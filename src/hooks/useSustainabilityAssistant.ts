import { useState, useCallback, useEffect } from 'react';
import { sustainabilityQuestions, UserProfile, SustainabilityResponse, SustainabilityResults } from '@/data/sustainability-questionnaire.v2';
import { universities } from '@/data/universities';
import { persistAssistantData, loadAssistantData, clearAssistantData, hasPersistedData } from '@/utils/persistence';
import { googleSheetsService, SurveyResponse } from '@/services/googleSheetsService';

export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  options?: string[];
  specialInput?: 'university-select';
}

export interface AssistantState {
  currentStep: 'welcome' | 'profile' | 'questionnaire' | 'results' | 'chat';
  currentFieldIndex: number;
  currentQuestionIndex: number;
  currentDimension: 'Ambiental' | 'Social' | 'Gobernanza';
  profile: Partial<UserProfile>;
  responses: SustainabilityResponse[];
  results: SustainabilityResults | null;
}

const PROFILE_FIELDS = [
  { key: 'name', label: '¿Cómo te llamas?', placeholder: 'Ingresa tu nombre completo' },
  { key: 'university', label: 'Universidad a calificar', type: 'select', options: universities }
];

export const useSustainabilityAssistant = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [state, setState] = useState<AssistantState>({
    currentStep: 'welcome',
    currentFieldIndex: 0,
    currentQuestionIndex: 0,
    currentDimension: 'Ambiental',
    profile: {},
    responses: [],
    results: null
  });
  const [hasLoadedFromStorage, setHasLoadedFromStorage] = useState(false);

  // Cargar datos persistidos al inicializar
  useEffect(() => {
    if (!hasLoadedFromStorage) {
      try {
        const persistedData = loadAssistantData();
        if (persistedData) {
          // Verificar compatibilidad de datos
          if (persistedData.state.currentFieldIndex >= PROFILE_FIELDS.length) {
            console.log('🧺 Datos persistidos incompatibles, reiniciando...');
            clearAssistantData();
          } else {
            setState(persistedData.state);
            setMessages(persistedData.messages);
            console.log('📋 Sesión anterior restaurada');
            
            // Si estamos en resultados pero no hay resultados, intentar recuperarlos
            if (persistedData.state.currentStep === 'results' && !persistedData.state.results) {
              console.log('🔄 Intentando recuperar resultados...');
              try {
                const backupResults = localStorage.getItem('sustainability_results_backup');
                if (backupResults) {
                  const parsedResults = JSON.parse(backupResults);
                  setState(prev => ({ ...prev, results: parsedResults }));
                  console.log('✅ Resultados recuperados desde backup');
                }
              } catch (error) {
                console.error('❌ Error recuperando resultados:', error);
              }
            }
          }
        }
      } catch (error) {
        console.error('❌ Error al cargar datos persistidos:', error);
        clearAssistantData();
      }
      setHasLoadedFromStorage(true);
    }
  }, [hasLoadedFromStorage]);

  // Auto-guardar cambios en el estado y mensajes
  useEffect(() => {
    if (hasLoadedFromStorage && (messages.length > 0 || state.responses.length > 0)) {
      persistAssistantData(state, messages);
    }
  }, [state, messages, hasLoadedFromStorage]);

  const addMessage = useCallback((content: string, type: 'user' | 'bot', options?: string[], specialInput?: 'university-select') => {
    const newMessage: ChatMessage = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2)}`,
      type,
      content,
      timestamp: new Date(),
      options,
      specialInput
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const initializeBot = useCallback(() => {
    const welcomeMessage = `🌱 **¡Bienvenido/a al Asistente Virtual de Sostenibilidad Universitaria de la Universidad de La Sabana!**

Este asistente te ayudará a evaluar el nivel de sostenibilidad de tu institución en tres dimensiones fundamentales:

🌍 **Ambiental** - Gestión de recursos, energía, residuos y biodiversidad
👥 **Social** - Equidad, derechos humanos, responsabilidad social universitaria  
🏛️ **Gobernanza** - Transparencia, ética, planificación estratégica

> 📋 **El proceso incluye:**
> - Registro de información básica (2 preguntas)
> - Cuestionario integral de sostenibilidad (43 preguntas)
> - Diagnóstico detallado con fortalezas, debilidades y recomendaciones
> - Opción de exportar resultados y continuar conversando

¿Estás listo/a para comenzar esta evaluación de sostenibilidad?`;

    addMessage(welcomeMessage, 'bot', ['Sí, comenzar evaluación', 'Necesito más información']);
  }, [addMessage]);

  const startProfileCollection = useCallback(() => {
    setState(prev => ({ ...prev, currentStep: 'profile', currentFieldIndex: 0 }));
    
    addMessage(
      '**📝 Registro Inicial**\n\nPerfecto, comencemos con algunas preguntas básicas para personalizar tu experiencia.\n\n' + PROFILE_FIELDS[0].label,
      'bot'
    );
  }, [addMessage]);

  const handleProfileInput = useCallback((input: string) => {
    const currentField = PROFILE_FIELDS[state.currentFieldIndex];
    
    // Verificar que currentField existe
    if (!currentField) {
      console.error('Current field is undefined, currentFieldIndex:', state.currentFieldIndex);
      return;
    }
    
    setState(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        [currentField.key]: input
      }
    }));

    addMessage(input, 'user');

    if (state.currentFieldIndex < PROFILE_FIELDS.length - 1) {
      const nextFieldIndex = state.currentFieldIndex + 1;
      const nextField = PROFILE_FIELDS[nextFieldIndex];
      
      setState(prev => ({ ...prev, currentFieldIndex: nextFieldIndex }));
      
      if (nextField.type === 'select') {
        addMessage(
          `Perfecto, ${input}! 

**${nextField.label}**

Selecciona de la lista la universidad que deseas evaluar:`,
          'bot',
          undefined,
          'university-select'
        );
      } else {
        addMessage(`Gracias! ${nextField.label}`, 'bot');
      }
    } else {
      // Profile collection complete
      setState(prev => ({ 
        ...prev, 
        currentStep: 'questionnaire',
        currentQuestionIndex: 0,
        currentDimension: 'Ambiental'
      }));
      
      setTimeout(() => {
        addMessage(
          `¡Excelente, ${state.profile.name}! Ya tenemos tu información básica.\n\n🌱 **Comenzaremos con la Dimensión AMBIENTAL**\n\nEsta sección evalúa cómo tu universidad gestiona sus recursos naturales, energía, residuos y su compromiso con la sostenibilidad ambiental.\n\n> 💡 **Instrucciones:** Para cada pregunta, selecciona la opción (1-5) que mejor describa la situación actual de tu institución.`,
          'bot',
          ['Comenzar Dimensión Ambiental']
        );
      }, 1000);
    }
  }, [state.currentFieldIndex, state.profile.name, addMessage]);

  const startDimensionQuestions = useCallback((dimension: 'Ambiental' | 'Social' | 'Gobernanza') => {
    const dimensionQuestions = sustainabilityQuestions.filter(q => q.dimension === dimension);
    const firstQuestion = dimensionQuestions[0];

    setState(prev => ({ 
      ...prev, 
      currentDimension: dimension,
      currentQuestionIndex: 0
    }));

    const options = Object.entries(firstQuestion.opciones).map(([key, value]) => `${key}. ${value}`);

    addMessage(
      `**${dimension} - Pregunta 1 de ${dimensionQuestions.length}**\n\n**${firstQuestion.pregunta}**\n\nSelecciona la opción que mejor describe la situación actual:`,
      'bot',
      options
    );
  }, [addMessage]);

  const handleQuestionAnswer = useCallback((answer: string) => {
    const score = parseInt(answer.split('.')[0]);
    const dimensionQuestions = sustainabilityQuestions.filter(q => q.dimension === state.currentDimension);
    const currentQuestion = dimensionQuestions[state.currentQuestionIndex];
    
    // Save response
    const response: SustainabilityResponse = {
      questionId: currentQuestion.id,
      score,
      timestamp: new Date()
    };

    setState(prev => ({
      ...prev,
      responses: [...prev.responses, response]
    }));

    addMessage(answer, 'user');
    addMessage(`✅ **Respuesta registrada:** Puntuación ${score}/5`, 'bot');

    if (state.currentQuestionIndex < dimensionQuestions.length - 1) {
      // Next question in same dimension
      const nextQuestionIndex = state.currentQuestionIndex + 1;
      const nextQuestion = dimensionQuestions[nextQuestionIndex];
      
      setState(prev => ({ ...prev, currentQuestionIndex: nextQuestionIndex }));
      
      setTimeout(() => {
        const options = Object.entries(nextQuestion.opciones).map(([key, value]) => `${key}. ${value}`);
        
        addMessage(
          `**${state.currentDimension} - Pregunta ${nextQuestionIndex + 1} de ${dimensionQuestions.length}**\n\n**${nextQuestion.pregunta}**\n\nSelecciona la opción que mejor describe la situación actual:`,
          'bot',
          options
        );
      }, 1000);
    } else {
      // Dimension complete, show summary and move to next
      setTimeout(() => {
        showDimensionSummary(state.currentDimension);
      }, 1000);
    }
  }, [state.currentDimension, state.currentQuestionIndex, addMessage]);

  const showDimensionSummary = useCallback((completedDimension: 'Ambiental' | 'Social' | 'Gobernanza') => {
    const dimensionQuestions = sustainabilityQuestions.filter(q => q.dimension === completedDimension);
    const dimensionResponses = state.responses.filter(r => 
      sustainabilityQuestions.find(q => q.id === r.questionId)?.dimension === completedDimension
    );
    
    const averageScore = dimensionResponses.reduce((sum, r) => sum + r.score, 0) / dimensionResponses.length;
    const strengths = dimensionResponses.filter(r => r.score >= 4).length;
    const weaknesses = dimensionResponses.filter(r => r.score <= 2).length;

    let nextDimension: 'Social' | 'Gobernanza' | null = null;
    let summaryMessage = `📊 **Resumen Dimensión ${completedDimension}**\n\n`;
    summaryMessage += `• **Puntuación promedio:** ${averageScore.toFixed(1)}/5.0\n`;
    summaryMessage += `• **Fortalezas identificadas:** ${strengths} áreas\n`;
    summaryMessage += `• **Áreas de mejora:** ${weaknesses} áreas\n\n`;

    if (completedDimension === 'Ambiental') {
      nextDimension = 'Social';
      summaryMessage += '🤝 **Continuamos con la Dimensión SOCIAL**\n\nEsta sección evalúa el compromiso de tu universidad con la equidad, derechos humanos, apoyo estudiantil y responsabilidad social.';
    } else if (completedDimension === 'Social') {
      nextDimension = 'Gobernanza';
      summaryMessage += '🏛️ **Finalizamos con la Dimensión GOBERNANZA**\n\nEsta sección evalúa la transparencia, ética institucional, planificación estratégica y estructuras de gobierno universitario.';
    } else {
      summaryMessage += '🎯 **¡Evaluación Completa!**\n\nHas terminado las tres dimensiones. Generando tu diagnóstico integral de sostenibilidad...';
    }

    addMessage(summaryMessage, 'bot', 
      nextDimension ? [`Comenzar Dimensión ${nextDimension}`] : ['Ver Resultados Completos']
    );

    if (!nextDimension) {
      setTimeout(() => generateResults(), 2000);
    }
  }, [state.responses, addMessage]);

  const saveToGoogleSheets = async (results: SustainabilityResults) => {
    try {
      if (!googleSheetsService.isConfigured()) {
        console.log('📋 Google Sheets no configurado, omitiendo...');
        return;
      }

      console.log('📄 Preparando datos para Google Sheets...');
      
      const surveyData: SurveyResponse = {
        timestamp: results.completedAt.toISOString(),
        name: results.profile.name,
        university: results.profile.university,
        overallScore: results.overallScore || 0,
        ambientalScore: results.dimensions.ambiental.score || 0,
        socialScore: results.dimensions.social.score || 0,
        gobernanzaScore: results.dimensions.gobernanza.score || 0,
        responses: results.responses,
        strengths: [
          ...results.dimensions.ambiental.strengths,
          ...results.dimensions.social.strengths,
          ...results.dimensions.gobernanza.strengths
        ],
        weaknesses: [
          ...results.dimensions.ambiental.weaknesses,
          ...results.dimensions.social.weaknesses,
          ...results.dimensions.gobernanza.weaknesses
        ],
        recommendations: [
          ...results.dimensions.ambiental.recommendations,
          ...results.dimensions.social.recommendations,
          ...results.dimensions.gobernanza.recommendations
        ]
      };

      await googleSheetsService.saveResponse(surveyData);
      console.log('✅ Datos guardados en Google Sheets exitosamente');
      
      // Mostrar notificación al usuario
      addMessage(
        '📈 **¡Respuestas guardadas!**\n\nTus respuestas han sido guardadas exitosamente en nuestra base de datos para análisis estadístico.',
        'bot'
      );
      
    } catch (error) {
      console.error('❌ Error guardando en Google Sheets:', error);
      // No mostrar error al usuario, ya que las respuestas están guardadas localmente
    }
  }; // Note: addMessage is used inside but it's stable and doesn't need dependency

  const generateResults = useCallback(() => {
    console.log('🎯 Iniciando generación de resultados...');
    console.log('📃 Estado actual - respuestas:', state.responses.length);
    console.log('👤 Perfil:', state.profile);
    
    // Calcular resultados inmediatamente
    const results = calculateSustainabilityResults();
    console.log('✅ Resultados calculados:', results);
    
    // Actualizar estado con resultados
    setState(prev => ({ 
      ...prev, 
      currentStep: 'results',
      results 
    }));

    // Forzar persistencia inmediata de resultados
    setTimeout(() => {
      console.log('💾 Guardando resultados en localStorage...');
      try {
        localStorage.setItem('sustainability_results_backup', JSON.stringify(results));
        console.log('✅ Resultados guardados exitosamente');
      } catch (error) {
        console.error('❌ Error al guardar resultados:', error);
      }
    }, 100);

    // Intentar guardar en Google Sheets
    setTimeout(() => {
      saveToGoogleSheets(results);
    }, 500);

    addMessage(
      '✅ **¡Diagnóstico Completado!**\n\nTu evaluación de sostenibilidad universitaria ha sido procesada exitosamente.\n\nPuedes revisar los resultados detallados, exportar el informe en PDF, o continuar conversando para profundizar en recomendaciones específicas.',
      'bot'
    );
  }, [state.responses, state.profile, saveToGoogleSheets, addMessage]);

  const calculateSustainabilityResults = useCallback((): SustainabilityResults => {
    const profile = state.profile as UserProfile;
    const responses = state.responses;

    console.log('📊 Calculando resultados con respuestas:', responses.length);
    console.log('🔍 Respuestas completas:', responses);

    // Calculate scores by dimension
    const dimensions = {
      ambiental: calculateDimensionResults('Ambiental'),
      social: calculateDimensionResults('Social'), 
      gobernanza: calculateDimensionResults('Gobernanza')
    };

    console.log('📊 Puntuaciones por dimensión:', dimensions);

    const validScores = [dimensions.ambiental.score, dimensions.social.score, dimensions.gobernanza.score]
      .filter(score => !isNaN(score) && isFinite(score) && score > 0);
    
    const overallScore = validScores.length > 0 ? validScores.reduce((a, b) => a + b, 0) / validScores.length : 0;

    console.log('🎯 Puntuación general calculada:', overallScore);

    const finalResults = {
      profile,
      responses,
      dimensions,
      overallScore,
      completedAt: new Date()
    };

    console.log('✅ Resultados finales:', finalResults);
    return finalResults;
  }, [state.profile, state.responses]);

  const calculateDimensionResults = useCallback((dimension: 'Ambiental' | 'Social' | 'Gobernanza') => {
    const dimensionQuestions = sustainabilityQuestions.filter(q => q.dimension === dimension);
    const dimensionResponses = state.responses.filter(r => 
      sustainabilityQuestions.find(q => q.id === r.questionId)?.dimension === dimension
    );

    console.log(`📊 ${dimension}: ${dimensionResponses.length} respuestas de ${dimensionQuestions.length} preguntas`);
    console.log(`🔍 ${dimension} - IDs de respuestas:`, dimensionResponses.map(r => r.questionId));

    if (dimensionResponses.length === 0) {
      console.log(`⚠️ ${dimension}: Sin respuestas, devolviendo valores por defecto`);
      return {
        score: 0,
        strengths: [],
        weaknesses: [],
        recommendations: [
          `Complete la evaluación de ${dimension.toLowerCase()} para obtener recomendaciones específicas.`
        ]
      };
    }

    const totalScore = dimensionResponses.reduce((sum, r) => {
      const score = r.score || 0;
      console.log(`📊 ${dimension} - respuesta ${r.questionId}: ${score}`);
      return sum + score;
    }, 0);
    
    const averageScore = totalScore / dimensionResponses.length;
    
    console.log(`📊 ${dimension}: total=${totalScore}, promedio=${averageScore.toFixed(2)}`);

    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const recommendations: string[] = [];

    dimensionResponses.forEach(response => {
      const question = sustainabilityQuestions.find(q => q.id === response.questionId);
      if (!question) {
        console.warn(`⚠️ Pregunta no encontrada: ${response.questionId}`);
        return;
      }

      const score = response.score || 0;
      if (score >= 4) {
        strengths.push(question.pregunta);
      } else if (score <= 2) {
        weaknesses.push(question.pregunta);
        const recommendation = question.recommendations[score.toString()];
        if (recommendation) {
          recommendations.push(recommendation);
        }
      }
    });

    return {
      score: averageScore,
      strengths,
      weaknesses,
      recommendations: recommendations.length > 0 ? recommendations : [
        `Continúe fortaleciendo las prácticas en ${dimension.toLowerCase()} según las recomendaciones específicas.`
      ]
    };
  }, [state.responses]);

  const handleUserMessage = useCallback((message: string) => {
    switch (state.currentStep) {
      case 'welcome':
        if (message === 'Sí, comenzar evaluación') {
          startProfileCollection();
        } else {
          addMessage(
            'El Asistente de Sostenibilidad Universitaria utiliza un modelo de evaluación integral basado en estándares internacionales para medir la sostenibilidad en tres dimensiones clave.\n\n¿Te gustaría comenzar ahora?',
            'bot',
            ['Sí, comenzar evaluación']
          );
        }
        break;

      case 'profile':
        handleProfileInput(message);
        break;

      case 'questionnaire':
        if (message === 'Comenzar Dimensión Ambiental') {
          startDimensionQuestions('Ambiental');
        } else if (message === 'Comenzar Dimensión Social') {
          startDimensionQuestions('Social');
        } else if (message === 'Comenzar Dimensión Gobernanza') {
          startDimensionQuestions('Gobernanza');
        } else if (message === 'Ver Resultados Completos') {
          generateResults();
        } else {
          handleQuestionAnswer(message);
        }
        break;

      default:
        break;
    }
  }, [state, startProfileCollection, handleProfileInput, startDimensionQuestions, 
      handleQuestionAnswer, generateResults, addMessage]);

  const restartEvaluation = useCallback(() => {
    console.log('🔁 Reiniciando evaluación completa...');
    clearAssistantData();
    setMessages([]);
    setState({
      currentStep: 'welcome',
      currentFieldIndex: 0,
      currentQuestionIndex: 0,
      currentDimension: 'Ambiental',
      profile: {},
      responses: [],
      results: null
    });
    setHasLoadedFromStorage(true); // Evitar que se carguen datos antiguos
    setTimeout(() => {
      initializeBot();
    }, 100);
  }, [initializeBot]);

  const continueToChat = useCallback(() => {
    setState(prev => ({ ...prev, currentStep: 'chat' }));
  }, []);

  const backToResults = useCallback(() => {
    setState(prev => ({ ...prev, currentStep: 'results' }));
  }, []);

  return {
    messages,
    state,
    results: state.results,
    handleUserMessage,
    initializeBot,
    restartEvaluation,
    continueToChat,
    backToResults
  };
};