import { useState, useEffect, useRef } from 'react';
import { Question, Answer, ContactInfo } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { UniversityBranding } from './UniversityBranding';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sparkles, User, HelpCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MarkdownRenderer } from './MarkdownRenderer';

interface ChatQuestionnaireWizardProps {
  questions: Question[];
  contactInfo: ContactInfo;
  onComplete: (answers: Answer[]) => void;
  initialAnswers?: Answer[];
}

interface ChatMessage {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
  question?: Question;
  answer?: Answer;
  isTyping?: boolean;
}

export const ChatQuestionnaireWizard = ({ 
  questions, 
  contactInfo, 
  onComplete,
  initialAnswers = []
}: ChatQuestionnaireWizardProps) => {
  // Find starting question index based on existing answers
  const getStartingQuestionIndex = () => {
    if (initialAnswers.length === 0) return 0;
    
    // Find the first unanswered question
    for (let i = 0; i < questions.length; i++) {
      const questionId = questions[i].id;
      const hasAnswer = initialAnswers.some(answer => answer.questionId === questionId);
      if (!hasAnswer) {
        return i;
      }
    }
    
    // If all questions are answered, start from the last one
    return questions.length - 1;
  };

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(getStartingQuestionIndex());
  const [answers, setAnswers] = useState<Answer[]>(initialAnswers);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showHelp, setShowHelp] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  // Initialize chat with welcome message and rebuild conversation history
  useEffect(() => {
    console.log('ChatQuestionnaireWizard useEffect triggered:', {
      messagesLength: messages.length,
      questionsLength: questions.length,
      currentQuestionIndex,
      initialAnswersLength: initialAnswers.length
    });

    if (messages.length === 0 && questions.length > 0) {
      console.log('Initializing chat...');
      const initialMessages: ChatMessage[] = [];
      
      // Welcome message
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        type: 'bot',
        content: `# ¡Hola ${contactInfo.name}! 👋\n\n> **Bienvenido al Exporta Check**\n> *Universidad de La Sabana*\n\n---\n\nSoy tu **asistente especializado** y voy a ayudarte a evaluar la capacidad exportadora de:\n\n## 🏢 ${contactInfo.company}\n\n### ¿Qué vamos a hacer?\n\n- ✅ **${questions.length} preguntas estratégicas** sobre tu empresa\n- 📈 **Análisis personalizado** de resultados\n- 🎯 **Recomendaciones específicas** para exportar\n- 📊 **Diagnóstico completo** con plan de acción\n\n---\n\n**¿Estás listo para comenzar?** 🚀`,
        timestamp: new Date()
      };
      initialMessages.push(welcomeMessage);

      // Rebuild conversation history for answered questions
      if (initialAnswers.length > 0) {
        console.log('Rebuilding conversation history...');
        for (let i = 0; i < currentQuestionIndex; i++) {
          const question = questions[i];
          const answer = initialAnswers.find(a => a.questionId === question.id);
          
          if (answer) {
            // Bot question message
            const questionMessage: ChatMessage = {
              id: `question-${question.id}`,
              type: 'bot',
              content: `**${question.category}** (${i + 1}/${questions.length})\n\n${question.text}`,
              timestamp: new Date(),
              question
            };
            initialMessages.push(questionMessage);

            // User answer message
            const userMessage: ChatMessage = {
              id: `answer-${question.id}`,
              type: 'user',
              content: answer.optionLabel,
              timestamp: new Date(),
              answer
            };
            initialMessages.push(userMessage);

            // Bot acknowledgment
            const ackMessage: ChatMessage = {
              id: `ack-${question.id}`,
              type: 'bot',
              content: getAcknowledgmentMessage(answer.optionValue),
              timestamp: new Date()
            };
            initialMessages.push(ackMessage);
          }
        }
      }
      
      setMessages(initialMessages);
      console.log('Messages set, asking next question...');
      
      // Ask current question after a delay (if not all questions are answered)
      if (currentQuestionIndex < questions.length) {
        setTimeout(() => {
          askNextQuestion();
        }, 1000);
      }
    }
  }, [questions, contactInfo]);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const askNextQuestion = () => {
    console.log('askNextQuestion called:', {
      currentQuestionIndex,
      questionsLength: questions.length,
      currentQuestion: questions[currentQuestionIndex]
    });

    if (currentQuestionIndex >= questions.length || !questions[currentQuestionIndex]) {
      console.log('Cannot ask next question - invalid state');
      return;
    }

    console.log('Setting typing indicator...');
    setIsTyping(true);
    
    setTimeout(() => {
      const question = questions[currentQuestionIndex];
      console.log('Adding question message:', question);
      
      const questionMessage: ChatMessage = {
        id: `question-${question.id}`,
        type: 'bot',
        content: `**${question.category}** (${currentQuestionIndex + 1}/${questions.length})\n\n${question.text}`,
        timestamp: new Date(),
        question
      };
      
      setMessages(prev => [...prev, questionMessage]);
      setIsTyping(false);
      console.log('Question message added, typing indicator cleared');
    }, 1000 + Math.random() * 1000); // Random delay for natural feel
  };

  const handleAnswerSelect = (optionValue: number, optionLabel: string) => {
    if (!currentQuestion) return;
    
    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      optionValue,
      optionLabel
    };

    // Add user response message
    const userMessage: ChatMessage = {
      id: `answer-${currentQuestion.id}`,
      type: 'user',
      content: optionLabel,
      timestamp: new Date(),
      answer: newAnswer
    };

    setMessages(prev => [...prev, userMessage]);

    // Update answers
    const updatedAnswers = answers.filter(a => a.questionId !== currentQuestion.id);
    updatedAnswers.push(newAnswer);
    setAnswers(updatedAnswers);

    // Save to localStorage
    localStorage.setItem('termometro_answers', JSON.stringify(updatedAnswers));

    // Bot acknowledgment
    setTimeout(() => {
      const ackMessage: ChatMessage = {
        id: `ack-${currentQuestion.id}`,
        type: 'bot',
        content: getAcknowledgmentMessage(optionValue),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, ackMessage]);

      // Move to next question or complete
      if (isLastQuestion) {
        setTimeout(() => {
          const completionMessage: ChatMessage = {
            id: 'completion',
            type: 'bot',
            content: `# ¡Perfecto! 🎉\n\n## ✅ Evaluación Completada\n\n**Hemos terminado** todas las preguntas del diagnóstico. Ahora procederé a:\n\n### 🔍 Análisis en proceso...\n\n- 📊 Procesando tus **${questions.length} respuestas**\n- 🎯 Evaluando capacidad exportadora de **${contactInfo.company}**\n- 📝 Generando recomendaciones personalizadas\n- 🏆 Calculando puntuación final\n\n---\n\n> ⏳ *Esto tomará solo unos segundos...*`,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, completionMessage]);
          
          setTimeout(() => {
            handleComplete(updatedAnswers);
          }, 2000);
        }, 1000);
      } else {
        setCurrentQuestionIndex(prev => prev + 1);
        setTimeout(() => {
          askNextQuestion();
        }, 1500);
      }
    }, 500 + Math.random() * 500);
  };

  const getAcknowledgmentMessage = (score: number): string => {
    if (score >= 4) return "## ¡Excelente! 👏\n\n**Esa es una gran fortaleza** que definitivamente te ayudará en tu proceso exportador.\n\n> *Sigue construyendo sobre esta base sólida.*";
    if (score >= 3) return "## Muy bien! 👍\n\n**Buen punto a favor** para tu empresa. Esto muestra un desarrollo positivo.\n\n- Mantén este nivel\n- Considera cómo optimizarlo aún más";
    if (score >= 2) return "## Entendido 📝\n\nHay **oportunidad de mejora** en esta área. No te preocupes, es normal.\n\n> *Cada empresa tiene sus áreas de crecimiento.*";
    return "## Perfecto 📋\n\nEsa será un **área importante para desarrollar**. Aquí es donde podrás generar mayor impacto.\n\n- Identifica recursos necesarios\n- Planifica pasos concretos";
  };

  const handleComplete = (finalAnswers: Answer[]) => {
    localStorage.setItem('termometro_answers', JSON.stringify(finalAnswers));
    localStorage.setItem('termometro_questionnaire_completed', 'true');
    onComplete(finalAnswers);
  };

  const toggleHelp = (questionId: string) => {
    setShowHelp(showHelp === questionId ? null : questionId);
  };

  // Show loading if questions aren't loaded yet
  if (!questions || questions.length === 0) {
    console.log('Questions not loaded yet');
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-chat-background to-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando preguntas...</p>
        </div>
      </div>
    );
  }

  console.log('ChatQuestionnaireWizard rendering with:', {
    questionsLength: questions.length,
    currentQuestionIndex,
    messagesLength: messages.length,
    isTyping,
    currentQuestion
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-chat-background to-background">
      <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-6 max-w-4xl">
        <UniversityBranding />
        
        {/* Progress Header - Mobile Optimized */}
        <div className="bg-card border border-card-border rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 shadow-soft">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <h2 className="text-base sm:text-lg font-semibold">Evaluación en Progreso</h2>
            <Badge variant="outline" className="text-xs sm:text-sm px-2 py-1">
              {Math.round(progress)}% completado
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs sm:text-sm text-muted-foreground mt-2">
            <span className="block sm:inline">{contactInfo.company}</span>
            <span className="hidden sm:inline"> • </span>
            <span className="block sm:inline">{answers.length} de {questions.length} preguntas respondidas</span>
          </p>
        </div>

        {/* Chat Container - Mobile Optimized */}
        <div className="bg-card border border-card-border rounded-lg shadow-strong overflow-hidden">
          <div className="h-[500px] sm:h-[600px] overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
            {messages.map((message) => (
              <div key={message.id}>
                <ChatMessageComponent 
                  message={message}
                  onAnswerSelect={handleAnswerSelect}
                  onToggleHelp={toggleHelp}
                  showHelp={showHelp === message.question?.id}
                />
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-2 sm:gap-3 justify-start px-1 sm:px-0">
                <Avatar className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-primary to-primary-light shadow-soft flex-shrink-0">
                  <AvatarFallback className="bg-transparent text-primary-foreground">
                    <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-chat-bubble-bot border border-card-border rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3 shadow-soft">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="mt-4 sm:mt-6 text-center text-xs text-muted-foreground px-2">
          <p>
            Desarrollado por el <strong>Laboratorio de Gobierno</strong><br />
            Universidad de La Sabana © 2024
          </p>
        </div>
      </div>
    </div>
  );
};

interface ChatMessageComponentProps {
  message: ChatMessage;
  onAnswerSelect?: (optionValue: number, optionLabel: string) => void;
  onToggleHelp?: (questionId: string) => void;
  showHelp?: boolean;
}

const ChatMessageComponent = ({ 
  message, 
  onAnswerSelect, 
  onToggleHelp,
  showHelp 
}: ChatMessageComponentProps) => {
  const isBot = message.type === 'bot';
  const hasOptions = message.question && message.question.options;
  const hasHelp = message.question && message.question.help;

  return (
    <div className={cn("flex gap-2 sm:gap-3 px-1 sm:px-0", isBot ? "justify-start" : "justify-end")}>
      {isBot && (
        <Avatar className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-primary to-primary-light shadow-soft flex-shrink-0">
          <AvatarFallback className="bg-transparent text-primary-foreground">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </AvatarFallback>
        </Avatar>
      )}
      
      {!isBot && (
        <Avatar className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-secondary to-secondary-light shadow-soft order-2 flex-shrink-0">
          <AvatarFallback className="bg-transparent text-secondary-foreground">
            <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={cn("max-w-[85%] sm:max-w-[80%] space-y-2 sm:space-y-3", !isBot && "order-first")}>
        <div
          className={cn(
            "px-3 py-2.5 sm:px-4 sm:py-3 rounded-2xl shadow-soft",
            isBot
              ? "bg-chat-bubble-bot text-chat-bubble-bot-foreground border border-card-border"
              : "bg-chat-bubble-user text-chat-bubble-user-foreground"
          )}
        >
          <MarkdownRenderer 
            content={message.content}
            className="text-chat-bubble-bot-foreground [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
          />
          
          {hasHelp && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleHelp?.(message.question!.id)}
              className="mt-2 h-8 sm:h-6 text-xs opacity-70 hover:opacity-100 touch-manipulation"
            >
              <HelpCircle className="w-3 h-3 mr-1" />
              {showHelp ? 'Ocultar ayuda' : '¿Qué significa esto?'}
            </Button>
          )}
        </div>
        
        {showHelp && hasHelp && (
          <div className="bg-muted border border-border rounded-lg p-3">
            <div className="flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">{message.question!.help}</p>
            </div>
          </div>
        )}
        
        {hasOptions && message.question?.options && (
          <div className="space-y-2 sm:space-y-3">
            {message.question.options.map((option, index) => {
              const isSelected = message.answer?.optionValue === option.value;
              return (
                <Button
                  key={index}
                  variant={isSelected ? "default" : "outline"}
                  className={cn(
                    "w-full text-left justify-start h-auto min-h-[52px] sm:min-h-[60px] p-3 sm:p-4 text-xs sm:text-sm touch-manipulation",
                    isSelected && "ring-2 ring-primary ring-offset-2",
                    !isSelected && "hover:bg-muted"
                  )}
                  onClick={() => onAnswerSelect?.(option.value, option.label)}
                  disabled={!!message.answer}
                >
                  <div className="flex items-start justify-between w-full gap-3">
                    <span className="flex-1 leading-relaxed text-left break-words">{option.label}</span>
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                      <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                        {option.value} pts
                      </Badge>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        )}
        
        {message.timestamp && (
          <p className="text-xs text-muted-foreground">
            {message.timestamp.toLocaleTimeString()}
          </p>
        )}
      </div>
    </div>
  );
};
