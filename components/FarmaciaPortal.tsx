'use client';

import React, { useState } from 'react';
import {
  Pill,
  Search,
  CheckCircle2,
  Clock,
  PackageCheck,
  AlertTriangle,
  FileDown,
  Building2,
  Plus,
  RefreshCw,
  ShoppingBag,
  UserCheck
} from 'lucide-react';
import { useRecetaStore } from '../lib/store';
import { RecetaDigital, EstadoReceta } from '../lib/types';
import { descargarPDFReceta } from '../lib/pdfGenerator';

export function FarmaciaPortal() {
  const {
    recetas,
    medicamentos,
    farmacias,
    actualizarEstadoReceta,
    despacharReceta,
    ajustarStock
  } = useRecetaStore();

  const [searchCode, setSearchCode] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'recetas' | 'inventario'>('recetas');
  const [filterEstado, setFilterEstado] = useState<string>('todos');
  const [selectedRecetaId, setSelectedRecetaId] = useState<string | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  const farmaciaActual = farmacias[0];

  // Filtrado de recetas
  const recetasFiltradas = recetas.filter(r => {
    const matchSearch =
      r.codigoRX.toLowerCase().includes(searchCode.toLowerCase()) ||
      r.paciente.nombreCompleto.toLowerCase().includes(searchCode.toLowerCase()) ||
      r.paciente.rutOIdentificacion.toLowerCase().includes(searchCode.toLowerCase());

    if (!matchSearch) return false;
    if (filterEstado === 'pendientes') return r.estado === 'EN_FARMACIA' || r.estado === 'PREPARANDO';
    if (filterEstado === 'entregadas') return r.estado === 'ENTREGADA';
    return true;
  });

  const handleDespachar = (recetaId: string, codigoRX: string) => {
    const exito = despacharReceta(recetaId);
    if (exito) {
      setMensajeExito(`¡Receta ${codigoRX} despachada con éxito! El inventario ha sido actualizado.`);
      setTimeout(() => setMensajeExito(null), 4000);
    }
  };

  const handleCambiarEstado = (recetaId: string, estado: EstadoReceta) => {
    actualizarEstadoReceta(recetaId, estado);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6 overflow-x-hidden">
      {/* Banner de la Farmacia Conectada */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-700 text-white flex items-center justify-center shadow-sm">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-900">
                {farmaciaActual.nombre}
              </h1>
              <span className="text-[11px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                Punto de Dispensación Activo
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {farmaciaActual.direccion} • Responsable: {farmaciaActual.responsable} • Email: {farmaciaActual.email}
            </p>
          </div>
        </div>

        {/* Subtabs: Recetas vs Inventario */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => setActiveSubTab('recetas')}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeSubTab === 'recetas'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Bandeja de Recetas ({recetas.length})
          </button>
          <button
            onClick={() => setActiveSubTab('inventario')}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeSubTab === 'inventario'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Inventario & Stock ({medicamentos.length} fármacos)
          </button>
        </div>
      </div>

      {mensajeExito && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-xs font-semibold animate-fade-in shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{mensajeExito}</span>
        </div>
      )}

      {activeSubTab === 'recetas' ? (
        /* VISTA DE BANDEJA DE RECETAS ENTRANTES */
        <div className="space-y-4">
          {/* Barra de Búsqueda por Código de Retiro */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 min-w-[280px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por código de retiro (ej. RX-74921) o nombre del paciente..."
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
              />
            </div>

            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-500 font-medium mr-1">Filtrar:</span>
              <button
                onClick={() => setFilterEstado('todos')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  filterEstado === 'todos' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Todas ({recetas.length})
              </button>
              <button
                onClick={() => setFilterEstado('pendientes')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  filterEstado === 'pendientes' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Por Dispensar
              </button>
              <button
                onClick={() => setFilterEstado('entregadas')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  filterEstado === 'entregadas' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Entregadas
              </button>
            </div>
          </div>

          {/* Listado de Recetas */}
          {recetasFiltradas.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-xl border border-slate-200">
              <Pill className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-700">No se encontraron recetas</h3>
              <p className="text-xs text-slate-500 mt-1">
                {searchCode ? 'Intente con otro código o nombre de paciente.' : 'Aún no hay recetas recibidas en esta farmacia.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recetasFiltradas.map((rec) => {
                const isEntregada = rec.estado === 'ENTREGADA';
                const isPreparando = rec.estado === 'PREPARANDO';

                return (
                  <div
                    key={rec.id}
                    className={`bg-white rounded-xl shadow-xs border transition-all ${
                      isEntregada ? 'border-slate-200 opacity-90' : 'border-blue-200 ring-1 ring-blue-100'
                    }`}
                  >
                    {/* Header de la Receta */}
                    <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-700 text-yellow-300 px-3 py-1.5 rounded-lg font-mono font-extrabold text-sm tracking-wider shadow-xs">
                          {rec.codigoRX}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">
                              {rec.paciente.nombreCompleto}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              RUT: {rec.paciente.rutOIdentificacion}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Emitida el {rec.fechaEmision} por {rec.doctor.nombre}
                          </p>
                        </div>
                      </div>

                      {/* Badge de Estado */}
                      <div className="flex items-center gap-2">
                        {isEntregada ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                            <PackageCheck className="w-3.5 h-3.5" />
                            Entregada y Descontada de Stock
                          </span>
                        ) : isPreparando ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 animate-pulse">
                            <Clock className="w-3.5 h-3.5" />
                            En Preparación por Farmacia
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                            <Clock className="w-3.5 h-3.5" />
                            Recibida por Correo (Pendiente Retiro)
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => descargarPDFReceta(rec)}
                          className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition-colors"
                          title="Descargar copia del PDF enviado por la doctora"
                        >
                          <FileDown className="w-3.5 h-3.5 text-slate-600" />
                          PDF Oficial
                        </button>
                      </div>
                    </div>

                    {/* Detalle de Medicamentos a Dispensar */}
                    <div className="p-4 space-y-3">
                      <div className="text-[11.5px] font-semibold text-slate-600">
                        <strong>Diagnóstico:</strong> {rec.diagnostico}
                      </div>

                      <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-100 text-xs">
                        {rec.items.map((item, idx) => {
                          const medInStock = medicamentos.find(
                            m => m.id === item.medicamentoId || m.nombreComercial === item.nombreMedicamento
                          );
                          const cantRequerida = Number(item.cantidadTotal) || 1;
                          const stockDisponible = medInStock ? medInStock.stockActual : 0;
                          const tieneStock = stockDisponible >= cantRequerida;

                          return (
                            <div key={idx} className="p-3 bg-white flex flex-wrap items-center justify-between gap-3">
                              <div className="flex-1 min-w-[200px]">
                                <div className="font-bold text-slate-900 flex items-center gap-2">
                                  <span>{item.nombreMedicamento}</span>
                                  <span className="text-slate-500 font-normal">({item.presentacion})</span>
                                </div>
                                <p className="text-[11px] text-slate-600 mt-0.5">
                                  <strong>Posología:</strong> {item.dosis} {item.unidadMedida} • {item.frecuencia} • {item.duracionNumero} {item.duracionUnidad}
                                </p>
                                {item.observacionesFarmacia && (
                                  <p className="text-[11px] text-amber-700 font-medium mt-0.5">
                                    Obs. Farmacia: {item.observacionesFarmacia}
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                                    Cant. a entregar: {cantRequerida} un.
                                  </span>
                                  <p className="text-[10.5px] text-slate-500 mt-0.5">
                                    Stock actual: {stockDisponible} un.
                                  </p>
                                </div>

                                <span className={`px-2 py-1 rounded text-[11px] font-bold ${
                                  tieneStock ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {tieneStock ? 'Stock Disponible' : 'Stock Insuficiente'}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Botones de Acción de Farmacia */}
                      {!isEntregada && (
                        <div className="pt-2 flex flex-wrap items-center justify-end gap-2 border-t border-slate-100">
                          {!isPreparando && (
                            <button
                              type="button"
                              onClick={() => handleCambiarEstado(rec.id, 'PREPARANDO')}
                              className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-xl border border-amber-200 transition-colors min-h-[44px] touch-manipulation text-center"
                            >
                              Marcar en Preparación
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDespachar(rec.id, rec.codigoRX)}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-xs transition-all min-h-[48px] touch-manipulation"
                          >
                            <ShoppingBag className="w-4 h-4" />
                            <span>Validar Código y Despachar (Descuenta Stock)</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* VISTA DE CONTROL DE INVENTARIO EN TIEMPO REAL */
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Inventario de Medicamentos - Farmacia
              </h2>
              <p className="text-xs text-slate-500">
                Stock actualizado en tiempo real. Los medicamentos dispensados descuentan unidades automáticamente.
              </p>
            </div>
          </div>

          {/* VISTA MÓVIL: Tarjetas de Medicamentos (block md:hidden) */}
          <div className="block md:hidden p-3.5 space-y-3 bg-slate-50/50">
            {medicamentos.map((med) => {
              const bajoStock = med.stockActual <= med.stockMinimo;
              const agotado = med.stockActual === 0;

              return (
                <div
                  key={med.id}
                  className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          {med.codigo}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 truncate">
                          {med.nombreComercial}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{med.presentacion}</p>
                      <p className="text-[11px] text-slate-400">
                        {med.principioActivo} • Vía: {med.viaAdministracionDefault}
                      </p>
                    </div>

                    <span className={`inline-block font-bold text-xs px-2.5 py-1 rounded-lg flex-shrink-0 ${
                      agotado
                        ? 'bg-red-100 text-red-800'
                        : bajoStock
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-50 text-emerald-800'
                    }`}>
                      {med.stockActual} u.
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="text-[11px]">
                      {agotado ? (
                        <span className="inline-flex items-center gap-1 font-bold text-red-600">
                          <AlertTriangle className="w-3.5 h-3.5" /> Agotado
                        </span>
                      ) : bajoStock ? (
                        <span className="inline-flex items-center gap-1 font-bold text-amber-600">
                          <AlertTriangle className="w-3.5 h-3.5" /> Bajo Stock (&lt;{med.stockMinimo})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Óptimo
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => ajustarStock(med.id, 10)}
                        className="min-h-[38px] px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 active:bg-blue-100 rounded-lg border border-blue-200 transition-colors touch-manipulation"
                        title="Agregar 10 unidades"
                      >
                        +10
                      </button>
                      <button
                        type="button"
                        onClick={() => ajustarStock(med.id, 50)}
                        className="min-h-[38px] px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 active:bg-blue-100 rounded-lg border border-blue-200 transition-colors touch-manipulation"
                        title="Agregar 50 unidades"
                      >
                        +50
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* VISTA DESKTOP: Tabla completa (hidden md:table) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[10.5px]">
                <tr>
                  <th className="px-4 py-3">Código</th>
                  <th className="px-4 py-3">Medicamento & Presentación</th>
                  <th className="px-4 py-3">Principio Activo</th>
                  <th className="px-4 py-3">Vía</th>
                  <th className="px-4 py-3 text-center">Stock Actual</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3 text-right">Acción Reposición</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {medicamentos.map((med) => {
                  const bajoStock = med.stockActual <= med.stockMinimo;
                  const agotado = med.stockActual === 0;

                  return (
                    <tr key={med.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3 font-mono font-semibold text-slate-500">
                        {med.codigo}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-bold text-slate-900 block">{med.nombreComercial}</span>
                        <span className="text-slate-500 text-[11px]">{med.presentacion}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {med.principioActivo}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {med.viaAdministracionDefault}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-block font-bold text-xs px-2.5 py-1 rounded-md ${
                          agotado
                            ? 'bg-red-100 text-red-800'
                            : bajoStock
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-50 text-emerald-800'
                        }`}>
                          {med.stockActual} unidades
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {agotado ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600">
                            <AlertTriangle className="w-3.5 h-3.5" /> Agotado
                          </span>
                        ) : bajoStock ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600">
                            <AlertTriangle className="w-3.5 h-3.5" /> Bajo Stock (&lt;{med.stockMinimo})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Óptimo
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => ajustarStock(med.id, 10)}
                            className="px-2.5 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition-colors"
                            title="Agregar 10 unidades al stock"
                          >
                            +10
                          </button>
                          <button
                            type="button"
                            onClick={() => ajustarStock(med.id, 50)}
                            className="px-2.5 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition-colors"
                            title="Agregar 50 unidades al stock"
                          >
                            +50
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
