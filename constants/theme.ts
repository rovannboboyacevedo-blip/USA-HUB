import type { OrgColor } from '@/types/models';

export const colors = {
  background: '#FFFFFF',
  yellow: '#C2181E',
  text: '#111111',
  card: '#FFFFFF',
  border: 'rgba(17, 17, 17, 0.14)',
  muted: '#4E4E4E',
  subtle: '#3A3A3A',
  active: '#C2181E',
  danger: '#C2181E',
  success: '#111111',
  register: '#C2181E',
  ink: '#111111',
  white: '#FFFFFF',
  overview: '#333333',
} as const;

export const orgColors: Record<OrgColor, string> = {
  red: '#C2181E',
  cream: '#F4B4B4',
  purple: '#7A1216',
  green: '#1A1A1A',
  cyan: '#F8D0D0',
  orange: '#E23A32',
  pink: '#E38B8B',
  darkgreen: '#4A1214',
  grey: '#8A8A8A',
};

export const fonts = {
  regular: 'Oswald_400Regular',
  medium: 'Oswald_500Medium',
  bold: 'Oswald_700Bold',
} as const;

export const shadow = {
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  float: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 4,
  },
} as const;
