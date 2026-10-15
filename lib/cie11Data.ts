export interface CIE11Item {
  codigo: string;
  titulo: string;
  capituloNumero: number;
  capituloNombre: string;
  descripcion?: string;
  sinonimos?: string[];
  esFrecuente?: boolean;
}

export interface CIE11Capitulo {
  numero: number;
  codigoBloque: string;
  nombre: string;
}

export const CIE11_CAPITULOS: CIE11Capitulo[] = [
  { numero: 1, codigoBloque: '01', nombre: 'Ciertas enfermedades infecciosas o parasitarias' },
  { numero: 2, codigoBloque: '02', nombre: 'Neoplasias' },
  { numero: 3, codigoBloque: '03', nombre: 'Enfermedades de la sangre o de los órganos hematopoyéticos' },
  { numero: 4, codigoBloque: '04', nombre: 'Enfermedades del sistema inmunitario' },
  { numero: 5, codigoBloque: '05', nombre: 'Enfermedades endocrinas, nutricionales o metabólicas' },
  { numero: 6, codigoBloque: '06', nombre: 'Trastornos mentales, del comportamiento o del neurodesarrollo' },
  { numero: 7, codigoBloque: '07', nombre: 'Trastornos del ciclo sueño-vigilia' },
  { numero: 8, codigoBloque: '08', nombre: 'Enfermedades del sistema nervioso' },
  { numero: 9, codigoBloque: '09', nombre: 'Enfermedades del sistema visual' },
  { numero: 10, codigoBloque: '10', nombre: 'Enfermedades del oído o de la apófisis mastoides' },
  { numero: 11, codigoBloque: '11', nombre: 'Enfermedades del sistema circulatorio' },
  { numero: 12, codigoBloque: '12', nombre: 'Enfermedades del sistema respiratorio' },
  { numero: 13, codigoBloque: '13', nombre: 'Enfermedades del sistema digestivo' },
  { numero: 14, codigoBloque: '14', nombre: 'Enfermedades de la piel' },
  { numero: 15, codigoBloque: '15', nombre: 'Enfermedades del sistema musculoesquelético o del tejido conectivo' },
  { numero: 16, codigoBloque: '16', nombre: 'Enfermedades del sistema genitourinario' },
  { numero: 17, codigoBloque: '17', nombre: 'Condiciones relacionadas con la salud sexual' },
  { numero: 18, codigoBloque: '18', nombre: 'Embarazo, parto o puerperio' },
  { numero: 21, codigoBloque: '21', nombre: 'Síntomas, signos o hallazgos clínicos no clasificados en otra parte' },
  { numero: 22, codigoBloque: '22', nombre: 'Traumatismos, envenenamientos o consecuencias de causas externas' },
  { numero: 25, codigoBloque: '25', nombre: 'Códigos para situaciones especiales (COVID-19)' }
];

export const CIE11_DATABASE: CIE11Item[] = [
  // Capítulo 12: Aparato Respiratorio
  {
    codigo: 'CA01',
    titulo: 'Faringitis aguda',
    capituloNumero: 12,
    capituloNombre: 'Enfermedades del sistema respiratorio',
    sinonimos: ['Dolor de garganta agudo', 'Infección faríngea', 'Odinofagia aguda'],
    esFrecuente: true
  },
  {
    codigo: 'CA02',
    titulo: 'Amigdalitis aguda',
    capituloNumero: 12,
    capituloNombre: 'Enfermedades del sistema respiratorio',
    sinonimos: ['Tonsilitis aguda', 'Infección de amígdalas', 'Amigdalitis pultácea'],
    esFrecuente: true
  },
  {
    codigo: 'CA05',
    titulo: 'Laringitis o traqueítis aguda',
    capituloNumero: 12,
    capituloNombre: 'Enfermedades del sistema respiratorio',
    sinonimos: ['Disfonía aguda', 'Laringotraqueítis'],
    esFrecuente: false
  },
  {
    codigo: 'CA20',
    titulo: 'Rinosinusitis aguda',
    capituloNumero: 12,
    capituloNombre: 'Enfermedades del sistema respiratorio',
    sinonimos: ['Sinusitis aguda', 'Infección sinusal'],
    esFrecuente: true
  },
  {
    codigo: 'CA23',
    titulo: 'Asma bronquial',
    capituloNumero: 12,
    capituloNombre: 'Enfermedades del sistema respiratorio',
    sinonimos: ['Crisis asmática', 'Hiperreactividad bronquial', 'Broncoespasmo'],
    esFrecuente: true
  },
  {
    codigo: 'CA23.0',
    titulo: 'Asma alérgica',
    capituloNumero: 12,
    capituloNombre: 'Enfermedades del sistema respiratorio',
    sinonimos: ['Asma extrínseca', 'Asma atópica'],
    esFrecuente: true
  },
  {
    codigo: 'CA40',
    titulo: 'Neumonía adquirida en la comunidad',
    capituloNumero: 12,
    capituloNombre: 'Enfermedades del sistema respiratorio',
    sinonimos: ['Infección pulmonar', 'Condensación pulmonar', 'Neumonitis infecciosa'],
    esFrecuente: true
  },
  {
    codigo: 'CA42',
    titulo: 'Bronquitis aguda',
    capituloNumero: 12,
    capituloNombre: 'Enfermedades del sistema respiratorio',
    sinonimos: ['Traqueobronquitis aguda', 'Cuadro bronquial obstructivo agudo'],
    esFrecuente: true
  },
  {
    codigo: '1C62',
    titulo: 'Infección aguda de las vías respiratorias superiores, sitio no especificado',
    capituloNumero: 1,
    capituloNombre: 'Ciertas enfermedades infecciosas o parasitarias',
    sinonimos: ['Resfriado común', 'Rinofaringitis viral', 'Cuadro catarral agudo'],
    esFrecuente: true
  },
  {
    codigo: '1E30',
    titulo: 'Gripe por virus de la influenza identificado',
    capituloNumero: 1,
    capituloNombre: 'Ciertas enfermedades infecciosas o parasitarias',
    sinonimos: ['Influenza A', 'Influenza B', 'Gripe estacional'],
    esFrecuente: true
  },

  // Capítulo 11: Sistema Circulatorio
  {
    codigo: 'BA00',
    titulo: 'Hipertensión arterial esencial',
    capituloNumero: 11,
    capituloNombre: 'Enfermedades del sistema circulatorio',
    sinonimos: ['Hipertensión primaria', 'Presión arterial alta', 'HTA'],
    esFrecuente: true
  },
  {
    codigo: 'BA01',
    titulo: 'Hipertensión arterial secundaria',
    capituloNumero: 11,
    capituloNombre: 'Enfermedades del sistema circulatorio',
    sinonimos: ['Hipertensión renovascular', 'HTA secundaria'],
    esFrecuente: false
  },
  {
    codigo: 'BA41',
    titulo: 'Insuficiencia cardíaca congestiva',
    capituloNumero: 11,
    capituloNombre: 'Enfermedades del sistema circulatorio',
    sinonimos: ['ICC', 'Falla cardíaca', 'Insuficiencia ventricular izquierda'],
    esFrecuente: true
  },
  {
    codigo: 'BA80',
    titulo: 'Angina de pecho estable',
    capituloNumero: 11,
    capituloNombre: 'Enfermedades del sistema circulatorio',
    sinonimos: ['Angor pectoris', 'Cardiopatía isquémica crónica'],
    esFrecuente: true
  },
  {
    codigo: 'BC63',
    titulo: 'Fibrilación auricular o aleteo auricular',
    capituloNumero: 11,
    capituloNombre: 'Enfermedades del sistema circulatorio',
    sinonimos: ['Arritmia por fibrilación auricular', 'FA'],
    esFrecuente: true
  },

  // Capítulo 05: Endocrino y Metabólico
  {
    codigo: '5A10',
    titulo: 'Diabetes mellitus tipo 1',
    capituloNumero: 5,
    capituloNombre: 'Enfermedades endocrinas, nutricionales o metabólicas',
    sinonimos: ['Diabetes juvenil', 'Diabetes insulinodependiente', 'DM1'],
    esFrecuente: true
  },
  {
    codigo: '5A11',
    titulo: 'Diabetes mellitus tipo 2',
    capituloNumero: 5,
    capituloNombre: 'Enfermedades endocrinas, nutricionales o metabólicas',
    sinonimos: ['Diabetes del adulto', 'Diabetes no insulinodependiente', 'DM2'],
    esFrecuente: true
  },
  {
    codigo: '5B81',
    titulo: 'Obesidad en el adulto',
    capituloNumero: 5,
    capituloNombre: 'Enfermedades endocrinas, nutricionales o metabólicas',
    sinonimos: ['Sobrepeso excesivo', 'IMC mayor a 30'],
    esFrecuente: true
  },
  {
    codigo: '5A00',
    titulo: 'Hipotiroidismo primario',
    capituloNumero: 5,
    capituloNombre: 'Enfermedades endocrinas, nutricionales o metabólicas',
    sinonimos: ['Tiroiditis de Hashimoto', 'Hipotiroidismo subclínico'],
    esFrecuente: true
  },
  {
    codigo: '5B50',
    titulo: 'Dislipidemia mixta o hipercolesterolemia',
    capituloNumero: 5,
    capituloNombre: 'Enfermedades endocrinas, nutricionales o metabólicas',
    sinonimos: ['Colesterol alto', 'Triglicéridos elevados', 'Hipertrigliceridemia'],
    esFrecuente: true
  },

  // Capítulo 13: Sistema Digestivo
  {
    codigo: 'DA42',
    titulo: 'Gastritis aguda o crónica',
    capituloNumero: 13,
    capituloNombre: 'Enfermedades del sistema digestivo',
    sinonimos: ['Gastritis erosiva', 'Dolor epigástrico', 'Dispepsia'],
    esFrecuente: true
  },
  {
    codigo: 'DA22',
    titulo: 'Enfermedad por reflujo gastroesofágico (ERGE)',
    capituloNumero: 13,
    capituloNombre: 'Enfermedades del sistema digestivo',
    sinonimos: ['Reflujo gastroesofágico', 'Pirosis', 'Esofagitis por reflujo'],
    esFrecuente: true
  },
  {
    codigo: 'DA40',
    titulo: 'Úlcera gástrica o duodenal',
    capituloNumero: 13,
    capituloNombre: 'Enfermedades del sistema digestivo',
    sinonimos: ['Úlcera péptica', 'Gastroduodenitis ulcerosa'],
    esFrecuente: false
  },
  {
    codigo: 'DD91',
    titulo: 'Síndrome de intestino irritable',
    capituloNumero: 13,
    capituloNombre: 'Enfermedades del sistema digestivo',
    sinonimos: ['Colon irritable', 'Colopatía funcional'],
    esFrecuente: true
  },
  {
    codigo: '1A00',
    titulo: 'Gastroenteritis aguda presumiblemente infecciosa',
    capituloNumero: 1,
    capituloNombre: 'Ciertas enfermedades infecciosas o parasitarias',
    sinonimos: ['Diarrea aguda', 'Vómitos y diarrea', 'Infección estomacal'],
    esFrecuente: true
  },

  // Capítulo 15: Sistema Musculoesquelético
  {
    codigo: 'ME84',
    titulo: 'Dolor lumbar (Lumbago agudo o crónico)',
    capituloNumero: 15,
    capituloNombre: 'Enfermedades del sistema musculoesquelético o del tejido conectivo',
    sinonimos: ['Lumbalgia', 'Lumbociática', 'Dolor de espalda baja'],
    esFrecuente: true
  },
  {
    codigo: 'FA00',
    titulo: 'Osteoartritis de rodilla (Gonartrosis)',
    capituloNumero: 15,
    capituloNombre: 'Enfermedades del sistema musculoesquelético o del tejido conectivo',
    sinonimos: ['Artrosis de rodilla', 'Desgaste articular'],
    esFrecuente: true
  },
  {
    codigo: 'FB56',
    titulo: 'Mialgia y contractura muscular',
    capituloNumero: 15,
    capituloNombre: 'Enfermedades del sistema musculoesquelético o del tejido conectivo',
    sinonimos: ['Dolor muscular', 'Contractura dorsal', 'Tortícolis'],
    esFrecuente: true
  },
  {
    codigo: 'FB40',
    titulo: 'Tendinitis y tendinopatías del manguito rotador',
    capituloNumero: 15,
    capituloNombre: 'Enfermedades del sistema musculoesquelético o del tejido conectivo',
    sinonimos: ['Tendinitis de hombro', 'Bursitis subacromial'],
    esFrecuente: true
  },
  {
    codigo: 'FA20',
    titulo: 'Artritis reumatoide seropositiva',
    capituloNumero: 15,
    capituloNombre: 'Enfermedades del sistema musculoesquelético o del tejido conectivo',
    sinonimos: ['Artritis crónica', 'Poliartritis autoinmune'],
    esFrecuente: false
  },

  // Capítulo 16: Sistema Genitourinario
  {
    codigo: 'GC08',
    titulo: 'Infección del tracto urinario (Cistitis aguda)',
    capituloNumero: 16,
    capituloNombre: 'Enfermedades del sistema genitourinario',
    sinonimos: ['ITU', 'Infección urinaria baja', 'Disuria'],
    esFrecuente: true
  },
  {
    codigo: 'GB90',
    titulo: 'Cólico renal o cálculo renal (Nefrolitiasis)',
    capituloNumero: 16,
    capituloNombre: 'Enfermedades del sistema genitourinario',
    sinonimos: ['Cálculo en el riñón', 'Litiasis ureteral', 'Cólico nefrítico'],
    esFrecuente: true
  },
  {
    codigo: 'GA00',
    titulo: 'Vaginitis o vulvovaginitis infecciosa',
    capituloNumero: 16,
    capituloNombre: 'Enfermedades del sistema genitourinario',
    sinonimos: ['Candidiasis vaginal', 'Vaginosis bacteriana'],
    esFrecuente: true
  },

  // Capítulo 08: Sistema Nervioso
  {
    codigo: '8A80',
    titulo: 'Migraña con o sin aura',
    capituloNumero: 8,
    capituloNombre: 'Enfermedades del sistema nervioso',
    sinonimos: ['Jaquequeca', 'Cefalea vascular', 'Dolor de cabeza hemicraneal'],
    esFrecuente: true
  },
  {
    codigo: '8A81',
    titulo: 'Cefalea tensional episódica o crónica',
    capituloNumero: 8,
    capituloNombre: 'Enfermedades del sistema nervioso',
    sinonimos: ['Cefalea por estrés', 'Cefalea muscular'],
    esFrecuente: true
  },
  {
    codigo: '8B00',
    titulo: 'Vértigo posicional paroxístico benigno o síndrome vertiginoso',
    capituloNumero: 8,
    capituloNombre: 'Enfermedades del sistema nervioso',
    sinonimos: ['Mareo y vértigo', 'Laberintitis', 'VPPB'],
    esFrecuente: true
  },

  // Capítulo 06: Salud Mental
  {
    codigo: '6A70',
    titulo: 'Trastorno depresivo unipolar leve o moderado',
    capituloNumero: 6,
    capituloNombre: 'Trastornos mentales, del comportamiento o del neurodesarrollo',
    sinonimos: ['Depresión mayor', 'Episodio depresivo', 'Ánimo bajo'],
    esFrecuente: true
  },
  {
    codigo: '6B00',
    titulo: 'Trastorno de ansiedad generalizada',
    capituloNumero: 6,
    capituloNombre: 'Trastornos mentales, del comportamiento o del neurodesarrollo',
    sinonimos: ['Crisis de pánico', 'Ansiedad crónica', 'Angustia'],
    esFrecuente: true
  },
  {
    codigo: '7A00',
    titulo: 'Trastorno de insomnio crónico',
    capituloNumero: 7,
    capituloNombre: 'Trastornos del ciclo sueño-vigilia',
    sinonimos: ['Dificultad para conciliar el sueño', 'Insomnio de mantención'],
    esFrecuente: true
  },

  // Capítulo 14: Piel
  {
    codigo: 'EA80',
    titulo: 'Dermatitis atópica o eccema',
    capituloNumero: 14,
    capituloNombre: 'Enfermedades de la piel',
    sinonimos: ['Eccema alérgico', 'Prurito cutáneo'],
    esFrecuente: true
  },
  {
    codigo: 'EA90',
    titulo: 'Dermatitis de contacto alérgica',
    capituloNumero: 14,
    capituloNombre: 'Enfermedades de la piel',
    sinonimos: ['Alergia en la piel', 'Erupción cutánea por contacto'],
    esFrecuente: true
  },
  {
    codigo: 'EB10',
    titulo: 'Urticaria aguda',
    capituloNumero: 14,
    capituloNombre: 'Enfermedades de la piel',
    sinonimos: ['Ronchas alérgicas', 'Habones pruriginosos'],
    esFrecuente: true
  },
  {
    codigo: '1B70',
    titulo: 'Dermatofitosis (Tinea pedis o corporal / Hongos)',
    capituloNumero: 1,
    capituloNombre: 'Ciertas enfermedades infecciosas o parasitarias',
    sinonimos: ['Pie de atleta', 'Micosis cutánea'],
    esFrecuente: true
  },

  // Capítulo 21: Síntomas y Signos
  {
    codigo: 'MD11',
    titulo: 'Fiebre de origen desconocido o no especificada',
    capituloNumero: 21,
    capituloNombre: 'Síntomas, signos o hallazgos clínicos no clasificados en otra parte',
    sinonimos: ['Hipertermia', 'Síndrome febril'],
    esFrecuente: true
  },
  {
    codigo: 'MD20',
    titulo: 'Tos aguda o crónica',
    capituloNumero: 21,
    capituloNombre: 'Síntomas, signos o hallazgos clínicos no clasificados en otra parte',
    sinonimos: ['Tos seca', 'Tos productiva'],
    esFrecuente: true
  },
  {
    codigo: 'MC80',
    titulo: 'Astenia, fatiga o cansancio no especificado',
    capituloNumero: 21,
    capituloNombre: 'Síntomas, signos o hallazgos clínicos no clasificados en otra parte',
    sinonimos: ['Cansancio crónico', 'Agotamiento físico'],
    esFrecuente: false
  },

  // Capítulo 25: Especiales
  {
    codigo: 'RA01.0',
    titulo: 'Enfermedad por coronavirus 2019 (COVID-19), con virus identificado',
    capituloNumero: 25,
    capituloNombre: 'Códigos para situaciones especiales (COVID-19)',
    sinonimos: ['Infección por SARS-CoV-2', 'COVID confirmado'],
    esFrecuente: true
  }
];

function normalizarTexto(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function buscarCIE11(query: string, capituloFiltro?: number): CIE11Item[] {
  const q = normalizarTexto(query.trim());

  return CIE11_DATABASE.filter(item => {
    if (capituloFiltro && item.capituloNumero !== capituloFiltro) {
      return false;
    }

    if (!q) return true;

    // Búsqueda por código
    if (normalizarTexto(item.codigo).includes(q)) return true;

    // Búsqueda por título
    if (normalizarTexto(item.titulo).includes(q)) return true;

    // Búsqueda en sinónimos
    if (item.sinonimos?.some(s => normalizarTexto(s).includes(q))) return true;

    // Búsqueda por nombre de capítulo
    if (normalizarTexto(item.capituloNombre).includes(q)) return true;

    return false;
  });
}
