import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Image, useWindowDimensions } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../hooks/useAuth';
import { LegalTheme } from '../constants/legaltheme';
import styles from './LoginStyles';
import LoginBackground from './LoginBackground';
import { ScrollContainer } from '../components/ScrollContainer';

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type FormData = z.infer<typeof schema>;

export default function LoginScreen({ navigation }: any) {
  const { width } = useWindowDimensions();
  const isWide = width >= 900;

  // Valores responsivos
  const containerPaddingH = isWide ? 32 : 16;
  const overlayPaddingV = isWide ? 28 : 20;
  const wrapperMaxWidth = Math.min(width - containerPaddingH * 2, 1200);
  const formBasis = isWide ? Math.max(360, Math.min(520, Math.round(width * 0.36))) : undefined;
  const brandCardPadding = isWide ? 24 : 12;
  const brandWidth = isWide
    ? Math.min(480, Math.max(280, Math.round(width * 0.32)))
    : Math.min(280, Math.max(200, Math.round(width * 0.55)));
  const brandHeight = Math.round(brandWidth * 0.275);

  const { login, loading } = useAuth();
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await login(data.email, data.password);
    } catch (e: any) {
      alert('Credenciales inválidas');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: LegalTheme.colors.background }}>
      <LoginBackground />
      <ScrollContainer style={[styles.overlay, { paddingHorizontal: containerPaddingH, paddingVertical: overlayPaddingV }]} contentContainerStyle={{ flexGrow: 1 }}>



        <View style={[styles.heroWrapper, { maxWidth: wrapperMaxWidth }] }>
          <View style={isWide ? styles.heroRow : styles.heroColumn}>
            <View style={[styles.formPanel, isWide ? { flexBasis: formBasis } : {}] }>
              <View style={styles.formCard}>
                <Text style={styles.title}>Iniciar sesión</Text>

                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      placeholder="Email"
                      autoCapitalize="none"
                      keyboardType="email-address"
                      style={styles.input}
                      value={value ?? ''}
                      onChangeText={onChange}
                    />
                  )}
                />
                {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      placeholder="Contraseña"
                      secureTextEntry
                      style={styles.input}
                      value={value ?? ''}
                      onChangeText={onChange}
                    />
                  )}
                />
                {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

                <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)} disabled={loading}>
                  {loading ? <ActivityIndicator color={LegalTheme.colors.surface} /> : <Text style={styles.buttonText}>Iniciar sesión</Text>}
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.link}>Crear cuenta</Text>
              </TouchableOpacity>
            </View>
            <View style={isWide ? styles.rightColumn : undefined}>
              <View style={[styles.brandPanel, { padding: brandCardPadding, minHeight: isWide ? undefined : 120 }] }>
                <Image source={require('../../assets/images/logolexianombre.png')} style={[styles.brandImage, { width: brandWidth, height: brandHeight }]} />
              </View>
              <View style={styles.welcomeCard}>
                <Text style={styles.welcomeText}>Bienvenido a Lexi IA, tu asistente legal</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollContainer>
    </View>
  );
}