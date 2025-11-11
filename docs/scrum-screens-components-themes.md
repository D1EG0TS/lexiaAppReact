# Plan Scrum: Creación de Screens, Componentes y Temas

Este documento simula un modelo de trabajo Scrum centrado en la creación y estandarización de screens, componentes reutilizables y temas de diseño para LexiaApp.

## Alcance
- Screens base y flujo principal: <mcfile name="screens" path="src/screens"></mcfile>
- Biblioteca de componentes: <mcfile name="components" path="src/components"></mcfile>
- Sistema de temas: <mcfile name="legaltheme.ts" path="src/constants/legaltheme.ts"></mcfile>
- Consistencia de scroll: <mcfile name="ScrollContainer.tsx" path="src/components/ScrollContainer.tsx"></mcfile>
- Navegación: <mcfile name="index.tsx" path="src/navigation/index.tsx"></mcfile>
- Entry y carga de fuentes: <mcfile name="index.tsx" path="app/index.tsx"></mcfile>

---
## Épica 1: Diseño y creación de Screens base
Objetivo: Definir y crear las pantallas esenciales con patrón consistente (funcional, estilado con LegalTheme, scroll multiplataforma).

Historias de Usuario:
- Como usuario, quiero iniciar sesión de forma clara y responsiva para acceder a mi cuenta (Login). 
- Como usuario, quiero registrarme con validación para crear una cuenta (Register). 
- Como usuario, quiero ver mi perfil y editar información básica (Profile). 
- Como usuario, quiero un Home con acciones claras para iniciar una consulta legal (UserScreen). 

Historias Técnicas:
- Definir plantilla de Screen funcional y uso de `ScrollContainer` en cada pantalla (<mcfile name="LoginScreen.tsx" path="src/screens/LoginScreen.tsx"></mcfile>, <mcfile name="RegisterScreen.tsx" path="src/screens/RegisterScreen.tsx"></mcfile>, <mcfile name="ProfileScreen.tsx" path="src/screens/ProfileScreen.tsx"></mcfile>, <mcfile name="UserScreen.tsx" path="src/screens/UserScreen.tsx"></mcfile>). 
- Estandarizar estilos externos cuando corresponda (p. ej. <mcfile name="LoginStyles.ts" path="src/screens/LoginStyles.ts"></mcfile>). 

Criterios de aceptación:
- Cada Screen compila sin errores TS/JSX. 
- Usa `ScrollContainer` y `LegalTheme` para colores y espaciados. 
- Navegación hacia/desde cada Screen está habilitada en <mcfile name="index.tsx" path="src/navigation/index.tsx"></mcfile>. 

Tareas:
- Crear plantilla de Screen base con props mínimas. 
- Integrar validaciones donde aplique (formularios). 
- Conectar rutas en navegación. 

Riesgos y mitigación:
- Inconsistencias visuales: centralizar tokens en LegalTheme. 
- Problemas de scroll en web: usar `ScrollContainer` en todos los Screens. 

Estimación: 8–12 puntos (dependiendo de formularios y validaciones).

---
## Épica 2: Biblioteca de Componentes reutilizables
Objetivo: Diseñar componentes consistentes, accesibles y con estilos basados en LegalTheme.

Historias de Usuario:
- Como usuario, quiero ver elementos y tarjetas homogéneas para entender la información rápidamente. 
- Como usuario, quiero indicadores de carga claros mientras espero respuestas. 

Historias Técnicas:
- Crear y documentar componentes clave: 
  - <mcfile name="DocumentoLegalCard.tsx" path="src/components/DocumentoLegalCard.tsx"></mcfile> 
  - <mcfile name="ConfiguracionConsulta.tsx" path="src/components/ConfiguracionConsulta.tsx"></mcfile> 
  - <mcfile name="legalloadingindicator.tsx" path="src/components/legalloadingindicator.tsx"></mcfile> 
- Asegurar props tipadas, estados controlados y estilos con `LegalTheme`. 

Criterios de aceptación:
- Componentes con props documentadas y tipadas. 
- Uso de `LegalTheme.colors` y `LegalTheme.borderRadius`. 
- Pruebas manuales en screens que consumen estos componentes. 

Tareas:
- Definir interfaz de props. 
- Implementar estilos reutilizables. 
- Integrar componentes en Screens (p. ej. UserScreen). 

Riesgos y mitigación:
- Propiedades cambiantes: versionado interno de componentes y ejemplos de uso. 
- Accesibilidad limitada: revisar tamaño de texto y contraste en LegalTheme. 

Estimación: 10–15 puntos.

---
## Épica 3: Sistema de Temas (LegalTheme) y consistencia visual
Objetivo: Consolidar el sistema de tokens (colores, tipografía, espaciados, sombras) para coherencia visual.

Historias de Usuario:
- Como usuario, quiero una interfaz profesional y coherente en todas las pantallas. 

Historias Técnicas:
- Normalizar paleta y radios de borde en <mcfile name="legaltheme.ts" path="src/constants/legaltheme.ts"></mcfile>. 
- Definir guía de uso del tema en screens y componentes. 

Criterios de aceptación:
- LegalTheme con colores primarios/secundarios, superficies, textos y borders. 
- Documentación de uso en componentes y screens. 

Tareas:
- Revisar y completar tokens (colors, borderRadius, shadows). 
- Reemplazar valores hardcodeados por referencias al tema. 

Riesgos y mitigación:
- Divergencia de estilos: linting y PRs que validen tokens del tema. 

Estimación: 5–8 puntos.

---
## Épica 4: Consistencia de Scroll y Navegación
Objetivo: Garantizar scroll multiplataforma y rutas claras entre pantallas.

Historias de Usuario:
- Como usuario, quiero que el contenido se desplace correctamente en web y móvil. 
- Como usuario, quiero navegar de forma intuitiva entre pantallas. 

Historias Técnicas:
- Usar <mcfile name="ScrollContainer.tsx" path="src/components/ScrollContainer.tsx"></mcfile> en todas las pantallas. 
- Configurar rutas en <mcfile name="index.tsx" path="src/navigation/index.tsx"></mcfile>. 
- Asegurar carga de fuentes en <mcfile name="index.tsx" path="app/index.tsx"></mcfile> para consistencia de iconografía. 

Criterios de aceptación:
- Todas las pantallas usan `ScrollContainer`. 
- Rutas creadas y navegables desde Home. 

Tareas:
- Revisión de Screens para migración a `ScrollContainer`. 
- Comprobación de rutas y navegación. 

Riesgos y mitigación:
- Errores de JSX por cierres de tags: revisión de compilación y pruebas en navegador. 

Estimación: 5–7 puntos.

---
## Backlog (priorizado)
1) Plantilla de Screen y migración a `ScrollContainer` (Épica 1 y 4). 
2) Componentes base (Card, Indicador, Configuración) (Épica 2). 
3) Consolidación de LegalTheme y refactor de estilos (Épica 3). 
4) Navegación y rutas completas (Épica 4). 

---
## Day List por Sprint
Sprint 1 (Días 1–5): 
- Día 1: Plantilla de Screen y creación de Login, Register. 
- Día 2: Integración de `ScrollContainer` y estilos base con LegalTheme en Login/Register. 
- Día 3: UserScreen con CTA y componentes base; navegación inicial. 
- Día 4: ProfileScreen y pruebas manuales de navegación. 
- Día 5: Revisión de accesibilidad y coherencia visual; fixes.

Sprint 2 (Días 6–10): 
- Día 6: Biblioteca de componentes (DocumentoLegalCard, Indicador). 
- Día 7: ConfiguracionConsulta y consumo en UserScreen. 
- Día 8: Consolidación de LegalTheme en todos los componentes; eliminación de estilos hardcodeados. 
- Día 9: Validación en web y móvil (scroll, rutas, fuentes). 
- Día 10: Cierre de historias, retro y documentación.

---
## Definition of Ready (DoR)
- Historias con objetivo claro, criterios de aceptación y dependencias identificadas. 
- Diseño y tokens definidos en LegalTheme cuando corresponda. 

## Definition of Done (DoD)
- Compila sin errores; UI verificada en web/móvil. 
- Usa `ScrollContainer` y `LegalTheme`; navegación habilitada. 
- Documentación mínima y ejemplos de uso.

## Métricas sugeridas
- % de Screens que usan `ScrollContainer` y `LegalTheme`. 
- Tiempo de navegación entre pantallas y consistencia visual. 
- Incidencias de accesibilidad (contraste, tamaños).