import { useState, useEffect } from 'react';
import { ContactInfo, Answer, DiagnosisResult, QuestionnaireData } from '@/types/chat';
import { OnboardingForm } from './OnboardingForm';
import { QuestionnaireWizard } from './QuestionnaireWizard';
import { DiagnosisSummary } from './DiagnosisSummary';
import { generateDiagnosis } from '@/lib/diagnosis';
import { useToast } from '@/hooks/use-toast';

type AppStep = 'onboarding' | 'questionnaire' | 'summary';

export const TermometroExportador = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>('onboarding');
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [questionnaireData, setQuestionnaireData] = useState<QuestionnaireData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load questionnaire data and check for existing progress
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load questionnaire questions
        const response = await fetch('/termometro_exportador_questions.json');
        if (!response.ok) {
          throw new Error('Failed to load questionnaire data');
        }
        const data: QuestionnaireData = await response.json();
        setQuestionnaireData(data);

        // Check for existing progress in localStorage
        const savedContactInfo = localStorage.getItem('termometro_contact_info');
        const savedAnswers = localStorage.getItem('termometro_answers');
        const savedDiagnosis = localStorage.getItem('termometro_diagnosis');
        const isCompleted = localStorage.getItem('termometro_questionnaire_completed');

        if (isCompleted === 'true' && savedDiagnosis) {
          // Resume from summary
          setContactInfo(JSON.parse(savedContactInfo || '{}'));
          setAnswers(JSON.parse(savedAnswers || '[]'));
          setDiagnosis(JSON.parse(savedDiagnosis));
          setCurrentStep('summary');
        } else if (savedContactInfo && savedAnswers) {
          // Resume from questionnaire
          setContactInfo(JSON.parse(savedContactInfo));
          setAnswers(JSON.parse(savedAnswers));
          setCurrentStep('questionnaire');
        } else if (savedContactInfo) {
          // Resume from onboarding complete
          setContactInfo(JSON.parse(savedContactInfo));
          setCurrentStep('questionnaire');
        }
        // else stay in onboarding
      } catch (error) {
        console.error('Error loading questionnaire data:', error);
        toast({
          title: "Error al cargar cuestionario",
          description: "No se pudo cargar los datos del cuestionario.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [toast]);

  const handleOnboardingComplete = (newContactInfo: ContactInfo) => {
    setContactInfo(newContactInfo);
    setCurrentStep('questionnaire');
  };

  const handleQuestionnaireComplete = (newAnswers: Answer[]) => {
    if (!contactInfo || !questionnaireData) {
      toast({
        title: "Error",
        description: "Faltan datos necesarios para generar el diagnóstico.",
        variant: "destructive"
      });
      return;
    }

    setAnswers(newAnswers);
    
    // Generate diagnosis
    const generatedDiagnosis = generateDiagnosis(
      newAnswers,
      questionnaireData.questions,
      contactInfo
    );
    
    setDiagnosis(generatedDiagnosis);
    
    // Save to localStorage
    localStorage.setItem('termometro_diagnosis', JSON.stringify(generatedDiagnosis));
    localStorage.setItem('termometro_questionnaire_completed', 'true');
    
    setCurrentStep('summary');
  };

  const handleRestart = () => {
    // Clear all localStorage data
    localStorage.removeItem('termometro_contact_info');
    localStorage.removeItem('termometro_answers');
    localStorage.removeItem('termometro_diagnosis');
    localStorage.removeItem('termometro_questionnaire_completed');
    
    // Reset state
    setContactInfo(null);
    setAnswers([]);
    setDiagnosis(null);
    setCurrentStep('onboarding');
    
    toast({
      title: "Cuestionario reiniciado",
      description: "Puede comenzar una nueva evaluación.",
    });
  };

  const handleUpdateDiagnosis = (newDiagnosis: DiagnosisResult) => {
    setDiagnosis(newDiagnosis);
    localStorage.setItem('termometro_diagnosis', JSON.stringify(newDiagnosis));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-chat-background to-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando Exporta Check...</p>
        </div>
      </div>
    );
  }

  if (!questionnaireData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-chat-background to-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-semibold mb-4">Error al cargar el cuestionario</h2>
          <p className="text-muted-foreground mb-4">
            No se pudo cargar los datos del cuestionario. Por favor, recargue la página.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Recargar página
          </button>
        </div>
      </div>
    );
  }

  // Render current step
  switch (currentStep) {
    case 'onboarding':
      return (
        <OnboardingForm
          onComplete={handleOnboardingComplete}
          initialData={contactInfo || undefined}
        />
      );

    case 'questionnaire':
      return (
        <QuestionnaireWizard
          questions={questionnaireData.questions}
          contactInfo={contactInfo!}
          onComplete={handleQuestionnaireComplete}
          initialAnswers={answers}
        />
      );

    case 'summary':
      return (
        <DiagnosisSummary
          diagnosis={diagnosis!}
          onRestart={handleRestart}
          onUpdateDiagnosis={handleUpdateDiagnosis}
        />
      );

    default:
      return null;
  }
};
