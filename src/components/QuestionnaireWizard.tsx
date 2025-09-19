import { useState, useEffect } from 'react';
import { Question, Answer, ContactInfo } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { UniversityBranding } from './UniversityBranding';
import { ChevronLeft, ChevronRight, HelpCircle, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface QuestionnaireWizardProps {
  questions: Question[];
  contactInfo: ContactInfo;
  onComplete: (answers: Answer[]) => void;
  initialAnswers?: Answer[];
}

export const QuestionnaireWizard = ({ 
  questions, 
  contactInfo, 
  onComplete,
  initialAnswers = []
}: QuestionnaireWizardProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>(initialAnswers);
  const [showHelp, setShowHelp] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  // Find existing answer for current question
  const currentAnswer = answers.find(a => a.questionId === currentQuestion.id);

  // Save answers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('termometro_answers', JSON.stringify(answers));
  }, [answers]);

  const handleAnswerSelect = (optionValue: number, optionLabel: string) => {
    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      optionValue,
      optionLabel
    };

    setAnswers(prev => {
      const filtered = prev.filter(a => a.questionId !== currentQuestion.id);
      return [...filtered, newAnswer];
    });

    // Auto-advance to next question after a short delay
    setTimeout(() => {
      if (!isLastQuestion) {
        setCurrentQuestionIndex(prev => prev + 1);
      }
    }, 300);
  };

  const handlePrevious = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentAnswer && !isLastQuestion) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else if (currentAnswer && isLastQuestion) {
      handleComplete();
    }
  };

  const handleComplete = () => {
    // Save final state
    localStorage.setItem('termometro_answers', JSON.stringify(answers));
    localStorage.setItem('termometro_questionnaire_completed', 'true');
    onComplete(answers);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-chat-background to-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <UniversityBranding />
        
        <Card className="shadow-strong border-card-border">
          <CardHeader className="bg-gradient-to-r from-primary to-primary-light text-primary-foreground">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">
                  Pregunta {currentQuestionIndex + 1} de {questions.length}
                </CardTitle>
                <p className="text-primary-foreground/80 text-sm">
                  {contactInfo.company} - {contactInfo.name}
                </p>
              </div>
              
              {currentQuestion.help && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHelp(!showHelp)}
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20"
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  {showHelp ? 'Ocultar' : '¿Qué significa?'}
                </Button>
              )}
            </div>
            
            <div className="mt-4">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-primary-foreground/70 mt-1">
                {Math.round(progress)}% completado
              </p>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {showHelp && currentQuestion.help && (
              <Alert className="mb-6">
                <HelpCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <strong>Información adicional:</strong>
                      <p className="mt-1">{currentQuestion.help}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowHelp(false)}
                      className="ml-2 h-6 w-6 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <div className="mb-6">
              <Badge variant="secondary" className="mb-3">
                {currentQuestion.category}
              </Badge>
              <h3 className="text-lg font-semibold mb-4">
                {currentQuestion.text}
              </h3>
            </div>

            <div className="space-y-3 mb-8">
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  variant={currentAnswer?.optionValue === option.value ? "default" : "outline"}
                  className={`w-full text-left justify-start h-auto p-4 ${
                    currentAnswer?.optionValue === option.value 
                      ? 'ring-2 ring-primary ring-offset-2' 
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => handleAnswerSelect(option.value, option.label)}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm">{option.label}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {option.value} pts
                      </Badge>
                      {currentAnswer?.optionValue === option.value && (
                        <div className="w-2 h-2 bg-primary rounded-full" />
                      )}
                    </div>
                  </div>
                </Button>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-card-border">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={isFirstQuestion}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </Button>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {answers.length} de {questions.length} preguntas respondidas
                </p>
              </div>

              <Button
                onClick={handleNext}
                disabled={!currentAnswer}
                className="flex items-center gap-2"
              >
                {isLastQuestion ? 'Finalizar' : 'Siguiente'}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

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
