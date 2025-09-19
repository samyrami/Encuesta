export interface SustainabilityQuestion {
  id: string;
  pregunta: string;
  dimension: 'Ambiental' | 'Social' | 'Gobernanza';
  opciones: {
    [key: string]: string;
  };
  recommendations: {
    [key: string]: string;
  };
}

export const sustainabilityQuestions: SustainabilityQuestion[] = [
  // DIMENSIÓN AMBIENTAL
  {
    id: 'ambiental_energia_renovable',
    pregunta: 'Uso de energías renovables',
    dimension: 'Ambiental',
    opciones: {
      '1': 'No se utilizan energías renovables',
      '2': 'Proyectos aislados o pruebas piloto',
      '3': 'Uso parcial en algunos edificios',
      '4': 'Cobertura significativa (>30%) del consumo',
      '5': 'Alta cobertura (>70%) con metas de autosuficiencia y medición pública'
    },
    recommendations: {
      '1': 'Implemente sistemas solares piloto en edificios administrativos principales. Evalúe la viabilidad técnica y económica para expandir gradualmente.',
      '2': 'Escale los proyectos piloto exitosos. Desarrolle un plan maestro de energías renovables con metas específicas a 2-3 años.',
      '3': 'Acelere la instalación en edificios restantes. Considere asociaciones público-privadas para financiamiento.',
      '4': 'Mantenga el crecimiento hacia autosuficiencia. Implemente sistemas de monitoreo en tiempo real y publique resultados.',
      '5': 'Excelente trabajo. Considere convertirse en referente nacional y generar excedentes para la red eléctrica nacional.'
    }
  },
  {
    id: 'ambiental_consumo_energetico',
    pregunta: 'Consumo energético',
    dimension: 'Ambiental',
    opciones: {
      '1': 'No hay medición ni seguimiento',
      '2': 'Medición puntual sin plan de acción',
      '3': 'Medición regular y acciones puntuales',
      '4': 'Plan integral con metas e indicadores',
      '5': 'Reducción sostenida con reporte anual público'
    },
    recommendations: {
      '1': 'Instale medidores inteligentes en todos los edificios principales. Establezca una línea base del consumo energético.',
      '2': 'Desarrolle un plan de eficiencia energética con metas específicas. Forme un equipo técnico responsable del seguimiento.',
      '3': 'Implemente acciones sistemáticas como reemplazo de iluminación LED, optimización de aires acondicionados y automatización.',
      '4': 'Mantenga el seguimiento riguroso de indicadores. Considere certificaciones energéticas internacionales.',
      '5': 'Excelente gestión. Comparta mejores prácticas con otras universidades y participe en redes de sostenibilidad.'
    }
  },
  {
    id: 'ambiental_eficiencia_energetica',
    pregunta: 'Planes de eficiencia energética y reducción de emisiones',
    dimension: 'Ambiental',
    opciones: {
      '1': 'No existe plan',
      '2': 'Plan en borrador sin implementación',
      '3': 'Implementación parcial en áreas clave',
      '4': 'Plan integral con metas, indicadores y revisión anual',
      '5': 'Cumplimiento sostenido, mejora continua y certificaciones externas'
    },
    recommendations: {
      '1': 'Desarrolle un plan de eficiencia energética integral. Involucre ingeniería, administración y comunidad universitaria.',
      '2': 'Apruebe formalmente el plan e inicie implementación inmediata en edificios de mayor consumo.',
      '3': 'Amplíe la implementación a todas las áreas. Establezca indicadores de desempeño y sistemas de monitoreo.',
      '4': 'Mantenga la revisión anual del plan. Establezca metas más ambiciosas y considere neutralidad de carbono.',
      '5': 'Liderazgo ejemplar. Considere obtener certificaciones como LEED o BREEAM para sus edificios.'
    }
  },
  {
    id: 'ambiental_gestion_agua',
    pregunta: 'Gestión eficiente del agua',
    dimension: 'Ambiental',
    opciones: {
      '1': 'No hay acciones ni medición',
      '2': 'Medición esporádica sin acciones',
      '3': 'Acciones puntuales (ahorradores, control de fugas)',
      '4': 'Plan integral de gestión y reutilización',
      '5': 'Reducción sostenida, uso de aguas lluvias y recirculación'
    },
    recommendations: {
      '1': 'Instale medidores de agua e identifique puntos de mayor consumo. Realice auditoría de fugas.',
      '2': 'Implemente dispositivos ahorradores en baños y áreas comunes. Desarrolle campaña de concientización.',
      '3': 'Expanda acciones a jardines y sistemas de riego eficiente. Considere captación de aguas lluvias.',
      '4': 'Optimice el plan integral. Explore tecnologías de tratamiento y reutilización de aguas grises.',
      '5': 'Excelente gestión hídrica. Considere convertirse en modelo de campus sostenible para otras instituciones.'
    }
  },
  {
    id: 'ambiental_economia_circular',
    pregunta: 'Economía circular',
    dimension: 'Ambiental',
    opciones: {
      '1': 'Modelo lineal predominante',
      '2': 'Iniciativas aisladas de reciclaje o reuso',
      '3': 'Programas establecidos en áreas específicas',
      '4': 'Política institucional con metas y seguimiento',
      '5': 'Implementación integral con resultados medibles y alianzas estratégicas'
    },
    recommendations: {
      '1': 'Implemente programas básicos de reciclaje. Identifique oportunidades de reutilización en laboratorios y oficinas.',
      '2': 'Sistematice las iniciativas existentes. Desarrolle una política institucional de economía circular.',
      '3': 'Expanda programas a toda la universidad. Establezca alianzas con empresas locales para valorización de residuos.',
      '4': 'Fortalezca el seguimiento y medición de resultados. Integre economía circular en la investigación académica.',
      '5': 'Liderazgo excepcional. Comparta conocimiento a través de publicaciones y eventos sobre economía circular.'
    }
  },
  {
    id: 'ambiental_residuos_solidos',
    pregunta: 'Gestión de residuos sólidos y peligrosos',
    dimension: 'Ambiental',
    opciones: {
      '1': 'Sin manejo diferenciado',
      '2': 'Separación básica sin seguimiento',
      '3': 'Programa de separación con capacitación',
      '4': 'Gestión integral con indicadores y disposición segura',
      '5': 'Trazabilidad completa, minimización en la fuente y valorización de residuos'
    },
    recommendations: {
      '1': 'Implemente separación básica de residuos (orgánicos, reciclables, ordinarios). Capacite al personal de aseo.',
      '2': 'Establezca protocolos de seguimiento y medición. Identifique y gestione adecuadamente residuos peligrosos.',
      '3': 'Amplíe la capacitación a toda la comunidad universitaria. Implemente puntos ecológicos estratégicos.',
      '4': 'Mantenga el sistema integral. Explore oportunidades de compostaje y alianzas para reciclaje especializado.',
      '5': 'Gestión ejemplar. Considere certificaciones ambientales y genere investigación sobre gestión de residuos.'
    }
  },
  {
    id: 'ambiental_biodiversidad',
    pregunta: 'Conservación de biodiversidad',
    dimension: 'Ambiental',
    opciones: {
      '1': 'No hay inventario ni acciones',
      '2': 'Identificación parcial de áreas verdes y especies',
      '3': 'Programas puntuales de conservación',
      '4': 'Plan integral con monitoreo periódico',
      '5': 'Conservación activa, restauración y conexión con investigación'
    },
    recommendations: {
      '1': 'Realice inventario de áreas verdes y especies. Identifique áreas críticas para conservación.',
      '2': 'Complete el inventario e implemente señalización educativa. Desarrolle guías de flora y fauna del campus.',
      '3': 'Establezca corredores biológicos internos. Implemente programas de jardinería ecológica.',
      '4': 'Mantenga el monitoreo sistemático. Conecte conservación con programas de investigación biológica.',
      '5': 'Campus modelo de biodiversidad. Considere certificación como campus verde y genere publicaciones científicas.'
    }
  },
  {
    id: 'ambiental_cultura_ambiental',
    pregunta: 'Sensibilización y cultura ambiental',
    dimension: 'Ambiental',
    opciones: {
      '1': 'Sin actividades de sensibilización',
      '2': 'Actividades aisladas en fechas conmemorativas',
      '3': 'Programas anuales de educación ambiental',
      '4': 'Cultura ambiental integrada en la vida universitaria',
      '5': 'Cultura institucional consolidada y reconocida'
    },
    recommendations: {
      '1': 'Organice actividades para fechas ambientales clave (Día del Agua, de la Tierra, etc.). Forme grupo de estudiantes ambientalistas.',
      '2': 'Desarrolle programa anual de educación ambiental. Involucre todas las facultades en actividades ambientales.',
      '3': 'Integre cultura ambiental en orientación estudiantil y programas de bienestar. Reconozca iniciativas destacadas.',
      '4': 'Mantenga la integración sistemática. Desarrolle embajadores ambientales en cada facultad.',
      '5': 'Cultura ambiental ejemplar. Comparta experiencias en redes universitarias nacionales e internacionales.'
    }
  },
  {
    id: 'ambiental_educacion_curriculo',
    pregunta: 'Educación ambiental en el currículo',
    dimension: 'Ambiental',
    opciones: {
      '1': 'No se incluyen contenidos ambientales',
      '2': 'Contenidos optativos o aislados',
      '3': 'Integración parcial en algunas facultades',
      '4': 'Inclusión transversal en programas académicos',
      '5': 'Currículo integral con metodologías activas y proyectos reales'
    },
    recommendations: {
      '1': 'Incluya módulos ambientales básicos en materias introductorias. Ofrezca electivas ambientales interdisciplinarias.',
      '2': 'Desarrolle cátedra institucional de sostenibilidad. Forme docentes en pedagogía ambiental.',
      '3': 'Expanda integración a todas las facultades. Desarrolle proyectos ambientales con la comunidad.',
      '4': 'Mantenga la transversalidad curricular. Evalúe competencias ambientales en estudiantes.',
      '5': 'Currículo modelo de sostenibilidad. Considere acreditaciones internacionales en educación sostenible.'
    }
  },
  {
    id: 'ambiental_movilidad_sostenible',
    pregunta: 'Movilidad sostenible',
    dimension: 'Ambiental',
    opciones: {
      '1': 'Sin políticas o incentivos',
      '2': 'Iniciativas aisladas (bicicleteros, buses)',
      '3': 'Plan parcial de movilidad sostenible',
      '4': 'Plan integral con infraestructura y monitoreo',
      '5': 'Alta participación en medios sostenibles con medición de impacto'
    },
    recommendations: {
      '1': 'Instale bicicleteros seguros y promueva uso de bicicleta. Evalúe rutas de transporte público.',
      '2': 'Desarrolle plan integral de movilidad sostenible. Implemente incentivos para transporte compartido.',
      '3': 'Complete infraestructura ciclística. Explore alianzas para transporte eléctrico institucional.',
      '4': 'Mantenga monitoreo de indicadores de movilidad. Implemente aplicaciones de carpooling universitario.',
      '5': 'Movilidad sostenible ejemplar. Genere investigación sobre movilidad urbana sostenible.'
    }
  },

  // DIMENSIÓN SOCIAL
  {
    id: 'social_contratacion_transparente',
    pregunta: 'Políticas de contratación y remuneración transparentes',
    dimension: 'Social',
    opciones: {
      '1': 'No existen políticas ni mecanismos',
      '2': 'Lineamientos básicos sin estrategias de verificación',
      '3': 'Políticas formales con implementación parcial',
      '4': 'Políticas aplicadas con seguimiento y resultados públicos',
      '5': 'Políticas claras, auditadas externamente y con resultados publicados'
    },
    recommendations: {
      '1': 'Desarrolle políticas claras de contratación y remuneración. Establezca comité de recursos humanos.',
      '2': 'Implemente mecanismos de verificación y seguimiento. Publique criterios de contratación y bandas salariales.',
      '3': 'Complete implementación en todas las áreas. Establezca canales de denuncia y seguimiento.',
      '4': 'Mantenga publicación regular de resultados. Implemente encuestas de percepción sobre equidad.',
      '5': 'Transparencia ejemplar. Considere certificaciones en equidad laboral y derechos humanos.'
    }
  },
  {
    id: 'social_prevencion_abusos',
    pregunta: 'Estructuras organizativas que prevengan abusos de poder',
    dimension: 'Social',
    opciones: {
      '1': 'No existen estructuras organizativas',
      '2': 'Protocolos aislados sin aplicación constante',
      '3': 'Estructuras formales con implementación parcial',
      '4': 'Estructuras consolidadas con protocolos de seguimiento',
      '5': 'Sistema independiente con resultados periódicos y participación externa'
    },
    recommendations: {
      '1': 'Establezca protocolos contra acoso y abuso de poder. Cree instancias independientes de denuncia.',
      '2': 'Fortalezca aplicación sistemática de protocolos. Capacite a toda la comunidad universitaria.',
      '3': 'Complete implementación organizacional. Establezca seguimiento estadístico de casos.',
      '4': 'Mantenga monitoreo riguroso. Implemente programas preventivos y de sensibilización continua.',
      '5': 'Sistema robusto de protección. Considere auditorías externas y certificaciones en derechos humanos.'
    }
  },
  {
    id: 'social_evaluacion_docente',
    pregunta: 'Evaluación de la actividad docente y administrativa',
    dimension: 'Social',
    opciones: {
      '1': 'No existen políticas de evaluación',
      '2': 'Evaluaciones ocasionales sin criterios claros',
      '3': 'Evaluaciones formales con limitaciones',
      '4': 'Evaluaciones institucionales periódicas y con retroalimentación',
      '5': 'Sistema integral con seguimiento, transparencia y mejora continua'
    },
    recommendations: {
      '1': 'Desarrolle sistema de evaluación docente y administrativa. Establezca criterios claros y objetivos.',
      '2': 'Formalice criterios de evaluación y periodicidad. Implemente retroalimentación sistemática.',
      '3': 'Mejore limitaciones identificadas. Integre evaluación con planes de desarrollo profesional.',
      '4': 'Mantenga periodicidad rigurosa. Publique resultados agregados y planes de mejora.',
      '5': 'Sistema de evaluación modelo. Comparta mejores prácticas con otras instituciones educativas.'
    }
  },
  {
    id: 'social_clima_laboral',
    pregunta: 'Encuestas de satisfacción y clima laboral',
    dimension: 'Social',
    opciones: {
      '1': 'No se realizan encuestas',
      '2': 'Encuestas esporádicas sin análisis',
      '3': 'Encuestas regulares con implementación parcial',
      '4': 'Encuestas institucionales con seguimiento',
      '5': 'Encuestas consolidadas, con mejora continua y evaluación externa'
    },
    recommendations: {
      '1': 'Implemente encuestas anuales de clima laboral. Establezca línea base de satisfacción.',
      '2': 'Desarrolle análisis sistemático de resultados. Establezca planes de acción específicos.',
      '3': 'Complete implementación de acciones de mejora. Comunique resultados y acciones a la comunidad.',
      '4': 'Mantenga seguimiento riguroso de indicadores. Benchmark con otras universidades.',
      '5': 'Sistema integral de clima laboral. Considere certificaciones como Great Place to Work.'
    }
  },
  {
    id: 'social_derechos_humanos',
    pregunta: 'Respeto por los derechos humanos',
    dimension: 'Social',
    opciones: {
      '1': 'No existen políticas explícitas',
      '2': 'Declaraciones generales sin mecanismos',
      '3': 'Políticas aplicadas parcialmente',
      '4': 'Políticas aplicadas con seguimiento',
      '5': 'Políticas integrales, auditadas y con sanciones'
    },
    recommendations: {
      '1': 'Desarrolle política institucional de derechos humanos. Establezca comité de derechos humanos.',
      '2': 'Implemente mecanismos de protección y denuncia. Desarrolle programas de sensibilización.',
      '3': 'Complete aplicación en todas las áreas. Establezca protocolos de investigación de casos.',
      '4': 'Mantenga seguimiento estadístico y publicación de resultados. Implemente medidas correctivas.',
      '5': 'Protección integral de derechos. Considere adhesión a pactos universitarios internacionales.'
    }
  },
  {
    id: 'social_apoyo_estudiantes',
    pregunta: 'Apoyo a estudiantes de escasos recursos',
    dimension: 'Social',
    opciones: {
      '1': 'No existen programas de apoyo',
      '2': 'Apoyos ocasionales sin cobertura amplia',
      '3': 'Programas básicos con cobertura limitada',
      '4': 'Programas institucionalizados con seguimiento',
      '5': 'Programas integrales con amplia cobertura y alianzas externas'
    },
    recommendations: {
      '1': 'Establezca becas y apoyos económicos básicos. Desarrolle criterios transparentes de asignación.',
      '2': 'Amplíe cobertura de programas existentes. Diversifique tipos de apoyo (alimentario, transporte, etc.).',
      '3': 'Institucionalice programas de apoyo integral. Establezca seguimiento académico de beneficiarios.',
      '4': 'Mantenga robustez de programas. Evalúe impacto en graduación y empleabilidad.',
      '5': 'Apoyo estudiantil ejemplar. Desarrolle alianzas con sector privado y organizaciones sociales.'
    }
  },
  {
    id: 'social_practicas_insercion',
    pregunta: 'Prácticas profesionales e inserción laboral',
    dimension: 'Social',
    opciones: {
      '1': 'No existen programas de prácticas ni inserción',
      '2': 'Prácticas ocasionales sin seguimiento',
      '3': 'Programas limitados en algunas áreas',
      '4': 'Programas institucionales con seguimiento',
      '5': 'Programas consolidados con amplia cobertura y evaluación de impacto'
    },
    recommendations: {
      '1': 'Desarrolle oficina de prácticas y egresados. Establezca convenios básicos con empresas.',
      '2': 'Sistematice seguimiento de prácticas. Desarrolle base de datos de empresas aliadas.',
      '3': 'Amplíe programas a todas las carreras. Implemente ferias de empleo y networking.',
      '4': 'Mantenga seguimiento sistemático de inserción laboral. Desarrolle programas de mentoring.',
      '5': 'Inserción laboral ejemplar. Mantenga seguimiento de egresados y empleabilidad a largo plazo.'
    }
  },
  {
    id: 'social_rsu',
    pregunta: 'Responsabilidad Social Universitaria (RSU)',
    dimension: 'Social',
    opciones: {
      '1': 'No existen políticas de RSU',
      '2': 'Proyectos aislados sin medición de impacto',
      '3': 'Programas establecidos en áreas limitadas',
      '4': 'RSU institucionalizada con seguimiento',
      '5': 'RSU consolidada, con resultados medibles y reconocimientos externos'
    },
    recommendations: {
      '1': 'Desarrolle política institucional de RSU. Identifique necesidades del entorno social.',
      '2': 'Sistematice proyectos existentes bajo estrategia integral. Establezca indicadores de impacto.',
      '3': 'Amplíe programas a todas las facultades. Desarrolle alianzas con organizaciones sociales.',
      '4': 'Mantenga institucionalización robusta. Publique reportes anuales de impacto social.',
      '5': 'RSU modelo nacional. Participe en redes internacionales y obtenga reconocimientos externos.'
    }
  },
  {
    id: 'social_investigacion_actores',
    pregunta: 'Investigación vinculada a actores sociales',
    dimension: 'Social',
    opciones: {
      '1': 'No existen convenios con actores sociales',
      '2': 'Convenios limitados y esporádicos',
      '3': 'Convenios regulares en algunas áreas',
      '4': 'Convenios amplios con impacto verificable',
      '5': 'Convenios consolidados con impacto social medido y reconocido'
    },
    recommendations: {
      '1': 'Establezca convenios básicos con organizaciones comunitarias. Identifique problemas sociales relevantes.',
      '2': 'Formalice alianzas estratégicas para investigación aplicada. Desarrolle metodologías participativas.',
      '3': 'Amplíe convenios a diversas áreas del conocimiento. Establezca fondos para investigación social.',
      '4': 'Mantenga robustez de alianzas. Evalúe y documente impacto social de investigaciones.',
      '5': 'Investigación social ejemplar. Genere modelos replicables y publique casos de éxito.'
    }
  },
  {
    id: 'social_impacto_conocimiento',
    pregunta: 'Impacto social del conocimiento generado',
    dimension: 'Social',
    opciones: {
      '1': 'No se mide el impacto social del conocimiento',
      '2': 'Medición limitada y esporádica',
      '3': 'Medición parcial en algunos programas',
      '4': 'Medición institucional regular y con indicadores',
      '5': 'Medición integral con evaluación externa y difusión pública'
    },
    recommendations: {
      '1': 'Desarrolle metodologías de medición de impacto social. Establezca línea base.',
      '2': 'Sistematice medición en investigaciones aplicadas. Desarrolle casos de estudio.',
      '3': 'Amplíe medición a más programas académicos. Establezca indicadores cuantitativos y cualitativos.',
      '4': 'Mantenga medición sistemática y rigurosa. Publique reportes anuales de impacto.',
      '5': 'Medición de impacto modelo. Comparta metodologías con otras universidades y organismos internacionales.'
    }
  },

  // DIMENSIÓN GOBERNANZA
  {
    id: 'gobernanza_plan_sostenibilidad',
    pregunta: 'Plan o estrategia de sostenibilidad',
    dimension: 'Gobernanza',
    opciones: {
      '1': 'No existe plan',
      '2': 'Borrador sin aprobación formal',
      '3': 'Plan aprobado con implementación limitada',
      '4': 'Plan aprobado y en ejecución con indicadores',
      '5': 'Plan integral, revisado periódicamente y alineado con estándares internacionales'
    },
    recommendations: {
      '1': 'Desarrolle plan estratégico de sostenibilidad integral. Involucre todas las áreas de la universidad.',
      '2': 'Apruebe formalmente el plan en instancias directivas. Asigne recursos y responsabilidades específicas.',
      '3': 'Acelere implementación con cronograma detallado. Establezca comité de seguimiento.',
      '4': 'Mantenga seguimiento riguroso de indicadores. Implemente reportes periódicos de avance.',
      '5': 'Plan de sostenibilidad ejemplar. Alinee con ODS y estándares como GRI o STARS.'
    }
  },
  {
    id: 'gobernanza_comite_academico',
    pregunta: 'Comité académico formalizado',
    dimension: 'Gobernanza',
    opciones: {
      '1': 'No existe comité',
      '2': 'Comité conformado informalmente',
      '3': 'Comité formalizado con reuniones poco frecuentes',
      '4': 'Comité activo con funciones claras',
      '5': 'Comité consolidado con participación transversal y evaluación periódica'
    },
    recommendations: {
      '1': 'Conforme comité académico de sostenibilidad. Incluya representantes de todas las facultades.',
      '2': 'Formalice el comité con reglamento interno. Establezca cronograma regular de reuniones.',
      '3': 'Incremente frecuencia de reuniones y seguimiento. Defina funciones y responsabilidades específicas.',
      '4': 'Mantenga actividad sistemática del comité. Evalúe efectividad y ajuste composición si es necesario.',
      '5': 'Comité modelo de gobernanza académica. Comparta experiencias con redes universitarias.'
    }
  },
  {
    id: 'gobernanza_transparencia',
    pregunta: 'Transparencia organizacional',
    dimension: 'Gobernanza',
    opciones: {
      '1': 'No se publica información sobre la gestión',
      '2': 'Publicación parcial y esporádica',
      '3': 'Publicación regular pero incompleta',
      '4': 'Publicación completa y actualizada de información relevante',
      '5': 'Transparencia total con auditorías externas y acceso abierto'
    },
    recommendations: {
      '1': 'Desarrolle portal de transparencia básico. Publique información financiera y de gestión esencial.',
      '2': 'Establezca cronograma regular de publicaciones. Amplíe tipos de información disponible.',
      '3': 'Complete información en todas las áreas. Implemente solicitudes ciudadanas de información.',
      '4': 'Mantenga actualización sistemática. Implemente formatos de fácil comprensión para la comunidad.',
      '5': 'Transparencia ejemplar. Considere certificaciones en gobierno abierto y rendición de cuentas.'
    }
  },
  {
    id: 'gobernanza_comite_investigacion',
    pregunta: 'Comité de investigación con participación externa',
    dimension: 'Gobernanza',
    opciones: {
      '1': 'No existe comité',
      '2': 'Comité interno sin participación externa',
      '3': 'Comité con participación externa limitada',
      '4': 'Comité con participación externa regular',
      '5': 'Comité consolidado con amplia participación y evaluación periódica'
    },
    recommendations: {
      '1': 'Conforme comité de investigación institucional. Invite representantes del sector productivo y social.',
      '2': 'Incluya participación externa sistemática. Establezca criterios de selección de participantes externos.',
      '3': 'Amplíe participación externa a diversos sectores. Establezca cronograma regular de reuniones.',
      '4': 'Mantenga participación externa activa. Evalúe contribución y retroalimentación de participantes.',
      '5': 'Comité con participación externa modelo. Documente mejores prácticas y comparta experiencias.'
    }
  },
  {
    id: 'gobernanza_vision_mision',
    pregunta: 'Inclusión de sostenibilidad en visión/misión',
    dimension: 'Gobernanza',
    opciones: {
      '1': 'No se menciona sostenibilidad',
      '2': 'Mención genérica sin estrategias asociadas',
      '3': 'Inclusión formal con acciones aisladas',
      '4': 'Inclusión explícita con políticas y programas coherentes',
      '5': 'Inclusión explícita con indicadores y seguimiento del cumplimiento'
    },
    recommendations: {
      '1': 'Revise misión y visión para incluir sostenibilidad explícitamente. Realice proceso participativo.',
      '2': 'Desarrolle estrategias específicas alineadas con misión sostenible. Establezca objetivos medibles.',
      '3': 'Sistematice acciones bajo estrategia integral. Alinee todos los programas con misión sostenible.',
      '4': 'Mantenga coherencia entre políticas y práctica. Evalúe cumplimiento de objetivos sostenibles.',
      '5': 'Misión sostenible ejemplar. Publique reportes anuales de cumplimiento y comparta modelo.'
    }
  },
  {
    id: 'gobernanza_comite_administrativo',
    pregunta: 'Comité administrativo y financiero',
    dimension: 'Gobernanza',
    opciones: {
      '1': 'No existe comité',
      '2': 'Comité informal sin funciones claras',
      '3': 'Comité formalizado con reuniones poco frecuentes',
      '4': 'Comité activo con seguimiento de decisiones',
      '5': 'Comité consolidado con auditoría y evaluación periódica'
    },
    recommendations: {
      '1': 'Conforme comité administrativo y financiero. Establezca funciones y responsabilidades claras.',
      '2': 'Formalice comité con reglamento interno. Establezca cronograma regular de seguimiento.',
      '3': 'Incremente frecuencia y seguimiento de decisiones. Implemente sistemas de control interno.',
      '4': 'Mantenga seguimiento activo y sistemático. Implemente indicadores de gestión administrativa.',
      '5': 'Comité de gestión modelo. Considere auditorías externas y certificaciones en gestión financiera.'
    }
  },
  {
    id: 'gobernanza_codigo_etica',
    pregunta: 'Código de ética institucional',
    dimension: 'Gobernanza',
    opciones: {
      '1': 'No existe código',
      '2': 'Código en borrador o no divulgado',
      '3': 'Código formal con aplicación limitada',
      '4': 'Código vigente, difundido y aplicado',
      '5': 'Código integral con mecanismos de seguimiento y sanción'
    },
    recommendations: {
      '1': 'Desarrolle código de ética institucional participativo. Involucre toda la comunidad universitaria.',
      '2': 'Apruebe y divulgue ampliamente el código. Implemente programas de sensibilización.',
      '3': 'Fortalezca aplicación sistemática. Establezca instancias de interpretación y seguimiento.',
      '4': 'Mantenga difusión y aplicación rigurosa. Evalúe efectividad y actualice periódicamente.',
      '5': 'Código de ética modelo. Comparta experiencias con otras instituciones educativas.'
    }
  },
  {
    id: 'gobernanza_portal_transparencia',
    pregunta: 'Portal de transparencia',
    dimension: 'Gobernanza',
    opciones: {
      '1': 'No existe portal',
      '2': 'Portal básico con información limitada',
      '3': 'Portal con información amplia pero sin actualización regular',
      '4': 'Portal actualizado periódicamente y de fácil navegación',
      '5': 'Portal integral, actualizado y con indicadores de desempeño'
    },
    recommendations: {
      '1': 'Desarrolle portal de transparencia institucional. Incluya información básica de gestión y finanzas.',
      '2': 'Amplíe información disponible en el portal. Mejore diseño y navegabilidad.',
      '3': 'Establezca cronograma de actualización regular. Implemente buscador y filtros.',
      '4': 'Mantenga portal actualizado y funcional. Incluya métricas de uso y satisfacción.',
      '5': 'Portal de transparencia modelo. Considere estándares internacionales y certificaciones.'
    }
  },
  {
    id: 'gobernanza_plan_estrategico',
    pregunta: 'Plan estratégico alineado con sostenibilidad y RSU',
    dimension: 'Gobernanza',
    opciones: {
      '1': 'Plan sin mención a sostenibilidad o RSU',
      '2': 'Mención genérica sin objetivos medibles',
      '3': 'Inclusión parcial de objetivos sostenibles',
      '4': 'Inclusión explícita con indicadores y seguimiento',
      '5': 'Inclusión integral con resultados medibles y reportados públicamente'
    },
    recommendations: {
      '1': 'Revise plan estratégico para incluir sostenibilidad y RSU. Establezca objetivos específicos.',
      '2': 'Desarrolle objetivos medibles y cronograma de implementación. Asigne recursos específicos.',
      '3': 'Complete integración de sostenibilidad en todo el plan. Establezca indicadores de seguimiento.',
      '4': 'Mantenga seguimiento riguroso de indicadores. Publique avances periódicamente.',
      '5': 'Plan estratégico sostenible modelo. Alinee con ODS y comparta experiencias internacionalmente.'
    }
  },
  {
    id: 'gobernanza_conflictos_interes',
    pregunta: 'Prevención de conflictos de interés',
    dimension: 'Gobernanza',
    opciones: {
      '1': 'No hay políticas o mecanismos',
      '2': 'Políticas básicas sin mecanismos de verificación',
      '3': 'Políticas aplicadas de forma parcial',
      '4': 'Políticas aplicadas con seguimiento y sanciones',
      '5': 'Sistema integral con monitoreo constante y transparencia pública'
    },
    recommendations: {
      '1': 'Desarrolle políticas de prevención de conflictos de interés. Establezca definiciones claras.',
      '2': 'Implemente mecanismos de verificación y declaración. Capacite a directivos y funcionarios.',
      '3': 'Complete aplicación en todas las áreas. Establezca protocolos de investigación.',
      '4': 'Mantenga seguimiento sistemático. Publique estadísticas y casos (anonimizados).',
      '5': 'Sistema integral de prevención. Considere auditorías externas y certificaciones en integridad.'
    }
  }
];

export interface UserProfile {
  name: string;
  university: string;
  location: string;
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
    ambiental: {
      score: number;
      strengths: string[];
      weaknesses: string[];
      recommendations: string[];
    };
    social: {
      score: number;
      strengths: string[];
      weaknesses: string[];
      recommendations: string[];
    };
    gobernanza: {
      score: number;
      strengths: string[];
      weaknesses: string[];
      recommendations: string[];
    };
  };
  overallScore: number;
  completedAt: Date;
}