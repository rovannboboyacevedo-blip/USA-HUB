import { useSyncExternalStore } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { courseOrgs, universityOrgs } from '@/data/catalog';
import type { College, OrgColor, Organization } from '@/types/models';

const STORAGE_KEY = '@usahub/organizations';

const ORG_COLORS: OrgColor[] = [
  'red',
  'cream',
  'purple',
  'green',
  'cyan',
  'orange',
  'pink',
  'darkgreen',
  'grey',
];

export type NewOrganizationInput = {
  title: string;
  category: string;
  bio: string;
  kind: 'university' | 'course';
  college?: College;
  coverUri?: string;
};

type Listener = () => void;

let customOrgs: Organization[] = [];
let snapshot: Organization[] = [...universityOrgs, ...courseOrgs];
const listeners = new Set<Listener>();

const isCollege = (value: unknown): value is College =>
  value === 'SHS' ||
  value === 'CLASE' ||
  value === 'CNND' ||
  value === 'CPMT' ||
  value === 'COT' ||
  value === 'COB';

const isOrgColor = (value: unknown): value is OrgColor =>
  typeof value === 'string' && ORG_COLORS.includes(value as OrgColor);

const isStoredOrganization = (value: unknown): value is Organization => {
  if (!value || typeof value !== 'object') return false;
  const org = value as Organization;
  return (
    typeof org.id === 'string' &&
    typeof org.title === 'string' &&
    typeof org.category === 'string' &&
    typeof org.bio === 'string' &&
    isOrgColor(org.color) &&
    (org.kind === 'university' || org.kind === 'course')
  );
};

const publish = () => {
  snapshot = [...universityOrgs, ...courseOrgs, ...customOrgs];
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: Listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => snapshot;

export const useOrganizations = () => useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

export const loadOrganizations = async () => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return;
    customOrgs = parsed.filter(isStoredOrganization);
    publish();
  } catch {
    customOrgs = [];
  }
};

export const addOrganization = async (input: NewOrganizationInput) => {
  const org: Organization = {
    id: `custom-${Date.now()}`,
    title: input.title,
    category: input.category,
    bio: input.bio,
    kind: input.kind,
    color: ORG_COLORS[customOrgs.length % ORG_COLORS.length] ?? 'red',
    college: input.kind === 'course' && isCollege(input.college) ? input.college : undefined,
    coverUri: input.coverUri,
  };

  customOrgs = [...customOrgs, org];
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(customOrgs));
  publish();
  return org;
};
