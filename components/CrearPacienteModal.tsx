'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  UserPlus,
  AlertTriangle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  HeartPulse,
  Save,
  CheckCircle2
} from 'lucide-react';
import { Paciente } from '../lib/types';

interface CrearPacienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (paciente: Omit<Paciente, 'id' | 'fechaRegistro'>) => void;
  pacienteEditar?: Paciente | null;
}

export function CrearPacienteModal({
  isOpen,
  onClose,
  onSave,
  pacienteEditar
}: CrearPacienteModalProps) {
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [rutOIdentificacion, setRutOIdentificacion] = useState('');
  const [edad, setEdad] = useState<number | ''>('');
  const [genero, setGenero] = useState<'Femenino' | 'Masculino' | 'Otro'>('Femenino');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [telefonoWhatsapp, setTelefonoWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [direccion, setDireccion] = useState('');
  const [ciudad, setCiudad] = useState('Cochabamba');
  const [alergias, setAlergias] = useState('');
  const [antecedentesMedicos, setAntecedentesMedicos] = useState('');
  const [grupoSanguineo, setGrupoSanguineo] = useState('O Rh+');
  const [contactoEmergencia, setContactoEmergencia] = useState('');

  useEffect(() => {
    if (pacienteEditar) {
      setNombreCompleto(pacienteEditar.nombreCompleto || '');
      setRutOIdentificacion(pacienteEditar.rutOIdentificacion || '');
      setEdad(pacienteEditar.edad ?? '');
      setGenero(pacienteEditar.genero || 'Femenino');
      setFechaNacimiento(pacienteEditar.fechaNacimiento || '');
      setTelefonoWhatsapp(pacienteEditar.telefonoWhatsapp || '');
      setEmail(pacienteEditar.email || '');
      setDireccion(pacienteEditar.direccion || '');
      setCiudad(pacienteEditar.ciudad || 'Cochabamba');
      setAlergias(pacienteEditar.alergias || '');
      setAntecedentesMedicos(pacienteEditar.antecedentesMedicos || '');
      setGrupoSanguineo(pacienteEditar.grupoSanguineo || 'O Rh+');
      setContactoEmergencia(pacienteEditar.contactoEmergencia || '');
    } else {
      setNombreCompleto('');
      setRutOIdentificacion('');
      setEdad('');
      setGenero('Femenino');
      setFechaNacimiento('');
      setTelefonoWhatsapp('+591 ');
      setEmail('');
      setDireccion('');
      setCiudad('Cochabamba');
      setAlergias('');
      setAntecedentesMedicos('');
      setGrupoSanguineo('O Rh+');
      setContactoEmergencia('');
    }
  }, [pacienteEditar, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombreCompleto.trim() || !rutOIdentificacion.trim()) {
      alert('Por favor ingrese el Nombre Completo y Documento de Identidad del paciente.');
      return;
    }

    onSave({
      nombreCompleto: nombreCompleto.trim(),
      rutOIdentificacion: rutOIdentificacion.trim(),
      edad: Number(edad) || 0,
      genero,
      fechaNacimiento,
      telefonoWhatsapp: telefonoWhatsapp.trim(),
      email: email.trim(),
      direccion: direccion.trim(),
      ciudad: ciudad.trim(),
      alergias: alergias.trim(),
      antecedentesMedicos: antecedentesMedicos.trim(),
      grupoSanguineo,
      contactoEmergencia: contactoEmergencia.trim()
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fade-in modal-overscroll-contain overscroll-contain">
      <div className="relative w-full max-w-2xl bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col overflow-hidden my-0 sm:my-8 animate-scale-in overscroll-contain">
        <div className="bottom-sheet-handle sm:hidden" />
        {/* Header Modal */}
        <div className="px-5 py-3.5 sm:py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0" aria-hidden="true">
              <UserPlus className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate text-pretty">
                {pacienteEditar ? 'Editar Ficha del Paciente' : 'Registrar Nuevo Paciente'}
              </h2>
              <p className="text-[11px] text-slate-500 truncate">
                Sincronización clínica con recetas y PDF
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 active:bg-slate-200 transition-colors flex-shrink-0 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none"
            aria-label="Cerrar ventana de paciente"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1 overscroll-contain">
          {/* Datos Personales Principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nombre Completo *
              </label>
              <input
                type="text"
                value={nombreCompleto}
                onChange={e => setNombreCompleto(e.target.value)}
                placeholder="Ej. Juan Carlos Pérez Miranda"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Documento de Identidad (CI / RUT / DNI) *
              </label>
              <input
                type="text"
                value={rutOIdentificacion}
                onChange={e => setRutOIdentificacion(e.target.value)}
                placeholder="Ej. 4128903-CB"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent font-medium"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Edad
                </label>
                <input
                  type="number"
                  min="0"
                  max="130"
                  value={edad}
                  onChange={e => setEdad(e.target.value === '' ? '' : parseInt(e.target.value))}
                  placeholder="Años"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Género
                </label>
                <select
                  value={genero}
                  onChange={e => setGenero(e.target.value as any)}
                  className="w-full px-2.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white"
                >
                  <option value="Femenino">Femenino</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Teléfono / WhatsApp * (Para envío de receta)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={telefonoWhatsapp}
                  onChange={e => setTelefonoWhatsapp(e.target.value)}
                  placeholder="+591 76258575"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="paciente@correo.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Dirección Residencial
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={direccion}
                  onChange={e => setDireccion(e.target.value)}
                  placeholder="Calle, zona o barrio"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ciudad
                </label>
                <input
                  type="text"
                  value={ciudad}
                  onChange={e => setCiudad(e.target.value)}
                  placeholder="Cochabamba"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Grupo Sanguíneo
                </label>
                <select
                  value={grupoSanguineo}
                  onChange={e => setGrupoSanguineo(e.target.value)}
                  className="w-full px-2.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white"
                >
                  <option value="O Rh+">O Rh+</option>
                  <option value="O Rh-">O Rh-</option>
                  <option value="A Rh+">A Rh+</option>
                  <option value="A Rh-">A Rh-</option>
                  <option value="B Rh+">B Rh+</option>
                  <option value="B Rh-">B Rh-</option>
                  <option value="AB Rh+">AB Rh+</option>
                  <option value="AB Rh-">AB Rh-</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sección Alertas Clínicas */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-3">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Seguridad del Paciente & Alergias Medicamentosas</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-amber-950 mb-1">
                Alergias Conocidas (Se imprimirán como advertencia destacada en la receta)
              </label>
              <input
                type="text"
                value={alergias}
                onChange={e => setAlergias(e.target.value)}
                placeholder="Ej. Penicilina, Ciprofloxacino, Sulfas, AINEs (o dejar vacío si no tiene)"
                className="w-full px-3.5 py-2 rounded-lg border border-amber-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-amber-950 mb-1">
                Antecedentes Médicos / Comorbilidades
              </label>
              <textarea
                rows={2}
                value={antecedentesMedicos}
                onChange={e => setAntecedentesMedicos(e.target.value)}
                placeholder="Ej. Diabetes Mellitus Tipo 2, Pie Diabético Wagner II, Hipertensión arterial…"
                className="w-full px-3.5 py-2 rounded-lg border border-amber-300 bg-white text-xs text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 outline-none"
              />
            </div>
          </div>

          {/* Contacto de Emergencia */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Familiar / Contacto de Emergencia (Opcional)
            </label>
            <input
              type="text"
              value={contactoEmergencia}
              onChange={e => setContactoEmergencia(e.target.value)}
              placeholder="Ej. Roberto Morales (Esposo) - +591 71234567"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Footer de Acciones */}
          <div className="pt-3 border-t border-slate-200 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors min-h-[44px]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white font-bold text-xs shadow-sm transition-all min-h-[48px] touch-manipulation"
            >
              <Save className="w-4 h-4" />
              <span>{pacienteEditar ? 'Guardar Cambios' : 'Registrar y Seleccionar Paciente'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
