import { Redirect, Stack, useSegments } from 'expo-router';

import { SidebarProvider } from '@/components/AppSidebar';
import { colors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { evaluateRouteAccess, toPathname } from '@/middleware/authMiddleware';

const ProtectedLayout = () => {
  const { session, isReady } = useAuth();
  const segments = useSegments();

  if (!isReady) return null;

  const decision = evaluateRouteAccess(toPathname(segments), session);
  if (decision.status === 'redirect') {
    return <Redirect href={decision.href} />;
  }

  return (
    <SidebarProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="passport" />
        <Stack.Screen name="event/[id]" />
        <Stack.Screen name="org/[id]" />
      </Stack>
    </SidebarProvider>
  );
};

export default ProtectedLayout;
