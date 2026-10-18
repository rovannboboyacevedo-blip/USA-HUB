import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

import { useDialog } from '@/components/AppDialog';
import { EventCard, OrgCard, SuggestionCard, YouMightLikeBanner } from '@/components/cards';
import {
  BrandHeader,
  Chip,
  EmptyText,
  Screen,
  SearchField,
  SectionHeader,
  YellowBar,
} from '@/components/chrome';
import { useAuth } from '@/context/AuthContext';
import { recommendations, universityOrgs } from '@/data/catalog';
import { audienceLabel, useEvents } from '@/services/eventDirectory';
import { colors, fonts } from '@/constants/theme';
import { includesQuery } from '@/utils/format';
import { useResponsiveLayout } from '@/utils/layout';

const HomeScreen = () => {
  const router = useRouter();
  const { session, toggleBookmark } = useAuth();
  const { alert } = useDialog();
  const layout = useResponsiveLayout();
  const scheduledEvents = useEvents();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'all' | 'events'>('all');
  const bookmarks = session?.user.bookmarkedEventIds ?? [];

  const events = scheduledEvents.filter((event) =>
    includesQuery(query, [event.name, event.author, event.venue, event.description, audienceLabel(event)]),
  );
  const orgs = universityOrgs.filter((org) => includesQuery(query, [org.title, org.category]));
  const showOrgs = category === 'all';

  const handleOpenNotifications = () => {
    router.push('/notifications');
  };

  const handleOpenSettings = () => {
    router.push('/settings');
  };

  const handleOpenCalendar = () => {
    router.push('/calendar');
  };

  const handleOpenOrgs = () => {
    router.push({
      pathname: '/orgs',
      params: { focus: 'university', open: '0', nonce: String(Date.now()) },
    });
  };

  const handleOpenCourseOrgs = () => {
    router.push({
      pathname: '/orgs',
      params: { focus: 'course', open: '1', nonce: String(Date.now()) },
    });
  };

  const handleOpenEvent = (id: string) => {
    router.push({ pathname: '/event/[id]', params: { id } });
  };

  const handleOpenOrg = (id: string) => {
    router.push({ pathname: '/org/[id]', params: { id } });
  };

  const handleToggleBookmark = (id: string) => {
    toggleBookmark(id).catch(() => {
      alert('Bookmark', 'Unable to update that bookmark.');
    });
  };

  const handleApply = () => {
    alert('Membership', 'Membership Application Sent!');
  };

  const handleShowEverything = () => {
    setCategory('all');
  };

  const handleShowEvents = () => {
    setCategory('events');
  };

  return (
    <Screen>
      <BrandHeader onPressNotifications={handleOpenNotifications} onPressSettings={handleOpenSettings} />
      <YellowBar>
        <SearchField value={query} onChangeText={setQuery} />
      </YellowBar>

      <Text accessibilityRole="header" style={styles.categoryTitle}>
        Categories
      </Text>
        <ScrollView
          horizontal
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
        <Chip label="Everything" selected={category === 'all'} onPress={handleShowEverything} />
        <Chip label="Events" selected={category === 'events'} onPress={handleShowEvents} />
        <Chip label="USA Orgs" onPress={handleOpenOrgs} />
        <Chip label="Course Orgs" onPress={handleOpenCourseOrgs} />
      </ScrollView>

      <SectionHeader title="Upcoming Events" actionLabel="More" onPressAction={handleOpenCalendar} />
      {events.length === 0 ? (
        <EmptyText message="No events match that search." />
      ) : layout.isWide ? (
        <View style={[styles.wrap, { gap: layout.gap }]}>
          {events.map((event) => (
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
        <ScrollView
          horizontal
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.eventRow}
        >
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              bookmarked={bookmarks.includes(event.id)}
              onPress={() => handleOpenEvent(event.id)}
              onToggleBookmark={() => handleToggleBookmark(event.id)}
            />
          ))}
        </ScrollView>
      )}

      {showOrgs ? (
        <View style={styles.orgSection}>
          <SectionHeader title="University Orgs" actionLabel="More" onPressAction={handleOpenOrgs} />
          {orgs.length === 0 ? (
            <EmptyText message="No organizations match that search." />
          ) : (
            <View style={[styles.wrap, { gap: layout.gap }]}>
              {orgs.map((org) => (
                <OrgCard
                  key={org.id}
                  org={org}
                  width={layout.orgCardWidth}
                  boxHeight={layout.orgBoxHeight}
                  onPress={() => handleOpenOrg(org.id)}
                />
              ))}
            </View>
          )}

          {layout.showRightRail ? null : (
            <>
              <YouMightLikeBanner />
              <View style={[styles.wrap, { gap: layout.gap }]}>
                {recommendations.map((item) => (
                  <SuggestionCard
                    key={item.id}
                    item={item}
                    width={layout.suggestionWidth}
                    onPressApply={handleApply}
                  />
                ))}
              </View>
            </>
          )}
        </View>
      ) : null}
    </Screen>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  categoryTitle: {
    fontFamily: fonts.bold,
    fontSize: 22,
    textTransform: 'uppercase',
    color: colors.text,
    marginBottom: 12,
  },
  chips: {
    gap: 10,
    paddingTop: 12,
    paddingBottom: 22,
  },
  eventRow: {
    gap: 12,
    paddingBottom: 28,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 28,
  },
  orgSection: {
    marginTop: 4,
  },
});
