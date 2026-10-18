import { useEffect, useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { useDialog } from '@/components/AppDialog';
import { DetailRow, HubButton, PanelTag, Screen, StackHeader } from '@/components/chrome';
import { colors, fonts, shadow } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { readSettings, saveSettings } from '@/services/settingsService';
import { formatTimestamp } from '@/utils/format';

const SettingsScreen = () => {
  const router = useRouter();
  const { session, logout } = useAuth();
  const { confirm } = useDialog();
  const [eventReminders, setEventReminders] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      const stored = await readSettings();
      if (active) setEventReminders(stored.eventReminders);
    };

    load();

    return () => {
      active = false;
    };
  }, []);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/');
  };

  const handleToggleReminders = async (nextValue: boolean) => {
    setEventReminders(nextValue);
    await saveSettings({ eventReminders: nextValue });
  };

  const handleLogout = () => {
    confirm('Log out', 'Disconnect from current interactive terminal session?', () => {
      logout();
    });
  };

  return (
    <Screen>
      <StackHeader title="Settings" onPressBack={handleBack} />
      <PanelTag label="Settings panel active" />
      <Text style={styles.lead}>Campus preferences for this device</Text>

      <View style={styles.card}>
        <View style={styles.switchRow}>
          <View style={styles.switchCopy}>
            <Text style={styles.switchTitle}>Event reminders</Text>
            <Text style={styles.switchBody}>Keep highlighted campus dates on this phone</Text>
          </View>
          <Switch
            accessibilityLabel="Event reminders"
            value={eventReminders}
            onValueChange={handleToggleReminders}
            trackColor={{ false: '#E4E4E4', true: colors.yellow }}
            thumbColor={colors.white}
          />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Signed-in session</Text>
        <DetailRow label="Student" value={session?.user.name ?? 'Unknown'} tone="success" />
        <DetailRow label="Email" value={session?.user.email ?? 'Unknown'} tone="success" />
        <DetailRow label="Authorized ID" value={session?.user.id ?? 'Unknown'} tone="success" />
        <DetailRow
          label="Expires"
          value={session ? formatTimestamp(session.expiresAt) : 'Expired'}
          tone="success"
        />
      </View>

      <HubButton label="Log out" variant="danger" onPress={handleLogout} />
    </Screen>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  lead: {
    fontFamily: fonts.medium,
    fontSize: 14,
    textTransform: 'uppercase',
    color: colors.muted,
    marginBottom: 18,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 16,
    ...shadow.card,
  },
  cardTitle: {
    fontFamily: fonts.bold,
    fontSize: 14,
    textTransform: 'uppercase',
    color: colors.text,
    marginBottom: 12,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  switchCopy: {
    flex: 1,
  },
  switchTitle: {
    fontFamily: fonts.bold,
    fontSize: 15,
    textTransform: 'uppercase',
    color: colors.text,
  },
  switchBody: {
    marginTop: 4,
    fontFamily: fonts.medium,
    fontSize: 12,
    textTransform: 'none',
    color: colors.muted,
  },
});
