# Plan Scrum – LexiaApp

## Visión
Entregar una experiencia fluida y consistente en web y móvil para usuarios y administradores, con navegación clara, scroll confiable, y acceso seguro al chat legal.

## Alcance actual
- Integración de contenedor de scroll reutilizable.
- Corrección de errores TypeScript/JSX.
- Mejora de iconografía en web.
- Acceso al chat legal desde CTA y acciones rápidas.
- Ajustes de tema y branding responsivo.

---

## Épica 1: Integración de scroll multiplataforma
**Objetivo:** Comportamiento de scroll consistente en web y móvil, sin romper el layout.

**Historias de usuario**
- Como usuario, quiero poder desplazar el contenido en la pantalla de inicio de sesión para ver el formulario completo en pantallas pequeñas.
- Como administrador, quiero desplazamiento en las pantallas de usuarios y creación de usuarios para acceder a toda la información.

**Historias técnicas**
- Crear un contenedor reutilizable de scroll que funcione en web y móvil.
- Integrar el contenedor en pantallas clave sin romper estilos existentes.

**Criterios de aceptación**
- Las pantallas permiten scroll, sin barras visibles no deseadas en web.
- No se rompe el fondo ni el layout.
- Sin errores TS/JSX por ScrollView o etiquetas desbalanceadas.

**Tareas**
- Crear componente ScrollContainer.
- Integrar en LoginScreen, RegisterScreen, ProfileScreen, AdminUsersScreen, AdminCreateUserScreen, UserScreen.
- Validación visual en web y móvil.

**Riesgos**
- Romper el overlay/fondo en Login.
  - Mitigación: respetar estructura (overlay/hero) y validar con LoginBackground.

**Estimación:** 5 puntos.

---

## Épica 2: Corrección de errores TypeScript y consistencia de imports
**Objetivo:** Eliminar errores de compilación y asegurar imports adecuados.

**Historia de usuario**
- Como usuario, quiero que la aplicación funcione sin errores al navegar y usar formularios.

**Historias técnicas**
- Reemplazar `React.useState` por import explícito de `useState` donde aplique.
- Sustituir `ScrollView` por `ScrollContainer` en pantallas que lo requieran.
- Corregir etiquetas JSX desbalanceadas.

**Criterios de aceptación**
- El proyecto compila sin errores TS/JSX en pantallas modificadas.

**Tareas**
- Arreglo en AdminCreateUserScreen (import { useState }).
- Sustitución de ScrollView por ScrollContainer en AdminUsersScreen.
- Corrección de cierre de etiquetas en LoginScreen.

**Estimación:** 3 puntos.

---

## Épica 3: UX Web – Iconos y fuentes
**Objetivo:** Evitar fallbacks de iconos (p.ej., “3”) en web.

**Historia de usuario**
- Como usuario web, quiero ver los íconos correctos en los botones y componentes.

**Historias técnicas**
- Cargar fuentes de Ionicons en el arranque con `expo-font`.
- Eliminar iconos problemáticos cuando sea preferible mantener solo texto.

**Criterios de aceptación**
- No se muestran caracteres erróneos en lugar de iconos en web.

**Tareas**
- Cargar fuente Ionicons en el entry point.
- Remover la flecha del CTA principal en UserScreen o reemplazar por texto.

**Riesgos**
- Latencia de carga de fuentes.
  - Mitigación: no renderizar hasta que la fuente esté lista; usar texto plano como fallback.

**Estimación:** 3 puntos.

---

## Épica 4: Legal Chat y acceso desde pantallas
**Objetivo:** Facilitar el acceso al chat legal desde el CTA y acciones rápidas.

**Historias de usuario**
- Como usuario, quiero iniciar una consulta legal desde el botón principal cuando el servicio esté disponible.
- Como usuario, quiero abrir el chat desde acciones rápidas por área del derecho.

**Historias técnicas**
- Integrar estado de salud del API para habilitar/deshabilitar CTA.
- Controlar apertura de chat y alertas de indisponibilidad.

**Criterios de aceptación**
- El CTA habilita el chat solo si el servicio está disponible.
- Las acciones rápidas abren el chat correctamente.

**Tareas**
- Validar/usar indicadores en UserScreen.
- Integrar chat en componente LegalChat.

**Estimación:** 5 puntos.

---

## Épica 5: Tema y branding responsivo
**Objetivo:** Experiencia visual consistente y responsiva.

**Historia de usuario**
- Como usuario, quiero ver un branding claro y legible en distintas resoluciones.

**Historias técnicas**
- Ajustes responsive en Login y Home.
- Uso consistente de colores del tema.

**Criterios de aceptación**
- Logos y tarjetas se escalan correctamente sin pixelación ni desbordes.

**Tareas**
- Revisión de estilos en LoginStyles.
- Ajustes de colores en legaltheme.

**Estimación:** 3 puntos.

---

## Backlog de Historias de Usuario (ejemplos)
- Ver cuántas consultas he realizado en mi panel principal.
- Crear usuarios desde una pantalla dedicada con indicador de carga coherente.
- Navegar entre secciones y temas frecuentes con una lista clara y accesible.

## Backlog de Historias Técnicas (ejemplos)
- Sustituir todos los `ScrollView` residuales por `ScrollContainer`.
- Añadir pruebas básicas de render (web) para pantallas clave.
- Centralizar lógica de verificación de salud de API.

## Definition of Ready (DoR)
- Historia con objetivo claro, criterios de aceptación definidos y dependencias identificadas.
- Mockups o referencias de UI cuando aplique.

## Definition of Done (DoD)
- Código integrado.
- Compilación sin errores.
- Validación visual en web y móvil.
- Comportamiento conforme a criterios de aceptación.

---

## Plan de Sprints y Day List

### Sprint 1 (Integración de Scroll y Correcciones TS)
**Duración:** 5 días.
**Objetivo:** Scroll consistente y eliminar errores TS/JSX.

**Day list**
- Día 1: Crear `ScrollContainer` y validar en una pantalla piloto.
- Día 2: Integrar en LoginScreen, RegisterScreen, ProfileScreen.
- Día 3: Integrar en AdminUsersScreen, AdminCreateUserScreen.
- Día 4: Correcciones TS (imports de `useState`), reemplazo de `ScrollView` residual; equilibrar JSX en LoginScreen.
- Día 5: Validación visual web/móvil; ajustes finos de estilos.

### Sprint 2 (UX Web – Iconos y Chat)
**Duración:** 5 días.
**Objetivo:** Evitar fallbacks de iconos en web y pulir acceso al chat.

**Day list**
- Día 1: Cargar Ionicons con `expo-font` en el entry point; validar en navegador.
- Día 2: Remover iconos problemáticos y dejar texto plano donde aplique (UserScreen).
- Día 3: Validar CTA y acciones rápidas para abrir chat (LegalChat).
- Día 4: Ajustes de tema/branding y revisión de responsividad (LoginStyles, legaltheme).
- Día 5: Pruebas de navegación y confirmación de criterios de aceptación.

---

## Métricas sugeridas
- Tiempo de respuesta del API (p95).
- Errores de compilación por sprint: objetivo cero.
- Tasa de éxito de apertura del chat desde CTA/acciones rápidas.

## Dependencias
- `@expo/vector-icons`, `expo-font` para iconos.
- `react-hook-form`, `zod` para formularios y validación.

## Notas
Este plan es iterativo y puede ajustarse según hallazgos en validación visual y feedback de usuarios.