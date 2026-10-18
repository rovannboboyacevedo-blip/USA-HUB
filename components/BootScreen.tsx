import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import HubLogo from '@/components/HubLogo';
import { colors, fonts } from '@/constants/theme';

const BootScreen = () => (
  <View style={styles.screen}>
    <View style={[styles.bar, styles.topBar]} />
    <View style={styles.center}>
      <Text style={styles.wordmark}>USA Hub</Text>
      <HubLogo width={120} />
      <View style={styles.spinner}>
        <ActivityIndicator color={colors.text} size="small" />
      </View>
      <Text style={styles.caption}>Checking campus session</Text>
    </View>
    <View style={[styles.bar, styles.bottomBar]} />
  </View>
);

export default BootScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: '100%',
    minHeight: '100%',
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 45,
    backgroundColor: colors.yellow,
  },
  topBar: {
    top: 0,
  },
  bottomBar: {
    bottom: 0,
  },
  center: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  wordmark: {
    fontFamily: fonts.bold,
    fontSize: 36,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.text,
  },
  spinner: {
    marginTop: 28,
    width: 24,
    height: 24,
  },
  caption: {
    marginTop: 12,
    fontFamily: fonts.medium,
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.text,
  },
});
