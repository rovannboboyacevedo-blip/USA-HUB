import type { ComponentProps, ReactNode } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type KeyboardTypeOptions,
} from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fonts, shadow } from '@/constants/theme';
import { useEvents } from '@/services/eventDirectory';
import { useRaiseOnHover } from '@/components/useRaiseOnHover';
import { useResponsiveLayout, useShowMenuButton } from '@/utils/layout';

type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
};

export const Screen = ({ children, scroll = true }: ScreenProps) => {
  const insets = useSafeAreaInsets();
  const { horizontalPadding } = useResponsiveLayout();
  const paddingTop = insets.top + 12;
  const paddingBottom = Math.max(insets.bottom, 12) + 24;

  if (!scroll) {
    return (
      <View style={[styles.screen, { paddingTop, paddingBottom, paddingHorizontal: horizontalPadding }]}>
        <View style={styles.frame}>{children}</View>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop, paddingBottom, paddingHorizontal: horizontalPadding },
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
};

type IconButtonProps = {
  name: ComponentProps<typeof FontAwesome6>['name'];
  label: string;
  onPress: () => void;
};

export const IconButton = ({ name, label, onPress }: IconButtonProps) => {
  const { translateY, handleHoverIn, handleHoverOut, zIndex } = useRaiseOnHover();

  return (
    <Animated.View style={{ transform: [{ translateY }], zIndex }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        hitSlop={8}
        onHoverIn={handleHoverIn}
        onHoverOut={handleHoverOut}
        onPress={onPress}
        style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
      >
        <FontAwesome6 name={name} solid size={18} color={colors.text} />
      </Pressable>
    </Animated.View>
  );
};

type BrandHeaderProps = {
  onPressNotifications: () => void;
  onPressSettings: () => void;
};

export const BrandHeader = ({ onPressNotifications, onPressSettings }: BrandHeaderProps) => {
  const showMenuButton = useShowMenuButton();
  const alertCount = useEvents().filter((event) => event.postedAt).length;
  const notificationLabel = alertCount > 0 ? `Open notifications, ${alertCount} new` : 'Open notifications';

  return (
    <View style={styles.brandRow}>
      <View style={styles.brandLeft}>
        {showMenuButton ? <View style={styles.menuSpacer} /> : null}
        <Text accessibilityRole="header" style={styles.brand}>
          USA Hub
        </Text>
      </View>
      <View style={styles.brandActions}>
        <View style={styles.bellWrap}>
          <IconButton name="bell" label={notificationLabel} onPress={onPressNotifications} />
          {alertCount > 0 ? (
            <View pointerEvents="none" style={styles.bellBadge}>
              <Text style={styles.bellBadgeText}>{alertCount > 9 ? '9+' : String(alertCount)}</Text>
            </View>
          ) : null}
        </View>
        <IconButton name="gear" label="Open settings" onPress={onPressSettings} />
      </View>
    </View>
  );
};

type SearchFieldProps = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
};

export const SearchField = ({
  value,
  onChangeText,
  placeholder = 'search here...',
}: SearchFieldProps) => {
  const { translateY, handleHoverIn, handleHoverOut, zIndex } = useRaiseOnHover();

  return (
    <Animated.View
      onPointerEnter={handleHoverIn}
      onPointerLeave={handleHoverOut}
      style={[styles.searchPill, { transform: [{ translateY }], zIndex }]}
    >
      <FontAwesome6 name="magnifying-glass" solid size={14} color={colors.text} />
      <TextInput
        accessibilityLabel="Search"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="rgba(17,17,17,0.45)"
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.searchInput}
      />
    </Animated.View>
  );
};

type YellowBarProps = {
  children: ReactNode;
  trailing?: ReactNode;
};

export const YellowBar = ({ children, trailing }: YellowBarProps) => (
  <View style={styles.yellowBar}>
    <View style={styles.yellowMain}>{children}</View>
    {trailing}
  </View>
);

type HubButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'black' | 'muted' | 'yellow' | 'outline' | 'danger' | 'red';
  disabled?: boolean;
};

export const HubButton = ({ label, onPress, variant = 'black', disabled = false }: HubButtonProps) => {
  const { translateY, handleHoverIn, handleHoverOut, zIndex } = useRaiseOnHover();

  return (
    <Animated.View style={{ transform: [{ translateY }], zIndex }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onHoverIn={disabled ? undefined : handleHoverIn}
        onHoverOut={handleHoverOut}
        onPress={onPress}
        style={({ pressed }) => [
          styles.button,
          variant === 'red' && styles.buttonRed,
          pressed && !disabled && styles.pressed,
          disabled && styles.buttonDisabled,
        ]}
      >
        <Text
          style={[
            styles.buttonLabel,
            variant === 'danger' && styles.buttonLabelDanger,
            variant === 'red' && styles.buttonLabelLight,
          ]}
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

type SectionHeaderProps = {
  title: string;
  actionLabel?: string;
  onPressAction?: () => void;
};

export const SectionHeader = ({ title, actionLabel, onPressAction }: SectionHeaderProps) => (
  <View style={styles.sectionRow}>
    <Text accessibilityRole="header" style={styles.sectionTitle}>
      {title}
    </Text>
    {actionLabel && onPressAction ? (
      <Pressable accessibilityRole="button" accessibilityLabel={actionLabel} onPress={onPressAction}>
        <Text style={styles.moreLink}>{actionLabel}</Text>
      </Pressable>
    ) : null}
  </View>
);

type ChipProps = {
  label: string;
  selected?: boolean;
  onPress: () => void;
};

export const Chip = ({ label, selected = false, onPress }: ChipProps) => {
  const { translateY, handleHoverIn, handleHoverOut, zIndex } = useRaiseOnHover();

  return (
    <Animated.View style={{ transform: [{ translateY }], zIndex }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ selected }}
        onHoverIn={handleHoverIn}
        onHoverOut={handleHoverOut}
        onPress={onPress}
        style={({ pressed }) => [styles.chip, selected && styles.chipSelected, pressed && styles.pressed]}
      >
        <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
};

type StackHeaderProps = {
  title: string;
  onPressBack: () => void;
};

export const StackHeader = ({ title, onPressBack }: StackHeaderProps) => (
  <View style={styles.stackHeader}>
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Go back"
      hitSlop={8}
      onPress={onPressBack}
      style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
    >
      <FontAwesome6 name="arrow-left" solid size={16} color={colors.text} />
    </Pressable>
    <Text accessibilityRole="header" style={styles.stackTitle}>
      {title}
    </Text>
  </View>
);

type PanelTagProps = {
  label: string;
  fullWidth?: boolean;
};

export const PanelTag = ({ label, fullWidth = false }: PanelTagProps) => (
  <View style={[styles.panelTag, fullWidth && styles.panelTagFull]}>
    <Text style={styles.panelTagText}>{label}</Text>
  </View>
);

type DetailRowProps = {
  label: string;
  value: string;
  tone?: 'danger' | 'success' | 'light';
};

export const DetailRow = ({ label, value, tone = 'danger' }: DetailRowProps) => (
  <View style={styles.detailRow}>
    <Text style={[styles.detailLabel, tone === 'light' && styles.detailLight]}>{label}</Text>
    <Text
      style={[
        styles.detailValue,
        tone === 'success' && styles.detailSuccess,
        tone === 'light' && styles.detailLight,
      ]}
    >
      {value}
    </Text>
  </View>
);

type FieldProps = {
  label?: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'words' | 'sentences';
  keyboardType?: KeyboardTypeOptions;
  onSubmitEditing?: () => void;
  returnKeyType?: 'next' | 'done' | 'go';
  tone?: 'yellow' | 'plain' | 'white';
  multiline?: boolean;
};

export const Field = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  autoCapitalize = 'none',
  keyboardType = 'default',
  onSubmitEditing,
  returnKeyType = 'next',
  tone = 'yellow',
  multiline = false,
}: FieldProps) => (
  <View style={styles.fieldGroup}>
    {label ? <Text style={styles.fieldLabel}>{label}</Text> : null}
    <TextInput
      accessibilityLabel={label ?? placeholder}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={
        tone === 'plain' || tone === 'white' ? 'rgba(17,17,17,0.45)' : 'rgba(255,255,255,0.78)'
      }
      secureTextEntry={secureTextEntry}
      autoCapitalize={autoCapitalize}
      autoCorrect={false}
      keyboardType={keyboardType}
      onSubmitEditing={onSubmitEditing}
      returnKeyType={returnKeyType}
      multiline={multiline}
      textAlignVertical={multiline ? 'top' : 'center'}
      style={[
        styles.field,
        tone === 'plain' && styles.fieldPlain,
        tone === 'white' && styles.fieldWhite,
        multiline && styles.fieldMultiline,
      ]}
    />
  </View>
);

type ErrorTextProps = {
  message: string;
};

export const ErrorText = ({ message }: ErrorTextProps) => {
  if (!message) return null;
  return <Text style={styles.error}>{message}</Text>;
};

export const EmptyText = ({ message }: { message: string }) => (
  <Text style={styles.empty}>{message}</Text>
);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    width: '100%',
  },
  frame: {
    flex: 1,
    width: '100%',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  brandLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuSpacer: {
    width: 48,
  },
  brand: {
    fontFamily: fonts.bold,
    fontSize: 18,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.text,
  },
  brandActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    ...shadow.float,
  },
  bellWrap: {
    position: 'relative',
  },
  bellBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.ink,
  },
  bellBadgeText: {
    fontFamily: fonts.bold,
    fontSize: 9,
    color: colors.white,
    textTransform: 'none',
  },
  yellowBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 22,
  },
  yellowMain: {
    flex: 1,
  },
  searchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.card,
    borderRadius: 18,
    paddingHorizontal: 14,
    minHeight: 48,
    ...shadow.float,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.text,
    textTransform: 'none',
    paddingVertical: 8,
    borderWidth: 0,
  },
  button: {
    minHeight: 48,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: colors.card,
    ...shadow.float,
  },
  buttonPressed: {
    opacity: 0.88,
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  buttonLabel: {
    fontFamily: fonts.bold,
    fontSize: 14,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: colors.text,
  },
  buttonRed: {
    backgroundColor: colors.yellow,
  },
  buttonLabelDanger: {
    color: colors.danger,
  },
  buttonLabelLight: {
    color: colors.white,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 12,
  },
  sectionTitle: {
    flex: 1,
    fontFamily: fonts.bold,
    fontSize: 22,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: colors.text,
  },
  moreLink: {
    fontFamily: fonts.bold,
    fontSize: 12,
    textDecorationLine: 'underline',
    textTransform: 'uppercase',
    color: colors.text,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: colors.card,
    ...shadow.float,
  },
  chipSelected: {
    borderWidth: 2,
    borderColor: colors.text,
  },
  chipLabel: {
    fontFamily: fonts.bold,
    fontSize: 12,
    textTransform: 'uppercase',
    color: colors.text,
  },
  chipLabelSelected: {
    color: colors.text,
  },
  stackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 18,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stackTitle: {
    flex: 1,
    fontFamily: fonts.bold,
    fontSize: 22,
    textTransform: 'uppercase',
    color: colors.text,
  },
  panelTag: {
    alignSelf: 'flex-start',
    backgroundColor: colors.yellow,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 14,
    ...shadow.card,
  },
  panelTagFull: {
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  panelTagText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    textTransform: 'uppercase',
    color: colors.white,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 8,
  },
  detailLabel: {
    fontFamily: fonts.bold,
    fontSize: 13,
    textTransform: 'uppercase',
    color: colors.text,
  },
  detailValue: {
    flex: 1,
    textAlign: 'right',
    fontFamily: fonts.bold,
    fontSize: 13,
    textTransform: 'uppercase',
    color: colors.danger,
  },
  detailSuccess: {
    color: colors.success,
  },
  detailLight: {
    color: colors.white,
  },
  fieldGroup: {
    gap: 6,
    marginBottom: 14,
  },
  fieldLabel: {
    fontFamily: fonts.bold,
    fontSize: 12,
    textTransform: 'uppercase',
    color: colors.text,
  },
  field: {
    minHeight: 48,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.yellow,
    paddingHorizontal: 18,
    textAlign: 'center',
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.white,
    textTransform: 'none',
  },
  fieldPlain: {
    backgroundColor: colors.card,
    borderWidth: 2,
    borderRadius: 12,
    textAlign: 'left',
    color: colors.text,
  },
  fieldWhite: {
    backgroundColor: colors.card,
    borderWidth: 0,
    color: colors.text,
    ...shadow.float,
  },
  fieldMultiline: {
    minHeight: 96,
    paddingTop: 12,
    borderRadius: 16,
  },
  error: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.danger,
    textTransform: 'none',
    marginBottom: 12,
    textAlign: 'center',
  },
  empty: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.muted,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  pressed: {
    opacity: 0.7,
  },
});
