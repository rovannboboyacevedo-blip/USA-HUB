import { useEffect, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Chip, ErrorText, Field, HubButton } from '@/components/chrome';
import { colors, fonts, shadow } from '@/constants/theme';
import type { NewOrganizationInput } from '@/services/orgDirectory';
import { COLLEGES, type College } from '@/types/models';

type OrganizationKind = 'university' | 'course';

type CreateOrganizationModalProps = {
  visible: boolean;
  kind: OrganizationKind;
  college: College | null;
  onChangeKind: (kind: OrganizationKind) => void;
  onChangeCollege: (college: College) => void;
  onClose: () => void;
  onCreate: (input: NewOrganizationInput) => Promise<void>;
};

export const CreateOrganizationModal = ({
  visible,
  kind,
  college,
  onChangeKind,
  onChangeCollege,
  onClose,
  onCreate,
}: CreateOrganizationModalProps) => {
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [bio, setBio] = useState('');
  const [coverUri, setCoverUri] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setTitle('');
    setCategory('');
    setBio('');
    setCoverUri(null);
    setError('');
    setIsSaving(false);
  }, [visible]);

  const handleChooseUniversity = () => {
    onChangeKind('university');
  };

  const handleChooseCourse = () => {
    onChangeKind('course');
  };

  const handleSelectCollege = (nextCollege: College) => {
    onChangeCollege(nextCollege);
  };

  const handleUploadCover = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError('Photo access is needed to upload a cover.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5,
      base64: true,
    });

    if (result.canceled) return;

    const asset = result.assets[0];
    if (!asset) return;

    if (asset.base64) {
      const mime = asset.mimeType ?? 'image/jpeg';
      setCoverUri(`data:${mime};base64,${asset.base64}`);
      setError('');
      return;
    }

    setCoverUri(asset.uri);
    setError('');
  };

  const handleCreate = async () => {
    const name = title.trim();
    const group = category.trim();
    const about = bio.trim();

    if (!name || !group || !about) {
      setError('Name, category, and about are required.');
      return;
    }

    if (kind === 'course' && !college) {
      setError('Choose a college for a course organization.');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      await onCreate({
        title: name,
        category: group,
        bio: about,
        kind,
        college: kind === 'course' ? (college ?? undefined) : undefined,
        coverUri: coverUri ?? undefined,
      });
    } catch {
      setError('Unable to save that organization.');
      setIsSaving(false);
    }
  };

  const listLabel =
    kind === 'university'
      ? 'University Organizations'
      : college
        ? `Course Organizations (${college})`
        : 'Course Organizations';

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.content,
            { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 },
          ]}
        >
          <View style={styles.header}>
            <Text accessibilityRole="header" style={styles.title}>
              Add a new organization
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close new organization form"
              hitSlop={8}
              onPress={onClose}
              style={({ pressed }) => [styles.close, pressed && styles.pressed]}
            >
              <FontAwesome6 name="xmark" solid size={16} color={colors.text} />
            </Pressable>
          </View>

          <Text style={styles.syncNote}>Shows under {listLabel}</Text>

          <Text style={styles.label}>Organization list</Text>
          <View style={styles.choices}>
            <Chip
              label="University Organizations"
              selected={kind === 'university'}
              onPress={handleChooseUniversity}
            />
            <Chip
              label={college ? `Course Organizations (${college})` : 'Course Organizations'}
              selected={kind === 'course'}
              onPress={handleChooseCourse}
            />
          </View>

          {kind === 'course' ? (
            <>
              <Text style={styles.label}>College</Text>
              <View style={styles.choices}>
                {COLLEGES.map((item) => (
                  <Chip
                    key={item}
                    label={item}
                    selected={college === item}
                    onPress={() => handleSelectCollege(item)}
                  />
                ))}
              </View>
            </>
          ) : null}

          <Field
            label="Organization name"
            value={title}
            onChangeText={setTitle}
            placeholder="Organization name"
            autoCapitalize="words"
            tone="plain"
          />
          <Field
            label="Category"
            value={category}
            onChangeText={setCategory}
            placeholder="Category"
            autoCapitalize="words"
            tone="plain"
          />
          <Field
            label="About"
            value={bio}
            onChangeText={setBio}
            placeholder="What this organization does"
            autoCapitalize="sentences"
            tone="plain"
            multiline
          />

          <Text style={styles.label}>Cover</Text>
          {coverUri ? (
            <Image accessible={false} source={{ uri: coverUri }} resizeMode="cover" style={styles.cover} />
          ) : (
            <View style={styles.coverEmpty}>
              <Text style={styles.coverEmptyLabel}>No cover yet</Text>
            </View>
          )}
          <ErrorText message={error} />
          <View style={styles.actions}>
            <HubButton label={coverUri ? 'Change cover' : 'Upload cover'} onPress={handleUploadCover} />
            <HubButton label="Cancel" onPress={onClose} disabled={isSaving} />
            <HubButton label={isSaving ? 'Creating' : 'Create'} onPress={handleCreate} disabled={isSaving} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontFamily: fonts.bold,
    fontSize: 22,
    textTransform: 'uppercase',
    color: colors.text,
  },
  close: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    ...shadow.float,
  },
  pressed: {
    opacity: 0.7,
  },
  syncNote: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.muted,
    textTransform: 'none',
    marginBottom: 16,
  },
  label: {
    fontFamily: fonts.bold,
    fontSize: 12,
    textTransform: 'uppercase',
    color: colors.text,
    marginBottom: 8,
  },
  choices: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  cover: {
    width: '100%',
    height: 160,
    borderRadius: 16,
    marginBottom: 12,
  },
  coverEmpty: {
    height: 160,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    ...shadow.float,
  },
  coverEmptyLabel: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.muted,
    textTransform: 'none',
  },
  actions: {
    gap: 16,
    marginTop: 12,
    paddingTop: 8,
    paddingBottom: 8,
  },
});
