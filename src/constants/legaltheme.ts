export const LegalTheme = {
  colors: {
    // Azul marino: confianza, profesionalismo
    primary: '#00353a',
    primaryDark: '#325d61',
    // Dorado: prestigio y excelencia
    secondary: '#D4AF37',
    // Neutros sobrios para fondos y superficies
    background: '#F5F6F7',
    surface: '#FFFFFF',
    surfaceVariant: '#F7F7F7',
    border: '#D1D5DB',
    // Tipografías
    text: '#1F2937',
    textSecondary: '#6B7280',
    // Estados
    warning: '#FFC107',
    // Mensajes en UI (suaves y legibles)
    userMessage: '#E6EEF7',
    assistantMessage: '#E8F5E9',
    systemMessage: '#FFF7E6',
    // Acentos temáticos adicionales
    accentGreen: '#1F4D3A', // ética, equilibrio
    accentBurgundy: '#7B1E3A', // tradición, distinción
    accentBlack: '#111827', // autoridad
  },
  borderRadius: {
    small: 8,
    medium: 12,
    large: 16,
  },
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 2.0,
      elevation: 1,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8.0,
      elevation: 3,
    },
  },
};

export type LegalThemeType = typeof LegalTheme;