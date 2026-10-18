import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import { AuthError } from '@/middleware/authMiddleware';
import { authService } from '@/services/authService';
import type { AuthSession, LoginCredentials, ProfilePatch, RegisterInput } from '@/types/models';

type AuthContextValue = {
  session: AuthSession | null;
  isReady: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<string>;
  updateProfile: (patch: ProfilePatch) => Promise<void>;
  toggleBookmark: (eventId: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let active = true;

    const restore = async () => {
      try {
        const restored = await authService.restoreSession();
        if (!active) return;
        setSession(restored);
      } catch {
        if (!active) return;
        setSession(null);
      } finally {
        if (active) setIsReady(true);
      }
    };

    restore();

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const next = await authService.login(credentials);
    setSession(next);
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    const next = await authService.register(input);
    setSession(next);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setSession(null);
  }, []);

  const requestPasswordReset = useCallback(async (email: string) => {
    return authService.requestPasswordReset(email);
  }, []);

  const updateProfile = useCallback(
    async (patch: ProfilePatch) => {
      if (!session) throw new AuthError('Your session expired. Log in again.');
      const next = await authService.updateProfile(session, patch);
      setSession(next);
    },
    [session],
  );

  const toggleBookmark = useCallback(
    async (eventId: string) => {
      if (!session) throw new AuthError('Your session expired. Log in again.');
      const next = await authService.toggleBookmark(session, eventId);
      setSession(next);
    },
    [session],
  );

  const value = useMemo(
    () => ({
      session,
      isReady,
      login,
      register,
      logout,
      requestPasswordReset,
      updateProfile,
      toggleBookmark,
    }),
    [
      session,
      isReady,
      login,
      register,
      logout,
      requestPasswordReset,
      updateProfile,
      toggleBookmark,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider.');
  }
  return context;
};
