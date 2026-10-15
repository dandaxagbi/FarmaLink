import { Medicamento, Farmacia, Doctor, Paciente, RecetaDigital, CentroMedico } from './types';

export const INITIAL_DOCTOR: Doctor = {
  nombre: 'Dra. Oriela Iriarte',
  especialidad: 'Infectología',
  registroMedico: 'MP-74921-BO',
  clinica: 'Centro Andar',
  email: 'dra.oriela.iriarte@centroandar.bo',
  telefono: '+591 76258575'
};

export const INITIAL_CENTRO_MEDICO: CentroMedico = {
  id: 'centro-andar-01',
  nombre: 'Centro Andar',
  subtitulo: 'Pie Diabético e Infectología',
  logoUrl: '/logo_andar.png',
  direccion: 'Calle Aurelio Meleán, entre Av. Heroínas y Plazuela Sucre, Edif. Tribeca Soho, Of. 4',
  ciudad: 'Cochabamba',
  pais: 'Bolivia',
  telefono: '+591 4 458 9200',
  whatsapp: '+591 76258575',
  email: 'contacto@centroandar.bo',
  sitioWeb: 'https://facebook.com/Andar-pie-diabético-e-infectologia-61583005790665/',
  horarioAtencion: 'Lunes a Viernes 08:30 - 18:30 / Sábados 09:00 - 13:00',
  nitRut: '3819402018',
  doctor: INITIAL_DOCTOR
};

export const INITIAL_PACIENTES: Paciente[] = [
  {
    id: 'pac-001',
    nombreCompleto: 'Camila Morales Vega',
    rutOIdentificacion: '5492819-CB',
    telefonoWhatsapp: '+591 76985432',
    email: 'camila.morales.v@gmail.com',
    edad: 34,
    genero: 'Femenino',
    fechaNacimiento: '1992-05-18',
    direccion: 'Av. América Este #450',
    ciudad: 'Cochabamba',
    alergias: 'Penicilina, Sulfas',
    antecedentesMedicos: 'Infección recurrente de tejidos blandos, intolerancia a AINEs',
    grupoSanguineo: 'O Rh+',
    contactoEmergencia: 'Roberto Morales (Esposo) - +591 71234567',
    fechaRegistro: '2026-01-10'
  },
  {
    id: 'pac-002',
    nombreCompleto: 'Juan Carlos Pérez Miranda',
    rutOIdentificacion: '4128903-CB',
    telefonoWhatsapp: '+591 77412890',
    email: 'jc.perez.m@outlook.com',
    edad: 58,
    genero: 'Masculino',
    fechaNacimiento: '1968-11-24',
    direccion: 'Calle Jordán #890',
    ciudad: 'Cochabamba',
    alergias: 'Ninguna conocida',
    antecedentesMedicos: 'Diabetes Mellitus Tipo 2 (12 años de evolución), Neuropatía periférica, Úlcera neuropática plantar izquierda Wagner II',
    grupoSanguineo: 'A Rh+',
    contactoEmergencia: 'María Elena Pérez (Hija) - +591 76451234',
    fechaRegistro: '2026-02-15'
  },
  {
    id: 'pac-003',
    nombreCompleto: 'María René Quiroga Flores',
    rutOIdentificacion: '3920147-CB',
    telefonoWhatsapp: '+591 70789012',
    email: 'mrene.quiroga@gmail.com',
    edad: 64,
    genero: 'Femenino',
    fechaNacimiento: '1962-08-04',
    direccion: 'Av. Libertador Bolívar #1240',
    ciudad: 'Cochabamba',
    alergias: 'Ciprofloxacino, Cefalosporinas de 1ra gen',
    antecedentesMedicos: 'Diabetes Tipo 2, Hipertensión arterial esencial, Osteomielitis falángica previa tratada',
    grupoSanguineo: 'B Rh+',
    contactoEmergencia: 'Carlos Quiroga (Hermano) - +591 72201948',
    fechaRegistro: '2026-03-01'
  },
  {
    id: 'pac-004',
    nombreCompleto: 'Gustavo Adolfo Vargas Siles',
    rutOIdentificacion: '6741029-SC',
    telefonoWhatsapp: '+591 78563214',
    email: 'gustavo.vargas.siles@gmail.com',
    edad: 49,
    genero: 'Masculino',
    fechaNacimiento: '1977-03-12',
    direccion: 'Calle Salamanca #310',
    ciudad: 'Cochabamba',
    alergias: 'Trimetoprim-Sulfametoxazol',
    antecedentesMedicos: 'Celulitis infecciosa de miembro inferior derecho, Insuficiencia venosa crónica',
    grupoSanguineo: 'O Rh+',
    contactoEmergencia: 'Sonia Siles (Madre) - +591 71982345',
    fechaRegistro: '2026-03-20'
  }
];

export const INITIAL_PACIENTE: Paciente = INITIAL_PACIENTES[0];

export const INITIAL_FARMACIAS: Farmacia[] = [
  {
    id: 'farm-01',
    nombre: 'Farmacia Cruz Central - Casa Matriz',
    direccion: 'Av. Providencia 1420, Santiago',
    telefono: '+56 2 2849 5000',
    email: 'despacho.central@farmaciacruz.cl',
    horario: 'Lunes a Domingo 08:00 - 22:00',
    responsable: 'Q.F. Mariana Soto Castro'
  },
  {
    id: 'farm-02',
    nombre: 'Farmacia San Rafael - Sucursal Norte',
    direccion: 'Av. Independencia 750, Recoleta',
    telefono: '+56 2 2733 1122',
    email: 'recetas.norte@farmaciasanrafael.cl',
    horario: 'Lunes a Sábado 08:30 - 20:30',
    responsable: 'Q.F. Rodrigo Benítez'
  },
  {
    id: 'farm-03',
    nombre: 'Farmacia Bienestar & Salud - Las Condes',
    direccion: 'Av. Apoquindo 4800, Local 12',
    telefono: '+56 2 2910 8844',
    email: 'contacto@farmaciabienestar.cl',
    horario: 'Abierto 24 Horas',
    responsable: 'Q.F. Andrea Gómez'
  }
];

export const INITIAL_MEDICAMENTOS: Medicamento[] = [
  {
    id: 'med-01',
    codigo: 'MED-AMOX-500',
    nombreComercial: 'Amoxicilina 500 mg',
    principioActivo: 'Amoxicilina Trihidrato',
    presentacion: 'Caja x 21 cápsulas',
    concentracion: '500 mg',
    viaAdministracionDefault: 'Oral',
    stockActual: 45,
    stockMinimo: 10,
    precioUnitario: 4500,
    categoria: 'Antibiótico'
  },
  {
    id: 'med-02',
    codigo: 'MED-IBUP-400',
    nombreComercial: 'Ibuprofeno 400 mg',
    principioActivo: 'Ibuprofeno',
    presentacion: 'Caja x 20 comprimidos recubiertos',
    concentracion: '400 mg',
    viaAdministracionDefault: 'Oral',
    stockActual: 120,
    stockMinimo: 20,
    precioUnitario: 2800,
    categoria: 'Analgésico / Antiinflamatorio'
  },
  {
    id: 'med-03',
    codigo: 'MED-PARA-1000',
    nombreComercial: 'Paracetamol 1 g',
    principioActivo: 'Paracetamol',
    presentacion: 'Caja x 16 comprimidos',
    concentracion: '1000 mg',
    viaAdministracionDefault: 'Oral',
    stockActual: 88,
    stockMinimo: 25,
    precioUnitario: 2100,
    categoria: 'Analgésico / Antipirético'
  },
  {
    id: 'med-04',
    codigo: 'MED-LOSA-50',
    nombreComercial: 'Losartán Potásico 50 mg',
    principioActivo: 'Losartán',
    presentacion: 'Caja x 30 comprimidos',
    concentracion: '50 mg',
    viaAdministracionDefault: 'Oral',
    stockActual: 62,
    stockMinimo: 15,
    precioUnitario: 5200,
    categoria: 'Antihipertensivo'
  },
  {
    id: 'med-05',
    codigo: 'MED-METF-850',
    nombreComercial: 'Metformina Clorhidrato 850 mg',
    principioActivo: 'Metformina',
    presentacion: 'Caja x 60 comprimidos',
    concentracion: '850 mg',
    viaAdministracionDefault: 'Oral',
    stockActual: 34,
    stockMinimo: 15,
    precioUnitario: 6800,
    categoria: 'Antidiabético oral'
  },
  {
    id: 'med-06',
    codigo: 'MED-SALB-100',
    nombreComercial: 'Salbutamol Aerosol 100 mcg',
    principioActivo: 'Salbutamol Sulfato',
    presentacion: 'Inhalador 200 dosis',
    concentracion: '100 mcg / dosis',
    viaAdministracionDefault: 'Inhalatoria',
    stockActual: 18,
    stockMinimo: 8,
    precioUnitario: 8900,
    categoria: 'Broncodilatador'
  },
  {
    id: 'med-07',
    codigo: 'MED-OMEP-20',
    nombreComercial: 'Omeprazol 20 mg',
    principioActivo: 'Omeprazol',
    presentacion: 'Caja x 30 cápsulas con microgránulos',
    concentracion: '20 mg',
    viaAdministracionDefault: 'Oral',
    stockActual: 50,
    stockMinimo: 12,
    precioUnitario: 3900,
    categoria: 'Inhibidor bomba de protones'
  },
  {
    id: 'med-08',
    codigo: 'MED-AZIT-500',
    nombreComercial: 'Azitromicina 500 mg',
    principioActivo: 'Azitromicina dihidrato',
    presentacion: 'Caja x 3 comprimidos recubiertos',
    concentracion: '500 mg',
    viaAdministracionDefault: 'Oral',
    stockActual: 5, // Bajo stock intencional para alertas
    stockMinimo: 10,
    precioUnitario: 9400,
    categoria: 'Antibiótico macrólido'
  }
];

export const DIAGNOSTICOS_FRECUENTES = [
  'J06.9 Infección aguda de las vías respiratorias superiores, no especificada',
  'J20.9 Bronquitis aguda, no especificada',
  'I10 Hipertensión esencial (primaria)',
  'E11.9 Diabetes mellitus tipo 2 sin mención de complicación',
  'K29.7 Gastritis, no especificada',
  'M54.5 Lumbago no especificado',
  'M79.1 Mialgia y dolor muscular',
  'R51 Cefalea tensional / Migraña',
  'J02.9 Faringitis aguda, no especificada',
  'N39.0 Infección del tracto urinario, sitio no especificado'
];

export const PRESENTACIONES_FRECUENTES = [
  'Caja x 20 comprimidos recubiertos',
  'Caja x 30 comprimidos',
  'Caja x 21 cápsulas',
  'Caja x 16 comprimidos',
  'Caja x 60 comprimidos',
  'Frasco jarabe 120 ml',
  'Frasco suspensión 100 ml',
  'Inhalador aerosol 200 dosis',
  'Tubo crema tópica 30 g',
  'Frasco gotas 15 ml',
  'Ampolla inyectable 2 ml'
];

export const UNIDADES_MEDIDA = [
  'comprimido(s)',
  'cápsula(s)',
  'mg',
  'g',
  'ml',
  'gotas',
  'puff / inhalación',
  'cucharada(s)',
  'sobre(s)'
];

export const VIAS_ADMINISTRACION = [
  'Oral',
  'Sublingual',
  'Inhalatoria',
  'Tópica / Cutánea',
  'Oftálmica',
  'Ótica',
  'Nasal',
  'Intramuscular',
  'Intravenosa',
  'Rectal'
];

export const FRECUENCIAS_FRECUENTES = [
  'Cada 8 horas',
  'Cada 12 horas',
  'Cada 24 horas (una vez al día en la mañana)',
  'Cada 24 horas (en la noche antes de dormir)',
  'Cada 6 horas',
  'Cada 4 horas si hay dolor o fiebre',
  'Con cada comida principal',
  'En ayunas 30 minutos antes del desayuno',
  'Según necesidad (SOS)'
];

export const INITIAL_RECETAS: RecetaDigital[] = [
  {
    id: 'rec-101',
    codigoRX: 'RX-74921',
    fechaEmision: '2026-10-14 10:30',
    tipoTratamiento: 'farmacologico',
    diagnostico: '[1C62] Infección aguda de las vías respiratorias superiores, sitio no especificado',
    observacionesGenerales: 'Mantener reposo relativo por 48 horas. Hidratación abundante (mínimo 2 litros de agua diarios). Controlar temperatura.',
    items: [
      {
        id: 'item-101-1',
        medicamentoId: 'med-02',
        nombreMedicamento: 'Ibuprofeno 400 mg',
        presentacion: 'Caja x 20 comprimidos recubiertos',
        cantidadTotal: 1,
        observacionesFarmacia: 'Bioequivalente aceptado. No sustituir por presentación líquida.',
        dosis: '1',
        unidadMedida: 'comprimido(s)',
        viaAdministracion: 'Oral',
        frecuencia: 'Cada 8 horas',
        duracionNumero: 5,
        duracionUnidad: 'dia(s)',
        fechaInicio: '14/10/2026',
        fechaFin: '19/10/2026',
        indicaciones: 'Tomar con alimentos o vaso de agua para proteger mucosa gástrica.'
      },
      {
        id: 'item-101-2',
        medicamentoId: 'med-03',
        nombreMedicamento: 'Paracetamol 1 g',
        presentacion: 'Caja x 16 comprimidos',
        cantidadTotal: 1,
        observacionesFarmacia: 'Dispensar presentación genérica autorizada.',
        dosis: '1',
        unidadMedida: 'comprimido(s)',
        viaAdministracion: 'Oral',
        frecuencia: 'Cada 8 horas si hay fiebre > 38°C o dolor',
        duracionNumero: 3,
        duracionUnidad: 'dia(s)',
        fechaInicio: '14/10/2026',
        fechaFin: '17/10/2026',
        indicaciones: 'No sobrepasar 4g diarios. No consumir alcohol.'
      }
    ],
    doctor: INITIAL_DOCTOR,
    paciente: INITIAL_PACIENTE,
    farmaciaDestino: INITIAL_FARMACIAS[0],
    estado: 'EN_FARMACIA',
    historialEstados: [
      { estado: 'EMITIDA', fecha: '2026-10-14 10:30', nota: 'Receta generada por Dra. Aránguiz' },
      { estado: 'EN_FARMACIA', fecha: '2026-10-14 10:31', nota: 'PDF enviado por correo a despacho.central@farmaciacruz.cl' }
    ],
    notificaciones: {
      emailEnviadoAFarmacia: true,
      emailFecha: '2026-10-14 10:31',
      whatsappEnviadoAPaciente: true,
      whatsappFecha: '2026-10-14 10:31'
    }
  }
];
