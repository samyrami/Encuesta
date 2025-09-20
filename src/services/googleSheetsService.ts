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

interface ServiceAccountConfig {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
}

class GoogleSheetsService {
  private serviceAccount: ServiceAccountConfig | null = null;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;
  private sheetId = '1wjNTHAdEN4gCF2WP00dqKTu3Vu9UHB360aKMa0DCIM8';

  constructor() {
    this.loadServiceAccount();
  }

  private loadServiceAccount() {
    // Try to load from environment variable first
    const envConfig = import.meta.env.VITE_GOOGLE_SERVICE_ACCOUNT;
    if (envConfig) {
      try {
        this.serviceAccount = JSON.parse(envConfig);
        return;
      } catch (error) {
        console.warn('Failed to parse VITE_GOOGLE_SERVICE_ACCOUNT');
      }
    }

    // Try to load from localStorage
    const storedConfig = localStorage.getItem('google_service_account');
    if (storedConfig) {
      try {
        this.serviceAccount = JSON.parse(storedConfig);
      } catch (error) {
        console.warn('Failed to parse stored service account config');
      }
    }
  }

  // Create JWT token for service account authentication
  private async createJWT(): Promise<string> {
    if (!this.serviceAccount) {
      throw new Error('Service account not configured');
    }

    const header = {
      "alg": "RS256",
      "typ": "JWT"
    };

    const now = Math.floor(Date.now() / 1000);
    const payload = {
      "iss": this.serviceAccount.client_email,
      "scope": "https://www.googleapis.com/auth/spreadsheets",
      "aud": "https://oauth2.googleapis.com/token",
      "exp": now + 3600, // 1 hour
      "iat": now
    };

    const encodedHeader = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    const encodedPayload = btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    
    const signatureInput = encodedHeader + '.' + encodedPayload;
    
    // Import the private key for signing
    const privateKey = this.serviceAccount.private_key.replace(/\\n/g, '\n');
    
    try {
      const keyData = await crypto.subtle.importKey(
        'pkcs8',
        this.pemToArrayBuffer(privateKey),
        {
          name: 'RSASSA-PKCS1-v1_5',
          hash: 'SHA-256'
        },
        false,
        ['sign']
      );

      const signature = await crypto.subtle.sign(
        'RSASSA-PKCS1-v1_5',
        keyData,
        new TextEncoder().encode(signatureInput)
      );

      const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)))
        .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

      return signatureInput + '.' + encodedSignature;
    } catch (error) {
      console.error('Error creating JWT:', error);
      throw new Error('Failed to create JWT token');
    }
  }

  private pemToArrayBuffer(pem: string): ArrayBuffer {
    const pemHeader = "-----BEGIN PRIVATE KEY-----";
    const pemFooter = "-----END PRIVATE KEY-----";
    const pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length);
    const binaryString = atob(pemContents);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  // Get access token using service account
  private async getAccessToken(): Promise<string> {
    // Check if we have a valid cached token
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    if (!this.serviceAccount) {
      throw new Error('Service account not configured');
    }

    try {
      const jwt = await this.createJWT();
      
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          'grant_type': 'urn:ietf:params:oauth:grant-type:jwt-bearer',
          'assertion': jwt
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OAuth2 token request failed: ${response.status} - ${errorText}`);
      }

      const tokenData = await response.json();
      this.accessToken = tokenData.access_token;
      this.tokenExpiry = Date.now() + (tokenData.expires_in * 1000) - 60000; // Refresh 1 minute before expiry

      return this.accessToken;
    } catch (error) {
      console.error('Error getting access token:', error);
      throw error;
    }
  }

  async saveResponse(data: SurveyResponse): Promise<boolean> {
    try {
      console.log('📄 Guardando respuesta en Google Sheets...');
      console.log('📋 Datos a guardar:', data);
      
      const accessToken = await this.getAccessToken();
      console.log('🔑 Access token obtenido:', accessToken ? 'Sí' : 'No');
      
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
          const checkUrl = `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values/${sheetName}!A1:M1`;
          const checkResponse = await fetch(checkUrl, {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });
          
          let needsHeaders = true;
          if (checkResponse.ok) {
            const checkResult = await checkResponse.json();
            needsHeaders = !checkResult.values || checkResult.values.length === 0 || 
                          !checkResult.values[0] || checkResult.values[0].length === 0;
          }
          
          // If we need headers, add them first
          if (needsHeaders) {
            console.log(`📋 Añadiendo encabezados a ${sheetName}...`);
            const headerUrl = `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values/${sheetName}!A1:append?valueInputOption=USER_ENTERED`;
            const headerResponse = await fetch(headerUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
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
          const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values/${range}:append?valueInputOption=USER_ENTERED`;
          console.log(`🔗 Intentando guardar en ${sheetName}:`, url);
          
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
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
      const accessToken = await this.getAccessToken();
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Connection test failed: ${response.status} - ${errorText}`);
      }

      console.log('✅ Conexión con Google Sheets exitosa');
      return true;
    } catch (error) {
      console.error('❌ Error de conexión con Google Sheets:', error);
      return false;
    }
  }

  setServiceAccount(serviceAccountJson: string): void {
    try {
      const config = JSON.parse(serviceAccountJson);
      this.serviceAccount = config;
      localStorage.setItem('google_service_account', serviceAccountJson);
      // Clear any cached tokens when config changes
      this.accessToken = null;
      this.tokenExpiry = 0;
    } catch (error) {
      throw new Error('Invalid service account JSON');
    }
  }

  isConfigured(): boolean {
    return !!(this.serviceAccount && this.serviceAccount.client_email && this.serviceAccount.private_key);
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
