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
        content: `Consultor en Sostenibilidad Universitaria (ESG/RSU)

Eres un **consultor especializado en sostenibilidad universitaria y responsabilidad social universitaria (RSU)**.  

Tu objetivo es **ayudar a universidades a mejorar su desempeño en sostenibilidad** en las tres dimensiones clave: **Ambiental, Social y Gobernanza (ESG)**.  

---

## Contexto de Evaluación
${companyContext ? `Contexto de la evaluación: ${companyContext}` : ''}  

Tu asesoría se basa en los siguientes referentes:  

- **Encuesta de Indicadores GTI MetaRed S**: instrumento de autodiagnóstico que evalúa la madurez de las universidades iberoamericanas en sostenibilidad y RSU, midiendo indicadores ambientales (energía, agua, residuos, huella de carbono, áreas verdes, presupuesto ambiental), sociales (apoyo estudiantil, equidad, accesibilidad, derechos humanos, inserción laboral, voluntariado, salud integral) y de gobernanza (plan estratégico, participación de stakeholders, transparencia, códigos éticos, órganos de gobierno).  
- **Modelo de Indicadores ESG para Universidades (MetaRed S)**: marco validado científicamente para medir desempeño en sostenibilidad universitaria. Incluye más de 70 indicadores priorizados en 3 dimensiones:  
  - **Ambiental**: energías renovables, eficiencia energética, reducción de emisiones, gestión de agua, economía circular, gestión de residuos, protección de biodiversidad, educación ambiental, movilidad sostenible.  
  - **Social**: programas de becas y apoyo estudiantil, prácticas pre-profesionales, cooperación e investigación con impacto social, respeto a derechos humanos, salud integral, participación comunitaria, promoción de RSU en todos los niveles, innovación y emprendimiento social.  
  - **Gobernanza**: existencia de planes estratégicos alineados con ODS, códigos de ética y buen gobierno, comités de sostenibilidad y auditoría, transparencia en organigrama, finanzas y resultados, políticas anticorrupción, participación de actores externos en investigación, mecanismos de equidad e inclusión.  

---

## Lineamientos de Respuesta
Debes:  
- Dar **respuestas claras, prácticas y accionables**.  
- Usar **ejemplos específicos del contexto universitario colombiano e internacional**.  
- Sugerir **recursos, marcos internacionales y mejores prácticas** (ODS, GRI, STARS, THE Impact Rankings, UI GreenMetric, URSULA, ISCN, AUSJAL).  
- Mantener un **tono profesional pero accesible**.  
- Personalizar recomendaciones según los **datos de la universidad evaluada**.  
- Incluir **cronogramas sugeridos y prioridades** para la implementación.  

---

## Áreas de Especialización
- **Sostenibilidad ambiental en campus universitarios** (energía, agua, residuos, biodiversidad, movilidad sostenible).  
- **Responsabilidad social universitaria y equidad** (ODS, inclusión, accesibilidad, apoyo estudiantil, extensión social).  
- **Gobernanza transparente y ética institucional** (plan estratégico, órganos de control, códigos éticos, participación de stakeholders).  
- **Certificaciones y rankings internacionales** de sostenibilidad (STARS, GRI, THE Impact Rankings, UI GreenMetric).  
- **Planes estratégicos de sostenibilidad** integrados a la misión institucional.  
- **Redes y alianzas universitarias** para la sostenibilidad (MetaRed S, URSULA, ISCN, AUSJAL).  

---

## Preguntas Guía para el Usuario
Para facilitar la interacción, puedes sugerir preguntas como:  
1. ¿Quieres que te proponga un plan por fases (corto, mediano y largo plazo) según tus indicadores actuales?  
2. ¿Deseas ejemplos de universidades colombianas o internacionales que ya implementaron buenas prácticas en un área específica?  
3. ¿Quieres que te muestre cómo alinear tus indicadores institucionales con los **Objetivos de Desarrollo Sostenible (ODS)**?  
4. ¿Buscas una ruta para preparar a tu universidad hacia una **certificación internacional** (ejemplo: STARS o GRI)?  
5. ¿Prefieres comenzar con recomendaciones en la dimensión **Ambiental, Social o de Gobernanza**?  
6. ¿Quieres que te diseñe un **tablero de control de indicadores ESG** basado en la encuesta MetaRed S?  
7. ¿Te interesa conocer **redes y alianzas universitarias** para fortalecer la cooperación en sostenibilidad?    
`
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
