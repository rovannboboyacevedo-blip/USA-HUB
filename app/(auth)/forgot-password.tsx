import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import AuthShell from '@/components/AuthShell';
import { ErrorText, Field, HubButton } from '@/components/chrome';
import { colors, fonts, shadow } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { AuthError } from '@/middleware/authMiddleware';

const ForgotPasswordScreen = () => {
  const router = useRouter();
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [temporaryPassword, setTemporaryPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReset = async () => {
    setError('');
    setTemporaryPassword('');
    setIsSubmitting(true);

    try {
      const nextPassword = await requestPasswordReset(email);
      setTemporaryPassword(nextPassword);
    } catch (caught) {
      setError(caught instanceof AuthError ? caught.message : 'Unable to reset that password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToLogin = () => {
    router.replace('/login');
  };

  return (
    <AuthShell>
      <Text accessibilityRole="header" style={styles.title}>
        Forget password?
      </Text>
      <Text style={styles.subtitle}>Enter the student email on your USA Hub account</Text>

      <Field
        label="Student email"
        value={email}
        onChangeText={setEmail}
        placeholder="name@usa.edu.ph"
        keyboardType="email-address"
        returnKeyType="go"
        onSubmitEditing={handleReset}
      />

      <ErrorText message={error} />
      <HubButton
        label={isSubmitting ? 'Dispatching' : 'Send reset'}
        onPress={handleReset}
        disabled={isSubmitting}
      />

      {temporaryPassword ? (
        <View style={styles.notice}>
          <Text style={styles.noticeTitle}>Password reset coordinates dispatched</Text>
          <Text style={styles.noticeBody}>
            This build has no mail server, so the temporary password is shown on this device.
          </Text>
          <Text selectable style={styles.password}>
            {temporaryPassword}
          </Text>
        </View>
      ) : null}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Back to login"
        onPress={handleBackToLogin}
        style={styles.back}
      >
        <Text style={styles.backLabel}>Back to log-in</Text>
      </Pressable>
    </AuthShell>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.bold,
    fontSize: 32,
    textAlign: 'center',
    textTransform: 'uppercase',
    color: colors.text,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 24,
    textAlign: 'center',
    fontFamily: fonts.medium,
    fontSize: 13,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  notice: {
    marginTop: 18,
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    ...shadow.card,
  },
  noticeTitle: {
    fontFamily: fonts.bold,
    fontSize: 14,
    textTransform: 'uppercase',
    color: colors.text,
  },
  noticeBody: {
    marginTop: 8,
    fontFamily: fonts.medium,
    fontSize: 13,
    lineHeight: 18,
    textTransform: 'none',
    color: colors.overview,
  },
  password: {
    marginTop: 12,
    fontFamily: fonts.bold,
    fontSize: 22,
    letterSpacing: 1,
    textAlign: 'center',
    textTransform: 'none',
    color: colors.text,
  },
  back: {
    alignSelf: 'center',
    marginTop: 18,
  },
  backLabel: {
    fontFamily: fonts.bold,
    fontSize: 12,
    textDecorationLine: 'underline',
    textTransform: 'uppercase',
    color: colors.text,
  },
});
