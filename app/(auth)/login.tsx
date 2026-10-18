import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import AuthShell from '@/components/AuthShell';
import HubLogo from '@/components/HubLogo';
import { ErrorText, Field, HubButton } from '@/components/chrome';
import { colors, fonts } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { ADMIN_ACCOUNT, DEMO_ACCOUNT } from '@/data/demoAccount';
import { AuthError } from '@/middleware/authMiddleware';

const LoginScreen = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState(DEMO_ACCOUNT.email);
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    setError('');
    setIsSubmitting(true);

    try {
      await login({ email, password });
    } catch (caught) {
      setError(caught instanceof AuthError ? caught.message : 'Unable to sign in right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgot = () => {
    router.push('/forgot-password');
  };

  const handleRegister = () => {
    router.push('/register');
  };

  const handleTogglePassword = () => {
    setIsPasswordVisible((current) => !current);
  };

  return (
    <AuthShell>
      <View style={styles.logoBlock}>
        <Text accessibilityRole="header" style={styles.wordmark}>
          USA Hub
        </Text>
        <HubLogo width={120} />
        <Text style={styles.submark}>Student Organization and Event Hub</Text>
      </View>

      <Text style={styles.greeting}>Hello Augustinian</Text>

      <Field
        value={email}
        onChangeText={setEmail}
        placeholder="ENTER STUDENT EMAIL"
        keyboardType="email-address"
        autoCapitalize="none"
        returnKeyType="next"
        tone="white"
      />
      <Field
        value={password}
        onChangeText={setPassword}
        placeholder="ENTER PASSWORD"
        secureTextEntry={!isPasswordVisible}
        returnKeyType="go"
        onSubmitEditing={handleLogin}
        tone="white"
      />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}
        onPress={handleTogglePassword}
        style={styles.textLink}
      >
        <Text style={styles.textLinkLabel}>{isPasswordVisible ? 'Hide password' : 'Show password'}</Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Forget password"
        onPress={handleForgot}
        style={styles.textLink}
      >
        <Text style={styles.forgot}>Forget password?</Text>
      </Pressable>

      <ErrorText message={error} />

      <View style={styles.actions}>
        <HubButton
          label={isSubmitting ? 'Signing in' : 'Log-In'}
          variant="red"
          onPress={handleLogin}
          disabled={isSubmitting}
        />
        <HubButton label="Register Now" variant="red" onPress={handleRegister} />
      </View>

      <Text style={styles.demo}>
        Rovann Acevedo · Admin{'\n'}
        {DEMO_ACCOUNT.email}
        {'\n'}
        {DEMO_ACCOUNT.password}
        {'\n\n'}
        Admin account{'\n'}
        {ADMIN_ACCOUNT.email}
        {'\n'}
        {ADMIN_ACCOUNT.password}
      </Text>
    </AuthShell>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  logoBlock: {
    alignItems: 'center',
    marginBottom: 28,
  },
  wordmark: {
    fontFamily: fonts.bold,
    fontSize: 36,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.text,
  },
  submark: {
    marginTop: 6,
    fontFamily: fonts.bold,
    fontSize: 9,
    letterSpacing: 0.4,
    textAlign: 'center',
    textTransform: 'uppercase',
    color: colors.text,
  },
  greeting: {
    fontFamily: fonts.bold,
    fontSize: 28,
    textAlign: 'center',
    textTransform: 'uppercase',
    color: colors.text,
    marginBottom: 22,
  },
  textLink: {
    alignSelf: 'center',
    marginBottom: 10,
  },
  textLinkLabel: {
    fontFamily: fonts.bold,
    fontSize: 11,
    textTransform: 'uppercase',
    color: colors.text,
  },
  forgot: {
    fontFamily: fonts.bold,
    fontSize: 12,
    textDecorationLine: 'underline',
    textTransform: 'uppercase',
    color: colors.text,
    marginBottom: 8,
  },
  actions: {
    gap: 16,
    marginTop: 6,
  },
  demo: {
    marginTop: 22,
    textAlign: 'center',
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 18,
    textTransform: 'none',
    color: colors.muted,
  },
});
