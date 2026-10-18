import { Image, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { useDialog } from '@/components/AppDialog';
import { DetailRow, HubButton, PanelTag, Screen, StackHeader } from '@/components/chrome';
import { colors, fonts, shadow } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { audienceLabel, eventImageSource, useEvents } from '@/services/eventDirectory';
import { readParam } from '@/utils/format';

const EventDetailScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const { session, toggleBookmark } = useAuth();
  const { alert } = useDialog();
  const event = useEvents().find((item) => item.id === readParam(params.id));
  const imageSource = event ? eventImageSource(event) : null;
  const audience = event ? audienceLabel(event) : '';
  const bookmarked = event ? (session?.user.bookmarkedEventIds.includes(event.id) ?? false) : false;

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/');
  };

  const handleVisitRoom = () => {
    alert('Event Room', 'Navigating to full gallery posts!');
  };

  const handleAttendance = () => {
    alert('Attendance', 'Secure QR Code / Link successfully connected to your Student Profile!');
  };

  const handleToggleBookmark = () => {
    if (!event) return;
    toggleBookmark(event.id).catch(() => {
      alert('Bookmark', 'Unable to update that bookmark.');
    });
  };

  if (!event) {
    return (
      <Screen>
        <StackHeader title="Event" onPressBack={handleBack} />
        <Text style={styles.missing}>That event is no longer on the calendar.</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <StackHeader title="Event Details" onPressBack={handleBack} />
      <PanelTag label="Event Details" />

      {imageSource ? (
        <Image accessible accessibilityLabel={`${event.name} image`} source={imageSource} resizeMode="cover" style={styles.photo} />
      ) : null}

      <View style={styles.hero}>
        {imageSource ? null : (
          <View style={styles.banner}>
            <Text style={styles.bannerText}>Event Banner</Text>
          </View>
        )}
        <View style={styles.heroCopy}>
          <Text style={styles.name}>{event.name}</Text>
          <Text style={styles.author}>By: {event.author}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <HubButton label="Visit Event Room" variant="outline" onPress={handleVisitRoom} />
        <HubButton label="Attendance Link" variant="yellow" onPress={handleAttendance} />
        <HubButton
          label={bookmarked ? 'Bookmarked' : 'Bookmark Event'}
          variant="outline"
          onPress={handleToggleBookmark}
        />
      </View>

      <Text style={styles.heading}>Details Framework</Text>
      <DetailRow label="Date" value={event.date} />
      <DetailRow label="Time" value={event.time} />
      <DetailRow label="Place" value={event.venue} />
      {audience ? <DetailRow label="Audience" value={audience} /> : null}
      <DetailRow label="Occupations" value={event.crowd} />

      <Text style={styles.heading}>Overview</Text>
      <Text style={styles.overview}>{event.description}</Text>
    </Screen>
  );
};

export default EventDetailScreen;

const styles = StyleSheet.create({
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: 16,
  },
  hero: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 16,
  },
  banner: {
    width: 84,
    height: 88,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: colors.border,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  bannerText: {
    fontFamily: fonts.bold,
    fontSize: 11,
    textAlign: 'center',
    textTransform: 'uppercase',
    color: colors.white,
  },
  heroCopy: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontFamily: fonts.bold,
    fontSize: 20,
    textTransform: 'uppercase',
    color: colors.text,
  },
  author: {
    marginTop: 6,
    fontFamily: fonts.bold,
    fontSize: 12,
    textTransform: 'uppercase',
    color: colors.subtle,
  },
  actions: {
    gap: 10,
    marginBottom: 18,
  },
  heading: {
    marginTop: 8,
    marginBottom: 8,
    fontFamily: fonts.bold,
    fontSize: 14,
    textTransform: 'uppercase',
    color: colors.text,
  },
  overview: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 21,
    textTransform: 'none',
    color: colors.overview,
  },
  missing: {
    fontFamily: fonts.medium,
    fontSize: 16,
    textTransform: 'uppercase',
    color: colors.muted,
    ...shadow.card,
  },
});
