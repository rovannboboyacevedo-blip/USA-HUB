import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useRouter } from 'expo-router';

import { Screen, StackHeader } from '@/components/chrome';
import { colors, fonts, shadow } from '@/constants/theme';
import { audienceLabel, eventImageSource, useEvents } from '@/services/eventDirectory';

const NotificationsScreen = () => {
  const router = useRouter();
  const alerts = useEvents()
    .filter((event) => event.postedAt)
    .sort((left, right) => (right.postedAt ?? 0) - (left.postedAt ?? 0));

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/');
  };

  const handleOpenEvent = (id: string) => {
    router.push({ pathname: '/event/[id]', params: { id } });
  };

  return (
    <Screen>
      <StackHeader title="Notifications" onPressBack={handleBack} />
      {alerts.length === 0 ? (
        <View style={styles.empty}>
          <FontAwesome6 name="bell" solid size={28} color={colors.text} />
          <Text accessibilityRole="header" style={styles.title}>
            No new alerts
          </Text>
          <Text style={styles.body}>Your campus hub is quiet right now.</Text>
        </View>
      ) : (
        alerts.map((event) => {
          const imageSource = eventImageSource(event);
          const audience = audienceLabel(event);

          return (
            <Pressable
              key={event.id}
              accessibilityRole="button"
              accessibilityLabel={`Open ${event.name}`}
              onPress={() => handleOpenEvent(event.id)}
              style={styles.card}
            >
              {imageSource ? (
                <Image accessible={false} source={imageSource} resizeMode="cover" style={styles.image} />
              ) : null}
              <Text style={styles.kicker}>{audience || 'Campus event'}</Text>
              <Text style={styles.name}>{event.name}</Text>
              <Text style={styles.meta}>
                {event.date} · {event.time}
              </Text>
              <Text style={styles.meta}>{event.venue}</Text>
              <Text style={styles.description}>{event.description}</Text>
            </Pressable>
          );
        })
      )}
    </Screen>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  empty: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 24,
    alignItems: 'center',
    ...shadow.card,
  },
  title: {
    marginTop: 14,
    fontFamily: fonts.bold,
    fontSize: 22,
    textTransform: 'uppercase',
    color: colors.text,
  },
  body: {
    marginTop: 8,
    fontFamily: fonts.medium,
    fontSize: 14,
    textAlign: 'center',
    textTransform: 'none',
    color: colors.muted,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    ...shadow.float,
  },
  image: {
    width: '100%',
    height: 140,
    borderRadius: 12,
    marginBottom: 12,
  },
  kicker: {
    fontFamily: fonts.bold,
    fontSize: 11,
    textTransform: 'uppercase',
    color: colors.subtle,
  },
  name: {
    marginTop: 4,
    fontFamily: fonts.bold,
    fontSize: 18,
    textTransform: 'uppercase',
    color: colors.text,
  },
  meta: {
    marginTop: 4,
    fontFamily: fonts.medium,
    fontSize: 13,
    textTransform: 'none',
    color: colors.subtle,
  },
  description: {
    marginTop: 8,
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 20,
    textTransform: 'none',
    color: colors.overview,
  },
});
