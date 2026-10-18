import { useSyncExternalStore } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ImageSourcePropType } from 'react-native';

import { eventsData } from '@/data/catalog';
import type { CampusEvent, College } from '@/types/models';
import { formatCampusDate, isSchoolDate } from '@/utils/calendar';

const STORAGE_KEY = '@usahub/events';

export type NewEventInput = {
  name: string;
  description: string;
  year: number;
  month: number;
  day: number;
  startTime: string;
  endTime: string;
  venue: string;
  scope: 'university' | 'course';
  college?: College;
  imageUri: string;
  author: string;
};

type Listener = () => void;

let customEvents: CampusEvent[] = [];
let snapshot: CampusEvent[] = [...eventsData];
const listeners = new Set<Listener>();

const isCollege = (value: unknown): value is College =>
  value === 'SHS' ||
  value === 'CLASE' ||
  value === 'CNND' ||
  value === 'CPMT' ||
  value === 'COT' ||
  value === 'COB';

const isStoredEvent = (value: unknown): value is CampusEvent => {
  if (!value || typeof value !== 'object') return false;
  const event = value as CampusEvent;
  const collegeOk = event.scope !== 'course' || isCollege(event.college);
  return (
    typeof event.id === 'string' &&
    typeof event.name === 'string' &&
    typeof event.description === 'string' &&
    typeof event.date === 'string' &&
    typeof event.time === 'string' &&
    typeof event.venue === 'string' &&
    typeof event.author === 'string' &&
    Array.isArray(event.lines) &&
    typeof event.imageUri === 'string' &&
    typeof event.year === 'number' &&
    typeof event.month === 'number' &&
    typeof event.day === 'number' &&
    typeof event.postedAt === 'number' &&
    (event.scope === 'university' || event.scope === 'course') &&
    collegeOk
  );
};

const publish = () => {
  snapshot = [...customEvents].reverse().concat(eventsData);
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: Listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => snapshot;

export const useEvents = () => useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

export const loadEvents = async () => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return;
    customEvents = parsed.filter(isStoredEvent);
    publish();
  } catch {
    customEvents = [];
  }
};

const titleLines = (name: string) => {
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length === 0) return ['Event'];
  return words.slice(0, 4);
};

export const audienceLabel = (event: Pick<CampusEvent, 'scope' | 'college'>) => {
  if (event.scope === 'course' && event.college) return `Course · ${event.college}`;
  if (event.scope === 'university') return 'Whole university';
  return '';
};

export const eventImageSource = (event: CampusEvent): ImageSourcePropType | null => {
  if (event.image) return event.image;
  if (event.imageUri) return { uri: event.imageUri };
  return null;
};

export const eventsForDay = (events: CampusEvent[], year: number, month: number, day: number) =>
  events.filter((event) => event.year === year && event.month === month && event.day === day);

export const addEvent = async (input: NewEventInput) => {
  const name = input.name.trim();
  const description = input.description.trim();
  const venue = input.venue.trim();
  const startTime = input.startTime.trim();
  const endTime = input.endTime.trim();

  if (!name || !description || !venue || !startTime || !endTime || !input.imageUri) {
    throw new Error('Event details are incomplete.');
  }

  if (!isSchoolDate(input.year, input.month, input.day)) {
    throw new Error('Choose a date on the school calendar.');
  }

  if (input.scope === 'course' && !isCollege(input.college)) {
    throw new Error('Choose a course for this notification.');
  }

  const event: CampusEvent = {
    id: `event-${Date.now()}`,
    lines: titleLines(name),
    name,
    author: input.author.trim() || 'Campus Admin',
    description,
    date: formatCampusDate(input.year, input.month, input.day),
    time: `${startTime} to ${endTime}`,
    venue,
    crowd: 'Open',
    imageUri: input.imageUri,
    year: input.year,
    month: input.month,
    day: input.day,
    scope: input.scope,
    college: input.scope === 'course' ? input.college : undefined,
    postedAt: Date.now(),
  };

  customEvents = [...customEvents, event];
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(customEvents));
  publish();
  return event;
};
