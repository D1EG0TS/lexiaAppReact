import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AdminUsersScreen from '../screens/AdminUsersScreen';
import { View, ActivityIndicator } from 'react-native';
import UserScreen from '../screens/UserScreen';
// (AdminCreateUserScreen import removed – file does not exist)

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Profile: undefined;
  AdminUsers: undefined;
  AdminCreateUser: undefined;
  User: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { token, user, loading } = useAuth();
  const isAdmin = user?.role === 'admin';

  // Mientras se resuelve la información del usuario tras el login, mostramos un loader
  if (token && loading) {
    return (
      <NavigationContainer>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      {!token ? (
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Iniciar sesión' }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Registro' }} />
        </Stack.Navigator>
      ) : isAdmin ? (
        <Stack.Navigator initialRouteName="AdminUsers">
          <Stack.Screen name="AdminUsers" component={AdminUsersScreen} options={{ title: 'Usuarios' }} />
          {/* AdminCreateUserScreen removed – file does not exist */}
          <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator initialRouteName="User">
          <Stack.Screen name="User" component={UserScreen} options={{ title: 'Inicio' }} />
          <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}