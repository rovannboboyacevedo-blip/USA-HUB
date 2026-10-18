import { Animated, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useDialog } from '@/components/AppDialog';
import { SuggestionCard, YouMightLikeBanner } from '@/components/cards';
import { useRaiseOnHover } from '@/components/useRaiseOnHover';
import { colors, shadow } from '@/constants/theme';
import { recommendations } from '@/data/catalog';
import { RIGHT_RAIL_WIDTH } from '@/utils/layout';

const ArrowButton = () => {
  const router = useRouter();
  const { translateY, handleHoverIn, handleHoverOut, zIndex } = useRaiseOnHover();

  const handlePress = () => {
    router.push('/orgs');
  };

  return (
    <Animated.View style={[styles.arrowLift, { transform: [{ translateY }], zIndex }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="See more organizations"
        onHoverIn={handleHoverIn}
        onHoverOut={handleHoverOut}
        onPress={handlePress}
        style={({ pressed }) => [styles.arrow, pressed && styles.pressed]}
      >
        <FontAwesome6 name="arrow-right" solid size={16} color={colors.text} />
      </Pressable>
    </Animated.View>
  );
};

export const RightRail = () => {
  const router = useRouter();
  const { alert } = useDialog();
  const insets = useSafeAreaInsets();

  const handleApply = () => {
    alert('Membership', 'Membership Application Sent!');
  };

  return (
    <View
      style={[
        styles.rail,
        { width: RIGHT_RAIL_WIDTH, paddingTop: insets.top + 28, paddingBottom: insets.bottom + 16 },
      ]}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <YouMightLikeBanner />
        {recommendations.map((item) => (
          <SuggestionCard key={item.id} item={item} onPressApply={handleApply} />
        ))}
      </ScrollView>
      <View style={styles.arrowRow}>
        <ArrowButton />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rail: {
    height: '100%',
    backgroundColor: colors.background,
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
    paddingHorizontal: 16,
  },
  content: {
    gap: 16,
    paddingBottom: 12,
  },
  arrowRow: {
    alignItems: 'flex-end',
    paddingTop: 12,
  },
  arrowLift: {
    borderRadius: 22,
  },
  arrow: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    ...shadow.float,
  },
  pressed: {
    opacity: 0.86,
  },
});
