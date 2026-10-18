import type {
  AuthSession,
  LoginCredentials,
  RegisterInput,
  RouteGuardResult,
  SessionUser,
  StudentAccount,
} from '@/types/models';

const SESSION_TTL_MS = 8 * 60 * 60 * 1000;
const TOKEN_SECRET = 'usa-hub-campus-middleware-v1';
const CAMPUS_EMAIL_PATTERN = /^[^\s@]+@usa\.edu\.ph$/i;
const PUBLIC_PATHS = new Set(['/login', '/register', '/forgot-password']);

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export type ApiRequest = {
  path: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
};

const sign = (value: string) => {
  const input = `${TOKEN_SECRET}:${value}`;
  let hashA = 2166136261;
  let hashB = 5381;

  for (let index = 0; index < input.length; index += 1) {
    const code = input.charCodeAt(index);
    hashA ^= code;
    hashA = Math.imul(hashA, 16777619);
    hashB = Math.imul(hashB, 33) ^ code;
  }

  return `${(hashA >>> 0).toString(16)}${(hashB >>> 0).toString(16)}`;
};

export const isCampusEmail = (email: string) => CAMPUS_EMAIL_PATTERN.test(email.trim());

export const toSessionUser = (account: StudentAccount): SessionUser => {
  const { password: _password, ...user } = account;
  return user;
};

export const toPathname = (segments: readonly string[]) => {
  const visible = segments.filter((segment) => !segment.startsWith('(') && segment !== 'index');
  if (visible.length === 0) return '/';
  return `/${visible.join('/')}`;
};

export const issueSession = (account: StudentAccount): AuthSession => {
  const issuedAt = Date.now();
  const expiresAt = issuedAt + SESSION_TTL_MS;
  const payload = `${account.id}|${issuedAt}|${expiresAt}`;
  const token = `${payload}|${sign(payload)}`;

  return {
    token,
    issuedAt,
    expiresAt,
    user: toSessionUser(account),
  };
};

export const verifySession = (session: AuthSession | null) => {
  if (!session?.token || !session.user?.id) return false;
  if (Date.now() > session.expiresAt) return false;

  const [subject, issuedAt, expiresAt, signature] = session.token.split('|');
  if (!subject || !issuedAt || !expiresAt || !signature) return false;

  const payload = `${subject}|${issuedAt}|${expiresAt}`;
  if (sign(payload) !== signature) return false;
  if (subject !== session.user.id) return false;
  if (Number(issuedAt) !== session.issuedAt) return false;
  if (Number(expiresAt) !== session.expiresAt) return false;

  return true;
};

export const evaluateRouteAccess = (
  pathname: string,
  session: AuthSession | null,
): RouteGuardResult => {
  const authed = verifySession(session);
  const isPublic = PUBLIC_PATHS.has(pathname);

  if (!authed && !isPublic) {
    return { status: 'redirect', href: '/login' };
  }

  if (authed && isPublic) {
    return { status: 'redirect', href: '/' };
  }

  return { status: 'allow' };
};

export const assertActiveSession = (session: AuthSession | null) => {
  if (!verifySession(session) || !session) {
    throw new AuthError('Your session expired. Log in again.');
  }

  return session;
};

export const authenticateCredentials = (
  credentials: LoginCredentials,
  account: StudentAccount | null,
) => {
  const email = credentials.email.trim().toLowerCase();
  const password = credentials.password;

  if (!email || password.length === 0) {
    throw new AuthError('Please enter your academic email and password.');
  }

  if (!isCampusEmail(email)) {
    throw new AuthError('Use your USA student email ending in @usa.edu.ph.');
  }

  if (!account || account.email.toLowerCase() !== email || account.password !== password) {
    throw new AuthError('Those credentials do not match a USA Hub account.');
  }

  return issueSession(account);
};

export const validateRegistration = (input: RegisterInput, existing: StudentAccount | null) => {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();

  if (name.length < 2) {
    throw new AuthError('Enter the full student name.');
  }

  if (!isCampusEmail(email)) {
    throw new AuthError('Register with a USA student email ending in @usa.edu.ph.');
  }

  if (input.password.length < 8) {
    throw new AuthError('Password must be at least 8 characters.');
  }

  if (input.password !== input.confirmPassword) {
    throw new AuthError('Password confirmation does not match.');
  }

  if (existing) {
    throw new AuthError('An account with that email is already registered.');
  }

  return { name, email };
};

export const createTemporaryPassword = () => {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let suffix = '';

  for (let index = 0; index < 6; index += 1) {
    suffix += alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  return `USA-${suffix}`;
};

export const authorizedRequest = async (request: ApiRequest, session: AuthSession | null) => {
  const active = assertActiveSession(session);
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new AuthError('No campus API is configured for this build.');
  }

  const response = await fetch(`${baseUrl}${request.path}`, {
    method: request.method ?? 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${active.token}`,
      ...request.headers,
    },
    body: request.body === undefined ? undefined : JSON.stringify(request.body),
  });

  if (response.status === 401) {
    throw new AuthError('The campus API rejected this session.');
  }

  return response;
};
