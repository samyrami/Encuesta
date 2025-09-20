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

class GoogleSheetsService {
  private apiKey: string | null = null;
  private sheetId = '1wjNTHAdEN4gCF2WP00dqKTu3Vu9UHB360aKMa0DCIM8';

  constructor() {
    // Intentar obtener API key desde variables de entorno
    this.apiKey = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY || null;
  }

  private getApiKey(): string {
    if (this.apiKey) return this.apiKey;
    
    // Intentar desde localStorage
    const storedKey = localStorage.getItem('google_sheets_api_key');
    if (storedKey) {
      this.apiKey = storedKey;
      return storedKey;
    }
    
    throw new Error('Google Sheets API key not configured');
  }

  async saveResponse(data: SurveyResponse): Promise<boolean> {
    try {
      console.log('📄 Guardando respuesta en Google Sheets...');
      console.log('📋 Datos a guardar:', data);
      
      const apiKey = this.getApiKey();
      console.log('🔑 API Key configurada:', apiKey ? 'Sí' : 'No');
      
      // Try different sheet names in order of preference
      const sheetNames = ['Sheet1', 'Hoja1', 'Responses', 'Datos'];
      let savedSuccessfully = false;
      let lastError = null;
      
      for (const sheetName of sheetNames) {
        try {
          const range = `${sheetName}!A:M`; // Extended to M to accommodate all columns
          
          // Add header row if this is the first entry
          const headerValues = [
            'Timestamp',
            'Nombre', 
            'Universidad',
            'Puntuación General',
            'Puntuación Ambiental',
            'Puntuación Social', 
            'Puntuación Gobernanza',
            'Número Respuestas',
            'Fortalezas',
            'Debilidades',
            'Recomendaciones',
            'Respuestas Completas',
            'ID Sesión'
          ];
          
          // Preparar datos para insertar
          const dataValues = [
            data.timestamp,
            data.name,
            data.university,
            data.overallScore.toFixed(1),
            data.ambientalScore.toFixed(1),
            data.socialScore.toFixed(1),
            data.gobernanzaScore.toFixed(1),
            data.responses.length.toString(),
            data.strengths.join('; '),
            data.weaknesses.join('; '),
            data.recommendations.slice(0, 5).join('; '),
            JSON.stringify(data.responses),
            `session_${Date.now()}`
          ];

          // First, try to check if sheet exists and has headers
          const checkUrl = `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values/${sheetName}!A1:M1?key=${apiKey}`;
          const checkResponse = await fetch(checkUrl);
          
          let needsHeaders = true;
          if (checkResponse.ok) {
            const checkResult = await checkResponse.json();
            needsHeaders = !checkResult.values || checkResult.values.length === 0 || 
                          !checkResult.values[0] || checkResult.values[0].length === 0;
          }
          
          // If we need headers, add them first
          if (needsHeaders) {
            console.log(`📋 Añadiendo encabezados a ${sheetName}...`);
            const headerUrl = `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values/${sheetName}!A1:append?valueInputOption=USER_ENTERED&key=${apiKey}`;
            const headerResponse = await fetch(headerUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                values: [headerValues]
              })
            });
            
            if (!headerResponse.ok) {
              const errorText = await headerResponse.text();
              console.warn(`⚠️ No se pudieron añadir encabezados a ${sheetName}:`, errorText);
            }
          }
          
          // Now append the data
          const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values/${range}:append?valueInputOption=USER_ENTERED&key=${apiKey}`;
          console.log(`🔗 Intentando guardar en ${sheetName}:`, url);
          
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              values: [dataValues]
            })
          });

          if (response.ok) {
            const result = await response.json();
            console.log(`✅ Respuesta guardada exitosamente en ${sheetName}:`, result);
            savedSuccessfully = true;
            break;
          } else {
            const errorText = await response.text();
            console.warn(`⚠️ Error en ${sheetName} (${response.status}):`, errorText);
            lastError = new Error(`${sheetName}: ${response.status} - ${errorText}`);
          }
          
        } catch (sheetError) {
          console.warn(`⚠️ Error probando ${sheetName}:`, sheetError);
          lastError = sheetError;
          continue;
        }
      }
      
      if (!savedSuccessfully) {
        throw lastError || new Error('No se pudo guardar en ninguna hoja');
      }
      
      return true;

    } catch (error) {
      console.error('❌ Error guardando en Google Sheets:', error);
      
      // Guardar en localStorage como backup
      this.saveToLocalBackup(data);
      
      throw error;
    }
  }

  private saveToLocalBackup(data: SurveyResponse): void {
    try {
      const existingData = localStorage.getItem('sheets_backup') || '[]';
      const backupData = JSON.parse(existingData);
      backupData.push(data);
      localStorage.setItem('sheets_backup', JSON.stringify(backupData));
      console.log('💾 Respuesta guardada en backup local');
    } catch (error) {
      console.error('❌ Error guardando backup local:', error);
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const apiKey = this.getApiKey();
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}?key=${apiKey}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Connection test failed: ${response.status}`);
      }

      console.log('✅ Conexión con Google Sheets exitosa');
      return true;
    } catch (error) {
      console.error('❌ Error de conexión con Google Sheets:', error);
      return false;
    }
  }

  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
    localStorage.setItem('google_sheets_api_key', apiKey);
  }

  isConfigured(): boolean {
    return !!(import.meta.env.VITE_GOOGLE_SHEETS_API_KEY || localStorage.getItem('google_sheets_api_key'));
  }

  async getBackupData(): Promise<SurveyResponse[]> {
    try {
      const backupData = localStorage.getItem('sheets_backup');
      return backupData ? JSON.parse(backupData) : [];
    } catch (error) {
      console.error('Error loading backup data:', error);
      return [];
    }
  }

  clearBackupData(): void {
    localStorage.removeItem('sheets_backup');
  }

  // Method to manually test saving a sample response
  async testSaveResponse(): Promise<boolean> {
    const testData: SurveyResponse = {
      timestamp: new Date().toISOString(),
      name: 'Test User',
      university: 'Universidad de Prueba',
      overallScore: 4.2,
      ambientalScore: 4.1,
      socialScore: 4.5,
      gobernanzaScore: 4.0,
      responses: [{questionId: 'test', score: 4, answer: 'Test answer'}],
      strengths: ['Gestión ambiental', 'Responsabilidad social'],
      weaknesses: ['Transparencia'],
      recommendations: ['Mejorar comunicación', 'Implementar políticas']
    };
    
    return await this.saveResponse(testData);
  }

  // Get detailed status for debugging
  getStatus(): {isConfigured: boolean, hasBackupData: boolean, sheetId: string} {
    return {
      isConfigured: this.isConfigured(),
      hasBackupData: localStorage.getItem('sheets_backup') !== null,
      sheetId: this.sheetId
    };
  }
}

export const googleSheetsService = new GoogleSheetsService();
export type { SurveyResponse };

// Add global debugging function
(window as any).testGoogleSheets = async () => {
  console.log('🧪 Testing Google Sheets integration...');
  console.log('📊 Status:', googleSheetsService.getStatus());
  
  try {
    const result = await googleSheetsService.testSaveResponse();
    console.log('✅ Test completed successfully:', result);
    return result;
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
};
