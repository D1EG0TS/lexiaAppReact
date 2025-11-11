import Constants from 'expo-constants';

export const API_URL = process.env.EXPO_PUBLIC_API_URL || (Constants?.expoConfig?.extra as any)?.apiUrl || 'http://127.0.0.1:8000';

export const getApiUrl = () => API_URL;

export const infoApiUrl = () => {
  return {
    apiUrl: API_URL,
    hint: 'Para probar en dispositivo físico, sustituye por tu IP local: http://192.168.1.XX:8000',
  } as const;
};