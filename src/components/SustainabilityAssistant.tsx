import { useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { SustainabilityResults } from './SustainabilityResults';
import { SustainabilityChat } from './SustainabilityChat';
import { useSustainabilityAssistant } from '@/hooks/useSustainabilityAssistant';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RotateCcw, Sparkles, Leaf } from 'lucide-react';

export const SustainabilityAssistant = () => {
  const {
    messages,
    state,
    results,
    handleUserMessage,
    initializeBot,
    restartEvaluation,
    continueToChat,
    backToResults
  } = useSustainabilityAssistant();

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeBot();
  }, [initializeBot]);

  useEffect(() => {
    // Smooth auto-scroll to bottom when new messages arrive
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

  const isWaitingForInput = (state.currentStep === 'profile' && !messages[messages.length - 1]?.options) ||
    (state.currentStep === 'questionnaire' && !messages[messages.length - 1]?.options);

  const getStepDescription = () => {
    switch (state.currentStep) {
      case 'welcome':
        return 'Iniciando evaluación de sostenibilidad...';
      case 'profile':
        return 'Recopilando información del perfil';
      case 'questionnaire':
        if (state.currentDimension === 'Ambiental') {
          const ambientalQuestions = 11; // número total de preguntas ambientales
          return `Dimensión Ambiental - Pregunta ${state.currentQuestionIndex + 1} de ${ambientalQuestions}`;
        } else if (state.currentDimension === 'Social') {
          const socialQuestions = 14; // número total de preguntas sociales
          return `Dimensión Social - Pregunta ${state.currentQuestionIndex + 1} de ${socialQuestions}`;
        } else if (state.currentDimension === 'Gobernanza') {
          const gobernanzaQuestions = 18; // número total de preguntas de gobernanza
          return `Dimensión Gobernanza - Pregunta ${state.currentQuestionIndex + 1} de ${gobernanzaQuestions}`;
        }
        return 'Evaluando sostenibilidad...';
      case 'results':
        return 'Diagnóstico de sostenibilidad completado';
      case 'chat':
        return 'Chat especializado activo';
      default:
        return 'Asistente de Sostenibilidad';
    }
  };

  const renderContent = () => {
    switch (state.currentStep) {
      case 'results':
        return results ? (
          <SustainabilityResults
            results={results}
            onContinueChat={continueToChat}
            onRestart={restartEvaluation}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Generando diagnóstico de sostenibilidad...</p>
            </div>
          </div>
        );

      case 'chat':
        return results ? (
          <SustainabilityChat
            results={results}
            onBack={backToResults}
          />
        ) : null;

      default:
        return (
          <>
            <ScrollArea ref={scrollAreaRef} className="flex-1 p-6">
              <div className="space-y-4 max-w-4xl mx-auto">
                {messages.map((message) => (
                  <div key={message.id} className="message-enter">
                    <ChatMessage
                      message={message}
                      onOptionSelect={handleUserMessage}
                    />
                  </div>
                ))}
                
                {state.currentStep !== 'results' && messages.length > 0 && (
                  <div className="flex justify-start items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-soft">
                      <Leaf className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-chat-bubble-bot border border-card-border rounded-2xl px-4 py-3 shadow-soft animate-pulse">
                      <div className="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {isWaitingForInput && (
              <div className="p-4 border-t border-card-border bg-chat-background">
                <div className="max-w-4xl mx-auto">
                  <ChatInput
                    onSendMessage={handleUserMessage}
                    placeholder={
                      state.currentStep === 'profile' 
                        ? "Escriba su respuesta..." 
                        : "Seleccione una opción o escriba su respuesta..."
                    }
                  />
                </div>
              </div>
            )}
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-green-950/20 dark:via-blue-950/20 dark:to-purple-950/20">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-primary">
                Asistente Virtual de Sostenibilidad Universitaria
              </h1>
              <p className="text-sm text-muted-foreground">
                Universidad de La Sabana
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-card/80 backdrop-blur-sm border border-card-border rounded-2xl shadow-strong overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-primary-foreground font-semibold text-lg flex items-center space-x-2">
                  <Sparkles className="w-5 h-5" />
                  <span>Evaluación de Sostenibilidad</span>
                </h2>
                <p className="text-primary-foreground/80 text-sm">
                  {getStepDescription()}
                </p>
              </div>
              <div className="flex gap-2">
                {state.currentStep !== 'results' && state.currentStep !== 'chat' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={restartEvaluation}
                    className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="h-[600px] flex flex-col bg-background/95">
            {renderContent()}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>
            Desarrollado por el <strong>Laboratorio de Gobierno</strong><br />
            Universidad de La Sabana © 2024
          </p>
          <p className="mt-2">
            🌱 Promoviendo la sostenibilidad en la educación superior
          </p>
        </div>
      </div>
    </div>
  );
};