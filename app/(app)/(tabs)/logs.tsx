import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { BrandHeader, DetailRow, Screen } from '@/components/chrome';
import { colors, fonts, shadow } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { activityLogs } from '@/data/catalog';
import { accountCategory } from '@/utils/accountCategory';
import { formatTimestamp } from '@/utils/format';

const LogsScreen = () => {
  const router = useRouter();
  const { session } = useAuth();
  const user = session?.user;

  const handleOpenNotifications = () => {
    router.push('/notifications');
  };

  const handleOpenSettings = () => {
    router.push('/settings');
  };

  return (
    <Screen>
      <BrandHeader onPressNotifications={handleOpenNotifications} onPressSettings={handleOpenSettings} />
      <Text accessibilityRole="header" style={styles.title}>
        Logs
      </Text>

      {user ? (
        <View style={styles.card}>
          <Text style={styles.heading}>Current session</Text>
          <DetailRow label="Name" value={user.name} tone="success" />
          <DetailRow label="Account" value={accountCategory(user.role)} tone="success" />
          <DetailRow label="Campus ID" value={user.id} tone="success" />
          <DetailRow label="Signed in" value={formatTimestamp(session?.issuedAt ?? 0)} tone="success" />
        </View>
      ) : null}

      <Text style={styles.heading}>Recent activity</Text>
      <View style={styles.list}>
        {activityLogs.map((entry) => (
          <View key={entry} style={styles.entry}>
            <Text style={styles.entryText}>{entry}</Text>
          </View>
        ))}
      </View>
    </Screen>
  );
};

export default LogsScreen;

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.bold,
    fontSize: 32,
    lineHeight: 36,
    textTransform: 'uppercase',
    color: colors.text,
    marginBottom: 16,
  },
  heading: {
    fontFamily: fonts.bold,
    fontSize: 14,
    textTransform: 'uppercase',
    color: colors.text,
    marginBottom: 10,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 22,
    ...shadow.card,
  },
  list: {
    gap: 10,
  },
  entry: {
    backgroundColor: colors.card,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    ...shadow.float,
  },
  entryText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 20,
    textTransform: 'none',
    color: colors.text,
  },
});
