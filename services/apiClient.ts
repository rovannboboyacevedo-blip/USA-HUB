import { AuthError, assertActiveSession, authorizedRequest } from '@/middleware/authMiddleware';
import type { AuthSession, PassportRecord } from '@/types/models';

export const fetchProtectedPassport = async (
  session: AuthSession | null,
): Promise<PassportRecord> => {
  const active = assertActiveSession(session);

  if (!process.env.EXPO_PUBLIC_API_URL) {
    return {
      studentId: active.user.id,
      name: active.user.name,
      role: active.user.role,
      email: active.user.email,
      campus: active.user.campus,
      city: active.user.city,
      expiresAt: active.expiresAt,
      source: 'device',
    };
  }

  const response = await authorizedRequest({ path: '/me/passport', method: 'GET' }, active);
  if (!response.ok) {
    throw new AuthError('The campus API could not issue a passport.');
  }

  const payload = (await response.json()) as Partial<PassportRecord>;

  return {
    studentId: payload.studentId ?? active.user.id,
    name: payload.name ?? active.user.name,
    role: payload.role ?? active.user.role,
    email: payload.email ?? active.user.email,
    campus: payload.campus ?? active.user.campus,
    city: payload.city ?? active.user.city,
    expiresAt: payload.expiresAt ?? active.expiresAt,
    source: 'api',
  };
};
