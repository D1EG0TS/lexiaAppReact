import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { ScrollContainer } from '../components/ScrollContainer'
import { useAuth } from '../hooks/useAuth'

export default function ProfileScreen({ navigation }: any) {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <ScrollContainer style={{ flex: 1 }} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <Text>ID: {user.id}</Text>
      <Text>Email: {user.email}</Text>
      <Text>Nombre: {user.full_name}</Text>
      <Text>Rol: {user.role}</Text>
      <TouchableOpacity style={styles.button} onPress={logout}>
        <Text style={styles.buttonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </ScrollContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  button: { backgroundColor: '#ef4444', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});