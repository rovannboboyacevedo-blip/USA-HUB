import AsyncStorage from '@react-native-async-storage/async-storage';

import { DEMO_ACCOUNT, SEED_ACCOUNTS } from '@/data/demoAccount';
import {
  assertActiveSession,
  authenticateCredentials,
  createTemporaryPassword,
  isCampusEmail,
  issueSession,
  toSessionUser,
  validateRegistration,
  verifySession,
  AuthError,
} from '@/middleware/authMiddleware';
import type {
  AuthSession,
  LoginCredentials,
  ProfilePatch,
  RegisterInput,
  StudentAccount,
} from '@/types/models';

const ACCOUNTS_KEY = '@usahub/accounts';
const SESSION_KEY = '@usahub/session';

const normalizeAccount = (account: StudentAccount): StudentAccount => ({
  ...account,
  email: account.email.trim().toLowerCase(),
  interests: account.interests ?? [],
  bookmarkedEventIds: account.bookmarkedEventIds ?? [],
  campus: account.campus || 'University of San Agustin',
  city: account.city || 'Iloilo City, Philippines',
});

const writeAccounts = async (accounts: StudentAccount[]) => {
  await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
};

const writeSession = async (session: AuthSession) => {
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

const readAccounts = async () => {
  const raw = await AsyncStorage.getItem(ACCOUNTS_KEY);

  if (!raw) {
    await writeAccounts(SEED_ACCOUNTS);
    return SEED_ACCOUNTS;
  }

  try {
    const parsed = JSON.parse(raw) as StudentAccount[];
    if (!Array.isArray(parsed)) {
      await writeAccounts(SEED_ACCOUNTS);
      return SEED_ACCOUNTS;
    }

    const stored = parsed.map(normalizeAccount);
    const accounts = stored.map((account) =>
      account.email === DEMO_ACCOUNT.email && account.role !== DEMO_ACCOUNT.role
        ? { ...account, role: DEMO_ACCOUNT.role }
        : account,
    );
    const missing = SEED_ACCOUNTS.filter(
      (seed) => !accounts.some((account) => account.email === seed.email),
    );
    const demoRoleChanged = stored.some(
      (account) => account.email === DEMO_ACCOUNT.email && account.role !== DEMO_ACCOUNT.role,
    );
    if (missing.length === 0 && !demoRoleChanged) return accounts;

    const next = [...missing, ...accounts];
    await writeAccounts(next);
    return next;
  } catch {
    await writeAccounts(SEED_ACCOUNTS);
    return SEED_ACCOUNTS;
  }
};

const createStudentId = (accounts: StudentAccount[]) => {
  const taken = new Set(accounts.map((account) => account.id));
  let nextId = '';

  do {
    const suffix = Math.floor(100 + Math.random() * 900);
    nextId = `USA-2026-${suffix}`;
  } while (taken.has(nextId));

  return nextId;
};

export const authService = {
  restoreSession: async () => {
    const raw = await AsyncStorage.getItem(SESSION_KEY);
    if (!raw) return null;

    try {
      const stored = JSON.parse(raw) as AuthSession;
      if (!verifySession(stored)) {
        await AsyncStorage.removeItem(SESSION_KEY);
        return null;
      }

      const accounts = await readAccounts();
      const account = accounts.find((item) => item.id === stored.user.id);
      if (!account) {
        await AsyncStorage.removeItem(SESSION_KEY);
        return null;
      }

      const session = { ...stored, user: toSessionUser(account) };
      if (!verifySession(session)) {
        await AsyncStorage.removeItem(SESSION_KEY);
        return null;
      }

      if (stored.user.role !== session.user.role) {
        await writeSession(session);
      }

      return session;
    } catch {
      await AsyncStorage.removeItem(SESSION_KEY);
      return null;
    }
  },

  login: async (credentials: LoginCredentials) => {
    const accounts = await readAccounts();
    const email = credentials.email.trim().toLowerCase();
    const account = accounts.find((item) => item.email === email) ?? null;
    const session = authenticateCredentials(credentials, account);
    await writeSession(session);
    return session;
  },

  register: async (input: RegisterInput) => {
    const accounts = await readAccounts();
    const email = input.email.trim().toLowerCase();
    const existing = accounts.find((item) => item.email === email) ?? null;
    const validated = validateRegistration(input, existing);

    const account: StudentAccount = {
      id: createStudentId(accounts),
      name: validated.name,
      email: validated.email,
      password: input.password,
      role: input.role,
      interests: [],
      campus: 'University of San Agustin',
      city: 'Iloilo City, Philippines',
      bookmarkedEventIds: [],
    };

    await writeAccounts([...accounts, account]);
    const session = issueSession(account);
    await writeSession(session);
    return session;
  },

  requestPasswordReset: async (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!isCampusEmail(cleanEmail)) {
      throw new AuthError('Use your USA student email ending in @usa.edu.ph.');
    }

    const accounts = await readAccounts();
    const account = accounts.find((item) => item.email === cleanEmail);
    if (!account) {
      throw new AuthError('No USA Hub account uses that email.');
    }

    const temporaryPassword = createTemporaryPassword();
    const next = accounts.map((item) =>
      item.id === account.id ? { ...item, password: temporaryPassword } : item,
    );
    await writeAccounts(next);
    return temporaryPassword;
  },

  updateProfile: async (session: AuthSession, patch: ProfilePatch) => {
    const active = assertActiveSession(session);
    const name = patch.name.trim();
    if (name.length < 2) {
      throw new AuthError('Enter the full student name.');
    }

    const accounts = await readAccounts();
    let updated: StudentAccount | undefined;
    const nextAccounts = accounts.map((account) => {
      if (account.id !== active.user.id) return account;
      updated = {
        ...account,
        name,
        role: patch.role,
        interests: patch.interests,
      };
      return updated;
    });

    if (!updated) {
      throw new AuthError('Account record was not found.');
    }

    await writeAccounts(nextAccounts);
    const nextSession = { ...active, user: toSessionUser(updated) };
    await writeSession(nextSession);
    return nextSession;
  },

  toggleBookmark: async (session: AuthSession, eventId: string) => {
    const active = assertActiveSession(session);
    const accounts = await readAccounts();
    let updated: StudentAccount | undefined;

    const nextAccounts = accounts.map((account) => {
      if (account.id !== active.user.id) return account;
      const hasBookmark = account.bookmarkedEventIds.includes(eventId);
      const bookmarkedEventIds = hasBookmark
        ? account.bookmarkedEventIds.filter((id) => id !== eventId)
        : [...account.bookmarkedEventIds, eventId];
      updated = { ...account, bookmarkedEventIds };
      return updated;
    });

    if (!updated) {
      throw new AuthError('Account record was not found.');
    }

    await writeAccounts(nextAccounts);
    const nextSession = { ...active, user: toSessionUser(updated) };
    await writeSession(nextSession);
    return nextSession;
  },

  logout: async () => {
    await AsyncStorage.removeItem(SESSION_KEY);
  },
};
