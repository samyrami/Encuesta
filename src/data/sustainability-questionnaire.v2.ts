export interface SustainabilityQuestion {
  id: string;
  pregunta: string;
  dimension: 'Ambiental' | 'Social' | 'Gobernanza';
  opciones: { [key: string]: string };
  recommendations: { [key: string]: string };
}

export interface UserProfile {
  name: string;
  university: string;
}

export interface SustainabilityResponse {
  questionId: string;
  score: number;
  timestamp: Date;
}

export interface SustainabilityResults {
  profile: UserProfile;
  responses: SustainabilityResponse[];
  dimensions: {
    ambiental: { score: number; strengths: string[]; weaknesses: string[]; recommendations: string[] };
    social: { score: number; strengths: string[]; weaknesses: string[]; recommendations: string[] };
    gobernanza: { score: number; strengths: string[]; weaknesses: string[]; recommendations: string[] };
  };
  overallScore: number;
  completedAt: Date;
}

const rec = (topic: string) => ({
  '1': `Inicie acciones básicas para ${topic}. Establezca un plan con metas a 6-12 meses.`,
  '2': `Pase de iniciativas aisladas a un programa formal de ${topic} con indicadores.`,
  '3': `Escale la implementación de ${topic} y haga seguimiento periódico de resultados.`,
  '4': `Consolide ${topic} institucionalmente y publique avances e impactos.`,
  '5': `Mantenga la mejora continua en ${topic} y comparta mejores prácticas.`
});

export const sustainabilityQuestions: SustainabilityQuestion[] = [
  // AMBIENTAL (12)
  { id: 'amb_energias', dimension: 'Ambiental', pregunta: 'Uso de energías renovables',
    opciones: { '1':'No se utilizan energías renovables','2':'Proyectos aislados o pruebas piloto','3':'Uso parcial en algunos edificios','4':'Cobertura significativa (>30%) del consumo','5':'Alta cobertura (>70%) con metas de autosuficiencia y medición pública' },
    recommendations: rec('energías renovables') },
  { id: 'amb_consumo_energetico', dimension: 'Ambiental', pregunta: 'Consumo energético',
    opciones: { '1':'No hay medición ni seguimiento','2':'Medición puntual sin plan de acción','3':'Medición regular y acciones puntuales','4':'Plan integral con metas e indicadores','5':'Reducción sostenida con reporte anual público' },
    recommendations: rec('gestión del consumo energético') },
  { id: 'amb_planes_eficiencia', dimension: 'Ambiental', pregunta: 'Planes de eficiencia energética y reducción de emisiones',
    opciones: { '1':'No existe plan','2':'Plan en borrador sin implementación','3':'Implementación parcial en áreas clave','4':'Plan integral con metas, indicadores y revisión anual','5':'Cumplimiento sostenido, mejora continua y certificaciones externas' },
    recommendations: rec('eficiencia energética y reducción de emisiones') },
  { id: 'amb_agua', dimension: 'Ambiental', pregunta: 'Gestión eficiente del agua',
    opciones: { '1':'No hay acciones ni medición','2':'Medición esporádica sin acciones','3':'Acciones puntuales (ahorradores, control fugas)','4':'Plan integral de gestión y reutilización','5':'Reducción sostenida, uso de aguas lluvias y recirculación' },
    recommendations: rec('gestión eficiente del agua') },
  { id: 'amb_economia_circular', dimension: 'Ambiental', pregunta: 'Economía circular',
    opciones: { '1':'Modelo lineal predominante','2':'Iniciativas aisladas de reciclaje o reuso','3':'Programas establecidos en áreas específicas','4':'Política institucional con metas y seguimiento','5':'Implementación integral con resultados medibles y alianzas estratégicas' },
    recommendations: rec('economía circular') },
  { id: 'amb_residuos', dimension: 'Ambiental', pregunta: 'Gestión de residuos sólidos y peligrosos',
    opciones: { '1':'Sin manejo diferenciado','2':'Separación básica sin seguimiento','3':'Programa de separación con capacitación','4':'Gestión integral con indicadores y disposición segura','5':'Trazabilidad completa, minimización en la fuente y valorización de residuos' },
    recommendations: rec('gestión integral de residuos') },
  { id: 'amb_biodiversidad', dimension: 'Ambiental', pregunta: 'Conservación de biodiversidad',
    opciones: { '1':'No hay inventario ni acciones','2':'Identificación parcial de áreas verdes y especies','3':'Programas puntuales de conservación','4':'Plan integral con monitoreo periódico','5':'Conservación activa, restauración y conexión con investigación' },
    recommendations: rec('conservación de biodiversidad en campus') },
  { id: 'amb_cultura', dimension: 'Ambiental', pregunta: 'Sensibilización y cultura ambiental',
    opciones: { '1':'Sin actividades de sensibilización','2':'Actividades aisladas en fechas conmemorativas','3':'Programas anuales de educación ambiental','4':'Cultura ambiental integrada en la vida universitaria','5':'Cultura institucional consolidada y reconocida' },
    recommendations: rec('cultura y educación ambiental') },
  { id: 'amb_curriculo', dimension: 'Ambiental', pregunta: 'Educación ambiental en el currículo',
    opciones: { '1':'No se incluyen contenidos ambientales','2':'Contenidos optativos o aislados','3':'Integración parcial en algunas facultades','4':'Inclusión transversal en programas académicos','5':'Currículo integral con metodologías activas y proyectos reales' },
    recommendations: rec('integración curricular de sostenibilidad') },
  { id: 'amb_movilidad', dimension: 'Ambiental', pregunta: 'Movilidad sostenible',
    opciones: { '1':'Sin políticas o incentivos','2':'Iniciativas aisladas (bicicleteros, buses)','3':'Plan parcial de movilidad sostenible','4':'Plan integral con infraestructura y monitoreo','5':'Alta participación en medios sostenibles con medición de impacto' },
    recommendations: rec('movilidad sostenible en campus') },
  { id: 'amb_flexibilidad', dimension: 'Ambiental', pregunta: 'Flexibilidad laboral y académica',
    opciones: { '1':'Sin políticas de flexibilidad','2':'Aplicación ocasional en casos específicos','3':'Políticas parciales en algunas áreas','4':'Política institucional con seguimiento','5':'Alta adopción, reducción de desplazamientos y beneficios documentados' },
    recommendations: rec('flexibilidad laboral/académica para reducir huella') },

  // SOCIAL (14)
  { id: 'soc_transparencia_salarial', dimension: 'Social', pregunta: 'Políticas de contratación y de remuneración transparentes',
    opciones: { '1':'No existen políticas escritas ni mecanismos de transparencia','2':'Lineamientos básicos sin estrategias de verificación','3':'Políticas formales con implementación parcial','4':'Políticas aplicadas con seguimiento y resultados públicos','5':'Políticas claras, auditadas externamente y con resultados publicados' },
    recommendations: rec('políticas de contratación y remuneración transparentes') },
  { id: 'soc_prevencion_abusos', dimension: 'Social', pregunta: 'Estructuras organizativas que prevengan y corrijan abusos de poder',
    opciones: { '1':'No existen estructuras organizativas para prevenir y corregir abusos','2':'Protocolos aislados sin aplicación constante','3':'Estructuras formales con implementación parcial','4':'Estructuras consolidadas con protocolos de seguimiento','5':'Sistema independiente con resultados periódicos y participación externa' },
    recommendations: rec('prevención y atención de abusos de poder') },
  { id: 'soc_eval_doc_admin', dimension: 'Social', pregunta: 'Políticas para la evaluación de la actividad docente y administrativa',
    opciones: { '1':'No existen políticas ni prácticas de evaluación','2':'Evaluaciones ocasionales sin criterios claros','3':'Evaluaciones formales con limitaciones','4':'Evaluaciones institucionales periódicas y con retroalimentación','5':'Sistema integral con seguimiento, transparencia y mejora continua' },
    recommendations: rec('evaluación docente y administrativa') },
  { id: 'soc_clima', dimension: 'Social', pregunta: 'Implementación de encuestas de satisfacción y clima laboral',
    opciones: { '1':'No se realizan encuestas','2':'Encuestas esporádicas sin análisis de resultados','3':'Encuestas regulares con implementación parcial','4':'Encuestas institucionales con seguimiento de resultados','5':'Encuestas consolidadas, con mejora continua y evaluación externa' },
    recommendations: rec('gestión del clima y satisfacción institucional') },
  { id: 'soc_ddhh', dimension: 'Social', pregunta: 'Políticas de respeto por los derechos humanos',
    opciones: { '1':'No existen políticas explícitas','2':'Declaraciones generales sin mecanismos de cumplimiento','3':'Políticas activas aplicadas parcialmente','4':'Políticas aplicadas con seguimiento','5':'Políticas integrales, auditadas y con sanciones' },
    recommendations: rec('políticas de derechos humanos') },
  { id: 'soc_apoyo_estudiantes', dimension: 'Social', pregunta: 'Programas de apoyo para estudiantes de escasos recursos',
    opciones: { '1':'No existen programas de apoyo','2':'Apoyos ocasionales sin cobertura amplia','3':'Programas básicos con cobertura limitada','4':'Programas institucionalizados con seguimiento','5':'Programas integrales con amplia cobertura y alianzas externas' },
    recommendations: rec('apoyo integral a estudiantes de escasos recursos') },
  { id: 'soc_practicas_empleo', dimension: 'Social', pregunta: 'Programas de prácticas profesionales y de inserción laboral',
    opciones: { '1':'No existen programas de prácticas ni inserción','2':'Prácticas ocasionales sin seguimiento','3':'Programas limitados en algunas áreas','4':'Programas institucionales con seguimiento','5':'Programas consolidados con amplia cobertura y evaluación de impacto' },
    recommendations: rec('prácticas e inserción laboral') },
  { id: 'soc_rsu', dimension: 'Social', pregunta: 'Políticas y programas de cooperación y RSU',
    opciones: { '1':'No existen políticas de RSU','2':'Proyectos aislados sin medición de impacto','3':'Programas establecidos en áreas limitadas','4':'RSU institucionalizada con seguimiento','5':'RSU consolidada, con resultados medibles y reconocimientos externos' },
    recommendations: rec('responsabilidad social universitaria') },
  { id: 'soc_investigacion_actores', dimension: 'Social', pregunta: 'Políticas de investigación y convenios con actores sociales',
    opciones: { '1':'No existen convenios con actores sociales','2':'Convenios limitados y esporádicos','3':'Convenios regulares en algunas áreas','4':'Convenios amplios con impacto verificable','5':'Convenios consolidados con impacto social medido y reconocido' },
    recommendations: rec('investigación con impacto y vinculación social') },
  { id: 'soc_transferencia', dimension: 'Social', pregunta: 'Políticas de transferencia de conocimiento y medición de impacto social',
    opciones: { '1':'No existen mecanismos de transferencia','2':'Transferencia ocasional sin indicadores de impacto','3':'Procesos establecidos en áreas limitadas','4':'Procesos institucionalizados con indicadores y seguimiento','5':'Transferencia consolidada, con medición de impacto validada externamente' },
    recommendations: rec('transferencia de conocimiento con impacto social') },
  { id: 'soc_eval_rsu_interna', dimension: 'Social', pregunta: 'Políticas internas de promoción y evaluación RSU',
    opciones: { '1':'No existen políticas internas','2':'Políticas preliminares sin implementación','3':'Políticas aplicadas parcialmente','4':'Políticas aplicadas institucionalmente con seguimiento','5':'Políticas consolidadas, auditadas y con resultados publicados' },
    recommendations: rec('gobernanza interna de RSU') },
  { id: 'soc_salud', dimension: 'Social', pregunta: 'Programas de salud alimentaria, física y mental',
    opciones: { '1':'No existen programas','2':'Actividades puntuales sin continuidad','3':'Programas aplicados parcialmente','4':'Programas institucionalizados con cobertura amplia','5':'Programas integrales, con evaluación externa y resultados publicados' },
    recommendations: rec('salud y bienestar universitario') },
  { id: 'soc_genero_diversidad', dimension: 'Social', pregunta: 'Género y diversidad en programas académicos',
    opciones: { '1':'No existen políticas ni programas','2':'Acciones puntuales sin continuidad','3':'Inclusión parcial en algunos programas','4':'Inclusión transversal con seguimiento','5':'Inclusión integral con indicadores y evaluación externa' },
    recommendations: rec('equidad de género y diversidad') },
  { id: 'soc_impacto_conocimiento', dimension: 'Social', pregunta: 'Evaluación del impacto social del conocimiento',
    opciones: { '1':'No se evalúa el impacto social del conocimiento','2':'Evaluaciones puntuales sin metodología clara','3':'Evaluación parcial en algunas áreas','4':'Evaluación institucional con indicadores','5':'Evaluación integral con validación externa y resultados públicos' },
    recommendations: rec('medición del impacto social del conocimiento') },

  // GOBERNANZA (18)
  { id: 'gov_plan', dimension: 'Gobernanza', pregunta: 'Plan o estrategia de sostenibilidad',
    opciones: { '1':'No existe plan','2':'Borrador sin aprobación formal','3':'Plan aprobado con implementación limitada','4':'Plan aprobado en ejecución con indicadores','5':'Plan integral, revisado periódicamente y alineado con estándares internacionales' },
    recommendations: rec('plan estratégico de sostenibilidad') },
  { id: 'gov_comite_academico', dimension: 'Gobernanza', pregunta: 'Comité académico formalizado',
    opciones: { '1':'No existe comité','2':'Comité conformado de manera informal','3':'Comité formalizado con reuniones poco frecuentes','4':'Comité activo con funciones claras y actas de seguimiento','5':'Comité consolidado, con participación transversal y evaluación periódica' },
    recommendations: rec('comité académico de sostenibilidad') },
  { id: 'gov_transparencia', dimension: 'Gobernanza', pregunta: 'Transparencia organizacional',
    opciones: { '1':'No se publica información sobre la gestión','2':'Publicación parcial y esporádica','3':'Publicación regular pero incompleta','4':'Publicación completa y actualizada','5':'Transparencia total con auditorías externas y acceso abierto' },
    recommendations: rec('transparencia y rendición de cuentas') },
  { id: 'gov_comite_investigacion', dimension: 'Gobernanza', pregunta: 'Comité de investigación con participación externa',
    opciones: { '1':'No existe comité','2':'Comité interno sin participación externa','3':'Comité con participación externa limitada','4':'Comité con participación externa regular y activa','5':'Comité consolidado con amplia participación externa y evaluación periódica' },
    recommendations: rec('comité de investigación con participación externa') },
  { id: 'gov_vision_mision', dimension: 'Gobernanza', pregunta: 'Inclusión de sostenibilidad en visión/misión',
    opciones: { '1':'No se menciona sostenibilidad','2':'Mención genérica sin estrategias asociadas','3':'Inclusión formal con acciones aisladas','4':'Inclusión explícita con políticas y programas coherentes','5':'Inclusión explícita, con indicadores y seguimiento del cumplimiento' },
    recommendations: rec('alineación de misión/visión con sostenibilidad') },
  { id: 'gov_comite_admin', dimension: 'Gobernanza', pregunta: 'Comité administrativo y financiero',
    opciones: { '1':'No existe comité','2':'Comité informal sin funciones claras','3':'Comité formalizado con reuniones poco frecuentes','4':'Comité activo con seguimiento de decisiones y resultados','5':'Comité consolidado, con auditoría y evaluación periódica del desempeño' },
    recommendations: rec('comité administrativo y financiero') },
  { id: 'gov_codigo_etica', dimension: 'Gobernanza', pregunta: 'Código de ética institucional',
    opciones: { '1':'No existe código','2':'Código en borrador o no divulgado','3':'Código formal con aplicación limitada','4':'Código vigente, difundido y aplicado','5':'Código integral con mecanismos de seguimiento y sanción' },
    recommendations: rec('código de ética institucional') },
  { id: 'gov_portal_transparencia', dimension: 'Gobernanza', pregunta: 'Portal de transparencia',
    opciones: { '1':'No existe portal','2':'Portal básico con información limitada','3':'Portal con información amplia pero sin actualización regular','4':'Portal actualizado periódicamente y de fácil navegación','5':'Portal integral, actualizado y con indicadores de desempeño' },
    recommendations: rec('portal de transparencia') },
  { id: 'gov_plan_estrategico', dimension: 'Gobernanza', pregunta: 'Plan estratégico alineado con sostenibilidad y RSU',
    opciones: { '1':'Plan sin mención a sostenibilidad o RSU','2':'Mención genérica sin objetivos medibles','3':'Inclusión parcial de objetivos sostenibles','4':'Inclusión explícita con indicadores y seguimiento','5':'Inclusión integral con resultados medibles y reportados públicamente' },
    recommendations: rec('alineación del plan estratégico con sostenibilidad y RSU') },
  { id: 'gov_conflicto_interes', dimension: 'Gobernanza', pregunta: 'Prevención de conflictos de interés',
    opciones: { '1':'No hay políticas o mecanismos','2':'Políticas básicas sin mecanismos de verificación','3':'Políticas aplicadas de forma parcial y sin sanciones claras','4':'Políticas aplicadas con seguimiento y sanciones','5':'Sistema integral con monitoreo constante y transparencia pública' },
    recommendations: rec('prevención de conflictos de interés') },
  { id: 'gov_responsable_esg', dimension: 'Gobernanza', pregunta: 'Área o responsable ESG/RSU',
    opciones: { '1':'No existe responsable designado','2':'Responsable informal o funciones dispersas','3':'Responsable formal con funciones limitadas','4':'Área o responsable con recursos y funciones claras','5':'Área consolidada con presupuesto, personal y autoridad' },
    recommendations: rec('estructura de gobernanza ESG/RSU') },
  { id: 'gov_buen_gobierno', dimension: 'Gobernanza', pregunta: 'Código de buen gobierno',
    opciones: { '1':'No existe código','2':'Código preliminar sin aprobación formal','3':'Código aprobado pero sin implementación plena','4':'Código vigente y aplicado','5':'Código robusto, aplicado con auditorías y revisión periódica' },
    recommendations: rec('código de buen gobierno') },
  { id: 'gov_politicas_sostenibilidad', dimension: 'Gobernanza', pregunta: 'Políticas de sostenibilidad formalizadas',
    opciones: { '1':'No existen políticas','2':'Políticas en borrador o sin aprobación formal','3':'Políticas aprobadas con aplicación parcial','4':'Políticas aplicadas institucionalmente','5':'Políticas consolidadas, evaluadas y alineadas con estándares internacionales' },
    recommendations: rec('políticas institucionales de sostenibilidad') },
  { id: 'gov_comite_auditoria', dimension: 'Gobernanza', pregunta: 'Comité de auditoría interno',
    opciones: { '1':'No existe comité','2':'Comité preliminar sin funciones claras','3':'Comité activo con funciones limitadas','4':'Comité activo con revisiones periódicas y recomendaciones','5':'Comité consolidado, con independencia y seguimiento exhaustivo' },
    recommendations: rec('comité de auditoría interna') },
  { id: 'gov_riesgos_esg', dimension: 'Gobernanza', pregunta: 'Evaluación de riesgos ESG',
    opciones: { '1':'No se realiza evaluación','2':'Evaluación parcial sin metodología definida','3':'Evaluación con metodología básica en algunas áreas','4':'Evaluación sistemática con planes de mitigación','5':'Evaluación integral, validada externamente y con seguimiento público' },
    recommendations: rec('gestión de riesgos ESG') },
  { id: 'gov_equidad_genero', dimension: 'Gobernanza', pregunta: 'Equidad de género en directivas',
    opciones: { '1':'No existen políticas ni datos sobre equidad','2':'Diagnóstico básico sin acciones','3':'Políticas aplicadas parcialmente','4':'Políticas activas con seguimiento y metas','5':'Equidad lograda o cercana, con monitoreo y rendición de cuentas' },
    recommendations: rec('equidad de género en órganos directivos') },
  { id: 'gov_stakeholders', dimension: 'Gobernanza', pregunta: 'Participación de stakeholders',
    opciones: { '1':'No se involucra a stakeholders','2':'Participación esporádica sin estructura','3':'Participación regular pero limitada','4':'Participación activa con mecanismos de consulta','5':'Participación amplia e institucionalizada con retroalimentación vinculante' },
    recommendations: rec('participación de grupos de interés') },
  { id: 'gov_portal_transparencia_inst', dimension: 'Gobernanza', pregunta: 'Portal de transparencia institucional',
    opciones: { '1':'No existe','2':'Portal básico con información general','3':'Portal con información variada pero desactualizada','4':'Portal actualizado y con acceso fácil','5':'Portal integral, actualizado, interactivo y con datos abiertos' },
    recommendations: rec('portal de transparencia institucional (datos abiertos)') },
];
