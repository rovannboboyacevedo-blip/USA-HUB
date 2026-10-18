import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEY = '@usahub/settings';

export type HubSettings = {
  eventReminders: boolean;
};

const defaultSettings: HubSettings = {
  eventReminders: true,
};

export const readSettings = async (): Promise<HubSettings> => {
  const raw = await AsyncStorage.getItem(SETTINGS_KEY);
  if (!raw) return defaultSettings;

  try {
    const parsed = JSON.parse(raw) as Partial<HubSettings>;
    return { eventReminders: Boolean(parsed.eventReminders) };
  } catch {
    return defaultSettings;
  }
};

export const saveSettings = async (settings: HubSettings) => {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};
