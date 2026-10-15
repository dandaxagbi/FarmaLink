# Plan de Implementación: Sistema de Receta Digital y Farmacia

**Feature Branch**: `001-receta-digital-farmacia`  
**Created**: 2026-10-14  
**Status**: In Progress  
**Standard**: GitHub Spec Kit  

---

## 1. Architectural Strategy

- **Stack Principal**: Next.js 14+ (App Router) + TypeScript + Tailwind CSS + Lucide Icons + jsPDF / HTML2Canvas.
- **Estructura del Proyecto**:
  - `src/app/page.tsx`: Punto de entrada con selector de roles y navegación principal (Portal Doctora vs Portal Farmacia vs Vista Paciente).
  - `src/components/receta/`: Replicación 1:1 de la interfaz gráfica de [receta_digital.png](file:///Users/danielaguilarbishop/dev/Farmacia/receta_digital.png) con tabs, diagnóstico, "Para la farmacia", "Para el paciente", cálculo automático de fechas y modal de nuevo medicamento.
  - `src/components/pdf/`: Motor de renderizado y descarga de PDF clínico con código RX, código QR, marcas de seguridad y tabla posológica.
  - `src/components/farmacia/`: Bandeja de entrada de recetas entrantes, buscador por código RX, comprobación de existencias y botón de dispensación con descuento de inventario.
  - `src/components/inventario/`: Tabla de productos, stock en tiempo real, alertas de stock mínimo y formulario de reposición.
  - `src/components/notificaciones/`: Simulador y despachador de emails a farmacia y mensajes de WhatsApp a pacientes con deep-link `wa.me`.
  - `src/lib/store.ts`: Gestión reactiva de estado (recetas, catálogo de medicamentos, stock de farmacia, farmacias y pacientes) con persistencia local en `localStorage` y datos semilla pre-cargados.

---

## 2. Fases de Ejecución

1. **Fase 1**: Especificación Spec Kit y Diseño UI/UX con `@ui-ux-designer` (tokens, contrastes, fuentes médicas, micro-interacciones).
2. **Fase 2**: Integración de diseño con Stitch MCP (creación del proyecto y generación de pantallas clínicas).
3. **Fase 3**: Implementación Frontend con `frontend-developer` y `nextjs-developer` (componentes visuales fieles a la imagen de referencia).
4. **Fase 4**: Implementación de Lógica de Negocio y Backend con `backend-architect` (cálculo de fechas, código RX, generación de PDF, API de despacho por correo y enlace WhatsApp).
5. **Fase 5**: Módulo de Farmacia y Descuento Automático de Inventario (cambio de estados a `ENTREGADA` y deducción de stock).
6. **Fase 6**: Despliegue local (`npm run dev`), verificación con browser subagent y comprobación de calidad con `code-reviewer`.
