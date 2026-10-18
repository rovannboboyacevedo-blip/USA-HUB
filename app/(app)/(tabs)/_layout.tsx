import { Slot } from 'expo-router';

import { colors } from '@/constants/theme';

const TabLayout = () => (
  <Slot
    screenOptions={{
      headerShown: false,
      animation: 'none',
      contentStyle: { backgroundColor: colors.background },
    }}
  />
);

export default TabLayout;
