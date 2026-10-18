import type { ImageSourcePropType } from 'react-native';

export const CAMPUS_ROLES = [
  'IT Intern',
  'Undergraduate Student',
  'Organization Representative',
  'Alumni Practitioner',
  'Admin',
] as const;

export type CampusRole = (typeof CAMPUS_ROLES)[number];

export const COLLEGES = ['SHS', 'CLASE', 'CNND', 'CPMT', 'COT', 'COB'] as const;

export type College = (typeof COLLEGES)[number];

export type OrgColor =
  | 'red'
  | 'cream'
  | 'purple'
  | 'green'
  | 'cyan'
  | 'orange'
  | 'pink'
  | 'darkgreen'
  | 'grey';

export type StudentAccount = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: CampusRole;
  interests: string[];
  campus: string;
  city: string;
  bookmarkedEventIds: string[];
};

export type SessionUser = Omit<StudentAccount, 'password'>;

export type AuthSession = {
  token: string;
  issuedAt: number;
  expiresAt: number;
  user: SessionUser;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: CampusRole;
};

export type ProfilePatch = {
  name: string;
  role: CampusRole;
  interests: string[];
};

export type CampusEvent = {
  id: string;
  lines: string[];
  name: string;
  author: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  crowd: string;
  image?: ImageSourcePropType;
  imageUri?: string;
  year?: number;
  month?: number;
  day?: number;
  scope?: 'university' | 'course';
  college?: College;
  postedAt?: number;
};

export type Organization = {
  id: string;
  title: string;
  category: string;
  color: OrgColor;
  bio: string;
  kind: 'university' | 'course';
  college?: College;
  coverUri?: string;
};

export type Recommendation = {
  id: string;
  name: string;
  meta: string;
  color: OrgColor;
  orgId: string;
};

export type PassportRecord = {
  studentId: string;
  name: string;
  role: string;
  email: string;
  campus: string;
  city: string;
  expiresAt: number;
  source: 'device' | 'api';
};

export type RouteGuardResult =
  | { status: 'allow' }
  | { status: 'redirect'; href: '/login' | '/' };
