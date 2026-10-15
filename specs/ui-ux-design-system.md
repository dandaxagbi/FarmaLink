# UI/UX Design System Specification: Receta Digital y Portal Farmacéutico

**Created by**: @ui-ux-designer Agent  
**Context**: Replicación fiel y elevación del diseño clínico de [receta_digital.png](file:///Users/danielaguilarbishop/dev/Farmacia/receta_digital.png)  
**Standard**: WCAG 2.1 AA Compliance, Usability Heuristics & Research-backed UX

---

## 1. Principios de Usabilidad Aplicados

1. **Ley de Jakob (Reconocimiento sobre recuerdo)**:
   - Los profesionales de la salud interactúan con sistemas de historias clínicas y prescripciones estructuradas. Mantenemos el flujo mental clínico: primero el diagnóstico, luego el despacho farmacéutico ("Para la farmacia"), seguido de las instrucciones al paciente ("Para el paciente") y finalmente recomendaciones globales.
2. **Ley de Fitts (Ergonomía de clics y toques)**:
   - Botones de acción clave (`+ Crear medicamento`, `Limpiar formulario`, `Despachar receta`, `Descargar PDF`) tienen un área mínima interactiva de 44x44px.
   - Los botones de borrado rápido `(x)` dentro de los inputs permiten vaciar campos de texto con un solo clic sin tener que seleccionar y borrar caracteres.
3. **Escaneo en Patrón F y Jerarquía Visual**:
   - Cabecera clara con pestañas de tratamiento subrayadas en azul clínico (`#1e40af`).
   - Títulos de sección en azul corporativo médico (`#1e3a8a`) con líneas de separación sutiles.
4. **Retroalimentación en Tiempo Real (Estado y Fechas)**:
   - Cuando la doctora selecciona la duración y hace clic en `día(s)`, `semana(s)` o `mes(es)`, la fecha de fin se calcula de forma reactiva instantánea.

---

## 2. Paleta de Colores y Tokens de Diseño

```css
:root {
  /* Marca e Identidad Clínica */
  --color-brand-primary: #1d4ed8;       /* Azul médico profesional */
  --color-brand-primary-hover: #1e40af;
  --color-brand-light: #eff6ff;
  --color-brand-border: #bfdbfe;

  /* Superficies y Fondos */
  --color-bg-app: #f8fafc;              /* Slate 50 sutil y descansado */
  --color-surface-card: #ffffff;
  --color-surface-card-subtle: #f9fafb;

  /* Bordes e Inputs */
  --color-border-input: #cbd5e1;        /* Borde nítido */
  --color-border-input-focus: #2563eb;
  --color-ring-focus: rgba(37, 99, 235, 0.15);

  /* Tipografía */
  --color-text-main: #0f172a;           /* Alto contraste legible */
  --color-text-secondary: #475569;
  --color-text-muted: #64748b;
  --color-text-placeholder: #94a3b8;

  /* Estados de Dispensación */
  --color-status-emitida: #3b82f6;      /* Azul */
  --color-status-farmacia: #8b5cf6;     /* Violeta */
  --color-status-preparando: #f59e0b;   /* Ámbar */
  --color-status-lista: #10b981;        /* Verde esmeralda */
  --color-status-entregada: #059669;    /* Verde oscuro */
  --color-status-urgente: #ef4444;      /* Rojo */
}
```

---

## 3. Tipografía

- **Familia Primaria**: `'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`.
  - Excelente legibilidad para terminología farmacológica compleja, dosificaciones numéricas y fracciones (`0.5`, `1/2`).
- **Números y Códigos**: `'JetBrains Mono', monospace` para códigos de receta (`RX-84920`) y códigos de barra/lote.

---

## 4. Anatomía de Componentes de la Receta Digital

### 4.1. Tabs de Tratamiento
- Pestaña `Tratamiento farmacológico`: borde inferior azul de 3px (`#1d4ed8`), texto en semibold.
- Pestaña `Tratamiento no farmacológico`: texto en gris neutro (`#64748b`) con hover suave.

### 4.2. Campos Flotantes / Bordes Redondeados
- Inputs con altura de 42px, borde `1px solid #cbd5e1`, esquinas redondeadas `rounded-md` (6px).
- Icono de borrado `(x)` en el extremo derecho cuando el input contiene texto.
- Selectores con chevron hacia abajo estilizado.

### 4.3. Selector de Duración con Pills Segmentadas
- Grupo de botones de duración:
  ```
  [ día(s) ] [ semana(s) ] [ mes(es) ]
  ```
  - Estado activo: borde y texto azul clínico, fondo blanco o azul muy claro con sombra suave.
  - Estado inactivo: borde gris, fondo neutro.

### 4.4. Botón "(+) Crear medicamento"
- Texto azul interactivo con icono de círculo y signo más:
  `[+] Crear medicamento`
- Abre un modal accesible para dar de alta un fármaco si no existe en la base de datos de la farmacia.

---

## 5. Accesibilidad (WCAG 2.1 AA)

- Ratio de contraste texto/fondo superior a 4.5:1 en todos los elementos interactivos.
- Foco visible accesible con ring outline de 2px para navegación por teclado.
- Etiquetas `aria-label` descriptivas en botones de icono `(x)` y selectores.
