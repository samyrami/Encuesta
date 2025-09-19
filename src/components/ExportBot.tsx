import { useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { UniversityBranding } from './UniversityBranding';
import { DiagnosisResultComponent } from './DiagnosisResult';
import { OpenAIChat } from './OpenAIChat';
import { useChatBot } from '@/hooks/useChatBot';
import { Button } from '@/components/ui/button';
import { HelpCircle, RotateCcw, Sparkles } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export const ExportBot = () => {
  const { 
    messages, 
    state, 
    diagnosis,
    handleUserMessage, 
    initializeBot, 

    continueToChat,
    restartEvaluation,
    backToDiagnosis
  } = useChatBot();
  
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


  const isWaitingForInput = state.currentStep === 'contact' || 
    (state.currentStep === 'questionnaire' && !messages[messages.length - 1]?.options);

  // Render different content based on current step
  const renderContent = () => {
    switch (state.currentStep) {
      case 'diagnosis':
        return diagnosis ? (
                        <DiagnosisResultComponent
            diagnosis={diagnosis}
            onContinueChat={continueToChat}
            onRestart={restartEvaluation}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Generando diagnóstico...</p>
            </div>
          </div>
        );

      case 'chat':
        return (
          <OpenAIChat
            onBackToDiagnosis={backToDiagnosis}
            companyName={diagnosis?.company || 'Tu empresa'}
            diagnosisData={diagnosis ? {
              score: diagnosis.score,
              category: diagnosis.category,
              strengths: diagnosis.strengths,
              weaknesses: diagnosis.weaknesses,
              recommendations: diagnosis.recommendations
            } : undefined}
          />
        );

      default:
        return (
          <>
            <ScrollArea ref={scrollAreaRef} className="flex-1 p-6">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="message-enter">
                    <ChatMessage
                      message={message}
                      onOptionSelect={handleUserMessage}
                    />
                  </div>
                ))}
                
                {state.currentStep !== 'diagnosis' && messages.length > 0 && (
                  <div className="flex justify-start items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-soft">
                      <Sparkles className="w-4 h-4 text-primary-foreground" />
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
                <ChatInput
                  onSendMessage={handleUserMessage}
                  placeholder={
                    state.currentStep === 'contact' 
                      ? "Escriba su respuesta..." 
                      : "Seleccione una opción o escriba su respuesta..."
                  }
                />
              </div>
            )}
          </>
        );
    }
  };

  const getStepDescription = () => {
    switch (state.currentStep) {
      case 'welcome':
        return 'Iniciando evaluación...';
      case 'contact':
        return 'Recopilando datos de contacto';
      case 'questionnaire':
        return `Pregunta ${state.currentQuestionIndex + 1} de 17`;
      case 'diagnosis':
        return 'Generando diagnóstico...';
      case 'chat':
        return 'Chat especializado activo';
      default:
        return 'Iniciando evaluación...';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-chat-background to-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <UniversityBranding />
        
        <div className="bg-card border border-card-border rounded-2xl shadow-strong overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-primary-light p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-primary-foreground font-semibold text-lg">
                  Asistente Exportador
                </h2>
                <p className="text-primary-foreground/80 text-sm">
                  {getStepDescription()}
                </p>
              </div>
              <div className="flex gap-2">

                {state.currentStep !== 'diagnosis' && state.currentStep !== 'chat' && (
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

          <div className="h-[600px] flex flex-col">
            {renderContent()}
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>
            Desarrollado por el <strong>Laboratorio de Gobierno</strong> con el apoyo del <strong>Laboratorio de Comercio Internacional</strong><br />
            Universidad de La Sabana © 2024
          </p>
        </div>
      </div>
    </div>
  );
};