# FarmaLink 🩺💊

> **Sistema de Receta Digital Interconectada con Farmacia**  
> *Prescripción clínica con CIE-11, gestión de centros médicos, directorio de pacientes y despacho asistido a farmacias en tiempo real.*

---

## 🌟 Características Principales

- **Menú Lateral Ergonómico (Sidebar)**:
  - Navegación ágil entre emisión de recetas, pacientes, configuración de centro médico y portal de farmacia.
- **Módulo de Centro Médico (Marca Blanca / Multi-Clínica)**:
  - Carga y personalización de logotipo oficial (*Centro Andar - Pie Diabético e Infectología*).
  - Configuración de dirección, WhatsApp institucional, correo y credenciales del profesional de salud prescriptor (*Dra. Oriela Iriarte - Infectología*).
- **Directorio y Gestión de Pacientes**:
  - Registro de pacientes con CI/RUT, edad, contacto WhatsApp y dirección.
  - Alertas visuales destacadas de **alergias farmacológicas** (Penicilina, Sulfas, etc.).
  - Antecedentes clínicos (Diabetes Mellitus Tipo 2, Pie Diabético Wagner II, etc.).
  - Selección rápida en un clic desde el formulario de prescripción.
- **Prescripción Asistida y Diagnósticos CIE-11**:
  - Motor predictivo oficial CIE-11 de la Organización Mundial de la Salud (OMS).
  - Posología estructurada, cálculo automático de fin de tratamiento y advertencias.
- **Generador de PDF Oficial y Código RX**:
  - Emisión de recetas en PDF con código QR de trazabilidad, código de retiro alfanumérico único (ej. `RX-78491`), sello médico y datos completos de la clínica y paciente.
- **Notificación Directa por WhatsApp**:
  - Mensaje pre-estructurado para el paciente con su código de retiro, farmacia asignada y dirección.
- **Portal de Farmacia & Control de Stock**:
  - Recepción de recetas en tiempo real, verificación y descuento automático de inventario al despachar.

---

## 🛠️ Tecnologías

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, React 19)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS & Lucide Icons
- **Documentos & Trazabilidad**: jsPDF & qrcode
- **Arquitectura de Especificaciones**: Spec Kit (`.specify/` & `specs/`)

---

## 🚀 Instalación y Ejecución Local

```bash
# Clonar repositorio
git clone https://github.com/dandaxagbi/FarmaLink.git
cd FarmaLink

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) en su navegador.

---

## 📄 Licencia

Desarrollado para fines clínicos e institucionales. FarmaLink © 2026.
