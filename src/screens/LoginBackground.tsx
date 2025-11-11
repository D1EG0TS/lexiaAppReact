import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { View } from 'react-native';
import { LegalTheme } from '../constants/legaltheme';

export default function LoginBackground() {
  return (
    <View style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}>
      {/* Bloque diagonal principal en tonos del primario */}
      <LinearGradient
        colors={[LegalTheme.colors.primaryDark, LegalTheme.colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          position: 'absolute',
          left: -80,
          top: -60,
          width: '130%',
          height: '70%',
          transform: [{ rotate: '-8deg' }],
          borderRadius: 32,
          opacity: 0.9,
        }}
      />

      {/* Círculo dorado translúcido */}
      <View
        style={{
          position: 'absolute',
          right: -40,
          top: 100,
          width: 220,
          height: 220,
          borderRadius: 110,
          backgroundColor: `${LegalTheme.colors.secondary}33`, // dorado suave
        }}
      />

      {/* Círculo primario suave en la esquina inferior izquierda */}
      <View
        style={{
          position: 'absolute',
          left: -60,
          bottom: 40,
          width: 280,
          height: 280,
          borderRadius: 140,
          backgroundColor: `${LegalTheme.colors.primary}1A`,
        }}
      />

      {/* Banda inferior gris con ligera inclinación */}
      <View
        style={{
          position: 'absolute',
          right: 0,
          bottom: -20,
          width: '65%',
          height: 120,
          backgroundColor: `${LegalTheme.colors.surfaceVariant}CC`,
          borderTopLeftRadius: 24,
          transform: [{ skewX: '-8deg' }],
        }}
      />

      {/* 🔹 NUEVAS FIGURAS GEOMÉTRICAS 🔹 */}

      {/* Triángulo verde fuerte (decorativo en la esquina superior izquierda) */}
      <View
        style={{
          position: 'absolute',
          top: 40,
          left: 30,
          width: 0,
          height: 0,
          borderLeftWidth: 60,
          borderRightWidth: 60,
          borderBottomWidth: 100,
          borderStyle: 'solid',
          backgroundColor: 'transparent',
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: '#0EAD69', // verde fuerte
          opacity: 0.8,
          transform: [{ rotate: '-10deg' }],
        }}
      />

      {/* Rectángulo dorado diagonal (decorativo central) */}
      <View
        style={{
          position: 'absolute',
          top: '40%',
          left: '20%',
          width: 160,
          height: 40,
          backgroundColor: '#CBA135', // dorado
          opacity: 0.4,
          borderRadius: 8,
          transform: [{ rotate: '25deg' }],
        }}
      />

      {/* Óvalo gris translúcido (fondo sutil) */}
      <View
        style={{
          position: 'absolute',
          top: '60%',
          right: '10%',
          width: 220,
          height: 120,
          borderRadius: 120,
          backgroundColor: '#A9A9A955', // gris translúcido
          transform: [{ rotate: '-15deg' }],
        }}
      />

      {/* Pequeño triángulo invertido dorado (detalle inferior) */}
      <View
        style={{
          position: 'absolute',
          bottom: 80,
          right: 50,
          width: 0,
          height: 0,
          borderLeftWidth: 40,
          borderRightWidth: 40,
          borderTopWidth: 70,
          borderStyle: 'solid',
          backgroundColor: 'transparent',
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderTopColor: '#FFD700', // dorado brillante
          opacity: 0.5,
        }}
      />

      {/* Cuadro verde saturado en esquina inferior izquierda */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 20,
          width: 80,
          height: 80,
          backgroundColor: '#007A33', // verde institucional fuerte
          opacity: 0.7,
          transform: [{ rotate: '12deg' }],
          borderRadius: 12,
        }}
      />
    </View>
  );
}
