import { useEffect, useMemo, useRef, useState, type ComponentProps, type ReactNode } from 'react';
import { Animated, Easing, Image, Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { usePathname, useRouter, type Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useDialog } from '@/components/AppDialog';
import { RightRail } from '@/components/RightRail';
import { useRaiseOnHover } from '@/components/useRaiseOnHover';
import { colors, fonts, shadow } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { SidebarContext } from '@/context/SidebarContext';
import { accountCategory } from '@/utils/accountCategory';
import {
  RIGHT_RAIL_BREAKPOINT,
  SIDEBAR_BREAKPOINT,
  SIDEBAR_WIDTH,
  useResponsiveLayout,
  useShowMenuButton,
} from '@/utils/layout';

const DRAWER_WIDTH = 280;

const destinations: {
  href: Href;
  label: string;
  icon: ComponentProps<typeof FontAwesome6>['name'];
}[] = [
  { href: '/', label: 'Home', icon: 'house' },
  { href: '/orgs', label: 'USA Orgs', icon: 'folder-open' },
  { href: '/calendar', label: 'Calendar', icon: 'calendar-days' },
  { href: '/profile', label: 'Profile', icon: 'user' },
  { href: '/logs', label: 'Logs', icon: 'clock-rotate-left' },
];

const isCurrentRoute = (pathname: string, href: Href) => {
  if (href === '/') return pathname === '/' || pathname === '/index';
  return pathname === href;
};

type SidebarPanelProps = {
  reserveMenu?: boolean;
  onSelect: (href: Href) => void;
};

const NavItem = ({
  item,
  selected,
  onSelect,
}: {
  item: (typeof destinations)[number];
  selected: boolean;
  onSelect: (href: Href) => void;
}) => {
  const { translateY, handleHoverIn, handleHoverOut, zIndex } = useRaiseOnHover();

  const handlePress = () => {
    onSelect(item.href);
  };

  return (
    <Animated.View style={{ transform: [{ translateY }], zIndex }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={item.label}
        accessibilityState={{ selected }}
        onHoverIn={handleHoverIn}
        onHoverOut={handleHoverOut}
        onPress={handlePress}
        style={({ pressed }) => [styles.item, selected && styles.itemSelected, pressed && styles.pressed]}
      >
        <FontAwesome6 name={item.icon} solid size={14} color={selected ? colors.text : colors.muted} />
        <Text style={[styles.itemLabel, selected && styles.itemLabelSelected]}>{item.label}</Text>
      </Pressable>
    </Animated.View>
  );
};

const AccountBanner = () => {
  const { session, logout } = useAuth();
  const { confirm } = useDialog();
  const { translateY, handleHoverIn, handleHoverOut, zIndex } = useRaiseOnHover();
  const user = session?.user;

  if (!user) return null;

  const handleSignOut = () => {
    confirm('Sign out', 'Sign out of USA Hub on this device?', () => {
      logout();
    });
  };

  return (
    <View style={styles.account}>
      <Text style={styles.accountName} numberOfLines={2}>
        {user.name}
      </Text>
      <Text style={styles.accountCategory}>{accountCategory(user.role)}</Text>
      <Animated.View style={{ transform: [{ translateY }], zIndex }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Sign out"
          onHoverIn={handleHoverIn}
          onHoverOut={handleHoverOut}
          onPress={handleSignOut}
          style={({ pressed }) => [styles.signOut, pressed && styles.pressed]}
        >
          <FontAwesome6 name="right-from-bracket" size={14} color={colors.text} />
          <Text style={styles.signOutLabel}>Sign out</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
};

const SidebarPanel = ({ reserveMenu = false, onSelect }: SidebarPanelProps) => {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const paddingTop = reserveMenu ? insets.top + 68 : insets.top + 28;

  return (
    <View style={[styles.panel, { width: reserveMenu ? DRAWER_WIDTH : SIDEBAR_WIDTH, paddingTop, paddingBottom: insets.bottom + 20 }]}>
      <View style={styles.wordmarkRow}>
        <Image
          accessibilityRole="image"
          accessibilityLabel="University of San Agustin seal"
          source={require('../assets/images/usa-seal.png')}
          style={styles.seal}
        />
        <Text accessibilityRole="header" style={styles.wordmark}>
          USA Hub
        </Text>
      </View>
      <View style={styles.nav}>
        {destinations.map((item) => (
          <NavItem
            key={item.label}
            item={item}
            selected={isCurrentRoute(pathname, item.href)}
            onSelect={onSelect}
          />
        ))}
      </View>
      <AccountBanner />
    </View>
  );
};

type MobileDrawerProps = {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onSelect: (href: Href) => void;
};

const MobileDrawer = ({ isOpen, onToggle, onClose, onSelect }: MobileDrawerProps) => {
  const insets = useSafeAreaInsets();
  const showMenuButton = useShowMenuButton();
  const { horizontalPadding } = useResponsiveLayout();
  const { translateY: menuLift, handleHoverIn, handleHoverOut } = useRaiseOnHover();
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: isOpen ? 1 : 0,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [isOpen, progress]);

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-DRAWER_WIDTH, 0],
  });
  const backdropOpacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <>
      <Animated.View
        pointerEvents={isOpen ? 'auto' : 'none'}
        aria-hidden={!isOpen}
        accessibilityElementsHidden={!isOpen}
        importantForAccessibility={isOpen ? 'yes' : 'no-hide-descendants'}
        style={[styles.backdrop, { opacity: backdropOpacity }]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close menu"
          onPress={onClose}
          style={styles.backdropPress}
        />
      </Animated.View>
      <Animated.View
        pointerEvents={isOpen ? 'auto' : 'none'}
        aria-hidden={!isOpen}
        accessibilityElementsHidden={!isOpen}
        importantForAccessibility={isOpen ? 'yes' : 'no-hide-descendants'}
        style={[styles.drawer, { transform: [{ translateX }] }]}
      >
        <SidebarPanel reserveMenu onSelect={onSelect} />
      </Animated.View>
      {showMenuButton ? (
        <Animated.View
          style={[
            styles.menuButton,
            { top: insets.top + 12, left: horizontalPadding, transform: [{ translateY: menuLift }] },
          ]}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isOpen ? 'Close menu' : 'Open menu'}
            accessibilityState={{ expanded: isOpen }}
            onHoverIn={handleHoverIn}
            onHoverOut={handleHoverOut}
            onPress={onToggle}
            style={({ pressed }) => [styles.menuPress, pressed && styles.pressed]}
          >
            <FontAwesome6 name={isOpen ? 'xmark' : 'bars'} solid size={18} color={colors.text} />
          </Pressable>
        </Animated.View>
      ) : null}
    </>
  );
};

type SidebarProviderProps = {
  children: ReactNode;
};

export const SidebarProvider = ({ children }: SidebarProviderProps) => {
  const { width } = useWindowDimensions();
  const pathname = usePathname();
  const router = useRouter();
  const showSidebar = width >= SIDEBAR_BREAKPOINT;
  const showRightRail = width >= RIGHT_RAIL_BREAKPOINT;
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname, showSidebar]);

  useEffect(() => {
    if (!isOpen || Platform.OS !== 'web') return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen((current) => !current);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSelect = (href: Href) => {
    if (pathname !== href) {
      router.navigate(href);
    }
    setIsOpen(false);
  };

  const value = useMemo(
    () => ({
      enabled: true,
      isOpen,
      toggle: handleToggle,
      close: handleClose,
    }),
    [isOpen],
  );

  return (
    <SidebarContext.Provider value={value}>
      <View style={styles.shell}>
        {showSidebar ? <SidebarPanel onSelect={handleSelect} /> : null}
        <View pointerEvents={!showSidebar && isOpen ? 'none' : 'auto'} style={styles.main}>
          {children}
        </View>
        {showRightRail ? <RightRail /> : null}
        {showSidebar ? null : (
          <MobileDrawer isOpen={isOpen} onToggle={handleToggle} onClose={handleClose} onSelect={handleSelect} />
        )}
      </View>
    </SidebarContext.Provider>
  );
};

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.background,
  },
  main: {
    flex: 1,
  },
  panel: {
    height: '100%',
    backgroundColor: colors.card,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    paddingHorizontal: 16,
  },
  wordmarkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 22,
    paddingHorizontal: 8,
  },
  seal: {
    width: 32,
    height: 32,
  },
  wordmark: {
    fontFamily: fonts.bold,
    fontSize: 20,
    lineHeight: 20,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.text,
  },
  nav: {
    gap: 16,
  },
  account: {
    marginTop: 'auto',
    paddingTop: 18,
    gap: 2,
  },
  accountName: {
    fontFamily: fonts.bold,
    fontSize: 14,
    lineHeight: 18,
    color: colors.text,
    textTransform: 'none',
  },
  accountCategory: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.muted,
    textTransform: 'none',
    marginBottom: 10,
  },
  signOut: {
    minHeight: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...shadow.float,
  },
  signOutLabel: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.text,
    textTransform: 'none',
  },
  item: {
    minHeight: 40,
    borderRadius: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.card,
    ...shadow.float,
  },
  itemSelected: {
    borderWidth: 2,
    borderColor: colors.text,
  },
  itemLabel: {
    fontFamily: fonts.bold,
    fontSize: 13,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  itemLabelSelected: {
    color: colors.text,
  },
  pressed: {
    opacity: 0.7,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  backdropPress: {
    flex: 1,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    zIndex: 30,
    width: DRAWER_WIDTH,
    backgroundColor: colors.card,
    ...shadow.float,
  },
  menuButton: {
    position: 'absolute',
    zIndex: 40,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    ...shadow.float,
  },
  menuPress: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
