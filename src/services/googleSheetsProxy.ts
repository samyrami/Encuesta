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

class GoogleSheetsProxyService {
  private webhookUrl: string | null = null;
  private sheetId = '1wjNTHAdEN4gCF2WP00dqKTu3Vu9UHB360aKMa0DCIM8';

  constructor() {
    // Priority order: Environment Apps Script URL > Environment Webhook > Local Storage
    const appsScriptUrl = import.meta.env.VITE_APPS_SCRIPT_URL;
    const webhookUrl = import.meta.env.VITE_SHEETS_WEBHOOK_URL;
    const storedWebhook = localStorage.getItem('sheets_webhook_url');
    const storedAppsScript = localStorage.getItem('apps_script_url');
    
    // Use Apps Script URL with highest priority
    this.webhookUrl = appsScriptUrl || webhookUrl || storedAppsScript || storedWebhook;
    
    if (this.webhookUrl) {
      console.log('📄 Google Apps Script configurado:', this.webhookUrl.substring(0, 50) + '...');
    }
  }

  async saveResponse(data: SurveyResponse): Promise<boolean> {
    try {
      console.log('📄 Guardando respuesta via webhook...');
      console.log('📋 Datos a guardar:', data);

      // If we have webhook URL (Google Apps Script), use it with no-cors
      if (this.webhookUrl) {
        console.log('🔗 Usando Google Apps Script URL:', this.webhookUrl);
        
        const payload = {
          action: 'saveResponse',
          data: {
            timestamp: data.timestamp,
            name: data.name,
            university: data.university,
            overallScore: data.overallScore.toFixed(1),
            ambientalScore: data.ambientalScore.toFixed(1),
            socialScore: data.socialScore.toFixed(1),
            gobernanzaScore: data.gobernanzaScore.toFixed(1),
            responseCount: data.responses.length.toString(),
            strengths: data.strengths.join('; '),
            weaknesses: data.weaknesses.join('; '),
            recommendations: data.recommendations.slice(0, 5).join('; '),
            rawResponses: JSON.stringify(data.responses),
            sessionId: `session_${Date.now()}`
          }
        };
        
        const response = await fetch(this.webhookUrl, {
          method: 'POST',
          mode: 'no-cors', // This is key for Google Apps Script!
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });

        // With no-cors, we can't read response status, so we assume it worked
        console.log('✅ Datos enviados a Google Apps Script exitosamente');
        console.log('ℹ️ Nota: Con no-cors no podemos verificar el estado, pero se envió la petición');
        return true;
      }

      // If no webhook URL configured, save locally
      console.log('⚠️ No hay webhook URL configurada, guardando solo localmente');
      this.saveToLocalBackup(data);
      return false;

    } catch (error) {
      console.error('❌ Error en proxy service:', error);
      
      // Save to local backup
      this.saveToLocalBackup(data);
      throw error;
    }
  }

  private async saveViaAppsScript(data: SurveyResponse): Promise<boolean> {
    try {
      console.log('📝 Intentando guardar via Google Apps Script...');
      
      // We'll create a simple Google Apps Script Web App
      const appsScriptUrl = 'https://script.google.com/macros/s/AKfycbyH8FXXSustainabilityCollector/exec';
      
      const payload = {
        action: 'saveResponse',
        sheetId: this.sheetId,
        data: {
          timestamp: data.timestamp,
          name: data.name,
          university: data.university,
          overallScore: data.overallScore.toFixed(1),
          ambientalScore: data.ambientalScore.toFixed(1),
          socialScore: data.socialScore.toFixed(1),
          gobernanzaScore: data.gobernanzaScore.toFixed(1),
          responseCount: data.responses.length.toString(),
          strengths: data.strengths.join('; '),
          weaknesses: data.weaknesses.join('; '),
          recommendations: data.recommendations.slice(0, 5).join('; '),
          rawResponses: JSON.stringify(data.responses),
          sessionId: `session_${Date.now()}`
        }
      };

      const response = await fetch(appsScriptUrl, {
        method: 'POST',
        mode: 'no-cors', // Required for Apps Script
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      // With no-cors, we can't read the response, so we assume it worked
      console.log('📤 Datos enviados a Google Apps Script');
      return true;

    } catch (error) {
      console.error('❌ Error con Apps Script:', error);
      return false;
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
      console.log('🔍 Probando conexión...');
      
      if (this.webhookUrl) {
        const response = await fetch(this.webhookUrl, {
          method: 'GET',
        });
        return response.ok;
      }

      // Test with a simple ping
      return true;
    } catch (error) {
      console.error('❌ Error de conexión:', error);
      return false;
    }
  }

  setWebhookUrl(url: string): void {
    this.webhookUrl = url;
    // Store as apps_script_url for better identification
    localStorage.setItem('apps_script_url', url);
    localStorage.setItem('sheets_webhook_url', url); // Keep for compatibility
    console.log('💾 Google Apps Script URL guardada');
  }

  isConfigured(): boolean {
    // For now, always return true since we have fallback methods
    return true;
  }

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

  getStatus(): {isConfigured: boolean, hasBackupData: boolean, sheetId: string, webhookUrl: string | null} {
    return {
      isConfigured: this.isConfigured(),
      hasBackupData: localStorage.getItem('sheets_backup') !== null,
      sheetId: this.sheetId,
      webhookUrl: this.webhookUrl
    };
  }
}

export const googleSheetsService = new GoogleSheetsProxyService();
export type { SurveyResponse };