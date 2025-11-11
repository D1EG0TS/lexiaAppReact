import React, { useCallback, useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Linking, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { LegalTheme } from '../constants/legaltheme';
import { apiService, ConsultaLegal, RespuestaLegal } from '../api/legalService';
import { ConfiguracionConsulta } from './ConfiguracionConsulta';
import { LegalLoadingIndicator } from './legalloadingindicator';

interface LegalChatProps {
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  fundamentos?: RespuestaLegal['fundamentos_legales'];
}

export const LegalChat: React.FC<LegalChatProps> = ({ onClose }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [consultaConfig, setConsultaConfig] = useState<Partial<ConsultaLegal>>({
    tipo_lenguaje: 'mixto',
    incluir_fundamentos: true,
    max_documentos: 5,
    umbral_relevancia: 0.7,
    incluir_metadatos: false,
  });
  // Eliminado: const { logout } = useAuth();

  const scrollToEnd = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    });
  }, []);

  const sendMessage = async () => {
    const question = input.trim();
    if (!question || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now() + '-user',
      text: question,
      sender: 'user',
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    scrollToEnd();

    setLoading(true);
    try {
      const payload: ConsultaLegal = {
        pregunta: question,
        ...consultaConfig,
      };
      const res = await apiService.realizarConsulta(payload);
      if (res.success && res.data) {
        const assistantMsg: ChatMessage = {
          id: Date.now() + '-assistant',
          text: res.data.respuesta,
          sender: 'assistant',
          fundamentos: res.data.fundamentos_legales,
        };
        setMessages((prev) => [...prev, assistantMsg]);
        scrollToEnd();
      } else {
        const assistantMsg: ChatMessage = {
          id: Date.now() + '-assistant-error',
          text: res.error || 'Ocurrió un error al procesar la consulta legal.',
          sender: 'assistant',
        };
        setMessages((prev) => [...prev, assistantMsg]);
        scrollToEnd();
      }
    } catch (error: any) {
      const assistantMsg: ChatMessage = {
        id: Date.now() + '-assistant-error',
        text: error?.message || 'Error de red: no fue posible contactar el servicio.',
        sender: 'assistant',
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={[LegalTheme.colors.primary, LegalTheme.colors.primaryDark]} style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Consulta Legal</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <TouchableOpacity onPress={() => setShowConfig((s) => !s)} style={styles.configButton} activeOpacity={0.8}>
              <Ionicons name="settings" size={20} color={LegalTheme.colors.surface} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.closeButton} activeOpacity={0.8}>
              <Ionicons name="close" size={22} color={LegalTheme.colors.surface} />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.headerSubtitle}>Haz tu pregunta y obtén una respuesta basada en la legislación mexicana</Text>
      </LinearGradient>

      {/* Panel de configuración */}
      {showConfig && (
        <ConfiguracionConsulta
          config={consultaConfig}
          onConfigChange={setConsultaConfig}
          onClose={() => setShowConfig(false)}
        />
      )}

      {/* Chat area */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView ref={scrollRef} contentContainerStyle={styles.messagesContainer}>
          {messages.map((m) => (
            <View key={m.id} style={[styles.messageBubble, m.sender === 'user' ? styles.userBubble : styles.assistantBubble]}>
              <Text style={[styles.messageText, m.sender === 'user' ? styles.userText : styles.assistantText]}>{m.text}</Text>
              {m.fundamentos && m.fundamentos.length > 0 && (
                <View style={styles.fundamentosBox}>
                  <Text style={styles.fundamentosTitle}>Fundamentos legales</Text>
                  {m.fundamentos.map((f, idx) => (
                    <View key={`${m.id}-f-${idx}`} style={styles.fundamentoItem}>
                      <Ionicons name="document-text" size={16} color={LegalTheme.colors.primary} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.fundamentoTitulo}>{f.titulo}</Text>
                        <Text style={styles.fundamentoFragmento}>{f.fragmento}</Text>
                        {(f.url || f.articulo) && (
                          <View style={styles.fundamentoLinks}>
                            {f.url && (
                              <TouchableOpacity style={styles.linkRow} onPress={() => handleOpenFundamentoUrl(f.url!)} activeOpacity={0.8}>
                                <Ionicons name="link" size={14} color={LegalTheme.colors.primary} />
                                <Text style={styles.linkText}>Ver documento</Text>
                              </TouchableOpacity>
                            )}
                            {f.articulo && (
                              <TouchableOpacity style={styles.linkRow} onPress={() => handleOpenFundamentoArticulo(f)} activeOpacity={0.8}>
                                <Ionicons name="bookmark-outline" size={14} color={LegalTheme.colors.secondary} />
                                <Text style={[styles.linkText, { color: LegalTheme.colors.secondary }]}>Ver artículo</Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
          {/* Loading overlay moved outside ScrollView */}
        </ScrollView>

        {/* Composer */}
        <View style={styles.composer}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Escribe tu pregunta legal..."
            placeholderTextColor={LegalTheme.colors.textSecondary}
            style={styles.input}
            multiline
          />
          <TouchableOpacity style={[styles.sendButton, !input.trim() || loading ? styles.sendDisabled : undefined]} onPress={sendMessage} disabled={!input.trim() || loading}>
            <Ionicons name="send" size={18} color={LegalTheme.colors.surface} />
            <Text style={styles.sendText}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      {loading && <LegalLoadingIndicator message="Generando respuesta..." />}
    </View>
  );
};

export default LegalChat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LegalTheme.colors.background,
  },
  header: {
    paddingTop: 18,
    paddingBottom: 18,
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: LegalTheme.colors.surface,
    fontSize: 18,
    fontWeight: '700',
  },
  closeButton: {
    padding: 8,
    borderRadius: 16,
    backgroundColor: `${LegalTheme.colors.surface}26`,
  },
  configButton: {
    padding: 8,
    borderRadius: 16,
    backgroundColor: `${LegalTheme.colors.surface}26`,
  },
  // logoutButton style removed
  headerSubtitle: {
    marginTop: 8,
    color: `${LegalTheme.colors.surface}D8`,
    fontSize: 13,
  },
  flex: { flex: 1 },
  messagesContainer: {
    padding: 16,
    paddingBottom: 110,
  },
  messageBubble: {
    borderRadius: LegalTheme.borderRadius.medium,
    padding: 12,
    marginBottom: 10,
    ...LegalTheme.shadows.small,
  },
  userBubble: {
    backgroundColor: LegalTheme.colors.userMessage,
    alignSelf: 'flex-end',
    maxWidth: '85%',
  },
  assistantBubble: {
    backgroundColor: LegalTheme.colors.assistantMessage,
    alignSelf: 'flex-start',
    maxWidth: '85%',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userText: {
    color: LegalTheme.colors.text,
  },
  assistantText: {
    color: LegalTheme.colors.text,
  },
  fundamentosBox: {
    marginTop: 8,
    backgroundColor: LegalTheme.colors.surfaceVariant,
    borderRadius: LegalTheme.borderRadius.small,
    padding: 8,
  },
  fundamentosTitle: {
    fontSize: 12,
    color: LegalTheme.colors.textSecondary,
    marginBottom: 6,
  },
  fundamentoItem: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  fundamentoTitulo: {
    fontSize: 13,
    fontWeight: '600',
    color: LegalTheme.colors.text,
    marginBottom: 2,
  },
  fundamentoFragmento: {
    fontSize: 12,
    color: LegalTheme.colors.textSecondary,
    lineHeight: 18,
  },
  fundamentoLinks: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkText: {
    fontSize: 12,
    color: LegalTheme.colors.primary,
    fontWeight: '500',
    marginLeft: 4,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  loadingText: {
    color: LegalTheme.colors.textSecondary,
    fontSize: 13,
  },
  composer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: LegalTheme.colors.border,
    backgroundColor: LegalTheme.colors.background,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    backgroundColor: LegalTheme.colors.surface,
    borderRadius: LegalTheme.borderRadius.medium,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: LegalTheme.colors.text,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: LegalTheme.colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: LegalTheme.borderRadius.medium,
    gap: 6,
  },
  sendText: {
    color: LegalTheme.colors.surface,
    fontWeight: '600',
    fontSize: 13,
  },
  sendDisabled: {
    opacity: 0.6,
  },
});


  const handleOpenFundamentoUrl = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'No se puede abrir este enlace en tu dispositivo', [{ text: 'OK' }]);
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al intentar abrir el enlace', [{ text: 'OK' }]);
    }
  };

  const handleOpenFundamentoArticulo = async (f: { fuente?: string; titulo?: string; articulo?: string; url?: string }) => {
    const articuloQuery = `${f?.fuente ?? ''} ${f?.titulo ?? ''} ${f?.articulo ?? ''}`.trim();
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(articuloQuery)}`;
    const targetUrl = f?.url || searchUrl;

    try {
      const supported = await Linking.canOpenURL(targetUrl);
      if (supported) {
        await Linking.openURL(targetUrl);
      } else {
        Alert.alert('Error', 'No se puede abrir este enlace en tu dispositivo', [{ text: 'OK' }]);
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al intentar abrir el enlace del artículo', [{ text: 'OK' }]);
    }
  };
