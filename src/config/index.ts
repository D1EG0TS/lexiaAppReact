import Constants from 'expo-constants';

const extra = (Constants?.expoConfig?.extra as any) || {};

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL || extra.apiUrl || 'http://192.168.1.108:8000';

export const LEGAL_API_URL =
  process.env.EXPO_PUBLIC_LEGAL_API_URL || extra.legalApiUrl || 'http://192.168.1.108:8001';

export const getApiUrl = () => API_URL;
export const getLegalApiUrl = () => LEGAL_API_URL;

export const infoApiUrl = () => {
  return {
    apiUrl: API_URL,
    legalApiUrl: LEGAL_API_URL,
    hint:
      'Configura EXPO_PUBLIC_API_URL y EXPO_PUBLIC_LEGAL_API_URL para producción. En pruebas con dispositivo físico, usa tu IP local (ej.: http://192.168.1.xx:8000 y :8001).',
  } as const;
};