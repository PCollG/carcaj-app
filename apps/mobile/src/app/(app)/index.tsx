import { Link, useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Button, FlatList, Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useSession } from '@/contexts/auth-context';
import { useTheme } from '@/hooks/use-theme';
import { CompetitionSummary, listCompetitions } from '@/lib/api';

export default function CompetitionsList() {
  const { session } = useSession();
  const router = useRouter();
  const theme = useTheme();
  const [competitions, setCompetitions] = useState<CompetitionSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (!session) return;
      setIsLoading(true);
      listCompetitions(session)
        .then(setCompetitions)
        .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar'))
        .finally(() => setIsLoading(false));
    }, [session])
  );

  return (
    <ThemedView style={styles.container}>
      <Button title="Nueva competición" onPress={() => router.push('/new')} />

      {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
      {!isLoading && competitions.length === 0 ? (
        <ThemedText type="small">Todavía no tienes competiciones.</ThemedText>
      ) : null}

      <FlatList
        data={competitions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Link href={{ pathname: '/[id]', params: { id: item.id } }} asChild>
            <Pressable style={StyleSheet.flatten([styles.item, { backgroundColor: theme.backgroundElement }])}>
              <ThemedText type="default">{item.name || 'Competición sin nombre'}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {new Date(item.date).toLocaleDateString()}
              </ThemedText>
            </Pressable>
          </Link>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: Spacing.four, gap: Spacing.three },
  list: { gap: Spacing.two },
  item: { padding: Spacing.three, borderRadius: Spacing.one, gap: Spacing.half },
  error: { color: '#d33' },
});
