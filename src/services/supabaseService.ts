interface SurveyResponse {
  timestamp: string;
  name: string;
  university: string;
  overallScore: number;
  ambientalScore: number;
  socialScore: number;
  gobernanzaScore: number;
  responses: any[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

// Mapeo de IDs de preguntas a nombres de columnas descriptivas
const QUESTION_ID_TO_COLUMN: Record<string, string> = {
  // AMBIENTAL
  'amb_energias': 'uso_energias_renovables',
  'amb_consumo_energetico': 'consumo_energetico',
  'amb_planes_eficiencia': 'planes_eficiencia_energetica_reduccion_emisiones',
  'amb_agua': 'gestion_eficiente_agua',
  'amb_economia_circular': 'economia_circular',
  'amb_residuos': 'gestion_residuos_solidos_peligrosos',
  'amb_biodiversidad': 'conservacion_biodiversidad',
  'amb_cultura': 'sensibilizacion_cultura_ambiental',
  'amb_curriculo': 'educacion_ambiental_curriculo',
  'amb_movilidad': 'movilidad_sostenible',
  'amb_flexibilidad': 'flexibilidad_laboral_academica',
  
  // SOCIAL
  'soc_transparencia_salarial': 'politicas_contratacion_remuneracion_transparentes',
  'soc_prevencion_abusos': 'estructuras_organizativas_prevencion_abusos_poder',
  'soc_eval_doc_admin': 'politicas_evaluacion_actividad_docente_administrativa',
  'soc_clima': 'implementacion_encuestas_satisfaccion_clima_laboral',
  'soc_ddhh': 'politicas_respeto_derechos_humanos',
  'soc_apoyo_estudiantes': 'programas_apoyo_estudiantes_escasos_recursos',
  'soc_practicas_empleo': 'programas_practicas_profesionales_insercion_laboral',
  'soc_rsu': 'politicas_programas_cooperacion_rsu',
  'soc_investigacion_actores': 'politicas_investigacion_convenios_actores_sociales',
  'soc_transferencia': 'politicas_transferencia_conocimiento_medicion_impacto_social',
  'soc_eval_rsu_interna': 'politicas_internas_promocion_evaluacion_rsu',
  'soc_salud': 'programas_salud_alimentaria_fisica_mental',
  'soc_genero_diversidad': 'genero_diversidad_programas_academicos',
  'soc_impacto_conocimiento': 'evaluacion_impacto_social_conocimiento',
  
  // GOBERNANZA
  'gov_plan': 'plan_estrategia_sostenibilidad',
  'gov_comite_academico': 'comite_academico_formalizado',
  'gov_transparencia': 'transparencia_organizacional',
  'gov_comite_investigacion': 'comite_investigacion_participacion_externa',
  'gov_vision_mision': 'inclusion_sostenibilidad_vision_mision',
  'gov_comite_admin': 'comite_administrativo_financiero',
  'gov_codigo_etica': 'codigo_etica_institucional',
  'gov_portal_transparencia': 'portal_transparencia',
  'gov_plan_estrategico': 'plan_estrategico_alineado_sostenibilidad_rsu',
  'gov_conflicto_interes': 'prevencion_conflictos_interes',
  'gov_responsable_esg': 'area_responsable_esg_rsu',
  'gov_buen_gobierno': 'codigo_buen_gobierno',
  'gov_politicas_sostenibilidad': 'politicas_sostenibilidad_formalizadas',
  'gov_comite_auditoria': 'comite_auditoria_interno',
  'gov_riesgos_esg': 'evaluacion_riesgos_esg',
  'gov_equidad_genero': 'equidad_genero_directivas',
  'gov_stakeholders': 'participacion_stakeholders',
  'gov_portal_transparencia_inst': 'portal_transparencia_institucional'
};

interface SupabaseConfig {
  url: string;
  anonKey: string;
}

class SupabaseService {
  private config: SupabaseConfig;
  private isConfigured: boolean = false;

  constructor() {
    // Configuration from environment or defaults
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rydxjcbyqrvzzxwnbkst.supabase.co';
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5ZHhqY2J5cXJ2enp4d25ia3N0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0ODg1MjYsImV4cCI6MjA3NDA2NDUyNn0.TiRvuiaTXVRFOXOAV5sZ3buP1znUMhT_crr1qstjeWY';
    
    this.config = {
      url: supabaseUrl,
      anonKey: supabaseAnonKey
    };
    
    this.isConfigured = !!(supabaseUrl && supabaseAnonKey);
    
    if (this.isConfigured) {
      console.log('✅ Supabase configurado correctamente');
      console.log('🔗 URL:', supabaseUrl);
    } else {
      console.warn('⚠️ Supabase no configurado correctamente');
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.config.url}/rest/v1/${endpoint}`;
    
    const headers = {
      'apikey': this.config.anonKey,
      'Authorization': `Bearer ${this.config.anonKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
      ...options.headers
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Supabase API Error: ${response.status} - ${errorText}`);
      }

      // Some endpoints might not return JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text();
    } catch (error) {
      console.error('❌ Error en Supabase request:', error);
      throw error;
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  async saveResponse(data: SurveyResponse): Promise<boolean> {
    const startTime = Date.now();
    
    try {
      console.log('💾 Iniciando guardado en Supabase...');
      console.log('📋 Datos recibidos:', {
        name: data.name,
        university: data.university,
        responses: data.responses?.length || 0,
        overallScore: data.overallScore,
        dimensions: {
          ambiental: data.ambientalScore,
          social: data.socialScore,
          gobernanza: data.gobernanzaScore
        }
      });

      // Validaciones previas
      if (!this.isConfigured) {
        throw new Error('Supabase no está configurado correctamente');
      }

      if (!data.name || !data.university) {
        throw new Error('Nombre y universidad son requeridos');
      }

      if (!data.responses || data.responses.length === 0) {
        console.warn('⚠️ No hay respuestas de preguntas para guardar');
      }

      const sessionId = this.generateSessionId();
      console.log('🎯 Session ID generado:', sessionId);

      // Preparar datos base con nombres de columnas en español
      const surveyData: any = {
        timestamp: data.timestamp,
        nombre: data.name,
        universidad: data.university,
        puntuacion_general: Number(data.overallScore?.toFixed(1)) || 0,
        puntuacion_ambiental: Number(data.ambientalScore?.toFixed(1)) || 0,
        puntuacion_social: Number(data.socialScore?.toFixed(1)) || 0,
        puntuacion_gobernanza: Number(data.gobernanzaScore?.toFixed(1)) || 0,
        session_id: sessionId,
        fortalezas: data.strengths || [],
        debilidades: data.weaknesses || [],
        recomendaciones: data.recommendations || []
      };

      // Mapear respuestas individuales con validación mejorada
      let responsesProcessed = 0;
      let responsesSkipped = 0;
      
      if (data.responses && data.responses.length > 0) {
        console.log(`🗒️ Procesando ${data.responses.length} respuestas individuales...`);
        
        data.responses.forEach((response: any, index: number) => {
          try {
            if (!response.questionId) {
              console.warn(`⚠️ Respuesta ${index + 1} sin questionId, omitiendo`);
              responsesSkipped++;
              return;
            }
            
            const columnName = QUESTION_ID_TO_COLUMN[response.questionId];
            if (!columnName) {
              console.warn(`⚠️ Question ID no reconocido: ${response.questionId}`);
              responsesSkipped++;
              return;
            }
            
            // Validar y limpiar score
            const score = parseInt(response.score);
            if (isNaN(score) || score < 1 || score > 5) {
              console.warn(`⚠️ Score inválido para ${response.questionId}: ${response.score}`);
              responsesSkipped++;
              return;
            }
            
            // Guardar score y respuesta
            surveyData[columnName] = score;
            surveyData[`${columnName}_respuesta`] = this.cleanResponseText(
              response.answer || response.response || response.selectedOption || ''
            );
            
            responsesProcessed++;
            
          } catch (responseError) {
            console.error(`❌ Error procesando respuesta ${index + 1}:`, responseError);
            responsesSkipped++;
          }
        });
        
        console.log(`✅ Respuestas procesadas: ${responsesProcessed}, omitidas: ${responsesSkipped}`);
      }

      // Log de datos finales (sin incluir textos largos)
      console.log('📊 Datos preparados para inserción:', {
        nombre: surveyData.nombre,
        universidad: surveyData.universidad,
        puntuaciones: {
          general: surveyData.puntuacion_general,
          ambiental: surveyData.puntuacion_ambiental,
          social: surveyData.puntuacion_social,
          gobernanza: surveyData.puntuacion_gobernanza
        },
        responsesCount: responsesProcessed,
        fortalezas: surveyData.fortalezas?.length || 0,
        debilidades: surveyData.debilidades?.length || 0,
        recomendaciones: surveyData.recomendaciones?.length || 0
      });

      // Insertar en base de datos
      console.log('💾 Insertando en base de datos...');
      const result = await this.makeRequest('survey_responses', {
        method: 'POST',
        body: JSON.stringify(surveyData)
      });

      if (!result || !Array.isArray(result) || result.length === 0) {
        throw new Error('Respuesta inválida del servidor: no se pudo crear el registro');
      }

      const savedRecord = result[0];
      const processingTime = Date.now() - startTime;
      
      console.log('✅ ¡Guardado exitoso!');
      console.log('🏆 Resumen:', {
        id: savedRecord.id,
        nombre: savedRecord.nombre,
        universidad: savedRecord.universidad,
        responsesProcessed,
        processingTime: `${processingTime}ms`
      });
      
      return true;

    } catch (error) {
      const processingTime = Date.now() - startTime;
      console.error('❌ Error guardando en Supabase:', {
        error: error instanceof Error ? error.message : error,
        processingTime: `${processingTime}ms`,
        dataReceived: {
          name: data?.name,
          university: data?.university,
          responsesCount: data?.responses?.length || 0
        }
      });
      
      // Guardar backup local como respaldo
      try {
        this.saveToLocalBackup(data);
        console.log('💾 Backup local guardado exitosamente');
      } catch (backupError) {
        console.error('❌ Error guardando backup local:', backupError);
      }
      
      throw error;
    }
  }
  
  private cleanResponseText(text: string): string {
    if (typeof text !== 'string') {
      return String(text || '');
    }
    
    return text
      .trim()
      .replace(/\s+/g, ' ')
      .substring(0, 500); // Limitar longitud
  }


  private saveToLocalBackup(data: SurveyResponse): void {
    try {
      const existingData = localStorage.getItem('supabase_backup') || '[]';
      const backupData = JSON.parse(existingData);
      backupData.push({
        ...data,
        backupTimestamp: new Date().toISOString()
      });
      localStorage.setItem('supabase_backup', JSON.stringify(backupData));
      console.log('💾 Respuesta guardada en backup local');
    } catch (error) {
      console.error('❌ Error guardando backup local:', error);
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      console.log('🔍 Probando conexión con Supabase...');
      
      if (!this.isConfigured) {
        console.error('❌ Supabase no está configurado');
        return false;
      }

      // Simple test: try to query survey_responses table
      await this.makeRequest('survey_responses?select=id&limit=1');
      
      console.log('✅ Conexión con Supabase exitosa');
      return true;
    } catch (error) {
      console.error('❌ Error de conexión con Supabase:', error);
      return false;
    }
  }

  async getSurveyStatistics(): Promise<any> {
    try {
      // Get basic statistics with new column names
      const stats = await this.makeRequest('survey_responses?select=universidad,puntuacion_general,puntuacion_ambiental,puntuacion_social,puntuacion_gobernanza,timestamp,nombre');
      return stats;
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas:', error);
      return [];
    }
  }

  async getBackupData(): Promise<SurveyResponse[]> {
    try {
      const backupData = localStorage.getItem('supabase_backup');
      return backupData ? JSON.parse(backupData) : [];
    } catch (error) {
      console.error('Error loading backup data:', error);
      return [];
    }
  }

  clearBackupData(): void {
    localStorage.removeItem('supabase_backup');
    console.log('🗑️ Backup local limpiado');
  }

  // Method to manually test saving a sample response
  async testSaveResponse(): Promise<boolean> {
    const testData: SurveyResponse = {
      timestamp: new Date().toISOString(),
      name: 'Usuario de Prueba Mejorado',
      university: 'Universidad Nacional de Colombia',
      overallScore: 4.2,
      ambientalScore: 4.4,
      socialScore: 4.1,
      gobernanzaScore: 4.1,
      responses: [
        // Respuestas ambientales
        { 
          questionId: 'amb_energias', 
          score: 4, 
          answer: '4. Cobertura significativa (>30%) del consumo'
        },
        { 
          questionId: 'amb_consumo_energetico', 
          score: 5, 
          answer: '5. Reducción sostenida con reporte anual público'
        },
        { 
          questionId: 'amb_residuos', 
          score: 4, 
          answer: '4. Gestión integral con indicadores y disposición segura'
        },
        // Respuestas sociales
        { 
          questionId: 'soc_transparencia_salarial', 
          score: 3, 
          answer: '3. Políticas formales con implementación parcial'
        },
        { 
          questionId: 'soc_apoyo_estudiantes', 
          score: 5, 
          answer: '5. Programas integrales con amplia cobertura y alianzas externas'
        },
        { 
          questionId: 'soc_ddhh', 
          score: 4, 
          answer: '4. Políticas aplicadas con seguimiento'
        },
        // Respuestas de gobernanza
        { 
          questionId: 'gov_plan', 
          score: 4, 
          answer: '4. Plan aprobado en ejecución con indicadores'
        },
        { 
          questionId: 'gov_transparencia', 
          score: 3, 
          answer: '3. Publicación regular pero incompleta'
        },
        { 
          questionId: 'gov_codigo_etica', 
          score: 5, 
          answer: '5. Código integral con mecanismos de seguimiento y sanción'
        }
      ],
      strengths: [
        'Excelente gestión de energías renovables y consumo energético',
        'Programas de apoyo estudiantil sobresalientes',
        'Código de ética robusto y bien implementado',
        'Plan de sostenibilidad estructurado'
      ],
      weaknesses: [
        'Transparencia salarial requiere mayor desarrollo',
        'Publicación de información organizacional necesita mejoras'
      ],
      recommendations: [
        'Desarrollar portal de transparencia salarial completo',
        'Implementar sistema de publicación de información más regular',
        'Expandir programas de eficiencia energética',
        'Fortalecer mecanismos de participación estudiantil en decisiones institucionales'
      ]
    };
    
    return await this.saveResponse(testData);
  }

  // Migrate data from Google Sheets backup to Supabase
  async migrateFromGoogleSheetsBackup(): Promise<boolean> {
    try {
      const backupData = localStorage.getItem('sheets_backup');
      if (!backupData) {
        console.log('ℹ️ No hay datos de backup de Google Sheets para migrar');
        return true;
      }

      const data = JSON.parse(backupData);
      console.log(`🔄 Migrando ${data.length} registros desde backup de Google Sheets...`);

      let migrated = 0;
      for (const item of data) {
        try {
          await this.saveResponse(item);
          migrated++;
        } catch (error) {
          console.warn('⚠️ Error migrando registro:', error);
        }
      }

      console.log(`✅ Migración completada: ${migrated}/${data.length} registros`);
      
      // Clear old backup after successful migration
      if (migrated > 0) {
        localStorage.removeItem('sheets_backup');
        console.log('🗑️ Backup de Google Sheets limpiado tras migración exitosa');
      }

      return migrated > 0;
    } catch (error) {
      console.error('❌ Error en migración:', error);
      return false;
    }
  }

  getStatus(): { isConfigured: boolean; hasBackupData: boolean; url: string } {
    return {
      isConfigured: this.isConfigured,
      hasBackupData: localStorage.getItem('supabase_backup') !== null,
      url: this.config.url
    };
  }

  isReady(): boolean {
    return this.isConfigured;
  }
}

export const supabaseService = new SupabaseService();
export type { SurveyResponse };

// Add global debugging function
(window as any).testSupabase = async () => {
  console.log('🧪 Testing Supabase integration...');
  console.log('📊 Status:', supabaseService.getStatus());
  
  try {
    const connectionTest = await supabaseService.testConnection();
    console.log('🔗 Connection test:', connectionTest ? 'SUCCESS' : 'FAILED');
    
    if (connectionTest) {
      const saveTest = await supabaseService.testSaveResponse();
      console.log('💾 Save test:', saveTest ? 'SUCCESS' : 'FAILED');
      return saveTest;
    }
    return false;
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
};

// Add global migration function
(window as any).migrateToSupabase = async () => {
  console.log('🔄 Starting migration from Google Sheets to Supabase...');
  try {
    const result = await supabaseService.migrateFromGoogleSheetsBackup();
    console.log('✅ Migration completed:', result);
    return result;
  } catch (error) {
    console.error('❌ Migration failed:', error);
    return false;
  }
};