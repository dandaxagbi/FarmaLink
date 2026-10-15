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
  id: string;
  medicamentoId: string;
  nombreMedicamento: string;
  presentacion: string;
  cantidadTotal: number | '';
  observacionesFarmacia: string;
  // Para el paciente
  dosis: string;
  unidadMedida: string;
  viaAdministracion: string;
  frecuencia: string;
  duracionNumero: number | '';
  duracionUnidad: 'dia(s)' | 'semana(s)' | 'mes(es)';
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
  responsable: string;
}

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

export interface Doctor {
  nombre: string;
  especialidad: string;
  registroMedico: string;
  clinica: string;
  email: string;
  telefono: string;
}

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

export type EstadoReceta = 'EMITIDA' | 'EN_FARMACIA' | 'PREPARANDO' | 'LISTA' | 'ENTREGADA';

export interface RecetaDigital {
  id: string;
  codigoRX: string; // Ej: RX-84920
  fechaEmision: string;
  tipoTratamiento: 'farmacologico' | 'no_farmacologico';
  diagnostico: string;
  observacionesGenerales: string;
  tratamientoNoFarmacologicoDetalle?: string;
  items: ItemReceta[];
  doctor: Doctor;
  centroMedico?: CentroMedico;
  paciente: Paciente;
  farmaciaDestino: Farmacia;
  estado: EstadoReceta;
  historialEstados: {
    estado: EstadoReceta;
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
