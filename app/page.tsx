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
  const [activeTab, setActiveTabState] = useState<TabType>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '') as TabType;
      const validTabs: TabType[] = ['receta', 'centro_medico', 'pacientes', 'farmacia', 'paciente_portal'];
      if (validTabs.includes(hash)) return hash;
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab') as TabType;
      if (validTabs.includes(tabParam)) return tabParam;
    }
    return 'receta';
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { centroMedico } = useRecetaStore();

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
    <div className="min-h-screen bg-slate-50 flex">
      {/* Menú Lateral en el lado izquierdo */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Contenedor Principal (con margen izquierdo para el sidebar en desktop) */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        <main className="flex-1 pb-16">
          {activeTab === 'receta' && <RecetaForm />}
          {activeTab === 'pacientes' && (
            <PacientesView onEmitirRecetaPaciente={() => setActiveTab('receta')} />
          )}
          {activeTab === 'centro_medico' && <CentroMedicoView />}
          {activeTab === 'farmacia' && <FarmaciaPortal />}
          {activeTab === 'paciente_portal' && <PacienteView />}
        </main>

        <footer className="bg-white border-t border-slate-200 py-3.5 px-6 text-center text-xs text-slate-500">
          <p>
            {centroMedico.nombre} • {centroMedico.subtitulo || 'Pie Diabético e Infectología'}
          </p>
        </footer>
      </div>
    </div>
  );
}
