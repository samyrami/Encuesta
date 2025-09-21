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
    try {
      console.log('💾 Guardando respuesta en Supabase...');
      console.log('📋 Datos a guardar:', data);

      if (!this.isConfigured) {
        throw new Error('Supabase no está configurado correctamente');
      }

      const sessionId = this.generateSessionId();

      // Prepare base data
      const surveyData: any = {
        timestamp: data.timestamp,
        name: data.name,
        university: data.university,
        overall_score: data.overallScore,
        ambiental_score: data.ambientalScore,
        social_score: data.socialScore,
        gobernanza_score: data.gobernanzaScore,
        session_id: sessionId,
        strengths: data.strengths || [],
        weaknesses: data.weaknesses || [],
        recommendations: data.recommendations || []
      };

      // Map individual responses to specific columns
      if (data.responses && data.responses.length > 0) {
        data.responses.forEach((response: any) => {
          if (response.questionId) {
            // Set score column
            surveyData[response.questionId] = response.score;
            // Set answer text column
            surveyData[`${response.questionId}_respuesta`] = response.answer || response.response || '';
          }
        });
      }

      console.log('📊 Insertando datos detallados en tabla...');
      const result = await this.makeRequest('survey_responses', {
        method: 'POST',
        body: JSON.stringify(surveyData)
      });

      if (!result || !result[0]) {
        throw new Error('No se pudo guardar la respuesta');
      }

      console.log('✅ Datos guardados exitosamente en Supabase con ID:', result[0].id);
      return true;

    } catch (error) {
      console.error('❌ Error guardando en Supabase:', error);
      
      // Save to local backup as fallback
      this.saveToLocalBackup(data);
      
      throw error;
    }
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
      // Get basic statistics
      const stats = await this.makeRequest('survey_responses?select=university,overall_score,ambiental_score,social_score,gobernanza_score,timestamp,name');
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
      name: 'Usuario de Prueba',
      university: 'Universidad de Prueba',
      overallScore: 4.2,
      ambientalScore: 4.1,
      socialScore: 4.5,
      gobernanzaScore: 4.0,
      responses: [
        { 
          questionId: 'ambiental_1', 
          score: 4, 
          answer: '4. Implementado de manera amplia',
          question: '¿Cómo evalúa el nivel de implementación de políticas ambientales en su universidad?'
        },
        { 
          questionId: 'social_1', 
          score: 5, 
          answer: '5. Completamente implementado',
          question: '¿En qué medida su universidad promueve la equidad e inclusión social?'
        },
        { 
          questionId: 'gobernanza_1', 
          score: 4, 
          answer: '4. Implementado de manera amplia',
          question: '¿Cómo califica la transparencia en los procesos de toma de decisiones?'
        }
      ],
      strengths: ['Gestión ambiental excelente', 'Responsabilidad social sólida', 'Liderazgo en sostenibilidad'],
      weaknesses: ['Transparencia mejorable'],
      recommendations: ['Mejorar comunicación institucional', 'Implementar políticas de sostenibilidad', 'Fortalecer procesos participativos']
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