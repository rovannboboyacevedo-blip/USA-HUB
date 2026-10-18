import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Oswald_400Regular, Oswald_500Medium, Oswald_700Bold } from '@expo-google-fonts/oswald';
import 'react-native-reanimated';

import { AppDialog } from '@/components/AppDialog';
import BootScreen from '@/components/BootScreen';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { colors } from '@/constants/theme';
import { evaluateRouteAccess } from '@/middleware/authMiddleware';
import { loadEvents } from '@/services/eventDirectory';
import { loadOrganizations } from '@/services/orgDirectory';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  anchor: '(app)',
};

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [fontsLoaded, fontError] = useFonts({
    Oswald_400Regular,
    Oswald_500Medium,
    Oswald_700Bold,
  });

  useEffect(() => {
    if (fontError) throw fontError;
  }, [fontError]);

  useEffect(() => {
    loadOrganizations();
    loadEvents();
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;

    const style = document.createElement('style');
    style.textContent = `
      button:hover,
      button:focus,
      button:focus-visible,
      input:hover,
      input:focus,
      input:focus-visible,
      textarea:hover,
      textarea:focus,
      textarea:focus-visible,
      [role="button"]:hover,
      [role="button"]:focus,
      [role="button"]:focus-visible {
        outline: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      style.remove();
    };
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <AppDialog>
        <StatusBar style="dark" />
        <RootNavigator />
      </AppDialog>
    </AuthProvider>
  );
};

const RootNavigator = () => {
  const { session, isReady } = useAuth();
  const appAccess = evaluateRouteAccess('/', session);
  const authAccess = evaluateRouteAccess('/login', session);

  if (!isReady) {
    return <BootScreen />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Protected guard={appAccess.status === 'allow'} redirectTo="/login">
        <Stack.Screen name="(app)" />
      </Stack.Protected>
      <Stack.Protected guard={authAccess.status === 'allow'} redirectTo="/">
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  );
};

export default RootLayout;
