import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useSession } from '@/contexts/auth-context';
import { useTheme } from '@/hooks/use-theme';
import { createCompetition } from '@/lib/api';

export default function NewCompetition() {
  const { session } = useSession();
  const router = useRouter();
  const theme = useTheme();
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    if (!session) return;
    setError(null);
    setIsSubmitting(true);
    try {
      const competition = await createCompetition(session, name || undefined);
      router.replace({ pathname: '/[id]', params: { id: competition.id } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la competición');
      setIsSubmitting(false);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.field}>
        <ThemedText type="small">Nombre (opcional)</ThemedText>
        <TextInput
          value={name}
          onChangeText={setName}
          accessibilityLabel="Nombre de la competición"
          style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
        />
      </View>

      {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}

      <Button title={isSubmitting ? 'Creando…' : 'Crear'} onPress={handleSubmit} disabled={isSubmitting} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: Spacing.four, gap: Spacing.three },
  field: { gap: Spacing.one },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.one,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
  },
  error: { color: '#d33' },
});
