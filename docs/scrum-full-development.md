# Plan Scrum de desarrollo: APIs, Screens y Componentes

Documento de trabajo Scrum que cubre la conexión con APIs, creación de screens y componentes, y sistema de temas para LexiaApp.

## Alcance y referencias
- Cliente API: <mcfile name="client.ts" path="src/api/client.ts"></mcfile>
- Servicios API: <mcfile name="legalService.ts" path="src/api/legalService.ts"></mcfile>
- Contexto y auth: <mcfile name="AuthContext.tsx" path="src/context/AuthContext.tsx"></mcfile>, <mcfile name="useAuth.ts" path="src/hooks/useAuth.ts"></mcfile>, <mcfile name="tokenStorage.ts" path="src/utils/tokenStorage.ts"></mcfile>
- Navegación: <mcfile name="index.tsx" path="src/navigation/index.tsx"></mcfile>
- Entry y fuentes: <mcfile name="index.tsx" path="app/index.tsx"></mcfile>
- Temas: <mcfile name="legaltheme.ts" path="src/constants/legaltheme.ts"></mcfile>
- Scroll: <mcfile name="ScrollContainer.tsx" path="src/components/ScrollContainer.tsx"></mcfile>
- Screens: <mcfile name="LoginScreen.tsx" path="src/screens/LoginScreen.tsx"></mcfile>, <mcfile name="RegisterScreen.tsx" path="src/screens/RegisterScreen.tsx"></mcfile>, <mcfile name="ProfileScreen.tsx" path="src/screens/ProfileScreen.tsx"></mcfile>, <mcfile name="UserScreen.tsx" path="src/screens/UserScreen.tsx"></mcfile>, <mcfile name="AdminUsersScreen.tsx" path="src/screens/AdminUsersScreen.tsx"></mcfile>, <mcfile name="AdminCreateUserScreen.tsx" path="src/screens/AdminCreateUserScreen.tsx"></mcfile>
- Componentes: <mcfile name="LegalChat.tsx" path="src/components/LegalChat.tsx"></mcfile>, <mcfile name="DocumentoLegalCard.tsx" path="src/components/DocumentoLegalCard.tsx"></mcfile>, <mcfile name="ConfiguracionConsulta.tsx" path="src/components/ConfiguracionConsulta.tsx"></mcfile>, <mcfile name="legalloadingindicator.tsx" path="src/components/legalloadingindicator.tsx"></mcfile>

---
## Épica 1: Infraestructura API y Autenticación
Objetivo: Conectar la app con servicios REST, gestionar tokens y estado de sesión.

Historias de Usuario:
- Como usuario, quiero iniciar sesión y mantener mi sesión activa.
- Como usuario, quiero cerrar sesión de forma segura.

Historias Técnicas:
- Configurar cliente HTTP y manejo de errores en <mcfile name="client.ts" path="src/api/client.ts"></mcfile>.
- Implementar servicios en <mcfile name="legalService.ts" path="src/api/legalService.ts"></mcfile> (login, registro, consultas, perfil).
- Persistir tokens en <mcfile name="tokenStorage.ts" path="src/utils/tokenStorage.ts"></mcfile> y gestionar sesión en <mcfile name="AuthContext.tsx" path="src/context/AuthContext.tsx"></mcfile> / <mcfile name="useAuth.ts" path="src/hooks/useAuth.ts"></mcfile>.

Criterios de aceptación:
- Login/Logout funcional, token persistido y refrescado cuando aplique.
- Errores de red con mensajes claros y estados de carga.

Tareas:
- Crear base URL y interceptores.
- Implementar métodos de auth y usuario.
- Integrar en Screens (Login/Register/Profile).

Riesgos:
- Inconsistencias de token: centralizar en tokenStorage y contexto.
- Errores silenciosos: logging y manejo de excepciones en servicios.

Estimación: 8–12 puntos.

---
## Épica 2: Screens base y Navegación
Objetivo: Construir pantallas principales con patrón consistente y rutas claras.

Historias de Usuario:
- Login, Registro, Perfil y Home con accesos rápidos y estados de carga.

Historias Técnicas:
- Plantilla de Screen funcional con `ScrollContainer` en cada screen.
- Definir rutas en <mcfile name="index.tsx" path="src/navigation/index.tsx"></mcfile>.

Criterios de aceptación:
- Compila sin errores TS/JSX; navegación estable entre pantallas.

Tareas:
- Crear y estilizar Screens con <mcfile name="legaltheme.ts" path="src/constants/legaltheme.ts"></mcfile>.
- Conectar acciones con servicios (login, registro, perfil).

Riesgos: cierres de tags y scroll web; mitigar con patrón `ScrollContainer` y revisión manual.

Estimación: 8–10 puntos.

---
## Épica 3: Componentes reutilizables y UI
Objetivo: Estandarizar componentes, estilos y accesibilidad.

Historias de Usuario:
- Ver tarjetas y formularios consistentes; feedback de carga claro.

Historias Técnicas:
- Componentes clave: <mcfile name="LegalChat.tsx" path="src/components/LegalChat.tsx"></mcfile>, <mcfile name="DocumentoLegalCard.tsx" path="src/components/DocumentoLegalCard.tsx"></mcfile>, <mcfile name="ConfiguracionConsulta.tsx" path="src/components/ConfiguracionConsulta.tsx"></mcfile>, <mcfile name="legalloadingindicator.tsx" path="src/components/legalloadingindicator.tsx"></mcfile>.
- Props tipadas; estilos desde `LegalTheme`.

Criterios de aceptación:
- Reutilizables, documentados y probados en Screens.

Tareas:
- Definir interfaces; implementar estilos; integrar.

Riesgos: divergencia de estilos; mitigar con tokens y lint.

Estimación: 10–14 puntos.

---
## Épica 4: Temas, Fuentes y Accesibilidad
Objetivo: Consolidar tokens visuales y asegurar legibilidad.

Historias Técnicas:
- Completar paleta, sombras y radios en <mcfile name="legaltheme.ts" path="src/constants/legaltheme.ts"></mcfile>.
- Cargar fuentes en <mcfile name="index.tsx" path="app/index.tsx"></mcfile> para consistencia de iconografía.

Criterios de aceptación:
- Uso consistente de `LegalTheme`; contraste adecuado.

Tareas:
- Sustituir colores hardcodeados; revisar tamaños mínimos.

Estimación: 5–8 puntos.

---
## Backlog priorizado
1) Infra API y auth (Épica 1).
2) Screens base y navegación (Épica 2).
3) Componentes reutilizables (Épica 3).
4) Temas y accesibilidad (Épica 4).

---
## Day List (2 sprints)
Sprint 1 (Días 1–5):
- Día 1: Cliente API y tokenStorage; rutas base.
- Día 2: Login/Register con servicios y `ScrollContainer`.
- Día 3: Profile y UserScreen; estados de carga/errores.
- Día 4: Componentes base (Card, Indicador) e integración.
- Día 5: Pruebas en web/móvil; fixes de navegación.

Sprint 2 (Días 6–10):
- Día 6: LegalTheme completo; refactor de estilos.
- Día 7: LegalChat y Configuración; flujo de consulta.
- Día 8: Accesibilidad y fuentes; revisión visual.
- Día 9: Endpoints adicionales (consultas, perfil); manejo de errores.
- Día 10: Cierre de historias; documentación y retro.

---
## DoR / DoD
- DoR: historias con objetivo, criterios y dependencias; tokens definidos.
- DoD: compila sin errores; navegación y scroll verificados; documentación mínima.

## Métricas
- % de Screens con `ScrollContainer` y `LegalTheme`.
- Tasa de errores de red; tiempos de carga.
- Incidencias de accesibilidad.