import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Button, Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useSession } from '@/contexts/auth-context';
import { useTheme } from '@/hooks/use-theme';
import { Competition, deleteCompetition, getCompetition, updateArrowScore } from '@/lib/api';

export default function CompetitionDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { session } = useSession();
  const router = useRouter();
  const theme = useTheme();
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (!session || !id) return;
      getCompetition(session, id)
        .then(setCompetition)
        .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar'));
    }, [session, id])
  );

  async function handleScoreCommit(roundNumber: number, arrowNumber: number, value: string, previous: string | null) {
    if (!session || !id || value === (previous ?? '')) return;
    try {
      await updateArrowScore(session, id, roundNumber, arrowNumber, value);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar la puntuación');
    }
  }

  async function performDelete() {
    if (!session || !id) return;
    await deleteCompetition(session, id);
    router.replace('/');
  }

  function handleDelete() {
    if (!session || !id) return;

    // Alert.alert has no effect on web (react-native-web doesn't implement it).
    if (Platform.OS === 'web') {
      if (window.confirm('¿Seguro que quieres eliminarla?')) {
        performDelete();
      }
      return;
    }

    Alert.alert('Eliminar competición', '¿Seguro que quieres eliminarla?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: performDelete },
    ]);
  }

  if (!competition) {
    return (
      <ThemedView style={styles.container}>
        {error ? <ThemedText style={styles.error}>{error}</ThemedText> : <ThemedText>Cargando…</ThemedText>}
      </ThemedView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <ThemedView style={styles.container}>
        <ThemedText type="title">{competition.name || 'Competición'}</ThemedText>

        {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}

        {competition.rounds.map((round) => (
          <View key={round.id} style={styles.round}>
            <ThemedText type="smallBold">Ronda {round.number}</ThemedText>
            <View style={styles.arrowsRow}>
              {round.arrows.map((arrow) => (
                <ArrowInput
                  key={arrow.id}
                  initialScore={arrow.score}
                  color={theme.text}
                  borderColor={theme.backgroundSelected}
                  label={`Ronda ${round.number} flecha ${arrow.number}`}
                  onCommit={(value) => handleScoreCommit(round.number, arrow.number, value, arrow.score)}
                />
              ))}
            </View>
          </View>
        ))}

        <Button title="Eliminar competición" color="#d33" onPress={handleDelete} />
      </ThemedView>
    </ScrollView>
  );
}

function ArrowInput({
  initialScore,
  color,
  borderColor,
  label,
  onCommit,
}: {
  initialScore: string | null;
  color: string;
  borderColor: string;
  label: string;
  onCommit: (value: string) => void;
}) {
  const [value, setValue] = useState(initialScore ?? '');

  return (
    <TextInput
      value={value}
      onChangeText={setValue}
      onBlur={() => onCommit(value)}
      accessibilityLabel={label}
      style={[styles.arrowInput, { color, borderColor }]}
    />
  );
}

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1 },
  container: { flex: 1, padding: Spacing.four, gap: Spacing.three },
  round: { gap: Spacing.one },
  arrowsRow: { flexDirection: 'row', gap: Spacing.two },
  arrowInput: {
    borderWidth: 1,
    borderRadius: Spacing.one,
    width: 56,
    textAlign: 'center',
    paddingVertical: Spacing.two,
  },
  error: { color: '#d33' },
});
