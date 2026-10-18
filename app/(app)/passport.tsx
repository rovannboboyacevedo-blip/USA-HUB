import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { DetailRow, PanelTag, Screen, StackHeader } from '@/components/chrome';
import { colors, fonts, shadow } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { fetchProtectedPassport } from '@/services/apiClient';
import type { PassportRecord } from '@/types/models';
import { formatTimestamp } from '@/utils/format';

const PassportScreen = () => {
  const router = useRouter();
  const { session } = useAuth();
  const [passport, setPassport] = useState<PassportRecord | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const next = await fetchProtectedPassport(session);
        if (active) setPassport(next);
      } catch (caught) {
        if (!active) return;
        setError(caught instanceof Error ? caught.message : 'Unable to generate a passport.');
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [session]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/profile');
  };

  return (
    <Screen>
      <StackHeader title="Digital Passport" onPressBack={handleBack} />
      <PanelTag label="Verification" />
      <Text style={styles.lead}>Generating verification passport token matrix</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {passport ? (
        <View style={styles.card}>
          <Text style={styles.brand}>USA Hub</Text>
          <Text style={styles.name}>{passport.name}</Text>
          <Text style={styles.role}>{passport.role}</Text>
          <View style={styles.divider} />
          <DetailRow label="Student ID" value={passport.studentId} tone="light" />
          <DetailRow label="Email" value={passport.email} tone="light" />
          <DetailRow label="Campus" value={passport.campus} tone="light" />
          <DetailRow label="City" value={passport.city} tone="light" />
          <DetailRow label="Session expires" value={formatTimestamp(passport.expiresAt)} tone="light" />
          <Text style={styles.source}>
            {passport.source === 'api' ? 'Issued by the campus API' : 'Issued on this device after the auth middleware verified the session'}
          </Text>
        </View>
      ) : null}
    </Screen>
  );
};

export default PassportScreen;

const styles = StyleSheet.create({
  lead: {
    fontFamily: fonts.medium,
    fontSize: 13,
    textTransform: 'uppercase',
    color: colors.muted,
    marginBottom: 16,
  },
  error: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.danger,
    textTransform: 'none',
    marginBottom: 12,
  },
  card: {
    backgroundColor: colors.yellow,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.text,
    padding: 18,
    ...shadow.float,
  },
  brand: {
    fontFamily: fonts.bold,
    fontSize: 14,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.white,
  },
  name: {
    marginTop: 16,
    fontFamily: fonts.bold,
    fontSize: 28,
    textTransform: 'uppercase',
    color: colors.white,
  },
  role: {
    marginTop: 4,
    marginBottom: 12,
    fontFamily: fonts.bold,
    fontSize: 14,
    textTransform: 'uppercase',
    color: colors.white,
  },
  divider: {
    height: 2,
    backgroundColor: colors.white,
    marginBottom: 12,
  },
  source: {
    marginTop: 12,
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 17,
    textTransform: 'none',
    color: colors.white,
  },
});
