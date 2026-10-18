import { useEffect, useState } from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { Chip, ErrorText, Field, HubButton } from '@/components/chrome';
import { colors, fonts, shadow } from '@/constants/theme';
import type { NewEventInput } from '@/services/eventDirectory';
import { COLLEGES, type College } from '@/types/models';
import { SCHOOL_MONTHS, daysInMonth } from '@/utils/calendar';

export type NewEventDraft = Omit<NewEventInput, 'author'>;

type CreateEventModalProps = {
  visible: boolean;
  initialYear: number;
  initialMonth: number;
  initialDay: number;
  onClose: () => void;
  onCreate: (input: NewEventDraft) => Promise<void>;
};

export const CreateEventModal = ({
  visible,
  initialYear,
  initialMonth,
  initialDay,
  onClose,
  onCreate,
}: CreateEventModalProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth);
  const [day, setDay] = useState(String(initialDay));
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [venue, setVenue] = useState('');
  const [scope, setScope] = useState<'university' | 'course'>('university');
  const [college, setCollege] = useState<College | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setName('');
    setDescription('');
    setYear(initialYear);
    setMonth(initialMonth);
    setDay(String(initialDay));
    setStartTime('');
    setEndTime('');
    setVenue('');
    setScope('university');
    setCollege(null);
    setImageUri(null);
    setError('');
    setIsSaving(false);
  }, [visible, initialYear, initialMonth, initialDay]);

  const handleChooseUniversity = () => {
    setScope('university');
  };

  const handleChooseCourse = () => {
    setScope('course');
  };

  const handleSelectMonth = (nextYear: number, nextMonth: number) => {
    setYear(nextYear);
    setMonth(nextMonth);
  };

  const handleChangeDay = (value: string) => {
    setDay(value.replace(/[^\d]/g, '').slice(0, 2));
  };

  const handleSelectCollege = (nextCollege: College) => {
    setCollege(nextCollege);
  };

  const handleUploadImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError('Photo access is needed to add an event image.');
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
      setImageUri(`data:${mime};base64,${asset.base64}`);
      setError('');
      return;
    }

    setImageUri(asset.uri);
    setError('');
  };

  const handleCreate = async () => {
    const eventName = name.trim();
    const about = description.trim();
    const place = venue.trim();
    const starts = startTime.trim();
    const ends = endTime.trim();
    const dayNumber = Number(day);

    if (!eventName || !about || !place || !starts || !ends) {
      setError('Name, description, time, and place are required.');
      return;
    }

    if (!Number.isInteger(dayNumber) || dayNumber < 1 || dayNumber > daysInMonth(year, month)) {
      setError('Choose a valid day for that month.');
      return;
    }

    if (scope === 'course' && !college) {
      setError('Choose a course for this notification.');
      return;
    }

    if (!imageUri) {
      setError('Add a photo for this event.');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      await onCreate({
        name: eventName,
        description: about,
        year,
        month,
        day: dayNumber,
        startTime: starts,
        endTime: ends,
        venue: place,
        scope,
        college: scope === 'course' ? (college ?? undefined) : undefined,
        imageUri,
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to post that event.');
      setIsSaving(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable accessibilityLabel="Close new event form" style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.card} onPress={() => undefined}>
          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <Text accessibilityRole="header" style={styles.title}>
              Add event notification
            </Text>
            <Field
              label="Event name"
              value={name}
              onChangeText={setName}
              placeholder="Event name"
              autoCapitalize="words"
              tone="plain"
            />
            <Field
              label="Short description"
              value={description}
              onChangeText={setDescription}
              placeholder="What students should know"
              autoCapitalize="sentences"
              tone="plain"
              multiline
            />
            <Text style={styles.label}>Month</Text>
            <View style={styles.choices}>
              {SCHOOL_MONTHS.map((item) => (
                <Chip
                  key={item.label}
                  label={item.label}
                  selected={year === item.year && month === item.month}
                  onPress={() => handleSelectMonth(item.year, item.month)}
                />
              ))}
            </View>
            <Field
              label="Day"
              value={day}
              onChangeText={handleChangeDay}
              placeholder="Day"
              keyboardType="number-pad"
              tone="plain"
            />
            <Field
              label="Start time"
              value={startTime}
              onChangeText={setStartTime}
              placeholder="8:00 AM"
              autoCapitalize="none"
              tone="plain"
            />
            <Field
              label="End time"
              value={endTime}
              onChangeText={setEndTime}
              placeholder="5:00 PM"
              autoCapitalize="none"
              tone="plain"
            />
            <Field
              label="Place"
              value={venue}
              onChangeText={setVenue}
              placeholder="Where it happens"
              autoCapitalize="words"
              tone="plain"
            />
            <Text style={styles.label}>Who should see this</Text>
            <View style={styles.choices}>
              <Chip label="Whole university" selected={scope === 'university'} onPress={handleChooseUniversity} />
              <Chip label="Specific course" selected={scope === 'course'} onPress={handleChooseCourse} />
            </View>
            {scope === 'course' ? (
              <>
                <Text style={styles.label}>Course</Text>
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
            <Text style={styles.label}>Event image</Text>
            {imageUri ? (
              <Image accessible={false} source={{ uri: imageUri }} resizeMode="cover" style={styles.cover} />
            ) : (
              <View style={styles.coverEmpty}>
                <Text style={styles.coverEmptyLabel}>No image yet</Text>
              </View>
            )}
            <HubButton label={imageUri ? 'Change image' : 'Upload image'} onPress={handleUploadImage} />
            <ErrorText message={error} />
            <View style={styles.actions}>
              <HubButton label="Cancel" onPress={onClose} disabled={isSaving} />
              <HubButton label={isSaving ? 'Posting' : 'Post notification'} onPress={handleCreate} disabled={isSaving} />
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
    gap: 10,
    marginTop: 4,
  },
});
