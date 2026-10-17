'use client';

import React, { useState } from 'react';
import { Sidebar, TabType } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { RecetaForm } from '../components/RecetaForm';
import { CentroMedicoView } from '../components/CentroMedicoView';
import { PacientesView } from '../components/PacientesView';
import { FarmaciaPortal } from '../components/FarmaciaPortal';
import { PacienteView } from '../components/PacienteView';
import { useRecetaStore } from '../lib/store';

export default function HomePage() {
  const [activeTab, setActiveTabState] = useState<TabType>('receta');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { centroMedico, recetas, pacientes } = useRecetaStore();
  const pendientesFarmacia = recetas.filter(
    r => r.estado === 'EN_FARMACIA' || r.estado === 'PREPARANDO'
  ).length;

  const setActiveTab = (tab: TabType) => {
    setActiveTabState(tab);
    if (typeof window !== 'undefined') {
      window.location.hash = tab;
    }
  };

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '') as TabType;
      const validTabs: TabType[] = ['receta', 'centro_medico', 'pacientes', 'farmacia', 'paciente_portal'];
      if (validTabs.includes(hash)) {
        setActiveTabState(hash);
      }

      const handleHashChange = () => {
        const newHash = window.location.hash.replace('#', '') as TabType;
        if (validTabs.includes(newHash)) {
          setActiveTabState(newHash);
        }
      };

      window.addEventListener('hashchange', handleHashChange);
      return () => window.removeEventListener('hashchange', handleHashChange);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex w-full max-w-full overflow-x-hidden">
      {/* Menú Lateral en el lado izquierdo */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Contenedor Principal (con margen izquierdo para el sidebar en desktop) */}
      <div className="flex-1 w-full min-w-0 max-w-full lg:pl-72 flex flex-col min-h-screen overflow-x-hidden">
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        <main className="flex-1 w-full min-w-0 max-w-full pb-40 lg:pb-16 overflow-x-hidden">
          {activeTab === 'receta' && <RecetaForm />}
          {activeTab === 'pacientes' && (
            <PacientesView onEmitirRecetaPaciente={() => setActiveTab('receta')} />
          )}
          {activeTab === 'centro_medico' && <CentroMedicoView />}
          {activeTab === 'farmacia' && <FarmaciaPortal />}
          {activeTab === 'paciente_portal' && <PacienteView />}
        </main>

        <footer className="hidden lg:block bg-white border-t border-slate-200 py-3.5 px-6 text-center text-xs text-slate-500">
          <p>
            {centroMedico.nombre} • {centroMedico.subtitulo || 'Pie Diabético e Infectología'}
          </p>
        </footer>

        {/* Barra de Navegación Inferior Móvil (Zona Ergonómica del Pulgar - Steven Hoober / NN Group) */}
        <nav
          aria-label="Navegación Móvil Rápida"
          className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 lg:hidden flex items-stretch justify-around px-1 py-1 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] safe-area-bottom w-full max-w-full"
        >
          {/* Receta */}
          <button
            id="mobile-nav-receta"
            type="button"
            onClick={() => setActiveTab('receta')}
            aria-label="Ir a Receta Digital"
            className={`flex-1 flex flex-col items-center justify-center py-1 px-1 min-h-[48px] rounded-xl transition-colors relative tap-press focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none ${
              activeTab === 'receta'
                ? 'text-blue-700 font-bold'
                : 'text-slate-500 hover:text-slate-900 active:bg-slate-100'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-all ${activeTab === 'receta' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'}`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-[11px] font-semibold mt-0.5 tracking-tight">Receta</span>
          </button>

          {/* Pacientes */}
          <button
            id="mobile-nav-pacientes"
            type="button"
            onClick={() => setActiveTab('pacientes')}
            aria-label="Ir a Directorio de Pacientes"
            className={`flex-1 flex flex-col items-center justify-center py-1 px-1 min-h-[48px] rounded-xl transition-colors relative tap-press focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none ${
              activeTab === 'pacientes'
                ? 'text-blue-700 font-bold'
                : 'text-slate-500 hover:text-slate-900 active:bg-slate-100'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-all relative ${activeTab === 'pacientes' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'}`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {pacientes.length > 0 && (
                <span className={`absolute -top-1 -right-1 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white tabular-nums ${
                  activeTab === 'pacientes' ? 'bg-amber-400 text-slate-950' : 'bg-blue-600 text-white'
                }`}>
                  {pacientes.length}
                </span>
              )}
            </div>
            <span className="text-[11px] font-semibold mt-0.5 tracking-tight">Pacientes</span>
          </button>

          {/* Farmacia */}
          <button
            id="mobile-nav-farmacia"
            type="button"
            onClick={() => setActiveTab('farmacia')}
            aria-label="Ir a Portal de Farmacia y Stock"
            className={`flex-1 flex flex-col items-center justify-center py-1 px-1 min-h-[48px] rounded-xl transition-colors relative tap-press focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none ${
              activeTab === 'farmacia'
                ? 'text-blue-700 font-bold'
                : 'text-slate-500 hover:text-slate-900 active:bg-slate-100'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-all relative ${activeTab === 'farmacia' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'}`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              {pendientesFarmacia > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse border-2 border-white tabular-nums">
                  {pendientesFarmacia}
                </span>
              )}
            </div>
            <span className="text-[11px] font-semibold mt-0.5 tracking-tight">Farmacia</span>
          </button>

          {/* WhatsApp / Paciente */}
          <button
            id="mobile-nav-whatsapp"
            type="button"
            onClick={() => setActiveTab('paciente_portal')}
            aria-label="Ir a Vista de Paciente y WhatsApp"
            className={`flex-1 flex flex-col items-center justify-center py-1 px-1 min-h-[48px] rounded-xl transition-colors relative tap-press focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none ${
              activeTab === 'paciente_portal'
                ? 'text-emerald-700 font-bold'
                : 'text-slate-500 hover:text-slate-900 active:bg-slate-100'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-all ${activeTab === 'paciente_portal' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600'}`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <span className="text-[11px] font-semibold mt-0.5 tracking-tight">WhatsApp</span>
          </button>

          {/* Menú Lateral */}
          <button
            id="mobile-nav-menu"
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Abrir Menú de Navegación Lateral"
            className="flex-1 flex flex-col items-center justify-center py-1 px-1 min-h-[48px] rounded-xl text-slate-500 hover:text-slate-900 active:bg-slate-100 transition-colors tap-press focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none"
          >
            <div className="p-1.5 rounded-xl text-slate-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </div>
            <span className="text-[11px] font-semibold mt-0.5 tracking-tight">Menú</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
