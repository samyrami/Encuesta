import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Send, Bot, User, Lightbulb, AlertCircle, Settings } from 'lucide-react';
import { SustainabilityResults } from '@/data/sustainability-questionnaire.v2';
import { openAIService, OpenAIMessage } from '@/services/openaiService';
import { isOpenAIConfigured } from '@/config/openai';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  isAI?: boolean;
}

interface SustainabilityChatProps {
  results: SustainabilityResults;
  onBack: () => void;
}

export const SustainabilityChat = ({ results, onBack }: SustainabilityChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Verificar configuración de OpenAI
    setIsConfigured(isOpenAIConfigured());
    
    // Mensaje de bienvenida del chat especializado
    const welcomeMessage: ChatMessage = {
      id: `welcome-${Date.now()}`,
      type: 'bot',
      content: `¡Hola de nuevo, ${results.profile.name}! 👋

Ahora estás en el **Chat Especializado en Sostenibilidad Universitaria**. Aquí puedes:

🤔 **Hacer preguntas específicas** sobre las recomendaciones de tu evaluación
💡 **Profundizar en estrategias** de implementación de sostenibilidad  
📊 **Analizar resultados** de dimensiones específicas
🎯 **Solicitar ejemplos** de mejores prácticas universitarias
🏛️ **Explorar marcos** de sostenibilidad internacionales

**Tu puntuación general:** ${(results.overallScore || 0).toFixed(1)}/5.0
- 🌍 Ambiental: ${(results.dimensions.ambiental.score || 0).toFixed(1)}/5.0
- 👥 Social: ${(results.dimensions.social.score || 0).toFixed(1)}/5.0  
- 🏛️ Gobernanza: ${(results.dimensions.gobernanza.score || 0).toFixed(1)}/5.0

${isConfigured ? '¿En qué te gustaría profundizar?' : '⚠️ **Nota:** Para obtener respuestas personalizadas de IA, configura tu API key de OpenAI.'}`,
      timestamp: new Date()
    };

    setMessages([welcomeMessage]);
  }, [results]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTo({
          top: scrollElement.scrollHeight,
          behavior: 'smooth'
        });
      }
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      let botResponse: string;
      
      if (isConfigured) {
        // Usar OpenAI para respuestas inteligentes
        botResponse = await generateOpenAIResponse(currentInput);
      } else {
        // Usar respuestas predefinidas como fallback
        botResponse = generateBotResponse(currentInput);
      }

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        type: 'bot',
        content: botResponse,
        timestamp: new Date(),
        isAI: isConfigured
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        type: 'bot',
        content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateOpenAIResponse = async (userInput: string): Promise<string> => {
    try {
      const universityContext = `
Información de la evaluación de sostenibilidad universitaria:
- Universidad: ${results.profile.university}
- Evaluado por: ${results.profile.name}
- Puntuación general: ${(results.overallScore || 0).toFixed(1)}/5.0
- Dimensión Ambiental: ${(results.dimensions.ambiental.score || 0).toFixed(1)}/5.0
  * Fortalezas: ${results.dimensions.ambiental.strengths.slice(0, 3).join(', ')}
  * Áreas de mejora: ${results.dimensions.ambiental.weaknesses.slice(0, 3).join(', ')}
- Dimensión Social: ${(results.dimensions.social.score || 0).toFixed(1)}/5.0
  * Fortalezas: ${results.dimensions.social.strengths.slice(0, 3).join(', ')}
  * Áreas de mejora: ${results.dimensions.social.weaknesses.slice(0, 3).join(', ')}
- Dimensión Gobernanza: ${(results.dimensions.gobernanza.score || 0).toFixed(1)}/5.0
  * Fortalezas: ${results.dimensions.gobernanza.strengths.slice(0, 3).join(', ')}
  * Áreas de mejora: ${results.dimensions.gobernanza.weaknesses.slice(0, 3).join(', ')}

Eres un consultor especializado en sostenibilidad universitaria. Responde de manera práctica y específica, usando los datos de la evaluación para personalizar tus recomendaciones.
      `;

      const openAIMessages: OpenAIMessage[] = [
        {
          role: 'user',
          content: userInput
        }
      ];

      const response = await openAIService.sendMessage(openAIMessages, universityContext);
      return response.content;
    } catch (error) {
      console.error('Error with OpenAI:', error);
      // Fallback a respuesta predefinida en caso de error
      return generateBotResponse(userInput) + '\n\n*Nota: Respuesta generada localmente debido a un error con la IA.*';
    }
  };

  const generateBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();

    // Respuestas contextuales basadas en los resultados
    if (input.includes('ambiental') || input.includes('energía') || input.includes('residuos') || input.includes('agua')) {
      if (results.dimensions.ambiental.score < 3.0) {
        return `Basándome en tu puntuación ambiental de **${results.dimensions.ambiental.score.toFixed(1)}/5.0**, veo varias oportunidades de mejora:

**Recomendaciones prioritarias:**
${results.dimensions.ambiental.recommendations.slice(0, 3).map(rec => `• ${rec}`).join('\n')}

**Pasos inmediatos sugeridos:**
1. Realizar auditoría energética completa del campus
2. Implementar programa piloto de separación de residuos 
3. Instalar medidores inteligentes en edificios principales
4. Formar comité ambiental con estudiantes y docentes

¿Te gustaría profundizar en alguna de estas estrategias específicas?`;
      } else {
        return `¡Excelente trabajo en la dimensión ambiental con **${results.dimensions.ambiental.score.toFixed(1)}/5.0**! 🌱

**Tus fortalezas ambientales:**
${results.dimensions.ambiental.strengths.slice(0, 3).map(strength => `• ${strength}`).join('\n')}

**Para mantener el liderazgo:**
• Considera certificaciones internacionales (LEED, BREEAM)
• Desarrolla investigación aplicada en sostenibilidad
• Comparte mejores prácticas con otras universidades
• Establece metas de neutralidad de carbono

¿Hay algún proyecto ambiental específico que te interese explorar?`;
      }
    }

    if (input.includes('social') || input.includes('equidad') || input.includes('estudiantes') || input.includes('derechos')) {
      if (results.dimensions.social.score < 3.0) {
        return `Tu puntuación social de **${results.dimensions.social.score.toFixed(1)}/5.0** indica importantes oportunidades de fortalecimiento:

**Áreas prioritarias de mejora:**
${results.dimensions.social.weaknesses.slice(0, 3).map(weakness => `• ${weakness}`).join('\n')}

**Plan de acción recomendado:**
1. Desarrollar política integral de derechos humanos
2. Ampliar programas de becas y apoyo estudiantil
3. Implementar encuestas regulares de clima institucional
4. Establecer oficina de equidad e inclusión

**Ejemplos de mejores prácticas:**
• Universidad Nacional: Programa integral de bienestar estudiantil
• Universidad de los Andes: Políticas avanzadas de equidad de género
• Javeriana: Red de apoyo psicosocial universitario

¿Qué área social te parece más urgente de atender?`;
      } else {
        return `¡Muy bien en la dimensión social con **${results.dimensions.social.score.toFixed(1)}/5.0**! 👥

**Fortalezas sociales identificadas:**
${results.dimensions.social.strengths.slice(0, 3).map(strength => `• ${strength}`).join('\n')}

**Oportunidades de expansión:**
• Desarrollar alianzas con organizaciones sociales internacionales
• Implementar medición sistemática de impacto social
• Crear programas de mentoring para estudiantes vulnerables
• Obtener certificaciones en responsabilidad social (Global Compact)

¿Te interesa explorar algún programa social específico?`;
      }
    }

    if (input.includes('gobernanza') || input.includes('transparencia') || input.includes('ética') || input.includes('planificación')) {
      if (results.dimensions.gobernanza.score < 3.0) {
        return `La puntuación de gobernanza de **${results.dimensions.gobernanza.score.toFixed(1)}/5.0** sugiere necesidad de fortalecimiento institucional:

**Debilidades en gobernanza:**
${results.dimensions.gobernanza.weaknesses.slice(0, 3).map(weakness => `• ${weakness}`).join('\n')}

**Estrategia de fortalecimiento:**
1. **Transparencia:** Portal web con información completa y actualizada
2. **Planificación:** Plan estratégico con ODS integrados
3. **Ética:** Código institucional con mecanismos de cumplimiento
4. **Participación:** Comités con representación externa

**Marcos de referencia internacionales:**
• Principios de Gobierno Universitario (ACU)
• Estándares STARS para sostenibilidad
• Global Reporting Initiative (GRI) para universidades

¿Qué aspecto de gobernanza quieres priorizar?`;
      } else {
        return `¡Excelente gobernanza con **${results.dimensions.gobernanza.score.toFixed(1)}/5.0**! 🏛️

**Fortalezas en gobernanza:**
${results.dimensions.gobernanza.strengths.slice(0, 3).map(strength => `• ${strength}`).join('\n')}

**Hacia la excelencia:**
• Auditorías externas periódicas
• Benchmarking con universidades internacionales líderes
• Participación en redes globales de sostenibilidad
• Reporting alineado con estándares GRI

¿Te interesa explorar certificaciones avanzadas de gobierno corporativo?`;
      }
    }

    if (input.includes('recomendación') || input.includes('estrategia') || input.includes('implementar') || input.includes('plan')) {
      const allRecommendations = [
        ...results.dimensions.ambiental.recommendations,
        ...results.dimensions.social.recommendations,
        ...results.dimensions.gobernanza.recommendations
      ];

      return `Basándome en tu evaluación integral, aquí tienes una **hoja de ruta estratégica de sostenibilidad**:

**🎯 Prioridades Inmediatas (0-6 meses):**
${allRecommendations.slice(0, 3).map(rec => `• ${rec}`).join('\n')}

**📈 Desarrollos a Mediano Plazo (6-18 meses):**
• Establecer sistema de indicadores de sostenibilidad
• Desarrollar alianzas estratégicas con universidades líderes
• Implementar programa de capacitación en sostenibilidad

**🚀 Visión a Largo Plazo (18+ meses):**
• Certificación internacional en sostenibilidad universitaria
• Liderazgo nacional en tu área más fuerte
• Reporte anual de sostenibilidad público

**💡 Consejo clave:** Comienza con la dimensión donde tengas mayor puntuación para generar momentum y experiencia.

¿Te gustaría un plan detallado para alguna de estas fases?`;
    }

    if (input.includes('ejemplo') || input.includes('caso') || input.includes('mejores prácticas')) {
      return `🏆 **Casos Exitosos de Sostenibilidad Universitaria:**

**🌍 Líderes Ambientales:**
• **UC Davis (California):** Primera universidad carbono neutral, campus con 100% energía renovable
• **Universidad de British Columbia:** Programa Living Lab, estudiantes lideran proyectos reales
• **Interface Flor (Colombia):** Campus modelo en economía circular

**👥 Líderes Sociales:**
• **Universidad Nacional (Colombia):** Programa integral de equidad e inclusión
• **Universidad de São Paulo:** Red latinoamericana de responsabilidad social universitaria
• **Arizona State University:** Innovación en acceso a educación superior

**🏛️ Líderes en Gobernanza:**
• **Universidad de La Sabana:** Modelo de transparencia y planificación estratégica
• **ETH Zurich:** Gobernanza participativa con stakeholders externos
• **Universidad de Melbourne:** Reporting integrado de sostenibilidad

**🔑 Factores Críticos de Éxito:**
1. Liderazgo institucional comprometido
2. Participación activa de estudiantes
3. Alianzas estratégicas externas
4. Medición y reporte sistemático
5. Integración curricular transversal

¿Te interesa profundizar en algún caso específico?`;
    }

    if (input.includes('objetivo') || input.includes('ods') || input.includes('internacional')) {
      return `🌍 **Alineación con Objetivos de Desarrollo Sostenible (ODS):**

**Tu universidad puede liderar en:**

**ODS prioritarios según tu evaluación:**
• **ODS 4 (Educación):** Calidad educativa y acceso inclusivo
• **ODS 6 (Agua):** Gestión eficiente recursos hídricos campus
• **ODS 7 (Energía):** Transición energética institucional
• **ODS 13 (Cambio Climático):** Acción climática universitaria
• **ODS 16 (Paz y Justicia):** Instituciones transparentes
• **ODS 17 (Alianzas):** Partnerships para la sostenibilidad

**Marcos Internacionales Relevantes:**
• **SDSN (Red de Soluciones para el Desarrollo Sostenible)**
• **STARS (Sustainability Tracking System)**
• **Global Compact for Universities**
• **UNESCO Higher Education Sustainability Initiative**

**Beneficios de la alineación:**
• Acceso a redes globales
• Oportunidades de financiamiento internacional
• Reconocimiento y rankings
• Intercambio de mejores prácticas

¿Quieres explorar cómo alinear tu plan institucional con algún ODS específico?`;
    }

    // Respuesta por defecto
    return `Gracias por tu pregunta sobre "${userInput}". 

Como especialista en sostenibilidad universitaria, puedo ayudarte con:

🔍 **Análisis específicos** de tus resultados (Ambiental: ${results.dimensions.ambiental.score.toFixed(1)}, Social: ${results.dimensions.social.score.toFixed(1)}, Gobernanza: ${results.dimensions.gobernanza.score.toFixed(1)})
💡 **Estrategias de implementación** para mejoras prioritarias
📚 **Marcos internacionales** y mejores prácticas
🎯 **Planes de acción** detallados por dimensión
🤝 **Alianzas estratégicas** y redes de sostenibilidad

**Preguntas sugeridas:**
• "¿Cómo mejorar mi dimensión más débil?"
• "Dame ejemplos de universidades líderes en sostenibilidad"
• "¿Cómo alinear mi universidad con los ODS?"
• "¿Cuáles son las primeras acciones que debo implementar?"

¿Qué te gustaría explorar específicamente?`;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const configureOpenAI = () => {
    const userKey = prompt(
      'Para habilitar respuestas personalizadas de IA, ingresa tu API key de OpenAI:\n\n' +
      '(Esta clave se guardará localmente en tu navegador)\n\n' +
      '¿No tienes API key? Obtén una gratis en: https://platform.openai.com/api-keys'
    );
    
    if (userKey && userKey.trim()) {
      localStorage.setItem('openai_api_key', userKey.trim());
      setIsConfigured(true);
      
      // Agregar mensaje confirmando la configuración
      const configMessage: ChatMessage = {
        id: `config-${Date.now()}`,
        type: 'bot',
        content: '🎉 **¡Configuración completada!**\n\nAhora puedes obtener respuestas personalizadas y contextualizadas usando inteligencia artificial. Las respuestas serán específicas para tu evaluación y universidad.\n\n¿En qué te gustaría que te ayude?',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, configMessage]);
    }
  };

  const handleSuggestedQuestion = async (question: string) => {
    if (isLoading) return;
    
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: question,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      let botResponse: string;
      
      if (isConfigured) {
        botResponse = await generateOpenAIResponse(question);
      } else {
        botResponse = generateBotResponse(question);
      }

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        type: 'bot',
        content: botResponse,
        timestamp: new Date(),
        isAI: isConfigured
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error with suggested question:', error);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        type: 'bot',
        content: 'Lo siento, hubo un error al procesar tu pregunta. Por favor, intenta de nuevo.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedQuestions = [
    "¿Cómo mejorar mi dimensión más débil?",
    "Dame ejemplos de mejores prácticas",
    "¿Cuál debería ser mi primera acción?",
    "¿Cómo obtener certificaciones internacionales?"
  ];

  return (
    <div className="h-full flex flex-col">
      <Card className="h-full flex flex-col">
        <CardHeader className="bg-gradient-to-r from-primary to-primary-light flex-shrink-0">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center space-x-2">
              <Bot className="w-6 h-6 text-primary-foreground" />
              <div className="flex-1">
                <CardTitle className="text-primary-foreground text-lg">
                  Chat Especializado en Sostenibilidad
                </CardTitle>
                <p className="text-primary-foreground/80 text-sm">
                  {results.profile.university} • Evaluación completada
                  {isConfigured ? ' • 🤖 IA activa' : ' • 💡 IA disponible'}
                </p>
              </div>
              {!isConfigured && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={configureOpenAI}
                  className="flex items-center gap-1"
                >
                  <Settings className="w-3 h-3" />
                  Activar IA
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0 min-h-0">
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 min-h-0">
            <div className="space-y-4 pb-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex items-start space-x-3 ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.type === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-sm flex-shrink-0">
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                  
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.type === 'user' 
                      ? 'bg-primary text-primary-foreground ml-auto' 
                      : 'bg-muted'
                  }`}>
                    <div className="whitespace-pre-wrap text-sm">
                      {message.content}
                    </div>
                    <div className={`text-xs mt-2 flex items-center justify-between ${
                      message.type === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    }`}>
                      <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {message.type === 'bot' && message.isAI && (
                        <span className="flex items-center gap-1 text-blue-600">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                          IA
                        </span>
                      )}
                    </div>
                  </div>

                  {message.type === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-sm">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="bg-muted rounded-2xl px-4 py-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground/30 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground/30 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground/30 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <Separator />

          {/* Suggested Questions */}
          {messages.length <= 1 && (
            <div className="flex-shrink-0 p-4 border-t bg-background">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Lightbulb className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Preguntas sugeridas:</span>
                </div>
                {!isConfigured && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={configureOpenAI}
                    className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-800"
                  >
                    <Settings className="w-3 h-3" />
                    Activar IA personalizada
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestedQuestion(question)}
                    disabled={isLoading}
                    className="text-xs hover:bg-primary/10"
                  >
                    {question}
                  </Button>
                ))}
              </div>
              {!isConfigured && (
                <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-700">
                    💡 <strong>Tip:</strong> Activa la IA para obtener respuestas específicas y personalizadas basadas en tu evaluación de sostenibilidad.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Input Area */}
          <div className="flex-shrink-0 p-4 bg-background border-t">
            <div className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Pregunta sobre sostenibilidad, estrategias, ejemplos..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!input.trim() || isLoading}
                size="icon"
                className="flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};