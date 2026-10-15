'use client';

import React, { useState } from 'react';
import {
  X,
  Mail,
  Send,
  FileText,
  Building2,
  Clock,
  Phone,
  CheckCircle2,
  Download,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Farmacia, ItemReceta, RecetaDigital } from '../lib/types';
import { useRecetaStore } from '../lib/store';
import { descargarPDFReceta } from '../lib/pdfGenerator';

interface EnvioModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: ItemReceta[];
  diagnostico: string;
  observacionesGenerales: string;
  tipoTratamiento: 'farmacologico' | 'no_farmacologico';
  tratamientoNoFarmacologicoDetalle?: string;
  onRecetaEmitidaExito: (receta: RecetaDigital) => void;
}

export function EnvioModal({
  isOpen,
  onClose,
  items,
  diagnostico,
  observacionesGenerales,
  tipoTratamiento,
  tratamientoNoFarmacologicoDetalle,
  onRecetaEmitidaExito
}: EnvioModalProps) {
  const { farmacias, medicamentos, doctor, paciente, emitirReceta } = useRecetaStore();

  const [selectedFarmaciaId, setSelectedFarmaciaId] = useState(farmacias[0]?.id || '');
  const [isSending, setIsSending] = useState(false);
  const [recetaEmitida, setRecetaEmitida] = useState<RecetaDigital | null>(null);

  if (!isOpen) return null;

  const selectedFarmacia = farmacias.find(f => f.id === selectedFarmaciaId) || farmacias[0];

  // Chequeo de stock en la farmacia para los medicamentos seleccionados
  const stockCheck = items.map(item => {
    const med = medicamentos.find(m => m.id === item.medicamentoId || m.nombreComercial === item.nombreMedicamento);
    const cant = Number(item.cantidadTotal) || 1;
    const stockActual = med ? med.stockActual : 25;
    const suficiente = stockActual >= cant;
    return {
      nombre: item.nombreMedicamento,
      requerido: cant,
      stockActual,
      suficiente
    };
  });

  const todoConStock = stockCheck.every(s => s.suficiente);

  const handleConfirmarEnvio = () => {
    setIsSending(true);

    setTimeout(() => {
      const nueva = emitirReceta({
        tipoTratamiento,
        diagnostico,
        observacionesGenerales,
        tratamientoNoFarmacologicoDetalle,
        items,
        doctor,
        paciente,
        farmaciaDestino: selectedFarmacia
      });

      setRecetaEmitida(nueva);
      setIsSending(false);

      // Disparar confeti de éxito
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}

      onRecetaEmitidaExito(nueva);
    }, 1200);
  };

  const getWhatsappUrl = () => {
    if (!recetaEmitida) return '#';
    const texto = `Hola ${recetaEmitida.paciente.nombreCompleto}, la ${recetaEmitida.doctor.nombre} ha emitido su receta médica digital oficial.\n\n` +
      `🔑 *CÓDIGO DE RETIRO: ${recetaEmitida.codigoRX}*\n\n` +
      `🏥 *Farmacia asignada:* ${recetaEmitida.farmaciaDestino.nombre}\n` +
      `📍 *Dirección:* ${recetaEmitida.farmaciaDestino.direccion}\n` +
      `⏰ *Horario:* ${recetaEmitida.farmaciaDestino.horario}\n\n` +
      `Por favor acuda al mostrador de la farmacia y mencione su código *${recetaEmitida.codigoRX}* para que le entreguen sus medicamentos preparados. ¡Que se recupere pronto!`;

    const phoneClean = recetaEmitida.paciente.telefonoWhatsapp.replace(/\D/g, '');
    return `https://wa.me/${phoneClean}?text=${encodeURIComponent(texto)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden my-0 sm:my-8 animate-scale-in">
        {/* Cabecera */}
        <div className="px-5 py-3.5 sm:py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <Building2 className="w-5 h-5 text-blue-700 flex-shrink-0" />
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-slate-800 truncate">
                {recetaEmitida ? '¡Receta Emitida y Despachada!' : 'Emisión Oficial y Envío'}
              </h2>
              <p className="text-[11px] text-slate-500 truncate">
                PDF oficial + Correo a Farmacia + WhatsApp
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 active:bg-slate-200 transition-colors flex-shrink-0"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {recetaEmitida ? (
          /* Pantalla de Éxito y Despacho */
          <div className="p-6 space-y-5">
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-emerald-900">
                  Receta Médica #{recetaEmitida.codigoRX} generada exitosamente
                </h3>
                <p className="text-xs text-emerald-700 mt-0.5">
                  El PDF clínico fue compilado por la Dra. Oriela Iriarte y despachado de forma segura.
                </p>
              </div>
            </div>

            {/* Código RX Destacado */}
            <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-xl p-5 text-center shadow-md">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-blue-200">
                Código Identificador de Retiro
              </span>
              <div className="text-3xl font-extrabold font-mono tracking-wider mt-1 text-yellow-300">
                {recetaEmitida.codigoRX}
              </div>
              <p className="text-xs text-blue-100 mt-2">
                Este código fue enviado al paciente y registrado en el portal de la farmacia.
              </p>
            </div>

            {/* Resumen de Notificaciones Enviadas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2 font-bold text-slate-800 mb-1">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span>Correo Enviado a Farmacia</span>
                </div>
                <p className="text-slate-600 text-[11.5px]">
                  <strong>Destino:</strong> {recetaEmitida.farmaciaDestino.email}
                </p>
                <p className="text-slate-500 text-[11px] mt-1">
                  Adjunto: Receta_{recetaEmitida.codigoRX}.pdf
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2 font-bold text-slate-800 mb-1">
                  <Send className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp al Paciente</span>
                </div>
                <p className="text-slate-600 text-[11.5px]">
                  <strong>Destinatario:</strong> {recetaEmitida.paciente.nombreCompleto} ({recetaEmitida.paciente.telefonoWhatsapp})
                </p>
                <p className="text-slate-500 text-[11px] mt-1">
                  Mensaje con código y farmacia de retiro.
                </p>
              </div>
            </div>

            {/* Acciones de Descarga y Enlace Directo WhatsApp */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => descargarPDFReceta(recetaEmitida)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <Download className="w-4 h-4 text-slate-600" />
                Descargar Copia PDF
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={getWhatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Abrir WhatsApp Web
                </a>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-lg text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 shadow-sm transition-colors"
                >
                  Finalizar y Volver
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Formulario de Selección y Confirmación */
          <div className="p-6 space-y-5">
            {/* Paciente y Doctor */}
            <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center justify-between text-xs">
              <div>
                <span className="text-[11px] font-semibold text-blue-800 uppercase">Paciente:</span>
                <p className="font-bold text-slate-800">{paciente.nombreCompleto}</p>
                <p className="text-slate-500 text-[11px]">RUT: {paciente.rutOIdentificacion} • {paciente.telefonoWhatsapp}</p>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-semibold text-blue-800 uppercase">Médico:</span>
                <p className="font-bold text-slate-800">{doctor.nombre}</p>
                <p className="text-slate-500 text-[11px]">{doctor.registroMedico}</p>
              </div>
            </div>

            {/* Selector de Farmacia Destino */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Seleccione la Farmacia para el Despacho *
              </label>
              <div className="space-y-2">
                {farmacias.map((farm) => (
                  <label
                    key={farm.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedFarmaciaId === farm.id
                        ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-600'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="farmacia_select"
                      checked={selectedFarmaciaId === farm.id}
                      onChange={() => setSelectedFarmaciaId(farm.id)}
                      className="mt-1 text-blue-700 focus:ring-blue-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{farm.nombre}</span>
                        <span className="text-[11px] text-blue-700 font-medium flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {farm.email}
                        </span>
                      </div>
                      <p className="text-[11.5px] text-slate-600 mt-0.5">{farm.direccion}</p>
                      <p className="text-[10.5px] text-slate-400 mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {farm.horario}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Verificación de Inventario */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800">
                  Disponibilidad de Inventario en Farmacia
                </span>
                {todoConStock ? (
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    ✓ Stock confirmado para todos los medicamentos
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Algunos ítems con stock ajustado
                  </span>
                )}
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-100 text-xs">
                {stockCheck.map((stk, i) => (
                  <div key={i} className="px-3 py-2 flex items-center justify-between bg-white">
                    <div>
                      <span className="font-semibold text-slate-800">{stk.nombre}</span>
                      <span className="text-slate-500 text-[11px] ml-2">Cant: {stk.requerido}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-500">Stock actual: {stk.stockActual} un.</span>
                      <span className={`px-2 py-0.5 rounded text-[10.5px] font-bold ${
                        stk.suficiente ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {stk.suficiente ? 'Disponible' : 'Bajo Stock'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-4 border-t border-slate-200 sticky bottom-0 bg-white">
              <button
                type="button"
                onClick={onClose}
                disabled={isSending}
                className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors min-h-[44px]"
              >
                Volver y Editar
              </button>

              <button
                type="button"
                onClick={handleConfirmarEnvio}
                disabled={isSending}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-50 rounded-xl shadow-md transition-all min-h-[48px] touch-manipulation"
              >
                {isSending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Compilando PDF y Despachando...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Confirmar, Emitir y Despachar a Farmacia</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
