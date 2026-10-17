'use client';

import React, { useState, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
  FileText,
  Pencil,
  Trash2,
  CheckCircle2,
  HeartPulse,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { useRecetaStore } from '../lib/store';
import { Paciente } from '../lib/types';
import { CrearPacienteModal } from './CrearPacienteModal';

interface PacientesViewProps {
  onEmitirRecetaPaciente?: (paciente: Paciente) => void;
}

export function PacientesView({ onEmitirRecetaPaciente }: PacientesViewProps) {
  const {
    pacientes,
    pacienteActivo,
    seleccionarPaciente,
    agregarPaciente,
    actualizarPaciente,
    eliminarPaciente
  } = useRecetaStore();

  const [busqueda, setBusqueda] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pacienteEditar, setPacienteEditar] = useState<Paciente | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCrearNuevo = () => {
    setPacienteEditar(null);
    setIsModalOpen(true);
  };

  const handleEditar = (p: Paciente) => {
    setPacienteEditar(p);
    setIsModalOpen(true);
  };

  const handleEliminar = (p: Paciente) => {
    if (confirm(`¿Está seguro de eliminar al paciente ${p.nombreCompleto}?`)) {
      eliminarPaciente(p.id);
      showToast(`Paciente ${p.nombreCompleto} eliminado.`);
    }
  };

  const handleSaveModal = (datos: Omit<Paciente, 'id' | 'fechaRegistro'>) => {
    if (pacienteEditar) {
      actualizarPaciente(pacienteEditar.id, datos);
      showToast(`Ficha de ${datos.nombreCompleto} actualizada.`);
    } else {
      const nuevo = agregarPaciente(datos);
      showToast(`Paciente ${nuevo.nombreCompleto} registrado exitosamente.`);
    }
  };

  const handlePrescribir = (p: Paciente) => {
    seleccionarPaciente(p);
    if (onEmitirRecetaPaciente) {
      onEmitirRecetaPaciente(p);
    }
  };

  // Filtrado de pacientes
  const pacientesFiltrados = useMemo(() => {
    const q = busqueda.toLowerCase().trim();
    if (!q) return pacientes;
    return pacientes.filter(
      p =>
        p.nombreCompleto.toLowerCase().includes(q) ||
        p.rutOIdentificacion.toLowerCase().includes(q) ||
        (p.telefonoWhatsapp && p.telefonoWhatsapp.includes(q)) ||
        (p.alergias && p.alergias.toLowerCase().includes(q)) ||
        (p.antecedentesMedicos && p.antecedentesMedicos.toLowerCase().includes(q))
    );
  }, [pacientes, busqueda]);

  // Métricas rápidas
  const totalConAlergias = pacientes.filter(
    p =>
      p.alergias &&
      p.alergias.trim() !== '' &&
      !p.alergias.toLowerCase().includes('ningun') &&
      !p.alergias.toLowerCase().includes('no report')
  ).length;
  const totalConDiabetes = pacientes.filter(
    p => p.antecedentesMedicos && p.antecedentesMedicos.toLowerCase().includes('diabet')
  ).length;

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 overflow-x-hidden">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 p-4 bg-emerald-600 text-white rounded-xl shadow-lg flex items-center gap-3 animate-fade-in text-sm font-semibold">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-blue-700 font-semibold text-xs uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Directorio Clínico</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Gestión de Pacientes
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Fichas clínicas con historial de alergias, antecedentes patológicos y emisión directa de recetas interconectadas.
          </p>
        </div>

        <button
          onClick={handleCrearNuevo}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm shadow-sm transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Registrar Nuevo Paciente</span>
        </button>
      </div>

      {/* Métricas rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900">{pacientes.length}</div>
            <div className="text-xs text-slate-500">Pacientes Registrados</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900">{totalConAlergias}</div>
            <div className="text-xs text-slate-500">Con Alergias Medicamentosas</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900">{totalConDiabetes}</div>
            <div className="text-xs text-slate-500">Manejo Pie Diabético / Diabetes</div>
          </div>
        </div>
      </div>

      {/* Buscador */}
      <div className="mb-6">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" aria-hidden="true" />
          <input
            type="text"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre, CI/RUT, teléfono, condición o alergia…"
            className="w-full pl-11 pr-12 py-3 bg-white rounded-xl border border-slate-200 text-base sm:text-sm text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:border-transparent outline-none shadow-xs min-h-[46px]"
          />
          {busqueda && (
            <button
              onClick={() => setBusqueda('')}
              aria-label="Limpiar búsqueda"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-xs text-slate-400 hover:text-slate-600 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none rounded-lg"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Listado de Pacientes */}
      {pacientesFiltrados.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No se encontraron pacientes</h3>
          <p className="text-xs text-slate-500 mt-1">
            Intente con otro término de búsqueda o registre un nuevo paciente clínico.
          </p>
          <button
            onClick={handleCrearNuevo}
            className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-700 text-white text-xs font-semibold min-h-[44px]"
          >
            <UserPlus className="w-4 h-4" />
            Registrar Paciente
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pacientesFiltrados.map(p => {
            const esActivo = pacienteActivo.id === p.id;
            const tieneAlergias = Boolean(
              p.alergias &&
              p.alergias.trim() !== '' &&
              !p.alergias.toLowerCase().includes('ningun') &&
              !p.alergias.toLowerCase().includes('no report')
            );

            return (
              <div
                key={p.id}
                className={`bg-white rounded-2xl border transition-all p-4 sm:p-5 shadow-xs flex flex-col justify-between ${
                  esActivo
                    ? 'border-blue-600 ring-2 ring-blue-100'
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div>
                  {/* Top: Avatar, Nombre e Identificación */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                          p.genero === 'Masculino'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {p.nombreCompleto
                          .split(' ')
                          .map(n => n[0])
                          .slice(0, 2)
                          .join('')}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="text-sm font-bold text-slate-900 leading-tight truncate">
                            {p.nombreCompleto}
                          </h3>
                          {esActivo && (
                            <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                              En Receta
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5 truncate">
                          CI: <span className="font-semibold text-slate-700 font-mono tabular-nums" translate="no">{p.rutOIdentificacion}</span> • <span className="tabular-nums">{p.edad}</span> años
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleEditar(p)}
                        title="Editar Ficha"
                        aria-label="Editar Ficha"
                        className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 active:bg-slate-100 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEliminar(p)}
                        title="Eliminar"
                        aria-label="Eliminar paciente"
                        className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-rose-600 active:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Datos de Contacto */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 py-2.5 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 truncate">
                      <Phone className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span className="truncate">{p.telefonoWhatsapp || 'Sin teléfono'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{p.email || 'Sin correo'}</span>
                    </div>
                  </div>

                  {/* Alertas Médicas: Alergias y Antecedentes */}
                  <div className="mt-2 space-y-1.5">
                    {tieneAlergias ? (
                      <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-semibold flex items-center gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                        <span className="truncate">Alergia: {p.alergias}</span>
                      </div>
                    ) : (
                      <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Sin alergias conocidas</span>
                      </div>
                    )}

                    {p.antecedentesMedicos && (
                      <div className="text-[11px] text-slate-600 line-clamp-2 bg-slate-50 p-2 rounded-lg border border-slate-200/60">
                        <strong className="text-slate-700">Patología:</strong> {p.antecedentesMedicos}
                      </div>
                    )}
                  </div>
                </div>

                {/* Botón de Prescripción Directa */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    Grupo: {p.grupoSanguineo || 'O Rh+'}
                  </span>

                  <button
                    onClick={() => handlePrescribir(p)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white font-semibold text-xs shadow-xs transition-all min-h-[44px] touch-manipulation"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Prescribir Receta</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Crear / Editar Paciente */}
      <CrearPacienteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveModal}
        pacienteEditar={pacienteEditar}
      />
    </div>
  );
}
