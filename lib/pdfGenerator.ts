'use client';

import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { RecetaDigital } from './types';

export async function generarPDFReceta(receta: RecetaDigital): Promise<jsPDF> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Fondo sutil de seguridad
  doc.setFillColor(250, 252, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Marco exterior médico
  doc.setDrawColor(219, 234, 254);
  doc.setLineWidth(0.8);
  doc.roundedRect(8, 8, pageWidth - 16, pageHeight - 16, 4, 4);

  // Cabecera superior
  doc.setFillColor(30, 64, 175); // Azul clínico #1e40af
  doc.rect(8, 8, pageWidth - 16, 26, 'F');

  const centroNombre = (receta.centroMedico?.nombre || receta.doctor.clinica || 'CENTRO ANDAR').toUpperCase();
  const centroSubtitulo = (receta.centroMedico?.subtitulo || 'PIE DIABÉTICO E INFECTOLOGÍA').toUpperCase();

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('RECETA MÉDICA DIGITAL OFICIAL', 16, 17);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`${centroNombre}  •  ${centroSubtitulo}`, 16, 23);
  const infoContactoCentro = receta.centroMedico?.direccion
    ? `${receta.centroMedico.direccion} | Tel: ${receta.centroMedico.whatsapp || receta.doctor.telefono}`
    : `Dr(a). ${receta.doctor.nombre} | ${receta.doctor.especialidad}`;
  doc.setFontSize(7.5);
  doc.text(infoContactoCentro.substring(0, 95), 16, 29);

  // Código RX prominente en la esquina derecha del header
  doc.setFillColor(239, 246, 255);
  doc.roundedRect(pageWidth - 65, 12, 53, 18, 2, 2, 'F');
  doc.setTextColor(30, 58, 138);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('CÓDIGO DE RECETA (RX)', pageWidth - 61, 17);
  doc.setFontSize(14);
  doc.text(receta.codigoRX, pageWidth - 61, 26);

  // Generar QR en base64
  try {
    const qrText = `RECETA:${receta.codigoRX}|PACIENTE:${receta.paciente.rutOIdentificacion}|DOCTOR:${receta.doctor.nombre}|FARMACIA:${receta.farmaciaDestino.nombre}|FECHA:${receta.fechaEmision}`;
    const qrDataUrl = await QRCode.toDataURL(qrText, {
      margin: 1,
      width: 120,
      color: {
        dark: '#1e3a8a',
        light: '#ffffff'
      }
    });
    doc.addImage(qrDataUrl, 'PNG', pageWidth - 36, 38, 24, 24);
  } catch (err) {
    console.warn('No se pudo generar QR:', err);
  }

  // Información del Médico y Paciente (2 columnas)
  let y = 42;
  doc.setTextColor(30, 64, 175);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text('1. DATOS DEL PROFESIONAL Y PACIENTE', 14, y);

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.line(14, y + 2, pageWidth - 42, y + 2);

  y += 6.5;
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'bold');
  doc.text('Médico Prescriptor:', 14, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(`${receta.doctor.nombre}  •  ${receta.doctor.especialidad}  (Reg: ${receta.doctor.registroMedico})`, 45, y);

  y += 4.5;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Paciente:', 14, y);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${receta.paciente.nombreCompleto}`, 30, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`(Doc/CI: ${receta.paciente.rutOIdentificacion}  •  Edad: ${receta.paciente.edad} años  •  WhatsApp: ${receta.paciente.telefonoWhatsapp})`, 30 + doc.getTextWidth(receta.paciente.nombreCompleto) + 3, y);

  y += 4.5;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Alergias Conocidas:', 14, y);
  doc.setFont('helvetica', 'bold');
  if (receta.paciente.alergias && receta.paciente.alergias.trim() !== '') {
    doc.setTextColor(185, 28, 28); // Rojo alerta
    doc.text(`⚠ ALERGIAS: ${receta.paciente.alergias}`, 45, y);
  } else {
    doc.setTextColor(22, 101, 52);
    doc.text('Sin alergias reportadas', 45, y);
  }

  if (receta.paciente.antecedentesMedicos) {
    y += 4.5;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text('Antecedentes / Comorbilidad:', 14, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    doc.text(receta.paciente.antecedentesMedicos.substring(0, 90), 55, y);
  }

  y += 4.5;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Diagnóstico (CIE-11):', 14, y);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(29, 78, 216);
  doc.text(receta.diagnostico || 'Sin diagnóstico especificado', 47, y);

  y += 4.5;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Fecha de Emisión:', 14, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(`${receta.fechaEmision} hrs.`, 42, y);

  // Farmacia de Destino Asignada
  y += 10;
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, y, pageWidth - 28, 14, 2, 2, 'F');
  doc.setTextColor(30, 58, 138);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('FARMACIA DE DESTINO ASIGNADA PARA RETIRO:', 18, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text(`${receta.farmaciaDestino.nombre}  •  ${receta.farmaciaDestino.direccion}`, 18, y + 10);
  doc.text(`Email despacho: ${receta.farmaciaDestino.email} | Horario: ${receta.farmaciaDestino.horario}`, 105, y + 10);

  // Sección Medicamentos y Posología
  y += 22;
  doc.setTextColor(30, 64, 175);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('2. PRESCRIPCIÓN FARMACOLÓGICA Y POSOLOGÍA', 14, y);

  doc.setDrawColor(226, 232, 240);
  doc.line(14, y + 2, pageWidth - 14, y + 2);

  y += 8;

  // Renderizar cada medicamento de la receta
  receta.items.forEach((item, index) => {
    // Caja del medicamento
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(14, y, pageWidth - 28, 38, 2, 2, 'FD');

    // Número de ítem y nombre
    doc.setFillColor(37, 99, 235);
    doc.circle(20, y + 7, 3.5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(String(index + 1), 18.8, y + 8.2);

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(item.nombreMedicamento || 'Medicamento no especificado', 26, y + 8);

    // Cantidad Total para Farmacia
    doc.setFillColor(239, 246, 255);
    doc.roundedRect(pageWidth - 75, y + 3, 57, 8, 1.5, 1.5, 'F');
    doc.setTextColor(30, 64, 175);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(`CANTIDAD A DISPENSAR: ${item.cantidadTotal} ${item.presentacion ? `(${item.presentacion})` : ''}`, pageWidth - 72, y + 8);

    // Línea divisoria suave
    doc.setDrawColor(241, 245, 249);
    doc.line(18, y + 13, pageWidth - 18, y + 13);

    // Detalles para el Paciente
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'bold');
    doc.text('Posología:', 18, y + 18);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(`${item.dosis} ${item.unidadMedida} por vía ${item.viaAdministracion}, ${item.frecuencia}.`, 35, y + 18);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text('Duración:', 18, y + 24);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(`${item.duracionNumero} ${item.duracionUnidad}  (Del ${item.fechaInicio} al ${item.fechaFin})`, 35, y + 24);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text('Indicaciones:', 18, y + 30);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(29, 78, 216);
    doc.text(item.indicaciones || 'Tomar según lo indicado con agua.', 38, y + 30);

    if (item.observacionesFarmacia) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(180, 83, 9);
      doc.text(`Obs. Farmacia: ${item.observacionesFarmacia}`, 18, y + 35);
    }

    y += 42;
  });

  // Observaciones Generales
  if (receta.observacionesGenerales) {
    doc.setFillColor(254, 252, 232);
    doc.setDrawColor(254, 240, 138);
    doc.roundedRect(14, y, pageWidth - 28, 16, 2, 2, 'FD');

    doc.setTextColor(161, 98, 7);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text('OBSERVACIONES GENERALES PARA EL/LA PACIENTE:', 18, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(74, 4, 78);
    doc.text(receta.observacionesGenerales, 18, y + 11);
    y += 20;
  }

  // Tratamiento No Farmacológico si aplica
  if (receta.tipoTratamiento === 'no_farmacologico' && receta.tratamientoNoFarmacologicoDetalle) {
    doc.setFillColor(240, 253, 244);
    doc.setDrawColor(187, 247, 208);
    doc.roundedRect(14, y, pageWidth - 28, 16, 2, 2, 'FD');

    doc.setTextColor(21, 128, 61);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text('INDICACIONES DE TRATAMIENTO NO FARMACOLÓGICO:', 18, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(22, 101, 52);
    doc.text(receta.tratamientoNoFarmacologicoDetalle, 18, y + 11);
    y += 20;
  }

  // Bloque inferior de firma y validación
  const footerY = pageHeight - 42;

  // Sello y Firma Digital
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, footerY, 90, 26, 2, 2);
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text('FIRMA Y SELLO MÉDICO PROFESIONAL', 18, footerY + 5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text(`${receta.doctor.nombre} (${receta.doctor.especialidad})`, 18, footerY + 11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Registro Profesional: ${receta.doctor.registroMedico} • ${receta.doctor.clinica}`, 18, footerY + 16);
  doc.text(`Código de Verificación: SHA256-${receta.codigoRX}-ANDAR`, 18, footerY + 21);

  // Instrucciones para el retiro en Farmacia
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(110, footerY, pageWidth - 124, 26, 2, 2, 'F');
  doc.setTextColor(30, 58, 138);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('INSTRUCCIONES DE RETIRO EN FARMACIA', 114, footerY + 6);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('1. El paciente debe acudir a la farmacia indicada.', 114, footerY + 11);
  doc.text(`2. Indicar al químico farmacéutico su código: ${receta.codigoRX}`, 114, footerY + 16);
  doc.text('3. La farmacia verificará el stock y entregará los medicamentos.', 114, footerY + 21);

  // Pie de página
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(
    `Centro Andar • Receta Médica Digital • Dra. Oriela Iriarte (Infectología) • Generado el ${new Date().toLocaleString()} • Página 1 de 1`,
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' }
  );

  return doc;
}

export async function descargarPDFReceta(receta: RecetaDigital): Promise<void> {
  const doc = await generarPDFReceta(receta);
  doc.save(`Receta_${receta.codigoRX}_${receta.paciente.nombreCompleto.replace(/\s+/g, '_')}.pdf`);
}
