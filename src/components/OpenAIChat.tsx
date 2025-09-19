import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, ArrowLeft, RotateCcw, AlertCircle } from 'lucide-react';
import { Message } from '@/types/chat';
import { openAIService, OpenAIMessage } from '@/services/openaiService';
import { isOpenAIConfigured } from '@/config/openai';

interface OpenAIChatProps {
  onBackToDiagnosis: () => void;
  companyName: string;
  diagnosisData?: {
    score: number;
    category: string;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const OpenAIChat = ({ onBackToDiagnosis, companyName, diagnosisData }: OpenAIChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Verificar si OpenAI está configurado
    setIsConfigured(isOpenAIConfigured());
    
    // Configurar mensaje de bienvenida personalizado
    const welcomeMessage: ChatMessage = {
      id: `welcome-${Date.now()}-${Math.random().toString(36).substring(2)}`,
      role: 'assistant',
      content: diagnosisData 
        ? `¡Hola! Soy tu asistente de comercio internacional. He revisado el diagnóstico de ${companyName}.

**Resumen de tu evaluación:**
- 📊 Puntuación: ${diagnosisData.score}/100 (${diagnosisData.category})
- ✅ Fortalezas principales: ${diagnosisData.strengths.slice(0, 2).join(', ')}
- 🔄 Áreas de mejora: ${diagnosisData.weaknesses.slice(0, 2).join(', ')}

Estoy aquí para ayudarte a profundizar en estos resultados y responder cualquier pregunta sobre exportación, mercados internacionales, o implementación de las recomendaciones.

¿En qué puedo ayudarte hoy?`
        : `¡Hola! Soy tu asistente de comercio internacional. He revisado el diagnóstico de ${companyName} y estoy aquí para ayudarte con cualquier pregunta específica sobre exportación, mercados internacionales, o para profundizar en las recomendaciones del diagnóstico.

¿En qué puedo ayudarte hoy?`,
      timestamp: new Date()
    };
    
    setMessages([welcomeMessage]);
  }, [companyName, diagnosisData]);

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
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2)}`,
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Usar el servicio real de OpenAI
      const openAIMessages: OpenAIMessage[] = [
        {
          role: 'user',
          content: inputValue
        }
      ];

      // Crear contexto más completo con la información del diagnóstico
      const companyContext = `
Información de la empresa evaluada:
- Nombre: ${companyName}
- El usuario acaba de completar un diagnóstico de capacidad exportadora
${diagnosisData ? `
- Puntuación obtenida: ${diagnosisData.score}/100
- Categoría: ${diagnosisData.category}
- Fortalezas identificadas: ${diagnosisData.strengths.join(', ')}
- Áreas de mejora: ${diagnosisData.weaknesses.join(', ')}
- Recomendaciones principales: ${diagnosisData.recommendations.slice(0, 3).join(', ')}
` : ''}
- Puede hacer preguntas específicas sobre exportación, certificaciones, mercados internacionales, etc.
- Responde como un consultor especializado en comercio internacional con experiencia en el mercado colombiano
- Usa la información del diagnóstico para dar respuestas más personalizadas
      `;
      
      const response = await openAIService.sendMessage(openAIMessages, companyContext);
      
      const assistantMessage: ChatMessage = {
        id: `${Date.now() + 1}-${Math.random().toString(36).substring(2)}`,
        role: 'assistant',
        content: response.content,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: `${Date.now() + 2}-${Math.random().toString(36).substring(2)}`,
        role: 'assistant',
        content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    // Recrear el mensaje de bienvenida
    const welcomeMessage: ChatMessage = {
      id: `welcome-${Date.now()}-${Math.random().toString(36).substring(2)}`,
      role: 'assistant',
      content: diagnosisData 
        ? `¡Hola! Soy tu asistente de comercio internacional. He revisado el diagnóstico de ${companyName}.

**Resumen de tu evaluación:**
- 📊 Puntuación: ${diagnosisData.score}/100 (${diagnosisData.category})
- ✅ Fortalezas principales: ${diagnosisData.strengths.slice(0, 2).join(', ')}
- 🔄 Áreas de mejora: ${diagnosisData.weaknesses.slice(0, 2).join(', ')}

Estoy aquí para ayudarte a profundizar en estos resultados y responder cualquier pregunta sobre exportación, mercados internacionales, o implementación de las recomendaciones.

¿En qué puedo ayudarte hoy?`
        : `¡Hola! Soy tu asistente de comercio internacional. He revisado el diagnóstico de ${companyName} y estoy aquí para ayudarte con cualquier pregunta específica sobre exportación, mercados internacionales, o para profundizar en las recomendaciones del diagnóstico.

¿En qué puedo ayudarte hoy?`,
      timestamp: new Date()
    };
    
    setMessages([welcomeMessage]);
  };

  const configureOpenAI = () => {
    const userKey = prompt('Por favor, ingresa tu API key de OpenAI:');
    if (userKey) {
      localStorage.setItem('openai_api_key', userKey);
      setIsConfigured(true);
      // Recargar la página para aplicar la nueva configuración
      window.location.reload();
    }
  };

  if (!isConfigured) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button
            onClick={onBackToDiagnosis}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Diagnóstico
          </Button>
        </div>

        <Card className="border-2 border-orange-200">
          <CardHeader className="text-center">
            <CardTitle className="text-lg text-orange-700 flex items-center justify-center gap-2">
              <AlertCircle className="w-5 h-5" />
              OpenAI No Configurado
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-orange-700">
              Para usar el chat especializado, necesitas configurar tu API key de OpenAI.
            </p>
            
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Opción 1:</strong> Crear archivo .env en la raíz del proyecto:</p>
              <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                VITE_OPENAI_API_KEY=tu-api-key-aqui
              </code>
              
              <p><strong>Opción 2:</strong> Configurar ahora mismo:</p>
            </div>
            
            <Button
              onClick={configureOpenAI}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Configurar API Key
            </Button>
            
            <div className="text-xs text-gray-500">
              <p>¿No tienes API key? Obtén una gratis en:</p>
              <a 
                href="https://platform.openai.com/api-keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                https://platform.openai.com/api-keys
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          onClick={onBackToDiagnosis}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al Diagnóstico
        </Button>
        <Button
          onClick={clearChat}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Limpiar Chat
        </Button>
      </div>

      <Card>
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            Asistente de Comercio Internacional
          </CardTitle>
          <p className="text-blue-100 text-sm">
            Chat especializado para resolver dudas sobre exportación e internacionalización
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[500px] flex flex-col">
            <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                      <div className={`text-xs mt-2 ${
                        message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString('es-CO', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    {message.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gray-100 rounded-lg px-4 py-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe tu pregunta sobre exportación..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Puedes preguntar sobre certificaciones, mercados, logística, financiamiento, precios y más.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
