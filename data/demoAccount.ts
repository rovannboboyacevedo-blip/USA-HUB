import type { StudentAccount } from '@/types/models';

export const DEMO_ACCOUNT: StudentAccount = {
  id: 'USA-2026-894',
  name: 'Rovann Acevedo',
  email: 'student.acevedo@usa.edu.ph',
  password: 'augustine2026',
  role: 'Admin',
  interests: ['Computer Networking', 'Java Programming', 'Cybersecurity Frameworks'],
  campus: 'University of San Agustin',
  city: 'Iloilo City, Philippines',
  bookmarkedEventIds: ['e3'],
};

export const ADMIN_ACCOUNT: StudentAccount = {
  id: 'USA-2026-001',
  name: 'Campus Admin',
  email: 'admin.hub@usa.edu.ph',
  password: 'augustine2026',
  role: 'Admin',
  interests: [],
  campus: 'University of San Agustin',
  city: 'Iloilo City, Philippines',
  bookmarkedEventIds: [],
};

export const SEED_ACCOUNTS = [DEMO_ACCOUNT, ADMIN_ACCOUNT];
