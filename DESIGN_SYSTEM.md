# ServerlessPipeline Design System

> Fuente de verdad visual y de interacción para la landing page y el simulador de validación de datos del proyecto ServerlessPipeline.
>
> **Estado del documento:** 1.0.0 · **Fecha:** 2026-08-07 · **Tecnología de referencia:** HTML semántico, CSS nativo y JavaScript Vanilla.

## 1. Design System Overview

### Propósito

Este documento define el lenguaje visual, los patrones de interacción, la accesibilidad y las reglas de implementación de la interfaz pública de ServerlessPipeline: una demostración académica de un pipeline serverless que ingesta CSV, valida transacciones, muestra anomalías y simula alertas.

### Principios

1. **Claridad operativa:** el usuario debe entender el flujo Ingesta → Lambda → DynamoDB → SNS y el resultado de cada registro.
2. **Consistencia:** una misma intención debe usar el mismo token, patrón y estado en todas las secciones.
3. **Datos legibles:** tablas, contadores, JSON y mensajes de validación priorizan escaneabilidad.
4. **Accesibilidad por defecto:** HTML semántico, teclado, foco visible, contraste WCAG 2.2 AA y mensajes comprensibles.
5. **Progresión responsive:** el contenido debe seguir siendo útil en móvil; no se debe depender solo del hover ni del ancho de escritorio.
6. **Simplicidad técnica:** reutilizar CSS nativo y componentes del sitio antes de agregar una dependencia o reestructurar la arquitectura.

### Alcance

**Implementado:** landing de una sola página con header fijo, hero, tarjetas de problema, diagrama de arquitectura, simulador CSV, tabs de resultados y footer.

**Parcialmente implementado:** estados de foco, navegación móvil, semántica/ARIA de tabs, feedback de errores y adaptación de tabla. Existen comportamientos visuales, pero deben endurecerse para cumplir AA.

**Recomendado:** biblioteca de componentes completa (modal, drawer, dropdown, toast, date picker, file upload, data table, etc.) para futuras pantallas. Estos elementos no existen hoy en el proyecto.

### Filosofía visual

Interfaz tipo SaaS/cloud: fondo claro Slate, superficies blancas, azul Royal como acción principal, Sky Blue como acento y gradientes discretos. El diseño combina tarjetas redondeadas, bordes suaves, sombras contenidas y tipografía Inter. La interfaz debe comunicar confiabilidad técnica sin parecer una consola compleja.

### Reglas generales

- Usar los tokens de este documento; no introducir colores hex arbitrarios en nuevos componentes.
- Mantener el ancho máximo de contenido en `1200px` y los gutters del contenedor.
- Las acciones primarias deben ser azules y las destructivas deben reservarse para rojo.
- Los estados de datos válidos y anómalos deben diferenciarse por color **y** texto/icono.
- No usar texto en mayúsculas para títulos largos; la mayúscula se reserva a etiquetas cortas.
- El contenido visible debe estar en español, con lenguaje directo y técnico solo cuando el contexto lo requiera.

## 2. Design Tokens

Los tokens actuales viven en `styles.css` dentro de `:root`. Los nombres canónicos para código nuevo son los siguientes.

### 2.1 Colors

| Token | Valor actual | Uso | Estado/contraste |
|---|---|---|---|
| `--color-primary` | `#0f172a` | Texto principal, headings, footer | Implementado. Alto contraste sobre fondos claros. |
| `--color-primary-light` | `#1e293b` | Variante oscura y separadores del footer | Implementado. |
| `--color-accent` | `#2563eb` | Acción primaria, enlaces, foco, tabs activos | Implementado. Verificar siempre texto blanco en superficies pequeñas. |
| `--color-accent-hover` | `#1d4ed8` | Hover del botón primario | Implementado como valor literal; debe convertirse en token. |
| `--color-secondary` | `#38bdf8` | Acento visual, gradientes e iconos secundarios | Implementado. No usar como texto pequeño sobre blanco sin validar contraste. |
| `--color-accent-glow` | `rgba(37,99,235,.15)` | Fondo de foco y badge | Implementado. Nunca debe ser el único indicador de estado. |
| `--color-background` | `#f8fafc` | Fondo general | Implementado. |
| `--color-surface` | `#ffffff` | Tarjetas, paneles, inputs y tablas | Implementado. |
| `--color-text-primary` | `#334155` | Texto de cuerpo | Implementado. |
| `--color-text-secondary` | `#64748b` | Texto muted, descripciones y captions | Implementado. Validar contraste en tamaños pequeños. |
| `--color-border` | `#e2e8f0` | Bordes y divisores | Implementado. |
| `--color-border-strong` | `#cbd5e1` | Hover de controles secundarios | Recomendado; hoy aparece como literal. |
| `--color-success` | `#10b981` | Registros válidos y éxito | Implementado como `--success`. Acompañar con texto/icono. |
| `--color-warning` | `#f59e0b` | Advertencias | Implementado como `--warning`; no hay componente visible actualmente. |
| `--color-error` | `#ef4444` | Anomalías y errores | Implementado como `--danger`; normalizar el nombre en una futura refactorización. |
| `--color-info` | `#38bdf8` | Información no crítica | Recomendado; usar `--color-secondary` mientras no exista. |
| `--color-white` | `#ffffff` | Texto sobre primario y superficies | Implementado como `--white`. |
| `--color-footer-muted` | `#94a3b8` | Texto secundario del footer | Implementado como literal; convertir en token. |

Los fondos translúcidos de filas válidas/anómalas y la alerta SNS son estados de apoyo. Nunca deben reemplazar las palabras “Válido”, “Anomalía” o el icono correspondiente.

### 2.2 Typography

- **Familia:** `Inter`, con fallback `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`. Se carga desde Google Fonts; si falla, el sistema debe seguir siendo legible.
- **Código/datos:** `"Courier New", Courier, monospace` para CSV y JSON.

| Token recomendado | Valor | Uso |
|---|---:|---|
| `--font-size-xs` | `0.75rem` | Labels de contadores. |
| `--font-size-sm` | `0.85rem` | Badge, tabla compacta y captions. |
| `--font-size-md` | `0.95rem` | Navegación y texto auxiliar. |
| `--font-size-base` | `1rem` | Botones y texto base. |
| `--font-size-lg` | `1.05rem` | Párrafos de sección. |
| `--font-size-xl` | `1.25rem` | Lead del hero y títulos de panel. |
| `--font-size-2xl` | `1.75rem` | Heading de sección en móvil. |
| `--font-size-3xl` | `2.25rem` | Heading de sección en desktop. |
| `--font-size-display` | `3.5rem` | H1 del hero; `2.5rem` hasta 768px. |

Pesos: 400 cuerpo, 500 navegación, 600 botones/labels, 700 headings, 800 logo/H1/contadores. Line-height: `1.6` cuerpo, `1.2` headings/H1 y `1.2` contadores. Letter spacing del H1: `-0.02em`.

### 2.3 Spacing

Escala base de 4px: `space-1=0.25rem`, `space-2=0.5rem`, `space-3=0.75rem`, `space-4=1rem`, `space-5=1.25rem`, `space-6=1.5rem`, `space-8=2rem`, `space-10=2.5rem`, `space-12=3rem`, `space-16=4rem`, `space-24=6rem`.

Usar `space-2/3` entre icono y texto, `space-4/6` dentro de controles y paneles, `space-8/12` entre grupos, y `space-24` como padding vertical de secciones desktop. En móvil, reducir secciones y gutters sin eliminar separación entre contenido y acción.

### 2.4 Border Radius

`--radius-sm: 6px` para tabs; `--radius-md: 8px` para botones, inputs y alertas; `--radius-lg: 10px` para contadores; `--radius-xl: 12px` para cards; `--radius-2xl: 16px` para paneles; `--radius-pill: 9999px` para badge. `28px` se usa en el icono del diagrama como círculo.

### 2.5 Shadows

- `shadow-sm`: borde/superficie sin elevación.
- `shadow-button`: `0 4px 14px rgba(37,99,235,.30)` para acción primaria.
- `shadow-button-hover`: `0 6px 20px rgba(37,99,235,.40)` en hover.
- `shadow-card-hover`: `0 10px 30px rgba(0,0,0,.03)` en tarjetas.

Usar sombra solo para indicar elevación o interacción; no agregar sombras a cada bloque.

### 2.6 Borders

Grosor estándar `1px`, sólido, `--color-border`. Usar `2px` únicamente para foco o indicación de estado de alta prioridad. Evitar bordes decorativos dobles. El footer usa `--color-primary-light` como divisor.

### 2.7 Breakpoints

- `0–767px`: móvil; navegación actual se oculta, diagrama se apila y H1 baja a `2.5rem`.
- `768–968px`: tablet/intermedio; mantener contenido con gutters y apilar el simulador cuando sea necesario.
- `969–1199px`: desktop compacto; simulador en dos columnas.
- `1200px+`: desktop; container máximo `1200px`.

Estos breakpoints reflejan los media queries existentes (`768px` y `968px`). No crear un breakpoint adicional sin necesidad demostrable.

## 3. Layout System

### Container y secciones

`.container` tiene `max-width: 1200px`, margen automático y padding horizontal de `2rem`. Cada sección usa padding vertical de `6rem` en desktop. La cabecera fija mide `70px`; el hero debe compensar ese espacio con su padding superior.

### Grid y alineación

- Problema y footer: CSS Grid fluido con `repeat(auto-fit, minmax(250–300px, 1fr))`.
- Simulador: dos columnas `1fr 1fr`, gap `3rem`; desde `968px` hacia abajo, una columna.
- Arquitectura: Flex horizontal con flechas entre pasos; en móvil, Flex vertical y flechas rotadas 90 grados.
- Alinear títulos de sección al centro; alinear datos y controles por sus bordes internos.

### Cards y páginas

Las cards usan superficie clara, borde, radius de 12px y padding amplio. Los paneles del simulador usan radius de 16px y padding de 2rem. Una futura pantalla debe conservar la jerarquía: header → contexto/hero → contenido principal → feedback → footer.

## 4. Components

### Button — Implementado

**Purpose:** ejecutar una acción inmediata o navegar a una sección.

**Anatomy:** icono Font Awesome opcional + label visible. `.btn-primary` para acción principal; `.btn-secondary` para acción alternativa.

**Variants:** primary, secondary; recomendado: tertiary y destructive solo cuando exista el caso de uso.

**States:** default, hover (color/sombra y leve elevación), disabled (nativo en el botón de simulación durante 600ms), loading (texto “Ejecutando Lambda...” e icono spinner). Focus visible: parcial, debe añadirse con `:focus-visible`.

**Behavior:** el label debe describir la acción (“Iniciar simulación”, no “Enviar”). Mantener un área táctil mínima recomendada de 44×44px.

**Responsive behavior:** los grupos hacen wrap; en móvil la acción principal puede ocupar todo el ancho.

**Accessibility:** usar `<button>` para acciones y `<a>` para navegación; no depender solo del icono; conservar foco y anunciar loading con `aria-busy` o texto accesible.

**Usage:** `button.btn.btn-primary` para iniciar el pipeline; `a.btn.btn-secondary` para GitHub.

**Do:** un primary por grupo. **Don't:** usar un enlace con apariencia de botón para mutar datos.

### Icon Button — Recomendado

No existe como componente independiente. Para un control solo-icono se requiere `aria-label`, foco visible y 44px mínimo. No usarlo si el icono no es universalmente reconocible.

### Link — Implementado parcialmente

Los enlaces de navegación son textuales y los CTAs usan la clase de botón. Definir estados hover, focus y visited; no eliminar el subrayado de enlaces de contenido sin otra señal.

### Input, Textarea, Label y Form — Parcialmente implementados

Existe un `<textarea id="csv-input">` con placeholder, monospace, borde, radius 8px y foco azul. No existe un `<label>` asociado ni un `<form>` real. La solución recomendada es añadir label visible, help text, `aria-describedby`, mensaje de error junto al campo y submit semántico.

**Validation:** mostrar qué está mal, cómo corregirlo y mantener el valor ingresado. No usar solo `alert()`. El CSV requiere headers `id_transaccion,cliente,monto,fecha`; cada registro exige ID, cliente, monto numérico no negativo y fecha `YYYY-MM-DD` válida.

### Select, Checkbox, Radio, Switch y Search — Recomendados

No existen. Usar controles nativos antes que controles custom; asociar labels, permitir teclado y no representar estados solo con color.

### Badge — Implementado

`.hero-badge` comunica contexto académico. Usa fondo azul translúcido, texto azul, borde sutil y pill. Debe ser informativo, no una acción.

### Tag — Recomendado

No existe. Reservar para filtros o atributos removibles; no confundirlo con un mensaje de error.

### Avatar — Recomendado

No existe. Usar imagen con alt o iniciales con nombre accesible.

### Card — Implementado

`.problem-card` y `.status-counter` son cards de información. La card de problema tiene icono, título y descripción; la de estado tiene número y label. El hover de la card no debe ser la única señal de interactividad porque hoy no es clicable.

### Modal, Dialog, Drawer — Recomendados

No existen. Implementar con `<dialog>` cuando se requiera confirmación o contenido bloqueante; gestionar foco, Escape, backdrop, lectura por screen reader y restauración del foco.

### Dropdown, Tooltip y Popover — Recomendados

No existen. Un tooltip no debe contener información esencial; los menus deben ser navegables con flechas, Escape y Enter.

### Tabs — Implementado parcialmente

`#tab-table` y `#tab-json` alternan tabla y JSON mediante JavaScript y clase `.active`. Faltan `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-controls` y navegación con flechas/Home/End.

**Responsive:** permitir wrap u overflow horizontal controlado; mantener el panel legible.

### Accordion — Recomendado

No existe. Preferir `<details>/<summary>` cuando no se necesite animación compleja.

### Breadcrumb — Recomendado

No existe y no es necesario para la página de una sola vista. Usarlo cuando existan niveles de navegación.

### Navbar — Implementado parcialmente

Header fijo de 70px con logo, enlaces de ancla y documentación. En móvil `.nav-links` se oculta sin menú alternativo; esto debe corregirse con un botón de navegación accesible o una navegación compacta.

### Sidebar — Recomendado

No existe. Solo introducirlo en una experiencia multi-página o dashboard.

### Pagination — Recomendado

No existe. El simulador muestra el dataset completo; si aumenta el volumen, paginar con estado visible y controles accesibles.

### Table / Data Table — Implementado parcialmente

La tabla `#simulation-table` muestra fila, ID, cliente, monto, fecha y estado/detalle. Tiene header, filas verdes para éxito y rojas para error, con overflow horizontal dentro de `.table-wrapper`.

No existen sorting, filtering, selección, paginación ni estados de carga de tabla. Para futuras extensiones usar `<caption>`, scope en headers, encabezado sticky solo si no perjudica móvil, y mantener el motivo de anomalía textual.

### Alert, Toast y Notification — Parcialmente implementados

`.sns-alert` es una alerta inline que aparece cuando hay anomalías. Tiene icono, título y descripción, pero usa `display:none`, animación pulse y no tiene rol ARIA. Debe usar `role="alert"` solo para novedades urgentes; preferir `role="status"` para resultados normales. Toast y notification persistente no existen.

### Progress, Spinner, Skeleton — Parcialmente implementados

El simulador cambia el texto del botón y usa `fa-spinner` durante 600ms. No hay barra de progreso ni skeleton. No prometer progreso porcentual si no se puede medir.

### Empty State, Error State, Loading State — Implementados parcialmente

La tabla tiene texto inicial vacío y el JSON un comentario placeholder. El loading del botón está implementado. El error de CSV vacío usa `alert()` y el backend devuelve 400/500. Recomendación: estados inline consistentes dentro del panel, con acción de recuperación y mensaje no técnico.

### Date Picker, Calendar y File Upload — Recomendados

No existen. Hoy el usuario pega CSV en textarea. Si se añade carga de archivo, aceptar `.csv`, indicar tamaño/límite, mostrar nombre y permitir reemplazarlo; no fingir una carga a S3 desde la demo local.

## 5. Componentes mínimos revisados

| Componente | Estado |
|---|---|
| Button, Link, Badge, Card, Textarea | Implementados |
| Navbar, Tabs, Table, Alert, Spinner, Empty/Loading state | Parcialmente implementados |
| Icon Button, Input, Select, Checkbox, Radio, Switch, Search, Form, Label, Tag, Avatar, Modal, Dialog, Drawer, Dropdown, Tooltip, Popover, Accordion, Breadcrumb, Sidebar, Pagination, Data Table, Toast, Notification, Progress, Skeleton, Error State, Date Picker, Calendar, File Upload | Recomendados; no existen actualmente |

## 6. Navigation

La jerarquía actual es logo → El Problema → Arquitectura → Simulador Demo → Documentación. Las anclas deben conservar nombres claros y el header fijo no debe tapar el inicio de una sección; usar `scroll-margin-top` en secciones.

En escritorio los enlaces viven en una fila. En móvil la navegación actual desaparece: antes de ampliar contenido se debe implementar un botón menú con nombre accesible, `aria-expanded`, `aria-controls`, foco administrado y cierre con Escape.

Tabs del simulador son navegación local, no rutas. Breadcrumbs, sidebar y pagination son futuros y no deben simularse en esta landing.

## 7. Forms

- Cada control necesita label visible o equivalente accesible.
- El textarea debe declarar que espera CSV y su formato.
- Los campos requeridos deben identificarse antes del error; no usar solo `*` sin explicación.
- Los errores deben aparecer cerca del campo o resultado afectado, con texto accionable.
- El botón se deshabilita durante la ejecución y debe recuperar su estado aunque haya error.
- En formularios complejos, agrupar con `fieldset/legend` y no borrar la entrada al validar.

**Correcto:** “Fecha inválida. Usa el formato AAAA-MM-DD, por ejemplo 2026-08-01.”

**Incorrecto:** “Error 400” como único mensaje visible.

## 8. Tables & Data Visualization

La tabla de ejecución es la única visualización implementada; no hay charts. La fuente de verdad de resultados es el JSON simulado, con `total_procesados`, `validos`, `anomalias`, registros válidos, anomalías y `alertas_disparadas`.

Si se agregan filtros o sorting, conservar la tabla visible, anunciar cambios de resultado y mantener el estado empty/loading/error. Si se agregan gráficos, reutilizar azul, verde, rojo y ámbar, añadir leyenda textual y no depender de color.

## 9. Feedback & States

- **Loading:** botón deshabilitado, spinner y “Ejecutando Lambda...”. Debe comunicar que la espera es temporal.
- **Empty:** explicar qué hacer (“Inicia la simulación para ver la validación por fila”).
- **Error:** describir causa y recuperación; diferenciar CSV vacío, registro inválido y fallo interno.
- **Success:** indicar “Válido y guardado” junto al icono de check.
- **Warning/error:** “Anomalía” junto al motivo y alerta SNS cuando corresponda.
- **Confirmation/destructive:** no existe actualmente; si se agrega, confirmar solo acciones irreversibles.

## 10. Responsive Design

En móvil se ocultan hoy los enlaces de navegación, el diagrama pasa a una columna, las flechas rotan y el H1/heading se reducen. El simulador ya pasa a una columna hasta 968px.

Mantener gutters de `1rem`–`2rem`, permitir wrap de botones, evitar anchos fijos que provoquen scroll de página y conservar overflow únicamente dentro de la tabla/JSON. Las tablas anchas deben desplazarse horizontalmente con encabezados comprensibles; nunca comprimir el texto hasta hacerlo ilegible. El panel de resultados debe seguir después del input y el CTA debe permanecer fácil de alcanzar.

## 11. Accessibility

Objetivo: WCAG 2.2 AA.

- Usar landmarks `header`, `nav`, `main`, `section` y `footer`; el HTML actual requiere agregar `<main>` y un `nav` explícito.
- Mantener contraste mínimo 4.5:1 para texto normal y 3:1 para texto grande/controles. Validar tokens cuando se cambien.
- Añadir `:focus-visible` con outline de al menos 2px; nunca ocultar foco.
- Todo debe funcionar con Tab, Enter/Space y, para tabs/menús, flechas y Escape.
- Los iconos decorativos deben llevar `aria-hidden="true"`; los icon-only deben tener `aria-label`.
- Las tabs necesitan roles y estados ARIA sincronizados con visibilidad real.
- Asociar label y textarea; usar `aria-describedby` para ayuda y error.
- Touch targets recomendados: 44×44px.
- Añadir `@media (prefers-reduced-motion: reduce)` para desactivar hover transform, pulse y scroll suave.
- No usar `alert()` como único feedback; presentar errores en el DOM y anunciar estados apropiadamente.
- Las imágenes futuras requieren alt contextual; imágenes decorativas deben tener alt vacío.

## 12. Icons

La librería implementada es Font Awesome 6.4.0 por CDN, con clases `fa-solid` y `fa-brands`. No mezclar otra familia visual sin una decisión registrada.

Usar tamaños aproximados de 16px en botones y navegación, 20–24px en tarjetas/alertas y 28px para marca/diagrama. Alinear icono y texto con gap de `0.5rem`. Los iconos decorativos no deben competir con el label. Los enlaces a GitHub combinan icono y texto en el hero; el icono aislado del footer debe recibir etiqueta accesible.

## 13. Images & Media

No hay imágenes rasterizadas ni video en la implementación; la arquitectura se representa con iconos y CSS. Para futuras imágenes, preferir ratios consistentes (16:9 para contenido, 1:1 para avatar), `object-fit: cover`, radius según superficie y placeholder mientras carga. El alt debe describir el propósito, no repetir el nombre del archivo.

## 14. Motion & Animation

La transición global es `all 0.3s cubic-bezier(0.4,0,0.2,1)`. El botón eleva 2px en hover, las cards 5px, el alert SNS pulsa durante 2s y el contador anima durante 400ms. Mantener animaciones cortas, no esenciales y respetuosas de `prefers-reduced-motion`.

No animar layout crítico ni usar pulse para información que deba permanecer estable. El loading debe comunicar progreso real o actividad, nunca una duración engañosa.

## 15. Content & UX Writing

Usar verbos de acción: “Probar simulación”, “Cargar CSV de prueba”, “Iniciar simulación”. Los títulos describen el contenido (“Resultados del Pipeline”). Los errores indican causa y corrección. Las notificaciones evitan dramatización innecesaria; “Se detectaron 2 anomalías” es preferible a “¡Falla crítica!” si el sistema sigue funcionando.

Conservar la terminología de negocio: transacción, registro, anomalía, validación, Lambda, SNS. Diferenciar siempre simulación frontend de persistencia real en AWS.

## 16. Dark Mode

**No implementado.** El proyecto solo define la paleta clara en `:root`; no existe selector, media query `prefers-color-scheme` ni tokens alternativos. No presentar dark mode como disponible ni añadir estilos aislados. Si se implementa, crear una familia completa de background, surface, text, muted, border y estados, y validar contraste antes de activarla.

## 17. Design Patterns

- **Demo/pipeline:** input CSV → acción de ejecución → contadores → alerta → tabla/JSON.
- **Validación:** procesar cada fila, separar válidos/anomalías, mostrar motivo y resumen.
- **Error recovery:** permitir editar/reemplazar CSV y ejecutar de nuevo sin recargar.
- **Arquitectura explicativa:** cuatro pasos visuales S3 → Lambda → DynamoDB → SNS.
- **CRUD, login, registration, dashboard, search, filtering, wizards y multi-step forms:** no existen; son patrones recomendados para futuras pantallas, no partes actuales del producto.

## 18. Do & Don't

### Do

- Reutilizar `.btn`, `.container`, paneles y tokens.
- Mantener estados válidos/anómalos con color, texto e icono.
- Hacer visible el formato esperado del CSV.
- Probar teclado y viewport móvil antes de aprobar una pantalla.
- Mostrar cuándo una respuesta es simulada y cuándo proviene de AWS.

### Don't

- Crear otro azul para una acción equivalente.
- Ocultar navegación móvil sin alternativa.
- Usar inline styles para valores que deberían ser tokens.
- Presentar componentes recomendados como si estuvieran implementados.
- Depender de hover, color o `alert()` como único canal de información.

## 19. Naming Conventions

- **Archivos:** nombres descriptivos en minúsculas; componentes futuros en kebab-case para archivos web (`data-table.js`, `modal.css`).
- **Clases CSS:** kebab-case semántico (`problem-card`, `status-counter`); variantes como modificadores (`btn-primary`, `row-error`).
- **IDs:** únicos, kebab-case y reservados para comportamiento/anclas (`csv-input`, `simulation-table`).
- **Tokens:** `--color-*`, `--font-*`, `--space-*`, `--radius-*`, `--shadow-*`, `--motion-*`.
- **JavaScript:** camelCase para variables y funciones (`runPipeline`, `countAnomalies`).
- **Datos:** conservar las claves del contrato (`id_transaccion`, `total_procesados`, `anomalias_detectadas`).
- **Iconos:** prefijo de librería y estilo explícito (`fa-solid fa-circle-play`).

## 20. Implementation Guidelines

Leer primero `DESIGN_SYSTEM.md`, `styles.css`, `index.html` y `script.js`. Componer con HTML semántico y CSS existente; extraer tokens antes de añadir valores nuevos. Evitar estilos inline, duplicación de reglas y dependencias que no estén justificadas.

Los cambios responsive deben probar 375px, 768px, 968px y 1200px. Los cambios interactivos deben probar mouse, teclado, lector de pantalla cuando sea posible, estado loading, error, empty y éxito. No cambiar la arquitectura del proyecto ni afirmar integración AWS cuando solo se modifica la simulación local.

## 21. AI Development Rules

Antes de modificar o crear UI, una IA debe:

1. Leer este archivo y localizar el patrón más cercano.
2. Reutilizar componentes y tokens existentes.
3. No introducir colores, radios, sombras o tipografías arbitrarias.
4. No duplicar componentes; evaluar `Reuse > Extend > Variant > New Component`.
5. Mantener el layout responsive y la semántica HTML.
6. Implementar estados default, hover, focus, disabled, loading, error, success y empty cuando correspondan.
7. Mantener WCAG 2.2 AA, teclado, focus visible y mensajes accesibles.
8. Verificar que el texto diferencie demo frontend de infraestructura AWS real.
9. Revisar inconsistencias entre HTML, CSS y JS antes de entregar.
10. Actualizar este documento cuando se introduzca un patrón o token reutilizable.

## 22. Component Decision Rules

Aplicar esta prioridad: **Reuse > Extend > Variant > New Component**.

- Reutilizar si la intención, anatomía y comportamiento ya existen.
- Extender si falta una capacidad pequeña sin romper API ni estilos.
- Crear variante si cambia presentación o estado, no la semántica.
- Crear componente nuevo solo si hay una responsabilidad reutilizable, anatomía propia y al menos dos usos previstos.
- Modificar el componente base cuando la regla sea común a todas sus instancias.
- Crear un patrón de página solo cuando varios componentes trabajen juntos con el mismo flujo.

Registrar la decisión en el change log y revisar impacto en responsive, accesibilidad y documentación.

## 23. Design System Change Log

| Date | Version | Change | Author |
|---|---|---|---|
| 2026-08-07 | 1.0.0 | Initial Design System basado en la implementación HTML/CSS/JS y el contexto del proyecto. | Codex |

## Appendix A — Source of truth y discrepancias

La fuente primaria para describir la UI es el código del repositorio: `index.html`, `styles.css`, `script.js`, `README.md` y `src/lambda_function.py`. `docs/Presentación del Proyecto Tecnológico.pdf` se revisó como contexto, pero describe un stack distinto (React/Tailwind, Node.js/Go, PostgreSQL/Redis, Docker/Kubernetes/Terraform y microservicios). Por tanto, esas tecnologías no se consideran implementadas en esta interfaz y no deben usarse para inventar componentes o tokens.

También se observa que existen estilos inline en varios elementos, el enlace de GitHub apunta actualmente a `https://github.com` en lugar del repositorio específico y el menú móvil se oculta sin alternativa. Son inconsistencias de implementación pendientes, documentadas aquí sin alterar la arquitectura.
