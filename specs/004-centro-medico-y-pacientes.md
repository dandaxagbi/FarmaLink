# Especificación 004: Menú Lateral, Gestión de Centro Médico y Gestión de Pacientes

## 1. Contexto y Objetivos

El sistema de Receta Digital Interconectada de **Centro Andar** evoluciona hacia una solución clínica integral multi-módulo que permite:
1. **Menú Lateral de Navegación (Sidebar)**: Organización ergonómica según principios de UI/UX (Left-side bias, Jakob's Law) con acceso directo a:
   - Emisión de Receta Digital (CIE-11 + Stock).
   - Gestión y Configuración del Centro Médico (Logo, ubicación, datos del doctor, contactos).
   - Directorio y Registro de Pacientes (Ficha clínica, antecedentes, alergias, emisión directa).
   - Portal Farmacia & Stock de Medicamentos.
   - Portal Paciente / Notificaciones WhatsApp.
2. **Módulo de Centro Médico**:
   - Creación y edición del Centro Médico.
   - Carga dinámica del logotipo (archivo local / drag & drop / preview en tiempo real).
   - Datos del profesional de salud: Nombre, especialidad, matrícula médica, teléfono, email.
   - Ubicación física (Dirección, edificio, ciudad, país) y canales de contacto.
   - Persistencia local y propagación automática a toda la interfaz y al PDF.
3. **Módulo de Pacientes**:
   - Creación, guardado y edición de pacientes con datos demográficos y clínicos (Alergias, Antecedentes, CI/RUT, WhatsApp).
   - Selección rápida e intuitiva desde el formulario de prescripción.
   - Inclusión automática de todos los datos clínicos del paciente en el PDF oficial y despacho a farmacia.

---

## 2. Modelos de Datos

### 2.1 Centro Médico (`CentroMedico`)
```typescript
export interface CentroMedico {
  id: string;
  nombre: string;
  subtitulo?: string;
  logoUrl: string;
  direccion: string;
  ciudad: string;
  pais: string;
  telefono: string;
  whatsapp: string;
  email: string;
  sitioWeb?: string;
  horarioAtencion?: string;
  nitRut?: string;
  doctor: Doctor;
}
```

### 2.2 Paciente (`Paciente`)
```typescript
export interface Paciente {
  id: string;
  nombreCompleto: string;
  rutOIdentificacion: string;
  telefonoWhatsapp: string;
  email: string;
  edad: number;
  genero?: 'Femenino' | 'Masculino' | 'Otro';
  fechaNacimiento?: string;
  direccion?: string;
  ciudad?: string;
  alergias?: string;
  antecedentesMedicos?: string;
  grupoSanguineo?: string;
  contactoEmergencia?: string;
  fechaRegistro?: string;
}
```

---

## 3. Arquitectura de Componentes

1. `components/Sidebar.tsx`: Menú lateral izquierdo moderno, con colapsado responsivo, branding del centro médico activo, indicador de estado de la doctora y navegación fluida entre pestañas.
2. `components/CentroMedicoView.tsx`: Panel completo de administración del Centro Médico con subida de logotipo, vista previa, edición de dirección, contactos y credenciales de la Dra. Oriela Iriarte.
3. `components/PacientesView.tsx`: Directorio de pacientes con búsqueda en tiempo real, listado de fichas clínicas, tarjetas de antecedentes y botón para crear nuevo paciente o iniciar receta directa.
4. `components/CrearPacienteModal.tsx`: Modal accesible para registrar nuevos pacientes rápidamente.
5. `components/RecetaForm.tsx`: Barra superior de paciente activo con selector dinámico desplegable y botón de alta rápida.
6. `lib/pdfGenerator.ts`: Inclusión del logo del centro médico, datos completos del establecimiento, información exhaustiva del paciente (incluyendo alergias) y código RX de dispensación.
