'use client';

import React, { useState, useEffect } from 'react';
import {
  PlusCircle,
  RotateCcw,
  Calendar,
  X,
  FileDown,
  Send,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  UserPlus,
  Users,
  ShieldAlert
} from 'lucide-react';
import { useRecetaStore, calcularFechaFin } from '../lib/store';
import { ItemReceta, RecetaDigital } from '../lib/types';
import {
  DIAGNOSTICOS_FRECUENTES,
  PRESENTACIONES_FRECUENTES,
  UNIDADES_MEDIDA,
  VIAS_ADMINISTRACION,
  FRECUENCIAS_FRECUENTES
} from '../lib/mockData';
import { CrearMedicamentoModal } from './CrearMedicamentoModal';
import { CrearPacienteModal } from './CrearPacienteModal';
import { EnvioModal } from './EnvioModal';
import { descargarPDFReceta } from '../lib/pdfGenerator';
import { CIE11Selector } from './CIE11Selector';

export function RecetaForm() {
  const {
    medicamentos,
    doctor,
    paciente,
    pacienteActivo,
    pacientes,
    centroMedico,
    farmacias,
    seleccionarPaciente,
    agregarPaciente
  } = useRecetaStore();

  const [isCrearPacienteModalOpen, setIsCrearPacienteModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<'farmacologico' | 'no_farmacologico'>('farmacologico');

  // Sección Diagnóstico (CIE-11)
  const [diagnostico, setDiagnostico] = useState('[1C62] Infección aguda de las vías respiratorias superiores, sitio no especificado');

  // Medicamentos en la receta
  const [recetaItems, setRecetaItems] = useState<ItemReceta[]>([]);

  // Formulario actual del medicamento
  const [medicamentoId, setMedicamentoId] = useState('');
  const [nombreMedicamento, setNombreMedicamento] = useState('');
  const [cantidadTotal, setCantidadTotal] = useState<number | ''>(1);
  const [presentacion, setPresentacion] = useState('');
  const [observacionesFarmacia, setObservacionesFarmacia] = useState('');

  // Para el paciente
  const [dosis, setDosis] = useState('');
  const [unidadMedida, setUnidadMedida] = useState('');
  const [viaAdministracion, setViaAdministracion] = useState('');
  const [frecuencia, setFrecuencia] = useState('');
  const [duracionNumero, setDuracionNumero] = useState<number | ''>(5);
  const [duracionUnidad, setDuracionUnidad] = useState<'dia(s)' | 'semana(s)' | 'mes(es)'>('dia(s)');
  const [fechaInicio, setFechaInicio] = useState('14/10/2026');
  const [fechaFin, setFechaFin] = useState('19/10/2026');
  const [indicaciones, setIndicaciones] = useState('');

  // Observaciones generales para el/la paciente
  const [observacionesGenerales, setObservacionesGenerales] = useState('');

  // Tratamiento no farmacológico
  const [noFarmacologicoTexto, setNoFarmacologicoTexto] = useState(
    'Reposo relativo por 48 horas. Hidratación constante de 2 a 3 litros de agua al día. Dieta blanda liviana fraccionada. Evitar cambios bruscos de temperatura. En caso de fiebre > 38.5°C persistente o disnea, consultar en servicio de urgencias.'
  );

  // Modales
  const [isCrearMedModalOpen, setIsCrearMedModalOpen] = useState(false);
  const [isEnvioModalOpen, setIsEnvioModalOpen] = useState(false);
  const [notifSuccess, setNotifSuccess] = useState<string | null>(null);

  // Recalcular fecha de fin automáticamente
  useEffect(() => {
    const finCalculado = calcularFechaFin(fechaInicio, duracionNumero, duracionUnidad);
    setFechaFin(finCalculado);
  }, [fechaInicio, duracionNumero, duracionUnidad]);

  // Cuando selecciona un medicamento del catálogo
  const handleSeleccionarMedicamento = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setMedicamentoId(selectedId);

    const med = medicamentos.find(m => m.id === selectedId);
    if (med) {
      setNombreMedicamento(med.nombreComercial);
      setPresentacion(med.presentacion);
      setViaAdministracion(med.viaAdministracionDefault);
      setUnidadMedida('comprimido(s)');
      setDosis('1');
      setFrecuencia('Cada 8 horas');
    } else {
      setNombreMedicamento('');
      setPresentacion('');
    }
  };

  // Limpiar campos del medicamento actual
  const handleLimpiarFormulario = () => {
    setMedicamentoId('');
    setNombreMedicamento('');
    setCantidadTotal('');
    setPresentacion('');
    setObservacionesFarmacia('');
    setDosis('');
    setUnidadMedida('');
    setViaAdministracion('');
    setFrecuencia('');
    setDuracionNumero('');
    setIndicaciones('');
  };

  // Callback de creación de medicamento
  const handleMedicamentoCreado = (nombre: string, pres: string, via: string) => {
    setNombreMedicamento(nombre);
    setPresentacion(pres);
    setViaAdministracion(via);
    setUnidadMedida('comprimido(s)');
    setDosis('1');
    setFrecuencia('Cada 8 horas');
    setCantidadTotal(1);
  };

  // Guardar o agregar medicamento a la lista de prescripción
  const handleAgregarItem = () => {
    if (!nombreMedicamento.trim()) {
      alert('Por favor seleccione o ingrese un medicamento.');
      return;
    }

    const nuevoItem: ItemReceta = {
      id: `item-${Date.now()}`,
      medicamentoId: medicamentoId || `med-temp-${Date.now()}`,
      nombreMedicamento,
      presentacion: presentacion || 'Unidad estándar',
      cantidadTotal: cantidadTotal || 1,
      observacionesFarmacia,
      dosis: dosis || '1',
      unidadMedida: unidadMedida || 'comprimido(s)',
      viaAdministracion: viaAdministracion || 'Oral',
      frecuencia: frecuencia || 'Cada 8 horas',
      duracionNumero: duracionNumero || 5,
      duracionUnidad,
      fechaInicio: fechaInicio || '14/10/2026',
      fechaFin: fechaFin || '19/10/2026',
      indicaciones: indicaciones || 'Tomar con abundante agua.'
    };

    setRecetaItems([...recetaItems, nuevoItem]);
    setNotifSuccess(`"${nombreMedicamento}" agregado a la lista de la receta.`);
    setTimeout(() => setNotifSuccess(null), 3500);

    // Resetear formulario para permitir agregar otro fármaco
    handleLimpiarFormulario();
  };

  const handleEliminarItem = (itemId: string) => {
    setRecetaItems(recetaItems.filter(i => i.id !== itemId));
  };

  // Preparar lista de items a emitir (si no ha presionado agregar pero tiene campos llenos, se incluye)
  const getItemsFinales = (): ItemReceta[] => {
    if (recetaItems.length > 0) return recetaItems;
    if (nombreMedicamento.trim()) {
      return [{
        id: `item-${Date.now()}`,
        medicamentoId: medicamentoId || 'med-01',
        nombreMedicamento,
        presentacion: presentacion || 'Caja x 20 comprimidos',
        cantidadTotal: cantidadTotal || 1,
        observacionesFarmacia,
        dosis: dosis || '1',
        unidadMedida: unidadMedida || 'comprimido(s)',
        viaAdministracion: viaAdministracion || 'Oral',
        frecuencia: frecuencia || 'Cada 8 horas',
        duracionNumero: duracionNumero || 5,
        duracionUnidad,
        fechaInicio,
        fechaFin,
        indicaciones
      }];
    }
    return [];
  };

  const handleDescargarBorradorPDF = () => {
    const items = getItemsFinales();
    if (items.length === 0) {
      alert('Agregue al menos un medicamento para generar el PDF.');
      return;
    }

    const mockReceta: RecetaDigital = {
      id: 'preview',
      codigoRX: 'RX-PREV',
      fechaEmision: '2026-10-14 16:45',
      tipoTratamiento: activeTab,
      diagnostico,
      observacionesGenerales,
      tratamientoNoFarmacologicoDetalle: noFarmacologicoTexto,
      items,
      doctor,
      centroMedico,
      paciente: pacienteActivo,
      farmaciaDestino: farmacias[0],
      estado: 'EMITIDA',
      historialEstados: [],
      notificaciones: {
        emailEnviadoAFarmacia: false,
        whatsappEnviadoAPaciente: false
      }
    };

    descargarPDFReceta(mockReceta);
  };

  const handleAbrirEnvio = () => {
    const items = getItemsFinales();
    if (items.length === 0 && activeTab === 'farmacologico') {
      alert('Por favor complete los datos de al menos un medicamento para emitir la receta.');
      return;
    }
    setIsEnvioModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Banner Notificación Toast */}
      {notifSuccess && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-emerald-800 text-xs font-semibold animate-fade-in shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{notifSuccess}</span>
        </div>
      )}

      {/* Ficha Clínica y Selector de Paciente Activo */}
      <div className="mb-5 bg-white rounded-xl shadow-xs border border-slate-200 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Datos del Paciente */}
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm flex-shrink-0 border border-blue-200">
              {pacienteActivo.nombreCompleto
                .split(' ')
                .map(n => n[0])
                .slice(0, 2)
                .join('')}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs uppercase tracking-wider font-bold text-blue-700">
                  Paciente Prescrito:
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {pacienteActivo.nombreCompleto}
                </span>
                <span className="text-xs text-slate-500">
                  (CI/Doc: <strong className="text-slate-700">{pacienteActivo.rutOIdentificacion}</strong> • {pacienteActivo.edad} años • {pacienteActivo.telefonoWhatsapp})
                </span>
              </div>

              {/* Alergias / Alertas clínicas */}
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                {pacienteActivo.alergias && pacienteActivo.alergias.trim() !== '' ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-rose-50 text-rose-700 px-2 py-0.5 rounded-md border border-rose-200">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                    ⚠ Alergias: {pacienteActivo.alergias}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Sin alergias farmacológicas declaradas
                  </span>
                )}

                {pacienteActivo.antecedentesMedicos && (
                  <span className="text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md truncate max-w-md">
                    <strong>Antecedentes:</strong> {pacienteActivo.antecedentesMedicos}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Selector y Botón Nuevo Paciente */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5">
              <Users className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={pacienteActivo.id}
                onChange={e => {
                  const p = pacientes.find(item => item.id === e.target.value);
                  if (p) seleccionarPaciente(p);
                }}
                className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
              >
                {pacientes.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.nombreCompleto} ({p.rutOIdentificacion})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => setIsCrearPacienteModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs shadow-xs transition-all"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Nuevo Paciente</span>
            </button>
          </div>
        </div>
      </div>

      {/* Contenedor Principal de la Receta Digital */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Cabecera y Tabs Idénticos a la Imagen */}
        <div className="px-6 pt-5 pb-0 border-b border-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Receta Digital
            </h1>

            {/* Acciones Rápidas */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDescargarBorradorPDF}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                title="Genera una copia oficial en PDF"
              >
                <FileDown className="w-3.5 h-3.5 text-slate-600" />
                Previsualizar PDF
              </button>

              <button
                type="button"
                onClick={handleAbrirEnvio}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 shadow-sm transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                Emitir y Enviar a Farmacia
              </button>
            </div>
          </div>

          {/* Pestañas de Tratamiento */}
          <div className="flex items-center gap-2 border-b border-transparent -mb-px">
            <button
              onClick={() => setActiveTab('farmacologico')}
              className={`tab-button ${activeTab === 'farmacologico' ? 'active' : ''}`}
            >
              Tratamiento farmacológico
            </button>
            <button
              onClick={() => setActiveTab('no_farmacologico')}
              className={`tab-button ${activeTab === 'no_farmacologico' ? 'active' : ''}`}
            >
              Tratamiento no farmacológico
            </button>
          </div>
        </div>

        {/* Cuerpo del Formulario */}
        <div className="p-6 space-y-6">
          {/* SECCIÓN DIAGNÓSTICO (CIE-11 Oficial OMS) */}
          <div>
            <CIE11Selector
              value={diagnostico}
              onChange={(val) => setDiagnostico(val)}
            />
          </div>

          {activeTab === 'farmacologico' ? (
            <>
              {/* SECCIÓN: PARA LA FARMACIA */}
              <div className="pt-2">
                <div className="section-blue-title">Para la farmacia</div>

                <div className="space-y-4">
                  {/* Fila 1: Medicamento + Botón Crear Medicamento */}
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <div className="flex-1 w-full field-container">
                      <label className="field-label">Medicamento</label>
                      <select
                        value={medicamentoId}
                        onChange={handleSeleccionarMedicamento}
                        className="field-input text-slate-800 bg-white cursor-pointer"
                      >
                        <option value="">Seleccione Medicamento</option>
                        {medicamentos.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.nombreComercial} ({m.presentacion}) - Stock: {m.stockActual}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsCrearMedModalOpen(true)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 transition-colors py-2 px-1 whitespace-nowrap"
                    >
                      <PlusCircle className="w-4 h-4 text-blue-700" />
                      Crear medicamento
                    </button>
                  </div>

                  {/* Fila 2: Cantidad total, Presentación/Envase, Limpiar formulario */}
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <div className="w-full md:w-64 field-container">
                      <label className="field-label">Cantidad total</label>
                      <input
                        type="number"
                        min="1"
                        placeholder="Ingrese total"
                        value={cantidadTotal}
                        onChange={(e) => setCantidadTotal(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                        className="field-input"
                      />
                      {cantidadTotal !== '' && (
                        <button
                          type="button"
                          onClick={() => setCantidadTotal('')}
                          className="field-clear-btn"
                          title="Borrar"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="w-full md:w-80 field-container">
                      <label className="field-label">Presentación/Envase</label>
                      <select
                        value={presentacion}
                        onChange={(e) => setPresentacion(e.target.value)}
                        className="field-input text-slate-800 bg-white cursor-pointer"
                      >
                        <option value="">Seleccione presentación</option>
                        {PRESENTACIONES_FRECUENTES.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center md:ml-auto">
                      <button
                        type="button"
                        onClick={handleLimpiarFormulario}
                        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors py-2 px-2"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                        Limpiar formulario
                      </button>
                    </div>
                  </div>

                  {/* Fila 3: Observaciones Farmacia */}
                  <div className="field-container">
                    <label className="field-label">Observaciones</label>
                    <input
                      type="text"
                      placeholder="Ingrese observaciones de ser necesario"
                      value={observacionesFarmacia}
                      onChange={(e) => setObservacionesFarmacia(e.target.value)}
                      className="field-input"
                    />
                    {observacionesFarmacia !== '' && (
                      <button
                        type="button"
                        onClick={() => setObservacionesFarmacia('')}
                        className="field-clear-btn"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* SECCIÓN: PARA EL PACIENTE */}
              <div className="pt-2">
                <div className="section-blue-title">Para el paciente</div>

                <div className="space-y-4">
                  {/* Fila 1: Dosis, Unidad de medida, Vía de administración */}
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <div className="w-full md:w-64 field-container">
                      <label className="field-label">Dosis</label>
                      <input
                        type="text"
                        placeholder="Ingrese cantidad. Ej.: 2 , 0.5, 1/2"
                        value={dosis}
                        onChange={(e) => setDosis(e.target.value)}
                        className="field-input"
                      />
                      {dosis !== '' && (
                        <button
                          type="button"
                          onClick={() => setDosis('')}
                          className="field-clear-btn"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="w-full md:w-64 field-container">
                      <label className="field-label">Unidad de medida</label>
                      <select
                        value={unidadMedida}
                        onChange={(e) => setUnidadMedida(e.target.value)}
                        className="field-input text-slate-800 bg-white cursor-pointer"
                      >
                        <option value="">Seleccione medida</option>
                        {UNIDADES_MEDIDA.map((u) => (
                          <option key={u} value={u}>{u}</option>
                        ))}
                      </select>
                    </div>

                    <div className="w-full md:w-80 field-container">
                      <label className="field-label">Vía de administración</label>
                      <select
                        value={viaAdministracion}
                        onChange={(e) => setViaAdministracion(e.target.value)}
                        className="field-input text-slate-800 bg-white cursor-pointer"
                      >
                        <option value="">Seleccione vía</option>
                        {VIAS_ADMINISTRACION.map((v) => (
                          <option key={v} value={v}>{v}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Fila 2: Frecuencia */}
                  <div className="w-full md:w-64 field-container">
                    <label className="field-label">Frecuencia</label>
                    <select
                      value={frecuencia}
                      onChange={(e) => setFrecuencia(e.target.value)}
                      className="field-input text-slate-800 bg-white cursor-pointer"
                    >
                      <option value="">Seleccione frecuencia</option>
                      {FRECUENCIAS_FRECUENTES.map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>

                  {/* Fila 3: Duración (input numérico) y pills [día(s)] [semana(s)] [mes(es)] */}
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <div className="w-full md:w-64 field-container">
                      <label className="field-label">Duración</label>
                      <input
                        type="number"
                        min="1"
                        placeholder="Ingrese cantidad"
                        value={duracionNumero}
                        onChange={(e) => setDuracionNumero(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                        className="field-input"
                      />
                      {duracionNumero !== '' && (
                        <button
                          type="button"
                          onClick={() => setDuracionNumero('')}
                          className="field-clear-btn"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Pills de duración */}
                    <div className="duration-pill-group">
                      <button
                        type="button"
                        onClick={() => setDuracionUnidad('dia(s)')}
                        className={`duration-pill-btn ${duracionUnidad === 'dia(s)' ? 'active' : ''}`}
                      >
                        día(s)
                      </button>
                      <button
                        type="button"
                        onClick={() => setDuracionUnidad('semana(s)')}
                        className={`duration-pill-btn ${duracionUnidad === 'semana(s)' ? 'active' : ''}`}
                      >
                        semana(s)
                      </button>
                      <button
                        type="button"
                        onClick={() => setDuracionUnidad('mes(es)')}
                        className={`duration-pill-btn ${duracionUnidad === 'mes(es)' ? 'active' : ''}`}
                      >
                        mes(es)
                      </button>
                    </div>
                  </div>

                  {/* Fila 4: Fecha de inicio y Fecha de fin */}
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <div className="w-full md:w-64 field-container">
                      <label className="field-label">Fecha de inicio</label>
                      <input
                        type="text"
                        placeholder="DD/MM/AAAA"
                        value={fechaInicio}
                        onChange={(e) => setFechaInicio(e.target.value)}
                        className="field-input"
                      />
                      <span className="field-clear-btn pointer-events-none text-slate-400">
                        <Calendar className="w-4 h-4" />
                      </span>
                    </div>

                    <div className="w-full md:w-64 field-container">
                      <label className="field-label">Fecha de fin</label>
                      <input
                        type="text"
                        placeholder="Calculada automáticamente"
                        value={fechaFin}
                        onChange={(e) => setFechaFin(e.target.value)}
                        className="field-input bg-slate-50/50"
                      />
                      <span className="field-clear-btn pointer-events-none text-slate-400">
                        <Calendar className="w-4 h-4" />
                      </span>
                    </div>
                  </div>

                  {/* Fila 5: Indicaciones del medicamento */}
                  <div className="field-container">
                    <label className="field-label">Indicaciones del medicamento</label>
                    <input
                      type="text"
                      placeholder="Ingrese indicaciones. Ej.: No consumir alcohol"
                      value={indicaciones}
                      onChange={(e) => setIndicaciones(e.target.value)}
                      className="field-input"
                    />
                    {indicaciones !== '' && (
                      <button
                        type="button"
                        onClick={() => setIndicaciones('')}
                        className="field-clear-btn"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Botón para incorporar a la receta */}
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={handleAgregarItem}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Agregar este medicamento a la receta
                    </button>
                  </div>
                </div>
              </div>

              {/* LISTA DE MEDICAMENTOS AGREGADOS A LA RECETA */}
              {recetaItems.length > 0 && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      Medicamentos en esta prescripción ({recetaItems.length})
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Se incluirán en el PDF y en el despacho de la farmacia
                    </span>
                  </div>

                  <div className="space-y-2">
                    {recetaItems.map((item, idx) => (
                      <div
                        key={item.id}
                        className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between shadow-xs text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-blue-700 text-white flex items-center justify-center text-[10px]">
                              {idx + 1}
                            </span>
                            {item.nombreMedicamento}
                            <span className="text-slate-500 font-normal">
                              ({item.presentacion})
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10.5px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                              Cant: {item.cantidadTotal}
                            </span>
                          </div>
                          <p className="text-[11.5px] text-slate-600 mt-1 pl-7">
                            <strong>Posología:</strong> {item.dosis} {item.unidadMedida} • {item.frecuencia} • {item.duracionNumero} {item.duracionUnidad} ({item.fechaInicio} al {item.fechaFin})
                          </p>
                          {item.indicaciones && (
                            <p className="text-[11px] text-blue-700 mt-0.5 pl-7">
                              <strong>Indicaciones:</strong> {item.indicaciones}
                            </p>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleEliminarItem(item.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Eliminar de la receta"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* PESTAÑA TRATAMIENTO NO FARMACOLÓGICO */
            <div className="space-y-4">
              <div className="section-blue-title">Indicaciones No Farmacológicas y Cuidados Generales</div>
              <p className="text-xs text-slate-500">
                Pautas de estilo de vida, reposo, dieta, hidratación, rehabilitación o interconsultas.
              </p>
              <textarea
                rows={6}
                value={noFarmacologicoTexto}
                onChange={(e) => setNoFarmacologicoTexto(e.target.value)}
                className="w-full p-3 text-xs border border-slate-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none leading-relaxed text-slate-800"
                placeholder="Describa las indicaciones de reposo, alimentación, fisioterapia..."
              />
            </div>
          )}

          {/* SECCIÓN: OBSERVACIONES GENERALES PARA EL/LA PACIENTE */}
          <div className="pt-2">
            <div className="section-blue-title">Observaciones generales para el/la paciente</div>
            <div className="field-container">
              <label className="field-label">Observaciones</label>
              <input
                type="text"
                placeholder="Ingrese observaciones. Ej.: próxima consulta"
                value={observacionesGenerales}
                onChange={(e) => setObservacionesGenerales(e.target.value)}
                className="field-input"
              />
              {observacionesGenerales !== '' && (
                <button
                  type="button"
                  onClick={() => setObservacionesGenerales('')}
                  className="field-clear-btn"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer Bar de la Receta */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Farmacias en convenio interconectadas: {farmacias.length} disponibles</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleDescargarBorradorPDF}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg shadow-xs transition-colors"
            >
              <FileDown className="w-4 h-4 text-slate-600" />
              Descargar PDF
            </button>

            <button
              type="button"
              onClick={handleAbrirEnvio}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              <Send className="w-4 h-4" />
              Emitir y Despachar a Farmacia
            </button>
          </div>
        </div>
      </div>

      {/* Modales */}
      <CrearMedicamentoModal
        isOpen={isCrearMedModalOpen}
        onClose={() => setIsCrearMedModalOpen(false)}
        onMedicamentoCreado={handleMedicamentoCreado}
      />

      <EnvioModal
        isOpen={isEnvioModalOpen}
        onClose={() => setIsEnvioModalOpen(false)}
        items={getItemsFinales()}
        diagnostico={diagnostico}
        observacionesGenerales={observacionesGenerales}
        tipoTratamiento={activeTab}
        tratamientoNoFarmacologicoDetalle={noFarmacologicoTexto}
        onRecetaEmitidaExito={() => {
          setRecetaItems([]);
          handleLimpiarFormulario();
        }}
      />

      <CrearPacienteModal
        isOpen={isCrearPacienteModalOpen}
        onClose={() => setIsCrearPacienteModalOpen(false)}
        onSave={nuevoPaciente => {
          const creado = agregarPaciente(nuevoPaciente);
          setNotifSuccess(`Paciente ${creado.nombreCompleto} registrado y seleccionado para esta receta.`);
          setTimeout(() => setNotifSuccess(null), 4000);
        }}
      />
    </div>
  );
}
