# Guía de creación: Screens, Componentes y Temas (Frontend)

Este documento explica cómo se crean y mantienen las pantallas (screens), los componentes reutilizables y el sistema de temas del proyecto LexiaApp.

## Estructura del proyecto (resumen)
- Screens: <mcfile name="screens" path="src/screens"></mcfile>
- Componentes: <mcfile name="components" path="src/components"></mcfile>
- Tema y constantes: <mcfile name="legaltheme.ts" path="src/constants/legaltheme.ts"></mcfile>
- Navegación: <mcfile name="index.tsx" path="src/navigation/index.tsx"></mcfile>
- Contexto de autenticación: <mcfile name="AuthContext.tsx" path="src/context/AuthContext.tsx"></mcfile>
- Hook de autenticación: <mcfile name="useAuth.ts" path="src/hooks/useAuth.ts"></mcfile>
- Entry point (carga de fuentes e inicio de navegación): <mcfile name="index.tsx" path="app/index.tsx"></mcfile>

## Temas y diseño
Archivo principal: <mcfile name="legaltheme.ts" path="src/constants/legaltheme.ts"></mcfile>
- Define colores (primary, primaryDark, background, surface, text, textSecondary, border, warning), radios de borde y sombras.
- Uso recomendado:
  - Importar `LegalTheme` en screens y componentes.
  - Usar `LegalTheme.colors.*` para colores y mantener consistencia.
  - Usar `LegalTheme.borderRadius.*` y `LegalTheme.shadows.*` para apariencia coherente.

## Componentes clave
- Contenedor de Scroll: <mcfile name="ScrollContainer.tsx" path="src/components/ScrollContainer.tsx"></mcfile>
  - Proporciona scroll consistente en web y móvil.
  - Props comunes: `style`, `contentContainerStyle`, `showsVerticalScrollIndicator`.
  - Patrón de uso: envolver el contenido principal de cada screen.

- Chat legal: <mcfile name="LegalChat.tsx" path="src/components/LegalChat.tsx"></mcfile>
  - Componente para iniciar y gestionar consultas legales.
  - Se integra desde pantallas como UserScreen.

- Configuración de consulta: <mcfile name="ConfiguracionConsulta.tsx" path="src/components/ConfiguracionConsulta.tsx"></mcfile>
  - Opciones previas a iniciar un chat o establecer parámetros.

- Tarjeta de documento legal: <mcfile name="DocumentoLegalCard.tsx" path="src/components/DocumentoLegalCard.tsx"></mcfile>
  - Card para mostrar información legal de forma condensada.

- Indicador de carga: <mcfile name="legalloadingindicator.tsx" path="src/components/legalloadingindicator.tsx"></mcfile>
  - Indicador visual reutilizable.

## Screens (patrones y ejemplos)
- Login: <mcfile name="LoginScreen.tsx" path="src/screens/LoginScreen.tsx"></mcfile>
  - Usa <mcfile name="LoginBackground.tsx" path="src/screens/LoginBackground.tsx"></mcfile> para el fondo.
  - Formulario con `react-hook-form` y validación con `zod`.
  - Envoltorio con `ScrollContainer` para asegurar scroll en pantallas pequeñas.
  - Estilos en <mcfile name="LoginStyles.ts" path="src/screens/LoginStyles.ts"></mcfile>.

- Registro: <mcfile name="RegisterScreen.tsx" path="src/screens/RegisterScreen.tsx"></mcfile>
  - Patrón similar a Login: formulario, validación, scroll.

- Perfil: <mcfile name="ProfileScreen.tsx" path="src/screens/ProfileScreen.tsx"></mcfile>
  - Presenta información del usuario y acciones sobre el perfil.

- Usuario (Home): <mcfile name="UserScreen.tsx" path="src/screens/UserScreen.tsx"></mcfile>
  - CTA principal para iniciar consulta legal.
  - Acciones rápidas por área del derecho.
  - Se integra `LegalChat` y se usa `ScrollContainer`.

- Administración de usuarios: <mcfile name="AdminUsersScreen.tsx" path="src/screens/AdminUsersScreen.tsx"></mcfile>
  - Lista/gestión de usuarios.
  - Scroll consistente para tablas y formularios.

- Crear usuario (admin): <mcfile name="AdminCreateUserScreen.tsx" path="src/screens/AdminCreateUserScreen.tsx"></mcfile>
  - Formulario de creación con `useState` y validaciones.

## Navegación
Archivo: <mcfile name="index.tsx" path="src/navigation/index.tsx"></mcfile>
- Define el árbol de navegación (stack o tabs) y rutas para cada screen.
- Recomendación: mantener nombres de rutas semánticos y consistentes.

## Autenticación
- Contexto: <mcfile name="AuthContext.tsx" path="src/context/AuthContext.tsx"></mcfile>
- Hook: <mcfile name="useAuth.ts" path="src/hooks/useAuth.ts"></mcfile>
- Uso: `const { login, loading, user } = useAuth();`

## Buenas prácticas
- Importar `useState` explícitamente: `import { useState } from 'react'`.
- Evitar `React.useState` en módulos TS para prevenir errores de tipo.
- En web, cargar fuentes de iconos: ver <mcfile name="index.tsx" path="app/index.tsx"></mcfile> (carga de Ionicons con `expo-font`).
- Usar `ScrollContainer` en lugar de `ScrollView` directo por consistencia multiplataforma.
- Mantener estilos en archivos dedicados cuando el screen sea complejo.

## Cómo crear una nueva Screen (paso a paso)
1) Crear el archivo en <mcfile name="screens" path="src/screens"></mcfile> con el patrón de componente funcional.
2) Envolver el contenido con `ScrollContainer`.
3) Importar `LegalTheme` para estilos y colores.
4) Si hay formularios: usar `react-hook-form` + `zod`.
5) Agregar la ruta en <mcfile name="index.tsx" path="src/navigation/index.tsx"></mcfile>.
6) Validar visualmente en web y móvil.

## Cómo crear un nuevo Componente
1) Crear el archivo en <mcfile name="components" path="src/components"></mcfile>.
2) Definir props claras y evitar estado interno cuando no sea necesario.
3) Usar `LegalTheme` para estilos.
4) Documentar el uso y ejemplos.
5) Reutilizar en screens donde aplique.

## Estándares de estilo y nombres
- Componentes en PascalCase (`UserCard`, `LegalChat`).
- Screens terminan en `Screen`.
- Utilidades y hooks en camelCase (`useAuth`, `tokenStorage`).

## Validación y pruebas manuales
- Compilar sin errores TS/JSX.
- Revisar UI con scroll y responsivo.
- Verificar navegación entre pantallas y apertura del chat.

## Referencias del proyecto
- Temas: <mcfile name="legaltheme.ts" path="src/constants/legaltheme.ts"></mcfile>
- Scroll: <mcfile name="ScrollContainer.tsx" path="src/components/ScrollContainer.tsx"></mcfile>
- Entry y fuentes: <mcfile name="index.tsx" path="app/index.tsx"></mcfile>

---
Este documento sirve como guía práctica para mantener coherencia al crear nuevas screens y componentes, asegurando consistencia visual y técnica en todo el frontend.