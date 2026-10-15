'use client';

import { useState, useEffect } from 'react';
import {
  Medicamento,
  Farmacia,
  RecetaDigital,
  Paciente,
  Doctor,
  EstadoReceta,
  ItemReceta
} from './types';
import {
  INITIAL_MEDICAMENTOS,
  INITIAL_FARMACIAS,
  INITIAL_DOCTOR,
  INITIAL_PACIENTE,
  INITIAL_PACIENTES,
  INITIAL_CENTRO_MEDICO,
  INITIAL_RECETAS
} from './mockData';
import { CentroMedico } from './types';

const STORAGE_KEYS = {
  MEDICAMENTOS: 'receta_farmacia_medicamentos',
  RECETAS: 'receta_farmacia_recetas',
  FARMACIAS: 'receta_farmacia_farmacias',
  PACIENTES: 'receta_farmacia_pacientes',
  PACIENTE_ACTIVO: 'receta_farmacia_paciente_activo',
  CENTRO_MEDICO: 'receta_farmacia_centro_medico',
  DOCTOR: 'receta_farmacia_doctor'
};

export function getInitialCentroMedico(): CentroMedico {
  if (typeof window === 'undefined') return INITIAL_CENTRO_MEDICO;
  const stored = localStorage.getItem(STORAGE_KEYS.CENTRO_MEDICO);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_CENTRO_MEDICO;
    }
  }
  localStorage.setItem(STORAGE_KEYS.CENTRO_MEDICO, JSON.stringify(INITIAL_CENTRO_MEDICO));
  return INITIAL_CENTRO_MEDICO;
}

export function getInitialPacientes(): Paciente[] {
  if (typeof window === 'undefined') return INITIAL_PACIENTES;
  const stored = localStorage.getItem(STORAGE_KEYS.PACIENTES);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_PACIENTES;
    }
  }
  localStorage.setItem(STORAGE_KEYS.PACIENTES, JSON.stringify(INITIAL_PACIENTES));
  return INITIAL_PACIENTES;
}

export function getInitialMedicamentos(): Medicamento[] {
  if (typeof window === 'undefined') return INITIAL_MEDICAMENTOS;
  const stored = localStorage.getItem(STORAGE_KEYS.MEDICAMENTOS);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_MEDICAMENTOS;
    }
  }
  localStorage.setItem(STORAGE_KEYS.MEDICAMENTOS, JSON.stringify(INITIAL_MEDICAMENTOS));
  return INITIAL_MEDICAMENTOS;
}

export function getInitialRecetas(): RecetaDigital[] {
  if (typeof window === 'undefined') return INITIAL_RECETAS;
  const stored = localStorage.getItem(STORAGE_KEYS.RECETAS);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_RECETAS;
    }
  }
  localStorage.setItem(STORAGE_KEYS.RECETAS, JSON.stringify(INITIAL_RECETAS));
  return INITIAL_RECETAS;
}

export function generateCodigoRX(): string {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `RX-${num}`;
}

export function calcularFechaFin(
  fechaInicioStr: string,
  duracionNumero: number | '',
  unidad: 'dia(s)' | 'semana(s)' | 'mes(es)'
): string {
  if (!fechaInicioStr || !duracionNumero || Number(duracionNumero) <= 0) {
    return '';
  }

  // Soporta formato DD/MM/YYYY o YYYY-MM-DD
  let day = 14, month = 9, year = 2026;
  if (fechaInicioStr.includes('/')) {
    const parts = fechaInicioStr.split('/');
    day = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10) - 1;
    year = parseInt(parts[2], 10);
  } else if (fechaInicioStr.includes('-')) {
    const parts = fechaInicioStr.split('-');
    year = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10) - 1;
    day = parseInt(parts[2], 10);
  }

  const date = new Date(year, month, day);
  const num = Number(duracionNumero);

  if (unidad === 'dia(s)') {
    date.setDate(date.getDate() + num);
  } else if (unidad === 'semana(s)') {
    date.setDate(date.getDate() + (num * 7));
  } else if (unidad === 'mes(es)') {
    date.setMonth(date.getMonth() + num);
  }

  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();

  return `${d}/${m}/${y}`;
}

export function useRecetaStore() {
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [recetas, setRecetas] = useState<RecetaDigital[]>([]);
  const [farmacias] = useState<Farmacia[]>(INITIAL_FARMACIAS);
  const [centroMedico, setCentroMedico] = useState<CentroMedico>(INITIAL_CENTRO_MEDICO);
  const [pacientes, setPacientes] = useState<Paciente[]>(INITIAL_PACIENTES);
  const [pacienteActivo, setPacienteActivo] = useState<Paciente>(INITIAL_PACIENTE);
  const [isLoaded, setIsLoaded] = useState(false);

  // Derivamos doctor del centro médico para compatibilidad absoluta
  const doctor = centroMedico.doctor;
  // Aliamos paciente a pacienteActivo para compatibilidad con código existente
  const paciente = pacienteActivo;

  useEffect(() => {
    setMedicamentos(getInitialMedicamentos());
    setRecetas(getInitialRecetas());
    setCentroMedico(getInitialCentroMedico());
    const initialPacientes = getInitialPacientes();
    setPacientes(initialPacientes);

    const storedPacActivo = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.PACIENTE_ACTIVO) : null;
    if (storedPacActivo) {
      try {
        setPacienteActivo(JSON.parse(storedPacActivo));
      } catch {
        setPacienteActivo(initialPacientes[0] || INITIAL_PACIENTE);
      }
    } else {
      setPacienteActivo(initialPacientes[0] || INITIAL_PACIENTE);
    }

    setIsLoaded(true);

    const handleStorageChange = () => {
      setMedicamentos(getInitialMedicamentos());
      setRecetas(getInitialRecetas());
      setCentroMedico(getInitialCentroMedico());
      setPacientes(getInitialPacientes());
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('receta_store_updated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('receta_store_updated', handleStorageChange);
    };
  }, []);

  const notifyUpdate = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('receta_store_updated'));
    }
  };

  const agregarMedicamentoNuevo = (nuevo: Omit<Medicamento, 'id' | 'codigo'>) => {
    const medId = `med-custom-${Date.now()}`;
    const codigo = `MED-CUST-${Math.floor(100 + Math.random() * 900)}`;
    const fullMed: Medicamento = {
      ...nuevo,
      id: medId,
      codigo
    };
    const updated = [fullMed, ...medicamentos];
    setMedicamentos(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.MEDICAMENTOS, JSON.stringify(updated));
      notifyUpdate();
    }
    return fullMed;
  };

  const emitirReceta = (recetaData: Omit<RecetaDigital, 'id' | 'codigoRX' | 'fechaEmision' | 'estado' | 'historialEstados' | 'notificaciones'>): RecetaDigital => {
    const now = new Date();
    const fechaEmision = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const codigoRX = generateCodigoRX();

    const nuevaReceta: RecetaDigital = {
      centroMedico: recetaData.centroMedico || centroMedico,
      ...recetaData,
      id: `rec-${Date.now()}`,
      codigoRX,
      fechaEmision,
      estado: 'EN_FARMACIA',
      historialEstados: [
        {
          estado: 'EMITIDA',
          fecha: fechaEmision,
          nota: `Receta confeccionada por ${recetaData.doctor.nombre}`
        },
        {
          estado: 'EN_FARMACIA',
          fecha: fechaEmision,
          nota: `Enviada a ${recetaData.farmaciaDestino.nombre} (${recetaData.farmaciaDestino.email})`
        }
      ],
      notificaciones: {
        emailEnviadoAFarmacia: true,
        emailFecha: fechaEmision,
        whatsappEnviadoAPaciente: true,
        whatsappFecha: fechaEmision
      }
    };

    const updated = [nuevaReceta, ...recetas];
    setRecetas(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.RECETAS, JSON.stringify(updated));
      notifyUpdate();
    }
    return nuevaReceta;
  };

  const actualizarEstadoReceta = (recetaId: string, nuevoEstado: EstadoReceta, nota?: string) => {
    const now = new Date();
    const fecha = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const updated = recetas.map(r => {
      if (r.id === recetaId) {
        return {
          ...r,
          estado: nuevoEstado,
          historialEstados: [
            ...r.historialEstados,
            { estado: nuevoEstado, fecha, nota: nota || `Estado actualizado a ${nuevoEstado}` }
          ]
        };
      }
      return r;
    });

    setRecetas(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.RECETAS, JSON.stringify(updated));
      notifyUpdate();
    }
  };

  // Despachar receta: cambia estado a ENTREGADA y descuenta del inventario de medicamentos
  const despacharReceta = (recetaId: string) => {
    const receta = recetas.find(r => r.id === recetaId);
    if (!receta) return false;

    // Descontar inventario
    const updatedMeds = [...medicamentos];
    receta.items.forEach(item => {
      const idx = updatedMeds.findIndex(m => m.id === item.medicamentoId || m.nombreComercial === item.nombreMedicamento);
      if (idx !== -1) {
        const cant = Number(item.cantidadTotal) || 1;
        updatedMeds[idx] = {
          ...updatedMeds[idx],
          stockActual: Math.max(0, updatedMeds[idx].stockActual - cant)
        };
      }
    });

    setMedicamentos(updatedMeds);
    actualizarEstadoReceta(recetaId, 'ENTREGADA', 'Medicamentos dispensados y entregados al paciente. Stock rebajado.');

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.MEDICAMENTOS, JSON.stringify(updatedMeds));
      notifyUpdate();
    }
    return true;
  };

  const ajustarStock = (medicamentoId: string, delta: number) => {
    const updated = medicamentos.map(m => {
      if (m.id === medicamentoId) {
        return {
          ...m,
          stockActual: Math.max(0, m.stockActual + delta)
        };
      }
      return m;
    });
    setMedicamentos(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.MEDICAMENTOS, JSON.stringify(updated));
      notifyUpdate();
    }
  };

  // Acciones de Centro Médico
  const actualizarCentroMedico = (datos: Partial<CentroMedico>) => {
    const updated: CentroMedico = {
      ...centroMedico,
      ...datos,
      doctor: {
        ...centroMedico.doctor,
        ...(datos.doctor || {})
      }
    };
    setCentroMedico(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CENTRO_MEDICO, JSON.stringify(updated));
      notifyUpdate();
    }
    return updated;
  };

  const subirLogoCentroMedico = (logoUrl: string) => {
    return actualizarCentroMedico({ logoUrl });
  };

  // Acciones de Pacientes
  const seleccionarPaciente = (p: Paciente) => {
    setPacienteActivo(p);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.PACIENTE_ACTIVO, JSON.stringify(p));
      notifyUpdate();
    }
  };

  const agregarPaciente = (nuevo: Omit<Paciente, 'id' | 'fechaRegistro'>): Paciente => {
    const id = `pac-${Date.now()}`;
    const now = new Date();
    const fechaRegistro = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const fullPaciente: Paciente = {
      ...nuevo,
      id,
      fechaRegistro
    };

    const updated = [fullPaciente, ...pacientes];
    setPacientes(updated);
    setPacienteActivo(fullPaciente);

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.PACIENTES, JSON.stringify(updated));
      localStorage.setItem(STORAGE_KEYS.PACIENTE_ACTIVO, JSON.stringify(fullPaciente));
      notifyUpdate();
    }
    return fullPaciente;
  };

  const actualizarPaciente = (id: string, datos: Partial<Paciente>) => {
    const updated = pacientes.map(p => {
      if (p.id === id) {
        const merged = { ...p, ...datos };
        if (pacienteActivo.id === id) {
          setPacienteActivo(merged);
          if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEYS.PACIENTE_ACTIVO, JSON.stringify(merged));
          }
        }
        return merged;
      }
      return p;
    });

    setPacientes(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.PACIENTES, JSON.stringify(updated));
      notifyUpdate();
    }
  };

  const eliminarPaciente = (id: string) => {
    const updated = pacientes.filter(p => p.id !== id);
    setPacientes(updated);
    if (pacienteActivo.id === id && updated.length > 0) {
      setPacienteActivo(updated[0]);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.PACIENTE_ACTIVO, JSON.stringify(updated[0]));
      }
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.PACIENTES, JSON.stringify(updated));
      notifyUpdate();
    }
  };

  return {
    isLoaded,
    medicamentos,
    recetas,
    farmacias,
    doctor,
    paciente,
    pacienteActivo,
    pacientes,
    centroMedico,
    emitirReceta,
    actualizarEstadoReceta,
    despacharReceta,
    ajustarStock,
    agregarMedicamentoNuevo,
    actualizarCentroMedico,
    subirLogoCentroMedico,
    seleccionarPaciente,
    agregarPaciente,
    actualizarPaciente,
    eliminarPaciente
  };
}
