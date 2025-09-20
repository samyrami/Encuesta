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
      console.log('📊 Guardando respuesta en Google Sheets...');
      
      const apiKey = this.getApiKey();
      const range = 'Hoja1!A:L'; // Ajustar según las columnas necesarias
      
      // Preparar datos para insertar
      const values = [[
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
        data.recommendations.slice(0, 3).join('; '),
        JSON.stringify(data.responses) // Respuestas completas en JSON
      ]];

      // URL de la API de Google Sheets
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values/${range}:append?valueInputOption=USER_ENTERED&key=${apiKey}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: values
        })
      });

      if (!response.ok) {
        throw new Error(`Google Sheets API error: ${response.status} - ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Respuesta guardada exitosamente:', result);
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
}

export const googleSheetsService = new GoogleSheetsService();
export type { SurveyResponse };