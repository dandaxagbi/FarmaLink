'use client';

import React from 'react';
import {
  FileText,
  Building2,
  Users,
  Pill,
  MessageSquare,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Phone,
  MapPin,
  X
} from 'lucide-react';
import { useRecetaStore } from '../lib/store';

export type TabType = 'receta' | 'centro_medico' | 'pacientes' | 'farmacia' | 'paciente_portal';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({
  activeTab,
  setActiveTab,
  isOpenMobile = false,
  onCloseMobile
}: SidebarProps) {
  const { centroMedico, recetas, pacientes } = useRecetaStore();

  const pendientesFarmacia = recetas.filter(
    r => r.estado === 'EN_FARMACIA' || r.estado === 'PREPARANDO'
  ).length;

  const navItems = [
    {
      id: 'receta' as TabType,
      label: 'Receta Digital',
      subtitle: 'Prescripción & CIE-11',
      icon: FileText,
      badge: null,
      badgeColor: ''
    },
    {
      id: 'pacientes' as TabType,
      label: 'Pacientes',
      subtitle: `${pacientes.length} registrados`,
      icon: Users,
      badge: pacientes.length > 0 ? pacientes.length : null,
      badgeColor: 'bg-blue-100 text-blue-700'
    },
    {
      id: 'centro_medico' as TabType,
      label: 'Centro Médico',
      subtitle: 'Logo & Especialistas',
      icon: Building2,
      badge: null,
      badgeColor: ''
    },
    {
      id: 'farmacia' as TabType,
      label: 'Portal Farmacia & Stock',
      subtitle: 'Dispensación y despacho',
      icon: Pill,
      badge: pendientesFarmacia > 0 ? pendientesFarmacia : null,
      badgeColor: 'bg-amber-400 text-slate-950 font-bold'
    },
    {
      id: 'paciente_portal' as TabType,
      label: 'Vista Paciente',
      subtitle: 'Notificación WhatsApp',
      icon: MessageSquare,
      badge: null,
      badgeColor: ''
    }
  ];

  return (
    <>
      {/* Overlay para móviles con blur */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-80 max-w-[85vw] bg-white border-r border-slate-200 flex flex-col transition-transform duration-250 ease-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Encabezado del Centro Médico */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-b from-slate-50/80 to-white flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-white border border-slate-200/80 p-1 flex items-center justify-center shadow-xs overflow-hidden flex-shrink-0">
              {centroMedico.logoUrl ? (
                <img
                  src={centroMedico.logoUrl}
                  alt={centroMedico.nombre}
                  className="w-full h-full object-contain"
                />
              ) : (
                <Building2 className="w-6 h-6 text-blue-600" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-bold text-slate-900 truncate tracking-tight">
                {centroMedico.nombre}
              </h2>
              <p className="text-[11px] font-medium text-slate-500 truncate">
                {centroMedico.subtitulo || 'Centro de Especialidades'}
              </p>
              <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Sistema Clínico Activo</span>
              </div>
            </div>
          </div>

          {/* Botón cerrar para móviles (44x44px target) */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden w-11 h-11 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 active:bg-slate-200 transition-colors flex-shrink-0 touch-manipulation"
            aria-label="Cerrar Menú"
            title="Cerrar Menú"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navegación Principal */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
          <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-slate-600 uppercase">
            Módulos del Sistema
          </div>

          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3 py-3 min-h-[48px] rounded-xl text-left transition-all group touch-manipulation ${
                  isActive
                    ? 'bg-blue-700 text-white shadow-xs font-semibold'
                    : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900 active:bg-slate-200'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200/80 group-hover:text-blue-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold leading-tight truncate">
                    {item.label}
                  </div>
                  <div
                    className={`text-[10px] truncate ${
                      isActive ? 'text-blue-100' : 'text-slate-600'
                    }`}
                  >
                    {item.subtitle}
                  </div>
                </div>

                {item.badge !== null && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white text-blue-800' : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {isActive && (
                  <ChevronRight className="w-4 h-4 text-blue-200 ml-auto" />
                )}
              </button>
            );
          })}
        </div>

        {/* Tarjeta de Profesional Médico */}
        <div className="p-3.5 border-t border-slate-200 bg-slate-50/70">
          <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs flex-shrink-0 border border-blue-200">
                {centroMedico.doctor.nombre
                  ? centroMedico.doctor.nombre
                      .replace('Dra.', '')
                      .replace('Dr.', '')
                      .trim()
                      .charAt(0)
                  : 'D'}
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-900 truncate">
                  {centroMedico.doctor.nombre}
                </div>
                <div className="text-[11px] text-blue-700 font-semibold truncate">
                  {centroMedico.doctor.especialidad}
                </div>
                <div className="text-[10px] text-slate-600 truncate">
                  Mat. {centroMedico.doctor.registroMedico}
                </div>
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <button
                onClick={() => {
                  setActiveTab('centro_medico');
                  if (onCloseMobile) onCloseMobile();
                }}
                className="text-blue-700 hover:text-blue-800 font-medium hover:underline text-[11px]"
              >
                Editar Centro / Doctor
              </button>
              <span className="text-[10px] text-slate-600">{centroMedico.ciudad}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
