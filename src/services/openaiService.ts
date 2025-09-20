import { getOpenAIKey, OPENAI_CONFIG, isOpenAIConfigured } from '@/config/openai';

export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenAIResponse {
  content: string;
  error?: string;
}

export class OpenAIService {
  private static instance: OpenAIService;
  private apiKey: string | null = null;

  private constructor() {}

  public static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }
    return OpenAIService.instance;
  }

  private async getApiKey(): Promise<string> {
    if (!this.apiKey) {
      try {
        this.apiKey = getOpenAIKey();
      } catch (error) {
        console.error('Error obteniendo API key:', error);
        throw new Error('No se pudo obtener la API key de OpenAI');
      }
    }
    return this.apiKey;
  }

  public async sendMessage(
    messages: OpenAIMessage[],
    companyContext?: string
  ): Promise<OpenAIResponse> {
    try {
      // Verificar si OpenAI está configurado
      if (!isOpenAIConfigured()) {
        throw new Error('OpenAI no está configurado. Por favor, crea un archivo .env con VITE_OPENAI_API_KEY=tu-api-key-aqui');
      }

      const apiKey = await this.getApiKey();
      
      // Agregar contexto del sistema si se proporciona
      const systemMessage: OpenAIMessage = {
        role: 'system',
        content: `Eres un consultor especializado en sostenibilidad universitaria y responsabilidad social universitaria (RSU). 
        
Tu objetivo es ayudar a universidades a mejorar su desempeño en sostenibilidad en las tres dimensiones clave: Ambiental, Social y Gobernanza (ESG).

${companyContext ? `Contexto de la evaluación: ${companyContext}` : ''}

Debes:
- Proporcionar respuestas claras, prácticas y accionables
- Usar ejemplos específicos del contexto universitario colombiano e internacional
- Sugerir recursos, marcos internacionales y mejores prácticas
- Mantener un tono profesional pero accesible
- Responder en español
- Personalizar respuestas usando los datos de la evaluación proporcionada
- Dar recomendaciones priorizadas y cronogramas sugeridos

Áreas de especialización:
- Sostenibilidad ambiental en campus universitarios
- Responsabilidad social universitaria y equidad
- Gobernanza transparente y ética institucional
- Certificaciones internacionales de sostenibilidad (STARS, GRI)
- Alineación con Objetivos de Desarrollo Sostenible (ODS)
- Implementación de planes estratégicos de sostenibilidad
- Redes y alianzas para la sostenibilidad universitaria`
      };

      const requestBody = {
        model: OPENAI_CONFIG.MODEL,
        messages: [systemMessage, ...messages],
        max_tokens: OPENAI_CONFIG.MAX_TOKENS,
        temperature: OPENAI_CONFIG.TEMPERATURE,
        stream: false
      };

      const response = await fetch(`${OPENAI_CONFIG.BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Error de OpenAI: ${response.status} - ${errorData.error?.message || 'Error desconocido'}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No se recibió respuesta de OpenAI');
      }

      return { content };
    } catch (error) {
      console.error('Error en OpenAI service:', error);
      return {
        content: `Lo siento, hubo un error al procesar tu mensaje: ${error instanceof Error ? error.message : 'Error desconocido'}. Por favor, intenta de nuevo o verifica tu API key.`,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  public async generateDiagnosisInsights(
    companyInfo: {
      company: string;
      size: string;
      answers: Record<string, string>;
    }
  ): Promise<string> {
    const context = `
Empresa: ${companyInfo.company}
Tamaño: ${companyInfo.size}
Respuestas del cuestionario: ${JSON.stringify(companyInfo.answers, null, 2)}

Genera insights específicos y recomendaciones personalizadas para esta empresa basándote en sus respuestas.
`;

    const messages: OpenAIMessage[] = [
      {
        role: 'user',
        content: `Analiza las respuestas del cuestionario de exportación y genera insights específicos para la empresa. Incluye fortalezas, debilidades y recomendaciones personalizadas.`
      }
    ];

    const response = await this.sendMessage(messages, context);
    return response.content;
  }
}

export const openAIService = OpenAIService.getInstance();
