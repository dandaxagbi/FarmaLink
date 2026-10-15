'use client';

import React from 'react';
import { Menu, Building2, Users, FileText, Pill, MessageSquare, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useRecetaStore } from '../lib/store';
import { TabType } from './Sidebar';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenMobileMenu?: () => void;
}

export function Navbar({ activeTab, setActiveTab, onOpenMobileMenu }: NavbarProps) {
  const { centroMedico, pacienteActivo, pacientes, recetas } = useRecetaStore();

  const titulosPorTab: Record<TabType, { titulo: string; desc: string }> = {
    receta: {
      titulo: 'Emisión de Receta Digital',
      desc: 'Formulario clínico con CIE-11 y despacho a farmacia'
    },
    pacientes: {
      titulo: 'Directorio de Pacientes',
      desc: `${pacientes.length} pacientes registrados con historial y alergias`
    },
    centro_medico: {
      titulo: 'Configuración del Centro Médico',
      desc: 'Logotipo, ubicación, contactos y médico especialista'
    },
    farmacia: {
      titulo: 'Portal de Farmacia & Stock',
      desc: 'Dispensación y control de inventario de medicamentos'
    },
    paciente_portal: {
      titulo: 'Vista del Paciente / WhatsApp',
      desc: 'Simulación de notificación móvil y verificación de código RX'
    }
  };

  const { titulo, desc } = titulosPorTab[activeTab] || titulosPorTab.receta;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-3">
        {/* Izquierda: Botón Móvil + Información del Módulo Actual */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="lg:hidden w-11 h-11 flex items-center justify-center rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-200 transition-colors touch-manipulation"
            aria-label="Abrir Menú de Navegación Lateral"
            title="Abrir Menú Lateral"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-tight truncate">
                {titulo}
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                En Línea
              </span>
            </div>
            <p className="text-xs text-slate-500 truncate hidden sm:block">
              {desc}
            </p>
          </div>
        </div>

        {/* Derecha: Resumen de Centro Médico y Doctor */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 p-1 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-2xs">
              {centroMedico.logoUrl ? (
                <img
                  src={centroMedico.logoUrl}
                  alt={centroMedico.nombre}
                  className="w-full h-full object-contain"
                />
              ) : (
                <Building2 className="w-4 h-4 text-blue-700" />
              )}
            </div>

            <div className="border-l border-slate-200 pl-3 hidden md:block text-right">
              <div className="text-xs font-bold text-slate-900 tracking-tight leading-tight">
                {centroMedico.nombre}
              </div>
              <p className="text-[11px] text-slate-600 font-medium">
                {centroMedico.doctor.nombre} ({centroMedico.doctor.especialidad})
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
