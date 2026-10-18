import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/constants/theme';

type AuthShellProps = {
  children: ReactNode;
};

const AuthShell = ({ children }: AuthShellProps) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const formWidth = width >= 860 ? 640 : 440;

  return (
    <View style={styles.root}>
      <View style={[styles.bar, styles.topBar]} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.content,
            {
              maxWidth: formWidth,
              paddingTop: insets.top + 64,
              paddingBottom: insets.bottom + 78,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={[styles.bar, styles.bottomBar]} />
    </View>
  );
};

export default AuthShell;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 45,
    backgroundColor: colors.yellow,
    zIndex: 2,
  },
  topBar: {
    top: 0,
  },
  bottomBar: {
    bottom: 0,
  },
});
