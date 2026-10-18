import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '@/constants/theme';

const BootScreen = () => (
  <View style={styles.screen}>
    <View style={styles.center}>
      <Text style={styles.wordmark}>USA Hub</Text>
      <Image
        accessibilityRole="image"
        accessibilityLabel="University of San Agustin seal"
        source={require('../assets/images/usa-seal.png')}
        style={styles.seal}
      />
      <View style={styles.spinner}>
        <ActivityIndicator color={colors.text} size="small" />
      </View>
      <Text style={styles.caption}>Checking campus session</Text>
    </View>
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
  seal: {
    width: 148,
    height: 155,
    marginTop: 10,
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
