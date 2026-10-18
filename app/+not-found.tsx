import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '@/constants/theme';

const NotFoundScreen = () => (
  <>
    <Stack.Screen options={{ title: 'Not found', headerShown: false }} />
    <View style={styles.screen}>
      <Text style={styles.title}>This screen does not exist.</Text>
      <Link href="/" style={styles.link}>
        <Text style={styles.linkText}>Go to USA Hub</Text>
      </Link>
    </View>
  </>
);

export default NotFoundScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: 24,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 22,
    textAlign: 'center',
    textTransform: 'uppercase',
    color: colors.text,
  },
  link: {
    marginTop: 16,
  },
  linkText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    textDecorationLine: 'underline',
    textTransform: 'uppercase',
    color: colors.text,
  },
});
