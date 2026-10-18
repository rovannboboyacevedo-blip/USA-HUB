import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

import { useDialog } from '@/components/AppDialog';
import { EventCard } from '@/components/cards';
import { CreateEventModal, type NewEventDraft } from '@/components/CreateEventModal';
import { BrandHeader, EmptyText, HubButton, Screen, SearchField, SectionHeader, YellowBar } from '@/components/chrome';
import { colors, fonts, shadow } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { addEvent, audienceLabel, eventImageSource, eventsForDay, useEvents } from '@/services/eventDirectory';
import { isAdminAccount } from '@/utils/accountCategory';
import { SCHOOL_MONTHS, WEEKDAYS, buildMonthWeeks, formatCampusDate } from '@/utils/calendar';
import { includesQuery } from '@/utils/format';
import { useResponsiveLayout } from '@/utils/layout';

type SelectedDay = {
  year: number;
  month: number;
  day: number;
};

const DEFAULT_EVENT_DATE: SelectedDay = { year: 2026, month: 10, day: 18 };

const CalendarScreen = () => {
  const router = useRouter();
  const { session, toggleBookmark } = useAuth();
  const { alert } = useDialog();
  const layout = useResponsiveLayout();
  const events = useEvents();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<SelectedDay | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const bookmarks = session?.user.bookmarkedEventIds ?? [];
  const canAddEvent = isAdminAccount(session?.user.role);
  const visibleEvents = events.filter((event) =>
    includesQuery(query, [event.name, event.author, event.date, event.venue, event.description, audienceLabel(event)]),
  );
  const selectedEvents = selected ? eventsForDay(events, selected.year, selected.month, selected.day) : [];
  const draftDate = selected ?? DEFAULT_EVENT_DATE;

  const handleOpenNotifications = () => {
    router.push('/notifications');
  };

  const handleOpenSettings = () => {
    router.push('/settings');
  };

  const handleOpenEvent = (id: string) => {
    router.push({ pathname: '/event/[id]', params: { id } });
  };

  const handleToggleBookmark = (id: string) => {
    toggleBookmark(id).catch(() => {
      alert('Bookmark', 'Unable to update that bookmark.');
    });
  };

  const handleSelectDay = (year: number, month: number, day: number) => {
    setSelected((current) =>
      current?.year === year && current.month === month && current.day === day ? null : { year, month, day },
    );
  };

  const handleOpenCreate = () => {
    setIsCreateOpen(true);
  };

  const handleCloseCreate = () => {
    setIsCreateOpen(false);
  };

  const handleCreateEvent = async (draft: NewEventDraft) => {
    if (!isAdminAccount(session?.user.role)) {
      throw new Error('Only an admin can post an event.');
    }

    await addEvent({
      ...draft,
      author: session?.user.name ?? 'Campus Admin',
    });
    setSelected({ year: draft.year, month: draft.month, day: draft.day });
    setIsCreateOpen(false);
  };

  return (
    <Screen>
      <BrandHeader onPressNotifications={handleOpenNotifications} onPressSettings={handleOpenSettings} />
      <YellowBar>
        <SearchField value={query} onChangeText={setQuery} />
      </YellowBar>

      <View style={styles.headingRow}>
        <View style={styles.headingCopy}>
          <Text accessibilityRole="header" style={styles.title}>
            Scheduled Events
          </Text>
          <Text style={styles.subtitle}>School Calendar of Events</Text>
        </View>
        {canAddEvent ? <HubButton label="Add event notification" onPress={handleOpenCreate} /> : null}
      </View>

      <View style={[styles.monthGrid, { gap: layout.gap }]}>
      {SCHOOL_MONTHS.map((month) => {
        const weeks = buildMonthWeeks(month.year, month.month);
        return (
          <View
            key={month.label}
            style={[
              styles.month,
              { width: layout.monthColumns === 1 ? '100%' : layout.monthWidth },
            ]}
          >
            <Text style={styles.monthHeader}>{month.label}</Text>
            <View style={styles.weekRow}>
              {WEEKDAYS.map((day) => (
                <Text key={`${month.label}-${day}`} style={styles.weekday}>
                  {day}
                </Text>
              ))}
            </View>
            {weeks.map((week, weekIndex) => (
              <View key={`${month.label}-week-${weekIndex}`} style={styles.weekRow}>
                {week.map((day, dayIndex) => {
                  if (!day) {
                    return <View key={`${month.label}-empty-${dayIndex}`} style={styles.dayCell} />;
                  }

                  const dayEvents = eventsForDay(events, month.year, month.month, day);
                  const isSelected =
                    selected?.year === month.year && selected.month === month.month && selected.day === day;
                  const label = dayEvents.length
                    ? `${month.label} ${day}, ${dayEvents.map((event) => event.name).join(', ')}`
                    : `${month.label} ${day}`;

                  return (
                    <Pressable
                      key={`${month.label}-${day}`}
                      accessibilityRole="button"
                      accessibilityLabel={label}
                      accessibilityState={{ selected: isSelected }}
                      onPress={() => handleSelectDay(month.year, month.month, day)}
                      style={[styles.dayCell, dayEvents.length > 0 && styles.activeDay, isSelected && styles.selectedDay]}
                    >
                      <Text style={[styles.dayText, dayEvents.length > 0 && styles.activeDayText]}>{day}</Text>
                    </Pressable>
                  );
                })}
              </View>
            ))}
          </View>
        );
      })}
      </View>

      {selected ? (
        <View style={styles.dayPanel}>
          <Text accessibilityRole="header" style={styles.dayTitle}>
            {formatCampusDate(selected.year, selected.month, selected.day)}
          </Text>
          {selectedEvents.length === 0 ? (
            <EmptyText message="No events on this day." />
          ) : (
            selectedEvents.map((event) => {
              const imageSource = eventImageSource(event);
              return (
                <Pressable
                  key={event.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Open ${event.name}`}
                  onPress={() => handleOpenEvent(event.id)}
                  style={styles.dayEvent}
                >
                  {imageSource ? (
                    <Image accessible={false} source={imageSource} resizeMode="cover" style={styles.dayImage} />
                  ) : null}
                  <View style={styles.dayCopy}>
                    <Text style={styles.dayName}>{event.name}</Text>
                    {audienceLabel(event) ? <Text style={styles.dayMeta}>{audienceLabel(event)}</Text> : null}
                    <Text style={styles.dayMeta}>{event.time}</Text>
                    <Text style={styles.dayMeta}>{event.venue}</Text>
                    <Text style={styles.dayDescription}>{event.description}</Text>
                  </View>
                </Pressable>
              );
            })
          )}
          {canAddEvent ? (
            <HubButton label="Add an event on this day" onPress={handleOpenCreate} />
          ) : null}
        </View>
      ) : null}

      <View style={styles.list}>
        <SectionHeader title="All Scheduled Events" />
        {visibleEvents.length === 0 ? (
          <EmptyText message="No events match that search." />
        ) : layout.isWide ? (
          <View style={[styles.monthGrid, { gap: layout.gap }]}>
            {visibleEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                width={layout.eventCardWidth}
                bookmarked={bookmarks.includes(event.id)}
                onPress={() => handleOpenEvent(event.id)}
                onToggleBookmark={() => handleToggleBookmark(event.id)}
              />
            ))}
          </View>
        ) : (
          visibleEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              fullWidth
              bookmarked={bookmarks.includes(event.id)}
              onPress={() => handleOpenEvent(event.id)}
              onToggleBookmark={() => handleToggleBookmark(event.id)}
            />
          ))
        )}
      </View>

      {canAddEvent ? (
        <CreateEventModal
          visible={isCreateOpen}
          initialYear={draftDate.year}
          initialMonth={draftDate.month}
          initialDay={draftDate.day}
          onClose={handleCloseCreate}
          onCreate={handleCreateEvent}
        />
      ) : null}
    </Screen>
  );
};

export default CalendarScreen;

const styles = StyleSheet.create({
  headingRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    gap: 12,
    marginBottom: 22,
  },
  headingCopy: {
    flexGrow: 1,
    flexShrink: 1,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 34,
    lineHeight: 38,
    textTransform: 'uppercase',
    color: colors.text,
  },
  subtitle: {
    marginTop: 6,
    fontFamily: fonts.bold,
    fontSize: 14,
    textTransform: 'uppercase',
    color: colors.text,
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  month: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  monthHeader: {
    backgroundColor: colors.ink,
    color: colors.white,
    textAlign: 'center',
    fontFamily: fonts.medium,
    fontSize: 16,
    textTransform: 'uppercase',
    paddingVertical: 8,
  },
  weekRow: {
    flexDirection: 'row',
  },
  weekday: {
    flex: 1,
    textAlign: 'center',
    fontFamily: fonts.bold,
    fontSize: 11,
    paddingVertical: 6,
    textTransform: 'uppercase',
    color: colors.text,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dayCell: {
    flex: 1,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  activeDay: {
    backgroundColor: colors.yellow,
    borderColor: colors.yellow,
  },
  selectedDay: {
    borderWidth: 2,
    borderColor: colors.text,
  },
  activeDayText: {
    color: colors.white,
  },
  dayText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.text,
  },
  dayPanel: {
    marginTop: 18,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.card,
    gap: 12,
    ...shadow.float,
  },
  dayTitle: {
    fontFamily: fonts.bold,
    fontSize: 18,
    textTransform: 'uppercase',
    color: colors.text,
  },
  dayEvent: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  dayImage: {
    width: 92,
    height: 72,
    borderRadius: 12,
  },
  dayCopy: {
    flex: 1,
  },
  dayName: {
    fontFamily: fonts.bold,
    fontSize: 14,
    textTransform: 'uppercase',
    color: colors.text,
  },
  dayMeta: {
    marginTop: 2,
    fontFamily: fonts.medium,
    fontSize: 12,
    textTransform: 'none',
    color: colors.subtle,
  },
  dayDescription: {
    marginTop: 4,
    fontFamily: fonts.medium,
    fontSize: 13,
    lineHeight: 18,
    textTransform: 'none',
    color: colors.overview,
  },
  list: {
    marginTop: 8,
  },
});
