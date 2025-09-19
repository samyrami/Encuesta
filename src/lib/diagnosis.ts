import { Answer, DiagnosisResult, ContactInfo, Question } from '@/types/chat';

export const generateDiagnosis = (
  answers: Answer[], 
  questions: Question[], 
  contactInfo: ContactInfo
): DiagnosisResult => {
  // Calculate total score (0-100 scale)
  const totalPossibleScore = questions.length * 4; // max 4 points per question
  const actualScore = answers.reduce((sum, answer) => sum + answer.optionValue, 0);
  const normalizedScore = Math.round((actualScore / totalPossibleScore) * 100);

  // Group answers by diagnosis type
  const diagnosisByType = {
    strength: [] as string[],
    opportunity: [] as string[],
    improvement: [] as string[],
    weakness: [] as string[]
  };

  answers.forEach(answer => {
    const question = questions.find(q => q.id === answer.questionId);
    if (question) {
      const option = question.options.find(opt => opt.value === answer.optionValue);
      if (option) {
        diagnosisByType[option.diagnosis.type].push(option.diagnosis.message);
      }
    }
  });

  // Generate strengths
  const fortalezas = [
    ...diagnosisByType.strength,
    ...diagnosisByType.opportunity.slice(0, 2) // Include some opportunities as strengths
  ];

  // Generate weaknesses
  const debilidades = [
    ...diagnosisByType.weakness,
    ...diagnosisByType.improvement.slice(0, 3)
  ];

  // Generate recommendations based on weaknesses and improvements
  const recomendaciones = generateRecommendations(diagnosisByType, normalizedScore);

  return {
    score: normalizedScore,
    fortalezas,
    debilidades,
    recomendaciones,
    metadata: {
      empresa: contactInfo.company,
      responsable: contactInfo.name,
      ciudad: contactInfo.city,
      fecha: new Date().toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  };
};

const generateRecommendations = (
  diagnosisByType: Record<string, string[]>,
  score: number
): string[] => {
  const recommendations = [];

  // Score-based recommendations
  if (score < 30) {
    recommendations.push(
      "Inicie con un programa de capacitación básica en comercio internacional",
      "Considere alianzas con empresas exportadoras experimentadas",
      "Evalúe la implementación de certificaciones de calidad como primer paso"
    );
  } else if (score < 60) {
    recommendations.push(
      "Fortalezca las áreas identificadas como debilidades antes de exportar",
      "Realice estudios de mercado específicos para países objetivo",
      "Desarrolle un plan de internacionalización gradual y estructurado"
    );
  } else if (score < 80) {
    recommendations.push(
      "Su empresa está bien preparada, enfóquese en identificar mercados específicos",
      "Implemente herramientas de gestión de riesgos para operaciones internacionales",
      "Considere participar en ferias internacionales y misiones comerciales"
    );
  } else {
    recommendations.push(
      "Su empresa tiene excelente preparación exportadora",
      "Explore mercados más exigentes y de mayor valor agregado",
      "Considere estrategias de expansión internacional más agresivas"
    );
  }

  // Category-specific recommendations
  if (diagnosisByType.weakness.length > 0 || diagnosisByType.improvement.length > 0) {
    recommendations.push(
      "Desarrolle un cronograma de implementación para abordar las áreas de mejora identificadas",
      "Busque asesoría especializada del Laboratorio de Gobierno y del Laboratorio de Comercio Internacional de la Universidad de La Sabana",
      "Establezca métricas para monitorear el progreso en cada área de mejora"
    );
  }

  return recommendations.slice(0, 6); // Limit to 6 recommendations
};

export const refineDiagnosisWithOpenAI = async (
  diagnosis: DiagnosisResult,
  apiKey: string
): Promise<DiagnosisResult> => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `Eres un asesor especializado del Laboratorio de Gobierno y del Laboratorio de Comercio Internacional de la Universidad de La Sabana. 
            
Tu tarea es mejorar la redacción de un diagnóstico de capacidad exportadora manteniendo las tres secciones principales: Fortalezas, Debilidades y Recomendaciones.

Pautas:
- Usa un lenguaje profesional pero cercano
- Mantén el tono constructivo y orientado a la acción
- Las fortalezas deben ser específicas y motivadoras
- Las debilidades deben presentarse como oportunidades de mejora
- Las recomendaciones deben ser concretas y realizables
- Adapta el contenido al contexto colombiano y latinoamericano
- Responde únicamente con un JSON válido con la estructura: {"fortalezas": string[], "debilidades": string[], "recomendaciones": string[]}`
          },
          {
            role: 'user',
            content: `Empresa: ${diagnosis.metadata.empresa}
Responsable: ${diagnosis.metadata.responsable}
Ciudad: ${diagnosis.metadata.ciudad}
Puntaje: ${diagnosis.score}/100

Diagnóstico actual:

FORTALEZAS:
${diagnosis.fortalezas.map(f => `- ${f}`).join('\n')}

DEBILIDADES:
${diagnosis.debilidades.map(d => `- ${d}`).join('\n')}

RECOMENDACIONES:
${diagnosis.recomendaciones.map(r => `- ${r}`).join('\n')}

Por favor, mejora la redacción manteniendo la estructura y el contenido esencial.`
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    const refinedDiagnosis = JSON.parse(content);
    
    return {
      ...diagnosis,
      fortalezas: refinedDiagnosis.fortalezas,
      debilidades: refinedDiagnosis.debilidades,
      recomendaciones: refinedDiagnosis.recomendaciones
    };
  } catch (error) {
    console.warn('Failed to refine diagnosis with OpenAI:', error);
    // Return original diagnosis if OpenAI fails
    return diagnosis;
  }
};
