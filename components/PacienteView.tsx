'use client';

import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  MessageSquare,
  ExternalLink,
  ShieldCheck,
  Building2,
  Clock,
  MapPin,
  CheckCheck,
  Copy,
  Check,
  Sparkles,
  QrCode
} from 'lucide-react';
import { useRecetaStore } from '../lib/store';
import { RecetaDigital } from '../lib/types';

export function PacienteView() {
  const { recetas } = useRecetaStore();

  const [selectedRecetaId, setSelectedRecetaId] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [qrSrc, setQrSrc] = useState<string>('');

  const receta = recetas.find(r => r.id === selectedRecetaId) || recetas[0];

  useEffect(() => {
    if (receta) {
      setSelectedRecetaId(receta.id);
      QRCode.toDataURL(
        `RECETA:${receta.codigoRX}|PACIENTE:${receta.paciente.rutOIdentificacion}|FARMACIA:${receta.farmaciaDestino.nombre}`,
        { width: 220, margin: 1, color: { dark: '#0f172a', light: '#ffffff' } }
      ).then(setQrSrc).catch(() => {});
    }
  }, [receta]);

  if (!receta) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h2 className="text-base font-bold text-slate-700">No hay recetas emitidas aún</h2>
        <p className="text-xs text-slate-500 mt-1">
          Emita una receta desde el Portal Médico para previsualizar el mensaje de WhatsApp.
        </p>
      </div>
    );
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(receta.codigoRX);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getWhatsappUrl = () => {
    const texto = `Hola ${receta.paciente.nombreCompleto}, su receta médica digital oficial ha sido emitida.\n\n` +
      `🔑 *CÓDIGO DE RETIRO: ${receta.codigoRX}*\n\n` +
      `🏥 *Farmacia:* ${receta.farmaciaDestino.nombre}\n` +
      `📍 *Dirección:* ${receta.farmaciaDestino.direccion}\n` +
      `⏰ *Horario:* ${receta.farmaciaDestino.horario}\n\n` +
      `Presente este código en el mostrador para retirar sus medicamentos.`;

    const phoneClean = receta.paciente.telefonoWhatsapp.replace(/\D/g, '');
    return `https://wa.me/${phoneClean}?text=${encodeURIComponent(texto)}`;
  };

  const isEntregada = receta.estado === 'ENTREGADA';
  const isPreparando = receta.estado === 'PREPARANDO';

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Selector de Receta si hay múltiples */}
      {recetas.length > 1 && (
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700">Seleccionar receta para visualizar:</span>
          <select
            value={receta.id}
            onChange={(e) => setSelectedRecetaId(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-md font-mono text-xs bg-white text-slate-800"
          >
            {recetas.map(r => (
              <option key={r.id} value={r.id}>
                {r.codigoRX} - {r.paciente.nombreCompleto} ({r.estado})
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* COLUMNA IZQUIERDA: Mockup de Teléfono con WhatsApp */}
        <div className="md:col-span-6 flex justify-center">
          <div className="w-[340px] bg-slate-900 rounded-[38px] p-3 shadow-2xl border-4 border-slate-800 ring-1 ring-slate-950/20">
            {/* Notch superior */}
            <div className="w-28 h-4 bg-slate-800 rounded-full mx-auto mb-2 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-slate-950 mr-2" />
              <div className="w-2 h-2 rounded-full bg-slate-900" />
            </div>

            {/* Pantalla WhatsApp */}
            <div className="bg-[#efeae2] rounded-[28px] overflow-hidden min-h-[520px] flex flex-col border border-slate-300">
              {/* WhatsApp Header */}
              <div className="bg-[#075e54] text-white px-3.5 py-2.5 flex items-center gap-2.5 shadow-xs">
                <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-xs text-white">
                  Rx
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold truncate">
                    {receta.doctor.clinica}
                  </div>
                  <div className="text-[10px] text-emerald-200">
                    En línea • {receta.doctor.nombre}
                  </div>
                </div>
              </div>

              {/* Mensajes Chat */}
              <div className="p-3 flex-1 flex flex-col justify-end space-y-2">
                {/* Burbuja de Mensaje Recibido */}
                <div className="bg-white rounded-lg rounded-tl-none p-3 shadow-sm text-[11.5px] leading-relaxed max-w-[92%] border border-slate-200 text-slate-800">
                  <p className="font-semibold text-emerald-800 mb-1 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Receta Médica Digital Emitida
                  </p>
                  <p>
                    Estimado/a <strong>{receta.paciente.nombreCompleto}</strong>:
                  </p>
                  <p className="mt-1">
                    Su doctora <strong>{receta.doctor.nombre}</strong> ha generado su receta oficial y la ha enviado para su preparación.
                  </p>

                  {/* Código RX resaltado */}
                  <div className="my-2.5 p-2.5 bg-emerald-50 rounded-md border border-emerald-300 text-center">
                    <span className="text-[9.5px] uppercase font-bold text-emerald-800 block">
                      Código de Retiro en Farmacia
                    </span>
                    <span className="text-xl font-extrabold font-mono tracking-wider text-emerald-950 block my-0.5">
                      {receta.codigoRX}
                    </span>
                    <span className="text-[9px] text-emerald-700">
                      Mencione este código al farmacéutico
                    </span>
                  </div>

                  <p className="font-semibold text-slate-900 mt-2">
                    🏥 Farmacia Asignada:
                  </p>
                  <p className="text-slate-700">{receta.farmaciaDestino.nombre}</p>
                  <p className="text-[10.5px] text-slate-500">📍 {receta.farmaciaDestino.direccion}</p>
                  <p className="text-[10.5px] text-slate-500">⏰ {receta.farmaciaDestino.horario}</p>

                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                    <span>{receta.fechaEmision}</span>
                    <span className="text-blue-500 flex items-center">
                      <CheckCheck className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: Tarjeta de Retiro, QR y Acciones */}
        <div className="md:col-span-6 space-y-5">
          {/* Tarjeta de Código de Retiro */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                  Credencial de Retiro
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                  Retiro en Farmacia
                </h2>
              </div>

              {isEntregada ? (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <CheckCheck className="w-3.5 h-3.5" /> Medicamentos Retirados
                </span>
              ) : isPreparando ? (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 animate-pulse flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> En Preparación por Farmacia
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Listo para Retirar
                </span>
              )}
            </div>

            {/* Bloque Grande con el Código */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center relative">
              <span className="text-xs text-slate-500 font-medium">
                Indique este código al llegar a la farmacia:
              </span>
              <div className="text-3xl font-extrabold font-mono text-blue-800 tracking-wider my-1">
                {receta.codigoRX}
              </div>

              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-300 rounded-md text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs mt-1"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copiar Código</span>
                  </>
                )}
              </button>
            </div>

            {/* Código QR para escaneo rápido */}
            {qrSrc && (
              <div className="flex flex-col items-center justify-center p-3 bg-white border border-slate-100 rounded-xl text-center">
                <img src={qrSrc} alt="QR Receta" className="w-36 h-36 border p-1 rounded-lg" />
                <span className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                  <QrCode className="w-3.5 h-3.5 text-slate-400" />
                  Escanear en mostrador farmacéutico
                </span>
              </div>
            )}

            {/* Farmacia de Retiro */}
            <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 space-y-1 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-blue-900">
                <Building2 className="w-4 h-4 text-blue-700" />
                <span>{receta.farmaciaDestino.nombre}</span>
              </div>
              <p className="text-slate-600 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {receta.farmaciaDestino.direccion}
              </p>
              <p className="text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {receta.farmaciaDestino.horario}
              </p>
            </div>

            {/* Botón WhatsApp Directo */}
            <div className="pt-2">
              <a
                href={getWhatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                Enviar / Reenviar por WhatsApp Real
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
