import { Stack } from 'expo-router';
import { Button } from 'react-native';

import { useSession } from '@/contexts/auth-context';

export default function AppLayout() {
  const { signOut } = useSession();

  return (
    <Stack
      screenOptions={{
        headerRight: () => <Button title="Cerrar sesión" onPress={() => signOut()} />,
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Competiciones' }} />
      <Stack.Screen name="new" options={{ title: 'Nueva competición' }} />
      <Stack.Screen name="[id]" options={{ title: 'Puntuaciones' }} />
    </Stack>
  );
}
