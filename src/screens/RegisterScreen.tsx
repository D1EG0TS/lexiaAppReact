import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native'
import { ScrollContainer } from '../components/ScrollContainer'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../hooks/useAuth';

const schema = z.object({
  email: z.string().email('Email inválido'),
  full_name: z.string().min(1, 'Nombre obligatorio'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type FormData = z.infer<typeof schema>;

export default function RegisterScreen({ navigation }: any) {
  const { register: registerUser, loading } = useAuth();
  const { register, setValue, handleSubmit, formState: { errors }, reset } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await registerUser({ ...data, role: 'user' });
      alert('Registro exitoso. Ahora puedes iniciar sesión.');
      reset();
      navigation.navigate('Login');
    } catch (e: any) {
      alert('El correo ya está registrado');
    }
  };

  return (
    <ScrollContainer style={{ flex: 1 }} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registro</Text>
      <TextInput placeholder="Email" autoCapitalize="none" keyboardType="email-address" style={styles.input} onChangeText={(t) => setValue('email', t)} {...register('email')} />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}
      <TextInput placeholder="Nombre completo" style={styles.input} onChangeText={(t) => setValue('full_name', t)} {...register('full_name')} />
      {errors.full_name && <Text style={styles.error}>{errors.full_name.message}</Text>}
      <TextInput placeholder="Contraseña" secureTextEntry style={styles.input} onChangeText={(t) => setValue('password', t)} {...register('password')} />
      {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Registrarme</Text>}
      </TouchableOpacity>
    </ScrollContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 10 },
  button: { backgroundColor: '#16a34a', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  error: { color: 'red', marginBottom: 8 }
});