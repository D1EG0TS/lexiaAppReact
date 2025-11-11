import React from 'react';
import { AuthProvider } from '../src/context/AuthContext';
import AppNavigator from '../src/navigation';
import { NavigationIndependentTree } from '@react-navigation/native';
import { useFonts } from 'expo-font';

export default function Index() {
  const [fontsLoaded] = useFonts({
    Ionicons: require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf'),
  });

  if (!fontsLoaded) {
    // Evita renderizar la UI hasta que la fuente de iconos esté lista (previene caracteres como "3" en lugar de íconos)
    return null;
  }

  return (
    <AuthProvider>
      <NavigationIndependentTree>
        <AppNavigator />
      </NavigationIndependentTree>
    </AuthProvider>
  );
}
