import { Image, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { useDialog } from '@/components/AppDialog';
import { HubButton, PanelTag, Screen, StackHeader } from '@/components/chrome';
import { colors, fonts, orgColors, shadow } from '@/constants/theme';
import { useOrganizations } from '@/services/orgDirectory';
import { readParam } from '@/utils/format';

const OrgDetailScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const organizations = useOrganizations();
  const org = organizations.find((item) => item.id === readParam(params.id));
  const { alert } = useDialog();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/orgs');
  };

  const handleApply = () => {
    if (!org) return;
    alert('Membership', `Application files sent directly to the ${org.title} admissions chair!`);
  };

  const handleVisit = () => {
    alert('Portal Room', 'Entering interactive virtual hub room...');
  };

  if (!org) {
    return (
      <Screen>
        <StackHeader title="Organization" onPressBack={handleBack} />
        <Text style={styles.missing}>That organization is not listed.</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <StackHeader title="Org Showcase" onPressBack={handleBack} />
      <PanelTag label="Org Showcase" />

      {org.coverUri ? (
        <Image
          accessibilityLabel={`${org.title} cover`}
          source={{ uri: org.coverUri }}
          resizeMode="cover"
          style={styles.cover}
        />
      ) : null}

      <View style={styles.hero}>
        <View style={[styles.swatch, { backgroundColor: orgColors[org.color] }]} />
        <View style={styles.heroCopy}>
          <Text style={styles.name}>{org.title}</Text>
          <Text style={styles.meta}>Category: {org.category}</Text>
          {org.college ? <Text style={styles.meta}>College: {org.college}</Text> : null}
        </View>
      </View>

      <View style={styles.actions}>
        <HubButton label="Apply for Membership" variant="outline" onPress={handleApply} />
        <HubButton label="Visit Portal Room" variant="yellow" onPress={handleVisit} />
      </View>

      <Text style={styles.heading}>About Group</Text>
      <Text style={styles.overview}>{org.bio}</Text>
      <Text style={styles.status}>Status: Recruiting Active Applicants</Text>
    </Screen>
  );
};

export default OrgDetailScreen;

const styles = StyleSheet.create({
  hero: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 16,
  },
  cover: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    marginBottom: 16,
  },
  swatch: {
    width: 84,
    height: 88,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: colors.border,
    ...shadow.card,
  },
  heroCopy: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontFamily: fonts.bold,
    fontSize: 22,
    textTransform: 'uppercase',
    color: colors.text,
  },
  meta: {
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
    fontFamily: fonts.bold,
    fontSize: 14,
    textTransform: 'uppercase',
    color: colors.text,
    marginBottom: 8,
  },
  overview: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 21,
    textTransform: 'none',
    color: colors.overview,
  },
  status: {
    marginTop: 12,
    fontFamily: fonts.bold,
    fontSize: 12,
    textTransform: 'uppercase',
    color: colors.text,
  },
  missing: {
    fontFamily: fonts.medium,
    fontSize: 16,
    textTransform: 'uppercase',
    color: colors.muted,
  },
});
