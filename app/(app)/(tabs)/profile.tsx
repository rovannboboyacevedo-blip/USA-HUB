import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useRouter } from 'expo-router';

import { useDialog } from '@/components/AppDialog';
import {
  BrandHeader,
  Chip,
  DetailRow,
  Field,
  HubButton,
  PanelTag,
  Screen,
  YellowBar,
} from '@/components/chrome';
import { colors, fonts, shadow } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { INTERESTS, ROLE_OPTIONS, activityLogs } from '@/data/catalog';
import { AuthError } from '@/middleware/authMiddleware';
import type { CampusRole } from '@/types/models';
import { useResponsiveLayout } from '@/utils/layout';

const ProfileScreen = () => {
  const router = useRouter();
  const { session, updateProfile } = useAuth();
  const { alert } = useDialog();
  const layout = useResponsiveLayout();
  const user = session?.user;
  const [name, setName] = useState(user?.name ?? '');
  const [role, setRole] = useState<CampusRole>(user?.role ?? 'Undergraduate Student');
  const [interests, setInterests] = useState<string[]>(user?.interests ?? []);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setName(user.name);
    setRole(user.role);
    setInterests(user.interests);
  }, [user?.name, user?.role, user?.interests]);

  if (!user) return null;

  const handleOpenNotifications = () => {
    router.push('/notifications');
  };

  const handleOpenSettings = () => {
    router.push('/settings');
  };

  const handleToggleInterest = (interest: string) => {
    setInterests((current) =>
      current.includes(interest) ? current.filter((item) => item !== interest) : [...current, interest],
    );
  };

  const handleSave = async () => {
    setError('');
    setIsSaving(true);

    try {
      await updateProfile({ name, role, interests });
      alert('Profile', 'All profile localized settings synced and saved successfully!');
    } catch (caught) {
      setError(caught instanceof AuthError ? caught.message : 'Unable to save that profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenPassport = () => {
    router.push('/passport');
  };

  return (
    <Screen>
      <BrandHeader onPressNotifications={handleOpenNotifications} onPressSettings={handleOpenSettings} />
      <YellowBar>
        <View style={styles.accountBar}>
          <FontAwesome6 name="user-gear" solid size={16} color={colors.text} />
          <Text style={styles.accountLabel}>Student Account Center</Text>
        </View>
      </YellowBar>

      <Text accessibilityRole="header" style={styles.title}>
        Manage Profile
      </Text>
      <Text style={styles.subtitle}>Customize your campus student passport identity</Text>

      <View style={layout.isWide ? styles.split : undefined}>
        <View style={[styles.identity, layout.isWide && styles.identityWide]}>
          <View style={styles.avatar}>
            <FontAwesome6 name="user-graduate" solid size={42} color={colors.white} />
          </View>
          <Text style={styles.displayName}>{name.trim() || 'No Name Set'}</Text>
          <View style={styles.roleTag}>
            <Text style={styles.roleTagText}>{role}</Text>
          </View>
          <View style={styles.campusRow}>
            <FontAwesome6 name="building-columns" solid size={12} color={colors.muted} />
            <Text style={styles.campusText}>{user.campus}</Text>
          </View>
          <View style={styles.campusRow}>
            <FontAwesome6 name="location-dot" solid size={12} color={colors.muted} />
            <Text style={styles.campusText}>{user.city}</Text>
          </View>
        </View>

        <View style={layout.isWide ? styles.formColumn : undefined}>
          <Field label="Full student name" value={name} onChangeText={setName} placeholder="Student name" autoCapitalize="words" tone="plain" />

          <Text style={styles.fieldLabel}>Campus role designation</Text>
          <View style={styles.chips}>
            {ROLE_OPTIONS.map((option) => (
              <Chip
                key={option.value}
                label={option.label}
                selected={role === option.value}
                onPress={() => setRole(option.value)}
              />
            ))}
          </View>

          <Text style={styles.fieldLabel}>Core skills and curricular interests</Text>
          <View style={styles.chips}>
            {INTERESTS.map((interest) => (
              <Chip
                key={interest}
                label={interest}
                selected={interests.includes(interest)}
                onPress={() => handleToggleInterest(interest)}
              />
            ))}
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}
          <HubButton label={isSaving ? 'Saving' : 'Save Permanent Changes'} variant="yellow" onPress={handleSave} disabled={isSaving} />

          <View style={styles.logs}>
            <PanelTag label="Security Logs" />
            <Text style={styles.logHeading}>Active Session Frame</Text>
            <DetailRow label="Authorized ID" value={user.id} tone="success" />
            <DetailRow label="Network Node" value="Campus_WiFI_East" />
            <DetailRow label="Server Status" value="Encrypted" tone="success" />

            <Text style={styles.logHeading}>Recent Event Activity</Text>
            {activityLogs.map((entry) => (
              <Text key={entry} style={styles.activity}>
                • {entry}
              </Text>
            ))}

            <HubButton label="Generate Digital Passport ID" variant="danger" onPress={handleOpenPassport} />
          </View>
        </View>
      </View>
    </Screen>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  accountBar: {
    minHeight: 48,
    borderRadius: 18,
    backgroundColor: colors.card,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    ...shadow.float,
  },
  accountLabel: {
    fontFamily: fonts.bold,
    fontSize: 13,
    textTransform: 'uppercase',
    color: colors.text,
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
    marginBottom: 18,
    fontFamily: fonts.bold,
    fontSize: 14,
    textTransform: 'uppercase',
    color: colors.text,
  },
  split: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 28,
  },
  identityWide: {
    width: 320,
    marginBottom: 0,
  },
  formColumn: {
    flex: 1,
    minWidth: 0,
  },
  identity: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    padding: 20,
    marginBottom: 20,
    ...shadow.card,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  displayName: {
    fontFamily: fonts.bold,
    fontSize: 22,
    textAlign: 'center',
    textTransform: 'uppercase',
    color: colors.text,
  },
  roleTag: {
    marginTop: 8,
    backgroundColor: colors.ink,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  roleTagText: {
    fontFamily: fonts.bold,
    fontSize: 11,
    textTransform: 'uppercase',
    color: colors.white,
  },
  campusRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  campusText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  fieldLabel: {
    fontFamily: fonts.bold,
    fontSize: 12,
    textTransform: 'uppercase',
    color: colors.text,
    marginBottom: 10,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 18,
  },
  error: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.danger,
    textTransform: 'none',
    marginBottom: 12,
  },
  logs: {
    marginTop: 28,
    gap: 8,
  },
  logHeading: {
    marginTop: 8,
    marginBottom: 6,
    fontFamily: fonts.bold,
    fontSize: 14,
    textTransform: 'uppercase',
    color: colors.text,
  },
  activity: {
    fontFamily: fonts.medium,
    fontSize: 13,
    lineHeight: 18,
    textTransform: 'none',
    color: colors.overview,
  },
});
