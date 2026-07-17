import { Link } from 'expo-router';
import { useState } from 'react';
import { Button, KeyboardAvoidingView, Platform, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useSession } from '@/contexts/auth-context';
import { useTheme } from '@/hooks/use-theme';

export default function Register() {
  const { signUp } = useSession();
  const theme = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    setError(null);
    setIsSubmitting(true);
    try {
      await signUp(name, email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la cuenta');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.select({ ios: 'padding', default: undefined })}>
      <ThemedView style={styles.container}>
        <ThemedText type="title">Crear cuenta</ThemedText>

        <View style={styles.field}>
          <ThemedText type="small">Nombre</ThemedText>
          <TextInput
            value={name}
            onChangeText={setName}
            accessibilityLabel="Nombre"
            style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
          />
        </View>

        <View style={styles.field}>
          <ThemedText type="small">Email</ThemedText>
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            accessibilityLabel="Email"
            style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
          />
        </View>

        <View style={styles.field}>
          <ThemedText type="small">Contraseña</ThemedText>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            accessibilityLabel="Contraseña"
            style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
          />
        </View>

        {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}

        <Button title={isSubmitting ? 'Creando…' : 'Crear cuenta'} onPress={handleSubmit} disabled={isSubmitting} />

        <Link href="/sign-in" style={styles.link}>
          <ThemedText type="link">Ya tengo cuenta, entrar</ThemedText>
        </Link>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
  },
  field: { gap: Spacing.one },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.one,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
  },
  error: { color: '#d33' },
  link: { marginTop: Spacing.two, alignSelf: 'center' },
});
