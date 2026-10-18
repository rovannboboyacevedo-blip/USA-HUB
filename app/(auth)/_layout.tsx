import { Redirect, Stack, useSegments } from 'expo-router';

import { colors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { evaluateRouteAccess, toPathname } from '@/middleware/authMiddleware';

const AuthLayout = () => {
  const { session, isReady } = useAuth();
  const segments = useSegments();

  if (!isReady) return null;

  const decision = evaluateRouteAccess(toPathname(segments), session);
  if (decision.status === 'redirect') {
    return <Redirect href={decision.href} />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'fade',
      }}
    />
  );
};

export default AuthLayout;
