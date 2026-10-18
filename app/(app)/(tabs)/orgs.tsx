import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { OrgCard } from '@/components/cards';
import { CreateOrganizationModal } from '@/components/CreateOrganizationModal';
import {
  BrandHeader,
  Chip,
  EmptyText,
  HubButton,
  Screen,
  SearchField,
  YellowBar,
} from '@/components/chrome';
import { colors, fonts, shadow } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { addOrganization, useOrganizations, type NewOrganizationInput } from '@/services/orgDirectory';
import { COLLEGES, type College } from '@/types/models';
import { isAdminAccount } from '@/utils/accountCategory';
import { includesQuery, readParam } from '@/utils/format';
import { useResponsiveLayout } from '@/utils/layout';

const OrgsScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ focus?: string | string[]; open?: string | string[]; nonce?: string | string[] }>();
  const focus = readParam(params.focus);
  const open = readParam(params.open);
  const nonce = readParam(params.nonce);
  const [query, setQuery] = useState('');
  const [section, setSection] = useState<'university' | 'course'>('university');
  const [college, setCollege] = useState<College | null>(null);
  const [isCollegeOpen, setIsCollegeOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const layout = useResponsiveLayout();
  const organizations = useOrganizations();
  const { session } = useAuth();
  const canAddOrganization = isAdminAccount(session?.user.role);

  useEffect(() => {
    if (focus === 'university') {
      setSection('university');
      setIsCollegeOpen(false);
      return;
    }

    if (focus === 'course') {
      setSection('course');
      setIsCollegeOpen(open === '1');
    }
  }, [focus, open, nonce]);

  const source = organizations.filter((org) => org.kind === section);
  const visibleOrgs = source.filter((org) => {
    const matchesCollege = section === 'university' || !college || org.college === college;
    return matchesCollege && includesQuery(query, [org.title, org.category, org.bio, org.college ?? '']);
  });

  const title =
    section === 'university'
      ? 'University Organizations'
      : college
        ? `Course Organizations (${college})`
        : 'Course Organizations';

  const handleOpenNotifications = () => {
    router.push('/notifications');
  };

  const handleOpenSettings = () => {
    router.push('/settings');
  };

  const handleShowUniversity = () => {
    setSection('university');
    setIsCollegeOpen(false);
  };

  const handleToggleCourses = () => {
    setSection('course');
    setIsCollegeOpen((current) => !current);
  };

  const handleSelectCollege = (nextCollege: College) => {
    setCollege(nextCollege);
    setSection('course');
    setIsCollegeOpen(false);
  };

  const handleClearCollege = () => {
    setCollege(null);
    setSection('course');
    setIsCollegeOpen(false);
  };

  const handleCloseColleges = () => {
    setIsCollegeOpen(false);
  };

  const handleOpenCreate = () => {
    setIsCollegeOpen(false);
    setIsCreateOpen(true);
  };

  const handleCloseCreate = () => {
    setIsCreateOpen(false);
  };

  const handleChangeCreateKind = (kind: 'university' | 'course') => {
    setSection(kind);
    setIsCollegeOpen(false);
  };

  const handleChangeCreateCollege = (nextCollege: College) => {
    setCollege(nextCollege);
    setSection('course');
  };

  const handleCreateOrganization = async (input: NewOrganizationInput) => {
    if (!isAdminAccount(session?.user.role)) return;
    await addOrganization(input);
    setSection(input.kind);
    if (input.kind === 'course') setCollege(input.college ?? null);
    setIsCollegeOpen(false);
    setIsCreateOpen(false);
  };

  const handleOpenOrg = (id: string) => {
    router.push({ pathname: '/org/[id]', params: { id } });
  };

  return (
    <Screen>
      <BrandHeader onPressNotifications={handleOpenNotifications} onPressSettings={handleOpenSettings} />
      <YellowBar>
        <SearchField value={query} onChangeText={setQuery} />
      </YellowBar>

      <Text accessibilityRole="header" style={styles.title}>
        {title}
      </Text>

      <View style={[styles.tabs, !layout.isWide && styles.tabsStacked]}>
        <View style={styles.filters}>
          <Chip label="University Organizations" selected={section === 'university'} onPress={handleShowUniversity} />
          <Chip
            label={college ? `Course Organizations (${college})` : 'Course Organizations'}
            selected={section === 'course'}
            onPress={handleToggleCourses}
          />
        </View>
        {canAddOrganization ? (
          <View style={[styles.addSlot, !layout.isWide && styles.addSlotStacked]}>
            <HubButton label="Add a new organization" onPress={handleOpenCreate} />
          </View>
        ) : null}
      </View>

      {visibleOrgs.length === 0 ? (
        <EmptyText message="No organizations match that filter." />
      ) : (
        <View style={[styles.grid, { gap: layout.gap }]}>
          {visibleOrgs.map((org) => (
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

      <Modal visible={isCollegeOpen} transparent animationType="fade" onRequestClose={handleCloseColleges}>
        <Pressable accessibilityLabel="Close college list" style={styles.backdrop} onPress={handleCloseColleges}>
          <Pressable accessibilityRole="menu" style={styles.sheet} onPress={() => undefined}>
            <Text style={styles.sheetTitle}>Course Organizations</Text>
            <Chip label="All colleges" selected={!college} onPress={handleClearCollege} />
            <View style={styles.collegeGrid}>
              {COLLEGES.map((item) => (
                <Chip
                  key={item}
                  label={item}
                  selected={college === item}
                  onPress={() => handleSelectCollege(item)}
                />
              ))}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
      {canAddOrganization ? (
        <CreateOrganizationModal
          visible={isCreateOpen}
          kind={section}
          college={college}
          onChangeKind={handleChangeCreateKind}
          onChangeCollege={handleChangeCreateCollege}
          onClose={handleCloseCreate}
          onCreate={handleCreateOrganization}
        />
      ) : null}
    </Screen>
  );
};

export default OrgsScreen;

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.bold,
    fontSize: 32,
    lineHeight: 36,
    textTransform: 'uppercase',
    color: colors.text,
    marginBottom: 16,
  },
  tabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  tabsStacked: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 10,
  },
  addSlot: {
    marginLeft: 'auto',
  },
  addSlotStacked: {
    marginLeft: 0,
    alignSelf: 'stretch',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.28)',
    justifyContent: 'center',
    padding: 24,
  },
  sheet: {
    backgroundColor: colors.background,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: colors.border,
    padding: 16,
    gap: 12,
    ...shadow.float,
  },
  sheetTitle: {
    fontFamily: fonts.bold,
    fontSize: 16,
    textTransform: 'uppercase',
    color: colors.text,
  },
  collegeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
