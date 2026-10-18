import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import AuthShell from '@/components/AuthShell';
import { Chip, ErrorText, Field, HubButton } from '@/components/chrome';
import { colors, fonts } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { ROLE_OPTIONS } from '@/data/catalog';
import { AuthError } from '@/middleware/authMiddleware';
import type { CampusRole } from '@/types/models';

const RegisterScreen = () => {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<CampusRole>('Undergraduate Student');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async () => {
    setError('');
    setIsSubmitting(true);

    try {
      await register({ name, email, password, confirmPassword, role });
    } catch (caught) {
      setError(caught instanceof AuthError ? caught.message : 'Unable to register right now.');
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
        Register Now
      </Text>
      <Text style={styles.subtitle}>Create a campus passport for USA Hub</Text>

      <Field
        label="Full student name"
        value={name}
        onChangeText={setName}
        placeholder="Rovann Acevedo"
        autoCapitalize="words"
      />
      <Field
        label="Student email"
        value={email}
        onChangeText={setEmail}
        placeholder="name@usa.edu.ph"
        keyboardType="email-address"
      />
      <Field
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="At least 8 characters"
        secureTextEntry
      />
      <Field
        label="Confirm password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Repeat password"
        secureTextEntry
        returnKeyType="done"
        onSubmitEditing={handleRegister}
      />

      <Text style={styles.roleLabel}>Campus role designation</Text>
      <View style={styles.roles}>
        {ROLE_OPTIONS.map((option) => (
          <Chip
            key={option.value}
            label={option.label}
            selected={role === option.value}
            onPress={() => setRole(option.value)}
          />
        ))}
      </View>

      <ErrorText message={error} />
      <HubButton
        label={isSubmitting ? 'Creating account' : 'Register Now'}
        onPress={handleRegister}
        disabled={isSubmitting}
      />
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

export default RegisterScreen;

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
  roleLabel: {
    fontFamily: fonts.bold,
    fontSize: 12,
    textTransform: 'uppercase',
    color: colors.text,
    marginBottom: 10,
  },
  roles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 18,
  },
  back: {
    alignSelf: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  backLabel: {
    fontFamily: fonts.bold,
    fontSize: 12,
    textDecorationLine: 'underline',
    textTransform: 'uppercase',
    color: colors.text,
  },
});
