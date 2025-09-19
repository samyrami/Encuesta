import { useState, useCallback } from 'react';
import { Message, QuestionnaireState, ContactInfo, DiagnosisResult } from '@/types/chat';
import { questions, contactFields } from '@/data/questionnaire';

export const useChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [state, setState] = useState<QuestionnaireState>({
    currentStep: 'welcome',
    currentQuestionIndex: 0,
    contactInfo: {},
    answers: {},
    diagnosisGenerated: false
  });
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);

  const addMessage = useCallback((content: string, type: 'user' | 'bot', options?: string[]) => {
    const newMessage: Message = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2)}`,
      type,
      content,
      timestamp: new Date(),
      options
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const initializeBot = useCallback(() => {
    const welcomeMessage = `¡Hola! Soy el asistente del **Exporta Check**, desarrollado por el **Laboratorio de Gobierno** con el apoyo del **Laboratorio de Comercio Internacional de la Universidad de La Sabana**.

Este cuestionario te ayudará a **evaluar la preparación y capacidad exportadora** de tu empresa. La información que proporciones será utilizada únicamente para diagnóstico y orientación general.

> 📋 El proceso incluye:
> - Recolección de datos básicos
> - Cuestionario de 23 preguntas clave  
> - Diagnóstico personalizado con recomendaciones
> - Chat especializado para resolver dudas

¿Estás listo para empezar?`;

    addMessage(welcomeMessage, 'bot', ['Sí, comenzar cuestionario', 'Necesito más información']);
  }, [addMessage]);

  const startContactCollection = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      currentStep: 'contact', 
      currentField: 'company' 
    }));
    
    addMessage(
      '**📝 Datos de Contacto**\n\nPerfecto, comencemos recopilando tus datos de contacto.\n\n¿Cuál es el **nombre de tu compañía**?',
      'bot'
    );
  }, [addMessage]);

  const handleContactInput = useCallback((input: string) => {
    const currentField = state.currentField!;
    const fieldIndex = contactFields.findIndex(f => f.key === currentField);
    
    console.log('📝 Guardando dato de contacto:', { currentField, input, fieldIndex });
    
    setState(prev => {
      const newState = {
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [currentField]: input
      }
      };
      console.log('🔄 Estado actualizado:', JSON.stringify(newState.contactInfo, null, 2));
      return newState;
    });

    addMessage(input, 'user');

    if (fieldIndex < contactFields.length - 1) {
      const nextField = contactFields[fieldIndex + 1];
      setState(prev => ({ ...prev, currentField: nextField.key }));
      
      addMessage(`Gracias. Ahora, ¿cuál es ${nextField.label.toLowerCase()}?`, 'bot');
    } else {
      // Contact collection complete
      console.log('✅ Datos de contacto completados');
      setState(prev => ({ 
        ...prev, 
        currentStep: 'questionnaire', 
        currentField: undefined 
      }));
      
      addMessage(
        '✅ **¡Excelente!** Ya tengo todos tus datos de contacto.\n\nAhora comenzaremos con el **cuestionario de evaluación exportadora**.\n\n> 💡 **Instrucciones:** Responde cada pregunta seleccionando la opción que mejor describa la situación actual de tu empresa.',
        'bot'
      );
      
      setTimeout(() => {
        const firstQuestion = questions[6]; // Empezar desde la pregunta 7 (tamaño de empresa)
        addMessage(
          `**Pregunta 1/17** - *${firstQuestion.category}*\n\n${firstQuestion.pregunta}`,
          'bot',
          firstQuestion.opcion_si && firstQuestion.opcion_no 
            ? ['Micro empresa (1-10 empleados)', 'Pequeña empresa (11-50 empleados)', 'Mediana empresa (51-200 empleados)', 'Gran empresa (más de 200 empleados)'] 
            : firstQuestion.opcion_si 
              ? [firstQuestion.opcion_si]
              : ['Continuar']
        );
      }, 1000);
    }
  }, [state.currentField, addMessage]);

  const handleQuestionAnswer = useCallback((answer: string) => {
    const currentQuestionIndex = state.currentQuestionIndex;
    const currentQuestion = questions[6 + currentQuestionIndex]; // Empezar desde índice 6
    
    console.log('❓ Procesando respuesta:', { currentQuestionIndex, questionId: currentQuestion.id, pregunta: currentQuestion.pregunta, answer });
    
    // Save answer
    setState(prev => {
      const newState = {
      ...prev,
      answers: {
        ...prev.answers,
        [currentQuestion.id]: answer
      }
      };
      console.log('💾 Respuesta guardada:', { questionId: currentQuestion.id, answer, totalAnswers: Object.keys(newState.answers).length, newAnswers: JSON.stringify(newState.answers, null, 2) });
      return newState;
    });

    addMessage(answer, 'user');

    // Confirm answer received
    addMessage(`✅ **Respuesta registrada:** ${answer}`, 'bot');

    if (currentQuestionIndex < 16) { // Solo 17 preguntas del cuestionario (excluyendo datos de contacto)
      // Next question
      setState(prev => ({ 
        ...prev, 
        currentQuestionIndex: prev.currentQuestionIndex + 1 
      }));
      
      setTimeout(() => {
        const nextQuestion = questions[6 + currentQuestionIndex + 1];
        addMessage(
          `**Pregunta ${currentQuestionIndex + 2}/17** - *${nextQuestion.category}*\n\n${nextQuestion.pregunta}`,
          'bot',
          nextQuestion.opcion_si && nextQuestion.opcion_no 
            ? (nextQuestion.opcion_si === 'Micro empresa (1-10 empleados)' 
                ? ['Micro empresa (1-10 empleados)', 'Pequeña empresa (11-50 empleados)', 'Mediana empresa (51-200 empleados)', 'Gran empresa (más de 200 empleados)']
                : ['Sí', 'No'])
            : nextQuestion.opcion_si 
              ? [nextQuestion.opcion_si]
              : ['Continuar']
        );
      }, 1000);
    } else {
      // Generate diagnosis
      console.log('🎯 Generando diagnóstico...');
      setState(prev => ({ ...prev, currentStep: 'diagnosis' }));
      generateDiagnosis();
    }
  }, [state.currentQuestionIndex, addMessage]);

  const generateDiagnosis = useCallback(() => {
    addMessage(
      '🎯 **¡Perfecto!** Has completado todo el cuestionario.\n\n⏳ Ahora voy a generar tu **diagnóstico personalizado**...',
      'bot'
    );

    setTimeout(() => {
      // Usar setState para acceder al estado más reciente
      setState(currentState => {
        const diagnosisResult = calculateDiagnosisWithState(currentState);
        setDiagnosis(diagnosisResult);
        
        addMessage(
          '✅ **¡Diagnóstico Completado!**\n\nTu evaluación ha sido procesada exitosamente. Ahora puedes revisar los resultados detallados, descargar el informe en PDF o CSV, y continuar chateando con nuestro asistente especializado.',
          'bot'
        );
        
        return currentState; // No cambiar el estado, solo acceder a él
      });
    }, 2000);
  }, [addMessage]);

  const calculateDiagnosisWithState = (currentState: QuestionnaireState): DiagnosisResult => {
    const answers = currentState.answers;
    const contactInfo = currentState.contactInfo;
    
    console.log('🔍 Calculando diagnóstico con:', { 
      totalAnswers: Object.keys(answers).length,
      answers: JSON.stringify(answers, null, 2), 
      contactInfo: JSON.stringify(contactInfo, null, 2) 
    });
    
    let score = 0;
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const recommendations: string[] = [];

    // Calcular puntuación basada en respuestas
    Object.entries(answers).forEach(([questionId, answer]) => {
      const question = questions.find(q => q.id === parseInt(questionId));
      console.log(`📝 Procesando pregunta ${questionId}:`, { 
        questionId, 
        answer, 
        pregunta: question?.pregunta,
        opcion_si: question?.opcion_si,
        opcion_no: question?.opcion_no
      });
      
      if (question && question.opcion_si && question.opcion_no) {
        if (question.opcion_si === 'Micro empresa (1-10 empleados)') {
          // Pregunta del tamaño de empresa - puntuación basada en el tamaño
          console.log('🏢 Procesando pregunta de tamaño de empresa:', answer);
          if (answer.includes('Micro')) {
            score += 2; // Micro empresa - menor puntuación
            weaknesses.push('Empresa de tamaño micro - puede requerir más recursos para exportar');
            console.log('➕ Micro empresa: +2 puntos');
          } else if (answer.includes('Pequeña')) {
            score += 3; // Pequeña empresa
            strengths.push('Empresa de tamaño pequeño - buen balance entre agilidad y recursos');
            console.log('➕ Pequeña empresa: +3 puntos');
          } else if (answer.includes('Mediana')) {
            score += 4; // Mediana empresa
            strengths.push('Empresa de tamaño mediano - recursos adecuados para exportación');
            console.log('➕ Mediana empresa: +4 puntos');
          } else if (answer.includes('Gran')) {
            score += 5; // Gran empresa
            strengths.push('Empresa de gran tamaño - recursos significativos para exportación');
            console.log('➕ Gran empresa: +5 puntos');
          }
        }
        // Preguntas Sí/No normales
        else if (answer === 'Sí' || answer === 'No') {
          console.log('✅ Procesando pregunta Sí/No:', answer);
          if (answer === 'Sí') {
            score += 4; // 4 puntos por respuesta positiva
            if (question.opcion_si) {
              strengths.push(question.opcion_si);
            }
            console.log('➕ Respuesta Sí: +4 puntos');
          } else {
            score += 1; // 1 punto por respuesta negativa
            if (question.opcion_no) {
              weaknesses.push(question.opcion_no);
            }
            console.log('➕ Respuesta No: +1 punto');
          }
        }
        // Cualquier otra respuesta que no sea Sí/No
        else {
          // Dar puntos neutros para respuestas no categorizadas
          score += 2;
          console.log('➕ Respuesta neutral: +2 puntos');
        }
      }
    });

    console.log(`📊 Puntuación calculada: ${score}`);

    // Normalizar puntuación a 100
    const maxPossibleScore = 17 * 4; // 17 preguntas * 4 puntos máximos
    score = Math.round((score / maxPossibleScore) * 100);

    console.log(`📈 Puntuación normalizada: ${score}/100`);

    // Determinar categoría
    let category: 'Principiante' | 'Intermedio' | 'Avanzado' | 'Experto';
    if (score < 25) {
      category = 'Principiante';
    } else if (score < 50) {
      category = 'Intermedio';
    } else if (score < 75) {
      category = 'Avanzado';
    } else {
      category = 'Experto';
    }

    console.log(`🏷️ Categoría asignada: ${category}`);

    // Generar recomendaciones basadas en categoría y respuestas
    if (category === 'Principiante') {
      recommendations.push(
        'Implementar un sistema de gestión de calidad básico (ISO 9001)',
        'Desarrollar un plan de capacitación en comercio internacional',
        'Realizar investigación básica de mercados objetivo',
        'Establecer alianzas con empresas exportadoras experimentadas',
        'Crear un plan de acción para la internacionalización'
      );
    } else if (category === 'Intermedio') {
      recommendations.push(
        'Obtener certificaciones específicas del sector',
        'Optimizar la cadena logística para exportación',
        'Desarrollar material promocional multilingüe',
        'Participar en ferias y misiones comerciales',
        'Implementar estrategias de precios internacionales'
      );
    } else if (category === 'Avanzado') {
      recommendations.push(
        'Expandir a mercados más exigentes',
        'Desarrollar productos específicos para mercados internacionales',
        'Implementar sistemas de gestión avanzados',
        'Crear alianzas estratégicas con distribuidores internacionales',
        'Desarrollar estrategias de innovación continua'
      );
    } else {
      recommendations.push(
        'Mantener liderazgo en estándares de calidad',
        'Explorar nuevos mercados emergentes',
        'Desarrollar capacidades de consultoría para otras empresas',
        'Participar en la definición de estándares internacionales',
        'Crear programas de transferencia de conocimiento'
      );
    }

    // Agregar recomendaciones específicas basadas en debilidades
    if (weaknesses.some(w => w.includes('certificaciones'))) {
      recommendations.push('Priorizar la obtención de certificaciones internacionales reconocidas');
    }
    if (weaknesses.some(w => w.includes('logística'))) {
      recommendations.push('Optimizar la cadena logística y establecer alianzas con operadores logísticos');
    }
    if (weaknesses.some(w => w.includes('personal'))) {
      recommendations.push('Invertir en capacitación del personal en comercio internacional');
    }
    if (weaknesses.some(w => w.includes('Micro empresa'))) {
      recommendations.push('Considerar alianzas estratégicas para compartir costos de exportación');
    }

    // Asegurar que siempre hay al menos algunos elementos
    if (strengths.length === 0) {
      strengths.push('La empresa muestra interés en internacionalización');
    }
    if (weaknesses.length === 0) {
      weaknesses.push('Se requiere mayor preparación para exportar');
    }

    const result = {
      company: contactInfo.company || 'Empresa',
      name: contactInfo.name || 'Usuario',
      city: contactInfo.city || 'Ciudad',
      date: new Date().toLocaleDateString('es-CO'),
      strengths: strengths.slice(0, 5), // Máximo 5 fortalezas
      weaknesses: weaknesses.slice(0, 5), // Máximo 5 debilidades
      recommendations: recommendations.slice(0, 8), // Máximo 8 recomendaciones
      score,
      category
    };

    console.log('🎯 Resultado del diagnóstico:', result);
    return result;
  };

  const handleUserMessage = useCallback((message: string) => {
    switch (state.currentStep) {
      case 'welcome':
        addMessage(message, 'user');
        if (message.includes('comenzar') || message.includes('Sí')) {
          startContactCollection();
        } else {
          addMessage(
            '📖 **Más Información sobre Exporta Check**\n\nExporta Check es una **herramienta de diagnóstico especializada** que evalúa diferentes aspectos críticos de tu empresa:\n\n### 🔍 **Aspectos Evaluados:**\n- 🏆 **Certificaciones de calidad** (ISO, BPM, BPA)\n- 🌍 **Experiencia internacional** \n- 🏭 **Capacidad productiva**\n- 👥 **Recursos humanos especializados**\n- 📦 **Adaptación de productos**\n- 🚚 **Logística y operaciones**\n- 🤝 **Alianzas y redes**\n- 💰 **Financiamiento y estrategias**\n\n### 📊 **Beneficios del Diagnóstico:**\n- Identificación de **fortalezas** y **oportunidades de mejora**\n- **Recomendaciones estratégicas** personalizadas\n- **Hoja de ruta** para la internacionalización\n- **Chat especializado** para resolver dudas\n\nCuando estés listo, selecciona "Sí, comenzar cuestionario".',
            'bot',
            ['Sí, comenzar cuestionario']
          );
        }
        break;

      case 'contact':
        handleContactInput(message);
        break;

      case 'questionnaire':
        handleQuestionAnswer(message);
        break;
    }
  }, [state, addMessage, startContactCollection, handleContactInput, handleQuestionAnswer]);



  const continueToChat = useCallback(() => {
    setState(prev => ({ ...prev, currentStep: 'chat' }));
  }, []);

  const restartEvaluation = useCallback(() => {
    setState({
      currentStep: 'welcome',
      currentQuestionIndex: 0,
      contactInfo: {},
      answers: {},
      diagnosisGenerated: false
    });
    setMessages([]);
    setDiagnosis(null);
    initializeBot();
  }, [initializeBot]);

  const backToDiagnosis = useCallback(() => {
    setState(prev => ({ ...prev, currentStep: 'diagnosis' }));
  }, []);

  return {
    messages,
    state,
    diagnosis,
    handleUserMessage,
    initializeBot,
    continueToChat,
    restartEvaluation,
    backToDiagnosis
  };
};