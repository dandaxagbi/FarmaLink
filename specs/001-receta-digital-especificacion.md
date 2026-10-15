# Feature Specification: Sistema de Receta Digital e Interconexión Farmacéutica

**Feature Branch**: `001-receta-digital-farmacia`  
**Created**: 2026-10-14  
**Status**: Ready for Implementation  
**Standard**: GitHub Spec Kit (Spec-Driven Development)

---

## 1. Executive Summary

El sistema de **Receta Digital e Interconexión Farmacéutica** permite a una doctora confeccionar prescripciones médicas digitales con una interfaz estructurada y precisa (replicando el diseño clínico de [receta_digital.png](file:///Users/danielaguilarbishop/dev/Farmacia/receta_digital.png)), generar automáticamente un documento PDF oficial con código único de receta (ej. `RX-84920`) y código QR, enviar dicho PDF directamente por correo electrónico a la farmacia seleccionada, notificar al paciente vía WhatsApp con su código identificador de retiro, y permitir a la farmacia recibir la receta, gestionar su inventario en tiempo real y dispensar los medicamentos descontando stock automáticamente al validar el código presentado por el paciente.

---

## 2. User Scenarios & Prioritized User Stories

### User Story 1 - Confección de Receta Digital (Priority: P1)
**Como** doctora médica,  
**Quiero** completar una receta digital con secciones clínicas separadas ("Diagnóstico", "Para la farmacia", "Para el paciente", "Observaciones generales"),  
**Para** garantizar una prescripción clara, sin errores de caligrafía y con posología exacta.

**Criterios de Aceptación (Gherkin):**
- **Escenario 1.1**: Selector de Tratamiento Farmacológico y No Farmacológico.
  - **Given** la doctora se encuentra en el portal de Receta Digital,
  - **When** cambia entre las pestañas "Tratamiento farmacológico" y "Tratamiento no farmacológico",
  - **Then** el formulario se adapta al tipo de prescripción correspondiente.
- **Escenario 1.2**: Llenado de sección "Para la farmacia".
  - **Given** la doctora selecciona un medicamento y presentación,
  - **When** ingresa la cantidad total requerida y observaciones para la farmacia,
  - **Then** el sistema valida que la cantidad sea numérica y permite agregar más de un medicamento si la receta es múltiple.
- **Escenario 1.3**: Llenado de sección "Para el paciente" y cálculo de fechas.
  - **Given** la doctora especifica dosis, unidad de medida, vía, frecuencia y duración con selector `[día(s)] [semana(s)] [mes(es)]`,
  - **When** se define la fecha de inicio,
  - **Then** el sistema calcula automáticamente la fecha de fin del tratamiento.
- **Escenario 1.4**: Búsqueda e Integración de Diagnósticos Oficiales CIE-11 (OMS).
  - **Given** la doctora desea asociar un diagnóstico clínico estandarizado,
  - **When** interactúa con el selector CIE-11 o escribe el nombre de la patología o código (ej. "hipertensión", "asma", "BA00", "CA40"),
  - **Then** el sistema busca en la base taxonómica oficial de la CIE-11 (MMS en español con normalización diacrítica), permite filtrar por capítulos clínicos y refleja el código oficial en el PDF y en el despacho a farmacia.

---

### User Story 2 - Generación de PDF Oficial con Código Único (Priority: P1)
**Como** sistema médico,  
**Quiero** compilar la receta en un PDF estructurado con identificador único alfanumérico (ej. `RX-78491`), código de barras/QR de verificación, datos del paciente y firma digital,  
**Para** que sirva como documento legal y verificable de prescripción médica.

**Criterios de Aceptación:**
- **Given** una receta con uno o más medicamentos completados,
- **When** la doctora pulsa "Generar y Emitir Receta",
- **Then** se asigna un código único irrepetible `RX-XXXXX`,
- **And** se genera el documento PDF formal con membrete clínico, tabla de medicamentos, posología detallada y QR.

---

### User Story 3 - Envío Directo por Correo a la Farmacia (Priority: P1)
**Como** doctora,  
**Quiero** enviar el PDF estructurado directamente al correo de la farmacia elegida,  
**Para** que el paciente no manipule la receta física y la farmacia comience la preparación inmediatamente.

**Criterios de Aceptación:**
- **Given** la receta emitida y la farmacia de destino seleccionada (con su email configurado),
- **When** se confirma el envío,
- **Then** el sistema despacha el correo electrónico con el PDF adjunto y cuerpo formal del pedido,
- **And** la receta pasa al estado `EN_FARMACIA` en la bandeja del portal farmacéutico.

---

### User Story 4 - Notificación por WhatsApp al Paciente con Código de Retiro (Priority: P1)
**Como** paciente,  
**Quiero** recibir un mensaje de WhatsApp indicándome que mi receta fue emitida, a qué farmacia fue enviada y cuál es mi código identificador de retiro,  
**Para** acudir directamente al mostrador de la farmacia, mencionar mi código y retirar mis medicamentos sin demoras.

**Criterios de Aceptación:**
- **Given** la receta enviada a farmacia,
- **When** se dispara la notificación al paciente,
- **Then** se construye el mensaje de WhatsApp con el formato:
  > *"Hola [Nombre Paciente], su doctora ha emitido su receta médica #RX-XXXXX. Sus medicamentos han sido remitidos a [Nombre Farmacia] ([Dirección Farmacia]). Presente su código #RX-XXXXX en el mostrador para su retiro."*
- **And** se provee enlace directo `wa.me` y simulador interactivo de mensajería.

---

### User Story 5 - Portal de Farmacia, Dispensación y Control de Inventario (Priority: P2)
**Como** químico farmacéutico o encargado de farmacia,  
**Quiero** consultar las recetas entrantes, buscarlas por código RX y dispensarlas descontando automáticamente el stock del inventario,  
**Para** mantener el control de existencias actualizado y evitar discrepancias de inventario.

**Criterios de Aceptación:**
- **Given** una receta en estado `EN_FARMACIA` o `PREPARANDO`,
- **When** el paciente se presenta e indica su código `RX-XXXXX`,
- **Then** el farmacéutico valida los medicamentos prescritos contra el stock disponible,
- **When** pulsa "Despachar / Entregar Medicamentos",
- **Then** se descuentan las unidades exactas de cada medicamento del inventario de la farmacia,
- **And** la receta cambia su estado a `ENTREGADA`.

---

## 3. Data Schema Specifications

```typescript
export interface Medicamento {
  id: string;
  codigo: string;
  nombreComercial: string;
  principioActivo: string;
  presentacion: string;
  concentracion: string;
  viaAdministracionDefault: string;
  stockActual: number;
  stockMinimo: number;
  precioUnitario: number;
  categoria: string;
}

export interface ItemReceta {
  medicamentoId: string;
  nombreMedicamento: string;
  presentacion: string;
  cantidadTotal: number;
  observacionesFarmacia?: string;
  // Para el paciente
  dosis: string;
  unidadMedida: string;
  viaAdministracion: string;
  frecuencia: string;
  duracionNumero: number;
  duracionUnidad: 'dias' | 'semanas' | 'meses';
  fechaInicio: string;
  fechaFin: string;
  indicaciones: string;
}

export interface Farmacia {
  id: string;
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
  horario: string;
}

export interface Paciente {
  id: string;
  nombreCompleto: string;
  rutOIdentificacion: string;
  telefonoWhatsapp: string;
  email: string;
  edad: number;
}

export interface RecetaDigital {
  id: string;
  codigoRX: string; // ej. RX-89241
  fechaEmision: string;
  tipoTratamiento: 'farmacologico' | 'no_farmacologico';
  diagnostico: string;
  observacionesGenerales?: string;
  tratamientoNoFarmacologicoDetalle?: string;
  items: ItemReceta[];
  doctor: {
    nombre: string;
    especialidad: string;
    registroMedico: string;
    clinica: string;
    email: string;
  };
  paciente: Paciente;
  farmaciaDestino: Farmacia;
  estado: 'EMITIDA' | 'EN_FARMACIA' | 'PREPARANDO' | 'LISTA' | 'ENTREGADA';
  historialEstados: {
    estado: string;
    fecha: string;
    nota?: string;
  }[];
  notificaciones: {
    emailEnviadoAFarmacia: boolean;
    emailFecha?: string;
    whatsappEnviadoAPaciente: boolean;
    whatsappFecha?: string;
  };
}
```
