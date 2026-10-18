import { useEffect, useState } from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { Chip, ErrorText, Field, HubButton } from '@/components/chrome';
import { colors, fonts, shadow } from '@/constants/theme';
import type { NewOrganizationInput } from '@/services/orgDirectory';
import { COLLEGES, type College } from '@/types/models';

type CreateOrganizationModalProps = {
  visible: boolean;
  initialKind: 'university' | 'course';
  initialCollege: College | null;
  onClose: () => void;
  onCreate: (input: NewOrganizationInput) => Promise<void>;
};

export const CreateOrganizationModal = ({
  visible,
  initialKind,
  initialCollege,
  onClose,
  onCreate,
}: CreateOrganizationModalProps) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [bio, setBio] = useState('');
  const [kind, setKind] = useState<'university' | 'course'>(initialKind);
  const [college, setCollege] = useState<College | null>(initialCollege);
  const [coverUri, setCoverUri] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setTitle('');
    setCategory('');
    setBio('');
    setKind(initialKind);
    setCollege(initialCollege);
    setCoverUri(null);
    setError('');
    setIsSaving(false);
  }, [visible, initialKind, initialCollege]);

  const handleChooseUniversity = () => {
    setKind('university');
  };

  const handleChooseCourse = () => {
    setKind('course');
  };

  const handleSelectCollege = (nextCollege: College) => {
    setCollege(nextCollege);
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

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable accessibilityLabel="Close new organization form" style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.card} onPress={() => undefined}>
          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <Text accessibilityRole="header" style={styles.title}>
              Add a new organization
            </Text>
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
            <Text style={styles.label}>Organization type</Text>
            <View style={styles.choices}>
              <Chip label="University" selected={kind === 'university'} onPress={handleChooseUniversity} />
              <Chip label="Course" selected={kind === 'course'} onPress={handleChooseCourse} />
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
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.28)',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 520,
    maxHeight: '90%',
    alignSelf: 'center',
    backgroundColor: colors.background,
    borderRadius: 18,
    padding: 18,
    ...shadow.float,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 20,
    textTransform: 'uppercase',
    color: colors.text,
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
    height: 140,
    borderRadius: 16,
    marginBottom: 12,
  },
  coverEmpty: {
    height: 140,
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
