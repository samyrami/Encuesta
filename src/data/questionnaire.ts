export interface Question {
  id: number;
  pregunta: string;
  opcion_si: string | null;
  opcion_no: string | null;
  diagnostico: string | null;
  category: string;
}

export const questions: Question[] = [
  {
    id: 1,
    pregunta: "Nombre de la compañía",
    opcion_si: "Información Personal",
    opcion_no: null,
    diagnostico: null,
    category: "Información Personal"
  },
  {
    id: 2,
    pregunta: "Nombre de quien responde la encuesta",
    opcion_si: null,
    opcion_no: null,
    diagnostico: null,
    category: "Información Personal"
  },
  {
    id: 3,
    pregunta: "Email",
    opcion_si: null,
    opcion_no: null,
    diagnostico: null,
    category: "Información Personal"
  },
  {
    id: 4,
    pregunta: "Telefono del contacto",
    opcion_si: null,
    opcion_no: null,
    diagnostico: null,
    category: "Información Personal"
  },
  {
    id: 5,
    pregunta: "Nit",
    opcion_si: null,
    opcion_no: null,
    diagnostico: null,
    category: "Información Personal"
  },
  {
    id: 6,
    pregunta: "Ciudad",
    opcion_si: null,
    opcion_no: null,
    diagnostico: null,
    category: "Información Personal"
  },
  {
    id: 7,
    pregunta: "¿Cómo definiría el tamaño de su empresa?",
    opcion_si: "Micro empresa (1-10 empleados)",
    opcion_no: "Pequeña empresa (11-50 empleados), Mediana empresa (51-200 empleados), Gran empresa (más de 200 empleados)",
    diagnostico: null,
    category: "Características de la Empresa"
  },
  {
    id: 8,
    pregunta: "Cuenta su empresa con Buenas Prácticas Agrícolas (BPA), de Manufactura (BPM) o equivalentes según el sector",
    opcion_si: "La empresa demuestra cumplimiento con estándares de calidad requeridos para exportación.",
    opcion_no: "La falta de BPA puede limitar el acceso a mercados internacionales exigentes.",
    diagnostico: null,
    category: "Calidad y Certificaciones"
  },
  {
    id: 9,
    pregunta: "¿Cuenta su empresa con certificaciones internacionales (ej: Global GAP, HACCP, ISO, FDA, Fair Trade, Rainforest Alliance, etc.)?",
    opcion_si: "La empresa cuenta con certificaciones internacionales reconocidas.",
    opcion_no: "La falta de certificaciones internacionales puede restringir oportunidades de negocio en el exterior.",
    diagnostico: null,
    category: "Calidad y Certificaciones"
  },
  {
    id: 10,
    pregunta: "¿La empresa exporta actualmente?",
    opcion_si: "La empresa exporta directamente",
    opcion_no: "La empresa exporta indirectamente",
    diagnostico: null,
    category: "Experiencia Exportadora"
  },
  {
    id: 11,
    pregunta: "¿Dispone la empresa de personal capacitado en comercio exterior?",
    opcion_si: "Contar con expertise comercial para la expansión internacional.",
    opcion_no: "La falta de expertise comercial puede obstaculizar la internacionalización.",
    diagnostico: null,
    category: "Recursos Humanos"
  },
  {
    id: 12,
    pregunta: "¿Cuenta la empresa con un sistema de gestión de calidad implementado?",
    opcion_si: "Tener un sistema de gestión de calidad es una fortaleza para competir internacionalmente.",
    opcion_no: "La falta de un sistema de calidad puede afectar la confianza de clientes internacionales.",
    diagnostico: null,
    category: "Calidad y Certificaciones"
  },
  {
    id: 13,
    pregunta: "¿Dispone la empresa de una cadena logística optimizada para exportar?",
    opcion_si: "Contar con una cadena logística optimizada es clave para competitividad global.",
    opcion_no: "La falta de una cadena logística optimizada puede aumentar costos y riesgos en exportación.",
    diagnostico: null,
    category: "Logística y Operaciones"
  },
  {
    id: 14,
    pregunta: "¿Ha establecido la empresa alianzas con distribuidores o agentes en el exterior?",
    opcion_si: "Tener alianzas con distribuidores es una ventaja competitiva en mercados internacionales.",
    opcion_no: "La falta de alianzas con distribuidores puede dificultar la entrada a mercados extranjeros.",
    diagnostico: null,
    category: "Alianzas y Redes"
  },
  {
    id: 15,
    pregunta: "¿Cuenta su empresa con una estrategia de costos y precios para mercados internacionales?",
    opcion_si: "La empresa ha formulado una estrategia de costos internacional.",
    opcion_no: "La empresa no cuenta con una estrategia de precios adaptada a los mercados internacionales.",
    diagnostico: null,
    category: "Estrategia y Planificación"
  },
  {
    id: 16,
    pregunta: "¿Ha implementado la empresa un plan de distribución internacional?",
    opcion_si: "Tener un plan de distribución internacional es una fortaleza.",
    opcion_no: "La falta de un plan de distribución puede retrasar la expansión internacional.",
    diagnostico: null,
    category: "Estrategia y Planificación"
  },
  {
    id: 17,
    pregunta: "¿Ha participado su empresa en ferias o misiones internacionales de promoción comercial?",
    opcion_si: "Participación en ferias internacionales mejora visibilidad y contactos.",
    opcion_no: "La ausencia en ferias limita las oportunidades de networking y clientes.",
    diagnostico: null,
    category: "Promoción y Marketing"
  },
  {
    id: 18,
    pregunta: "¿Cuenta la empresa con material promocional en otros idiomas?",
    opcion_si: "La empresa dispone de material multilingüe para promoción.",
    opcion_no: "La falta de material en otros idiomas limita la comunicación internacional.",
    diagnostico: null,
    category: "Promoción y Marketing"
  },
  {
    id: 19,
    pregunta: "¿Ha utilizado la empresa mecanismos de financiación para exportaciones (créditos, seguros, garantías)?",
    opcion_si: "La empresa ha accedido a mecanismos financieros de apoyo a exportación.",
    opcion_no: "La falta de financiamiento puede restringir operaciones internacionales.",
    diagnostico: null,
    category: "Financiamiento"
  },
  {
    id: 20,
    pregunta: "¿Cuenta la empresa con experiencia previa en exportación indirecta?",
    opcion_si: "La empresa cuenta con experiencia en exportación indirecta.",
    opcion_no: "La ausencia de experiencia indirecta limita el aprendizaje en exportación.",
    diagnostico: null,
    category: "Experiencia Exportadora"
  },
  {
    id: 21,
    pregunta: "¿La empresa realiza investigación de mercados internacionales de manera sistemática?",
    opcion_si: "La empresa investiga mercados internacionales regularmente.",
    opcion_no: "No realizar investigación sistemática puede aumentar riesgos de fracaso.",
    diagnostico: null,
    category: "Investigación de Mercados"
  },
  {
    id: 22,
    pregunta: "¿Cuenta con un área o personal exclusivo para la gestión de exportaciones?",
    opcion_si: "La empresa dispone de personal dedicado a exportaciones.",
    opcion_no: "La falta de personal exclusivo puede dificultar la gestión internacional.",
    diagnostico: null,
    category: "Recursos Humanos"
  },
  {
    id: 23,
    pregunta: "¿La empresa ha desarrollado innovación en productos o procesos pensando en mercados internacionales?",
    opcion_si: "La empresa innova en productos o procesos con orientación internacional.",
    opcion_no: "La falta de innovación puede reducir competitividad en mercados globales.",
    diagnostico: null,
    category: "Innovación y Desarrollo"
  }
];

export const contactFields = [
  { key: 'company', label: 'Nombre de la compañía', placeholder: 'Ingrese el nombre de su empresa' },
  { key: 'name', label: 'Nombre de quien responde la encuesta', placeholder: 'Ingrese su nombre completo' },
  { key: 'email', label: 'Email', placeholder: 'correo@empresa.com' },
  { key: 'phone', label: 'Teléfono del contacto', placeholder: 'Número de contacto' },
  { key: 'nit', label: 'NIT', placeholder: 'Número de identificación tributaria' },
  { key: 'city', label: 'Ciudad', placeholder: 'Ciudad donde opera' }
] as const;