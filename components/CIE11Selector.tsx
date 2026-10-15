'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  BookOpen,
  Check,
  ChevronDown,
  X,
  Sparkles,
  Info,
  Tag
} from 'lucide-react';
import {
  CIE11Item,
  CIE11_CAPITULOS,
  CIE11_DATABASE,
  buscarCIE11
} from '../lib/cie11Data';

interface CIE11SelectorProps {
  value: string;
  onChange: (diagnosticoCompleto: string, codigo?: string) => void;
}

export function CIE11Selector({ value, onChange }: CIE11SelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [capituloSeleccionado, setCapituloSeleccionado] = useState<number | undefined>(undefined);
  const [soloFrecuentes, setSoloFrecuentes] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputSearchRef = useRef<HTMLInputElement>(null);

  // Cerrar dropdown si se hace clic afuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Autofocus en el buscador al abrir
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputSearchRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  let resultados = buscarCIE11(searchTerm, capituloSeleccionado);
  if (soloFrecuentes) {
    resultados = resultados.filter(r => r.esFrecuente);
  }

  const handleSelect = (item: CIE11Item) => {
    const format = `[${item.codigo}] ${item.titulo}`;
    onChange(format, item.codigo);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Contenedor del campo con estética de la imagen original */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="field-container cursor-pointer"
      >
        <label className="field-label flex items-center gap-1.5">
          <span>Diagnóstico</span>
          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1 rounded border border-blue-200">
            CIE-11
          </span>
        </label>

        <div className="field-input flex items-center justify-between text-slate-800 pr-9 bg-white select-none">
          {value ? (
            <div className="flex items-center gap-2 truncate">
              <span className="font-semibold text-slate-900 truncate">
                {value}
              </span>
            </div>
          ) : (
            <span className="text-slate-400 text-xs">
              Seleccione el diagnóstico (CIE-11)
            </span>
          )}

          <div className="flex items-center gap-1">
            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors mr-1"
                title="Limpiar diagnóstico"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </div>

      {/* Popover Desplegable del Buscador CIE-11 */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-fade-in text-xs max-h-[480px] flex flex-col">
          {/* Barra de Búsqueda */}
          <div className="p-3 bg-slate-50 border-b border-slate-200 space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                ref={inputSearchRef}
                type="text"
                placeholder="Buscar por código (ej. CA01, BA00) o enfermedad (ej. faringitis, asma, diabetes)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-white text-xs text-slate-800 border border-slate-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filtros Rápidos de Capítulos */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
              <button
                type="button"
                onClick={() => { setCapituloSeleccionado(undefined); setSoloFrecuentes(false); }}
                className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                  capituloSeleccionado === undefined && !soloFrecuentes
                    ? 'bg-blue-700 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Todos ({CIE11_DATABASE.length})
              </button>

              <button
                type="button"
                onClick={() => { setSoloFrecuentes(!soloFrecuentes); setCapituloSeleccionado(undefined); }}
                className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
                  soloFrecuentes
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                Más frecuentes
              </button>

              <button
                type="button"
                onClick={() => setCapituloSeleccionado(12)}
                className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                  capituloSeleccionado === 12
                    ? 'bg-blue-700 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Respiratorio (Cap. 12)
              </button>

              <button
                type="button"
                onClick={() => setCapituloSeleccionado(11)}
                className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                  capituloSeleccionado === 11
                    ? 'bg-blue-700 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Circulatorio (Cap. 11)
              </button>

              <button
                type="button"
                onClick={() => setCapituloSeleccionado(5)}
                className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                  capituloSeleccionado === 5
                    ? 'bg-blue-700 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Metabólico (Cap. 05)
              </button>

              <button
                type="button"
                onClick={() => setCapituloSeleccionado(13)}
                className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                  capituloSeleccionado === 13
                    ? 'bg-blue-700 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Digestivo (Cap. 13)
              </button>

              <button
                type="button"
                onClick={() => setCapituloSeleccionado(15)}
                className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                  capituloSeleccionado === 15
                    ? 'bg-blue-700 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Musculoesquelético (Cap. 15)
              </button>
            </div>
          </div>

          {/* Listado de Resultados CIE-11 */}
          <div className="overflow-y-auto flex-1 divide-y divide-slate-100 p-1">
            {resultados.length === 0 ? (
              <div className="p-6 text-center text-slate-500">
                <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="font-semibold text-slate-700">No se encontraron diagnósticos CIE-11</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Pruebe buscando con otra palabra o código médico.
                </p>
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => {
                      onChange(searchTerm);
                      setIsOpen(false);
                    }}
                    className="mt-3 px-3 py-1.5 text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 font-semibold"
                  >
                    Usar texto libre: &ldquo;{searchTerm}&rdquo;
                  </button>
                )}
              </div>
            ) : (
              resultados.map((item) => {
                const isSelected = value.includes(item.codigo);

                return (
                  <div
                    key={item.codigo}
                    onClick={() => handleSelect(item)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-blue-50/80 text-blue-900 font-semibold'
                        : 'hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                          {item.codigo}
                        </span>
                        <span className="text-xs font-bold text-slate-900">
                          {item.titulo}
                        </span>
                        {item.esFrecuente && (
                          <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded font-semibold border border-amber-200">
                            Frecuente
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-500">
                        {item.capituloNombre} (Cap. {item.capituloNumero})
                      </p>

                      {item.sinonimos && item.sinonimos.length > 0 && (
                        <p className="text-[10.5px] text-slate-400 mt-0.5">
                          <span className="font-medium text-slate-500">Alias:</span> {item.sinonimos.join(', ')}
                        </p>
                      )}
                    </div>

                    {isSelected && (
                      <Check className="w-4 h-4 text-blue-700 flex-shrink-0 mt-1" />
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer del Selector */}
          <div className="px-3.5 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-blue-600" />
              Estándar Oficial OMS / OPS CIE-11 (MMS)
            </span>
            <span>{resultados.length} resultados encontrados</span>
          </div>
        </div>
      )}
    </div>
  );
}
