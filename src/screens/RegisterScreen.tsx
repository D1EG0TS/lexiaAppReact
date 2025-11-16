import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native'
import { ScrollContainer } from '../components/ScrollContainer'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../hooks/useAuth';
import { LegalTheme } from '../constants/legaltheme';
import React, { useState } from 'react';

const schema = z.object({
  email: z.string().email('Email inválido'),
  full_name: z.string().min(1, 'Nombre obligatorio'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirm_password: z.string().min(6, 'La confirmación debe tener al menos 6 caracteres'),
}).refine((data) => data.password === data.confirm_password, {
  path: ['confirm_password'],
  message: 'Las contraseñas no coinciden',
});

type FormData = z.infer<typeof schema>;

export default function RegisterScreen({ navigation }: any) {
  const { register: registerUser, loading } = useAuth();
  const { register, setValue, handleSubmit, formState: { errors }, reset } = useForm<FormData>({ resolver: zodResolver(schema) });




  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (data: FormData) => {
    try {
      const payload = { email: data.email, full_name: data.full_name, password: data.password, role: 'user' };
      await registerUser({ ...payload, role: undefined });
      alert('Registro exitoso. Ahora puedes iniciar sesión.');
      reset();
      navigation.navigate('Login');
    } catch (e: any) {
      alert('El correo ya está registrado');
    }
  };

  return (
    <ScrollContainer style={{ flex: 1, backgroundColor: LegalTheme.colors.background }} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registro</Text>
      <TextInput placeholder="Email" autoCapitalize="none" keyboardType="email-address" style={styles.input} onChangeText={(t) => setValue('email', t)} {...register('email')} />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}
      <TextInput placeholder="Nombre completo" style={styles.input} onChangeText={(t) => setValue('full_name', t)} {...register('full_name')} />
      {errors.full_name && <Text style={styles.error}>{errors.full_name.message}</Text>}
      <View style={styles.inputRow}>
        <TextInput placeholder="Contraseña" secureTextEntry={!showPassword} style={[styles.input, styles.inputFlex]} onChangeText={(t) => setValue('password', t)} {...register('password')} />
        <TouchableOpacity onPress={() => setShowPassword((v: boolean) => !v)} style={styles.toggleBtn}>
          <Text style={styles.toggleText}>{showPassword ? 'Ocultar' : 'Ver'}</Text>
        </TouchableOpacity>
      </View>
      {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
      <View style={styles.inputRow}>
        <TextInput placeholder="Confirmar contraseña" secureTextEntry={!showConfirmPassword} style={[styles.input, styles.inputFlex]} onChangeText={(t) => setValue('confirm_password', t)} {...register('confirm_password')} />
        <TouchableOpacity onPress={() => setShowConfirmPassword((v: boolean) => !v)} style={styles.toggleBtn}>
          <Text style={styles.toggleText}>{showConfirmPassword ? 'Ocultar' : 'Ver'}</Text>
        </TouchableOpacity>
      </View>
      {errors.confirm_password && <Text style={styles.error}>{errors.confirm_password.message}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Registrarme</Text>}
      </TouchableOpacity>
    </ScrollContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: LegalTheme.colors.text },
  input: { borderWidth: 1, borderColor: LegalTheme.colors.border, borderRadius: LegalTheme.borderRadius.medium, padding: 12, marginBottom: 10, backgroundColor: LegalTheme.colors.surface },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  inputFlex: { flex: 1 },
  toggleBtn: { marginLeft: 8, paddingHorizontal: 10, paddingVertical: 8, borderRadius: LegalTheme.borderRadius.small, backgroundColor: LegalTheme.colors.surfaceVariant, borderWidth: 1, borderColor: LegalTheme.colors.border },
  toggleText: { color: LegalTheme.colors.primary, fontWeight: '600' },
  button: { backgroundColor: LegalTheme.colors.primary, padding: 14, borderRadius: LegalTheme.borderRadius.medium, alignItems: 'center', marginTop: 10, ...LegalTheme.shadows.large },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  error: { color: LegalTheme.colors.accentBurgundy, marginBottom: 8 }
});