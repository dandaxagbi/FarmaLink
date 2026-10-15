'use client';

import React, { useState, useRef } from 'react';
import {
  Building2,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Globe,
  UserCheck,
  Stethoscope,
  RotateCcw,
  Save,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { useRecetaStore } from '../lib/store';
import { CentroMedico } from '../lib/types';

export function CentroMedicoView() {
  const { centroMedico, actualizarCentroMedico } = useRecetaStore();

  const [formData, setFormData] = useState<CentroMedico>({ ...centroMedico });
  const [logoPreview, setLogoPreview] = useState<string>(centroMedico.logoUrl);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sincronizar si cambia el store
  React.useEffect(() => {
    setFormData({ ...centroMedico });
    setLogoPreview(centroMedico.logoUrl);
  }, [centroMedico]);

  const handleInputChange = (field: keyof CentroMedico, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDoctorChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      doctor: {
        ...prev.doctor,
        [field]: value
      }
    }));
  };

  const handleFileProcess = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor seleccione un archivo de imagen válido (PNG, JPG, SVG o WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = e => {
      const result = e.target?.result as string;
      if (result) {
        setLogoPreview(result);
        setFormData(prev => ({
          ...prev,
          logoUrl: result
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRestablecerLogoAndar = () => {
    const logoOriginal = '/logo_andar.png';
    setLogoPreview(logoOriginal);
    setFormData(prev => ({
      ...prev,
      logoUrl: logoOriginal
    }));
  };

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    actualizarCentroMedico({
      ...formData,
      logoUrl: logoPreview
    });

    setToastMessage('¡Información del Centro Médico y Especialista actualizada correctamente!');
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 overflow-x-hidden">
      {/* Toast de confirmación */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 p-4 bg-emerald-600 text-white rounded-xl shadow-lg flex items-center gap-3 animate-fade-in text-sm font-semibold">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header de la sección */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-blue-700 font-semibold text-xs uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>Módulo Institucional</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Gestión del Centro Médico
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Configure la identidad institucional, suba el logotipo oficial y actualice los datos del especialista prescriptor para las recetas y documentos PDF.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGuardar}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm shadow-sm transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Guardar Cambios</span>
        </button>
      </div>

      <form onSubmit={handleGuardar} className="space-y-8">
        {/* Tarjeta 1: Logotipo e Identidad Visual */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ImageIcon className="w-5 h-5 text-blue-700" />
              <h2 className="text-base font-bold text-slate-900">
                Logotipo e Identidad Visual
              </h2>
            </div>
            <span className="text-xs text-slate-500">Visible en Navbar y PDF Oficial</span>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Previsualización del Logo */}
              <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <div className="w-44 h-28 bg-white rounded-lg p-2 border border-slate-200 shadow-xs flex items-center justify-center overflow-hidden mb-3">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Logotipo del Centro"
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <span className="text-xs text-slate-400">Sin logotipo</span>
                  )}
                </div>
                <span className="text-xs font-semibold text-slate-700">
                  Vista Previa en Receta
                </span>
                <span className="text-[11px] text-slate-400">
                  Fondo blanco o transparente recomendado
                </span>
              </div>

              {/* Zona de Subida / Drag & Drop */}
              <div className="md:col-span-8 space-y-4">
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-blue-600 bg-blue-50/60'
                      : 'border-slate-300 hover:border-blue-500 hover:bg-slate-50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 mx-auto flex items-center justify-center mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-slate-800">
                    Arrastra el nuevo logotipo aquí o haz clic para examinar
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Formatos soportados: PNG, JPG, WebP o SVG (máx. 5 MB)
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={handleRestablecerLogoAndar}
                    className="inline-flex items-center gap-1.5 text-xs text-blue-700 hover:text-blue-800 font-semibold hover:underline"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Restablecer logotipo oficial Centro Andar
                  </button>

                  <span className="text-xs text-slate-400">
                    Se guarda localmente para impresión digital
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tarjeta 2: Datos Institucionales y Ubicación */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-200 flex items-center gap-2.5">
            <Building2 className="w-5 h-5 text-blue-700" />
            <h2 className="text-base font-bold text-slate-900">
              Datos Institucionales y Ubicación
            </h2>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nombre del Centro Médico *
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={e => handleInputChange('nombre', e.target.value)}
                placeholder="Ej. Centro Andar"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Especialidad / Subtítulo Institucional
              </label>
              <input
                type="text"
                value={formData.subtitulo || ''}
                onChange={e => handleInputChange('subtitulo', e.target.value)}
                placeholder="Ej. Pie Diabético e Infectología"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent font-medium"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Dirección Física Completa *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={formData.direccion}
                  onChange={e => handleInputChange('direccion', e.target.value)}
                  placeholder="Calle, Número, Edificio, Oficina"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Ciudad
              </label>
              <input
                type="text"
                value={formData.ciudad}
                onChange={e => handleInputChange('ciudad', e.target.value)}
                placeholder="Ej. Cochabamba"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                País
              </label>
              <input
                type="text"
                value={formData.pais}
                onChange={e => handleInputChange('pais', e.target.value)}
                placeholder="Ej. Bolivia"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Teléfono Fijo / Central
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={formData.telefono}
                  onChange={e => handleInputChange('telefono', e.target.value)}
                  placeholder="+591 4 458 9200"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                WhatsApp Institucional *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={formData.whatsapp}
                  onChange={e => handleInputChange('whatsapp', e.target.value)}
                  placeholder="+591 76258575"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Correo Electrónico de Contacto *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => handleInputChange('email', e.target.value)}
                  placeholder="contacto@centroandar.bo"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Horario de Atención
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={formData.horarioAtencion || ''}
                  onChange={e => handleInputChange('horarioAtencion', e.target.value)}
                  placeholder="Lunes a Viernes 08:30 - 18:30"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tarjeta 3: Profesional Prescriptor Responsable */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Stethoscope className="w-5 h-5 text-blue-700" />
              <h2 className="text-base font-bold text-slate-900">
                Profesional de Salud Prescriptor
              </h2>
            </div>
            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Datos oficiales para emisión de recetas
            </span>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nombre y Título del Médico *
              </label>
              <input
                type="text"
                value={formData.doctor.nombre}
                onChange={e => handleDoctorChange('nombre', e.target.value)}
                placeholder="Ej. Dra. Oriela Iriarte"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Especialidad Médica *
              </label>
              <input
                type="text"
                value={formData.doctor.especialidad}
                onChange={e => handleDoctorChange('especialidad', e.target.value)}
                placeholder="Ej. Infectología"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Matrícula / Registro Profesional *
              </label>
              <input
                type="text"
                value={formData.doctor.registroMedico}
                onChange={e => handleDoctorChange('registroMedico', e.target.value)}
                placeholder="Ej. MP-74921-BO"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Teléfono Médico Directo
              </label>
              <input
                type="text"
                value={formData.doctor.telefono}
                onChange={e => handleDoctorChange('telefono', e.target.value)}
                placeholder="+591 76258575"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Email Profesional del Médico
              </label>
              <input
                type="email"
                value={formData.doctor.email}
                onChange={e => handleDoctorChange('email', e.target.value)}
                placeholder="dra.oriela.iriarte@centroandar.bo"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Barra de Acciones Inferior */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Configuración del Centro</span>
          </button>
        </div>
      </form>
    </div>
  );
}
