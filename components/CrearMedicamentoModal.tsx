'use client';

import React, { useState } from 'react';
import { X, PlusCircle, CheckCircle2 } from 'lucide-react';
import { useRecetaStore } from '../lib/store';
import { PRESENTACIONES_FRECUENTES, VIAS_ADMINISTRACION } from '../lib/mockData';

interface CrearMedicamentoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMedicamentoCreado: (nombre: string, presentacion: string, via: string) => void;
}

export function CrearMedicamentoModal({
  isOpen,
  onClose,
  onMedicamentoCreado
}: CrearMedicamentoModalProps) {
  const { agregarMedicamentoNuevo } = useRecetaStore();

  const [nombreComercial, setNombreComercial] = useState('');
  const [principioActivo, setPrincipioActivo] = useState('');
  const [presentacion, setPresentacion] = useState(PRESENTACIONES_FRECUENTES[0]);
  const [concentracion, setConcentracion] = useState('');
  const [viaDefault, setViaDefault] = useState(VIAS_ADMINISTRACION[0]);
  const [stockInicial, setStockInicial] = useState('30');
  const [precio, setPrecio] = useState('4500');
  const [categoria, setCategoria] = useState('Analgésico / Antibiótico');
  const [mensajeExito, setMensajeExito] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreComercial.trim()) return;

    const nuevo = agregarMedicamentoNuevo({
      nombreComercial: nombreComercial.trim(),
      principioActivo: principioActivo.trim() || nombreComercial.trim(),
      presentacion,
      concentracion: concentracion.trim() || 'Estándar',
      viaAdministracionDefault: viaDefault,
      stockActual: parseInt(stockInicial, 10) || 20,
      stockMinimo: 10,
      precioUnitario: parseInt(precio, 10) || 3000,
      categoria
    });

    setMensajeExito(true);
    setTimeout(() => {
      onMedicamentoCreado(nuevo.nombreComercial, nuevo.presentacion, nuevo.viaAdministracionDefault);
      setMensajeExito(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-blue-700" />
            <h2 className="text-sm font-bold text-slate-800">
              Crear Nuevo Medicamento en Catálogo
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {mensajeExito ? (
          <div className="p-8 text-center flex flex-col items-center justify-center gap-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 animate-bounce" />
            <h3 className="text-base font-bold text-slate-800">
              ¡Medicamento registrado con éxito!
            </h3>
            <p className="text-xs text-slate-500">
              Se ha incorporado al catálogo y al inventario de la farmacia.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nombre Comercial del Medicamento *
              </label>
              <input
                type="text"
                required
                placeholder="Ej.: Amoxicilina + Ácido Clavulánico 875/125 mg"
                value={nombreComercial}
                onChange={(e) => setNombreComercial(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Principio Activo
                </label>
                <input
                  type="text"
                  placeholder="Ej.: Amoxicilina"
                  value={principioActivo}
                  onChange={(e) => setPrincipioActivo(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Concentración
                </label>
                <input
                  type="text"
                  placeholder="Ej.: 875 mg / 125 mg"
                  value={concentracion}
                  onChange={(e) => setConcentracion(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Presentación / Envase
                </label>
                <select
                  value={presentacion}
                  onChange={(e) => setPresentacion(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:border-blue-600 outline-none bg-white"
                >
                  {PRESENTACIONES_FRECUENTES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Vía de Administración
                </label>
                <select
                  value={viaDefault}
                  onChange={(e) => setViaDefault(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:border-blue-600 outline-none bg-white"
                >
                  {VIAS_ADMINISTRACION.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Stock Inicial Farmacia
                </label>
                <input
                  type="number"
                  min="1"
                  value={stockInicial}
                  onChange={(e) => setStockInicial(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:border-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Precio Estimado ($CLP)
                </label>
                <input
                  type="number"
                  step="500"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:border-blue-600 outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-md shadow-sm transition-colors flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Guardar e Insertar en Receta
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
