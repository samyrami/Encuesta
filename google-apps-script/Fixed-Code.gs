// Fixed Google Apps Script - Manejo mejorado de parámetros y errores
function doPost(e) {
  try {
    console.log('Received POST request:', e);
    
    // Validar que e y postData existan
    if (!e || !e.postData || !e.postData.contents) {
      console.error('Error: Request data is missing or malformed');
      return ContentService
        .createTextOutput(JSON.stringify({
          error: 'Request data is missing or malformed',
          received: e,
          success: false
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const data = JSON.parse(e.postData.contents);
    console.log('Parsed data:', data);
    
    if (data.action === 'saveResponse') {
      return saveResponseToSheet(data.data);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({error: 'Unknown action: ' + data.action}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error in doPost:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        error: error.message,
        stack: error.stack,
        success: false
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  console.log('GET request received:', e);
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'OK', 
      timestamp: new Date().toISOString(),
      method: 'GET'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function saveResponseToSheet(data) {
  try {
    console.log('Saving detailed data to sheet:', data);
    
    const SHEET_ID = '1wjNTHAdEN4gCF2WP00dqKTu3Vu9UHB360aKMa0DCIM8';
    
    // Validar que tenemos acceso al spreadsheet
    let spreadsheet;
    try {
      spreadsheet = SpreadsheetApp.openById(SHEET_ID);
      console.log('Spreadsheet opened successfully:', spreadsheet.getName());
    } catch (sheetError) {
      console.error('Error accessing spreadsheet:', sheetError);
      throw new Error('Cannot access spreadsheet: ' + sheetError.message);
    }
    
    // Obtener o crear la hoja
    let sheet;
    const sheetNames = ['Responses', 'Sheet1', 'Hoja1'];
    
    for (const sheetName of sheetNames) {
      try {
        sheet = spreadsheet.getSheetByName(sheetName);
        console.log(`Using existing sheet: ${sheetName}`);
        break;
      } catch (e) {
        console.log(`Sheet ${sheetName} not found, trying next...`);
        continue;
      }
    }
    
    // Si no encontramos ninguna hoja, crear una nueva
    if (!sheet) {
      console.log('Creating new sheet: Responses');
      sheet = spreadsheet.insertSheet('Responses');
    }
    
    // Definir todas las preguntas en el orden correcto
    const questionIds = [
      // AMBIENTAL (11)
      'amb_energias', 'amb_consumo_energetico', 'amb_planes_eficiencia', 'amb_agua',
      'amb_economia_circular', 'amb_residuos', 'amb_biodiversidad', 'amb_cultura',
      'amb_curriculo', 'amb_movilidad', 'amb_flexibilidad',
      
      // SOCIAL (14)
      'soc_transparencia_salarial', 'soc_prevencion_abusos', 'soc_eval_doc_admin',
      'soc_clima', 'soc_ddhh', 'soc_apoyo_estudiantes', 'soc_practicas_empleo',
      'soc_rsu', 'soc_investigacion_actores', 'soc_transferencia', 'soc_eval_rsu_interna',
      'soc_salud', 'soc_genero_diversidad', 'soc_impacto_conocimiento',
      
      // GOBERNANZA (18)
      'gov_plan', 'gov_comite_academico', 'gov_transparencia', 'gov_comite_investigacion',
      'gov_vision_mision', 'gov_comite_admin', 'gov_codigo_etica', 'gov_portal_transparencia',
      'gov_plan_estrategico', 'gov_conflicto_interes', 'gov_responsable_esg', 'gov_buen_gobierno',
      'gov_politicas_sostenibilidad', 'gov_comite_auditoria', 'gov_riesgos_esg',
      'gov_equidad_genero', 'gov_stakeholders', 'gov_portal_transparencia_inst'
    ];
    
    console.log(`Total questions expected: ${questionIds.length}`);
    
    // Nombres legibles para las columnas de preguntas
    const questionTitles = {
      // AMBIENTAL
      'amb_energias': 'AMB - Energías renovables',
      'amb_consumo_energetico': 'AMB - Consumo energético', 
      'amb_planes_eficiencia': 'AMB - Planes eficiencia energética',
      'amb_agua': 'AMB - Gestión del agua',
      'amb_economia_circular': 'AMB - Economía circular',
      'amb_residuos': 'AMB - Gestión de residuos',
      'amb_biodiversidad': 'AMB - Conservación biodiversidad',
      'amb_cultura': 'AMB - Cultura ambiental',
      'amb_curriculo': 'AMB - Educación ambiental currículo',
      'amb_movilidad': 'AMB - Movilidad sostenible',
      'amb_flexibilidad': 'AMB - Flexibilidad laboral/académica',
      
      // SOCIAL
      'soc_transparencia_salarial': 'SOC - Transparencia salarial',
      'soc_prevencion_abusos': 'SOC - Prevención abusos poder',
      'soc_eval_doc_admin': 'SOC - Evaluación docente/admin',
      'soc_clima': 'SOC - Clima laboral',
      'soc_ddhh': 'SOC - Derechos humanos',
      'soc_apoyo_estudiantes': 'SOC - Apoyo estudiantes',
      'soc_practicas_empleo': 'SOC - Prácticas e inserción laboral',
      'soc_rsu': 'SOC - RSU y cooperación',
      'soc_investigacion_actores': 'SOC - Investigación actores sociales',
      'soc_transferencia': 'SOC - Transferencia conocimiento',
      'soc_eval_rsu_interna': 'SOC - Evaluación RSU interna',
      'soc_salud': 'SOC - Programas salud',
      'soc_genero_diversidad': 'SOC - Género y diversidad',
      'soc_impacto_conocimiento': 'SOC - Impacto social conocimiento',
      
      // GOBERNANZA
      'gov_plan': 'GOB - Plan sostenibilidad',
      'gov_comite_academico': 'GOB - Comité académico',
      'gov_transparencia': 'GOB - Transparencia organizacional',
      'gov_comite_investigacion': 'GOB - Comité investigación',
      'gov_vision_mision': 'GOB - Sostenibilidad visión/misión',
      'gov_comite_admin': 'GOB - Comité admin/financiero',
      'gov_codigo_etica': 'GOB - Código de ética',
      'gov_portal_transparencia': 'GOB - Portal transparencia',
      'gov_plan_estrategico': 'GOB - Plan estratégico alineado',
      'gov_conflicto_interes': 'GOB - Prevención conflictos interés',
      'gov_responsable_esg': 'GOB - Responsable ESG/RSU',
      'gov_buen_gobierno': 'GOB - Código buen gobierno',
      'gov_politicas_sostenibilidad': 'GOB - Políticas sostenibilidad',
      'gov_comite_auditoria': 'GOB - Comité auditoría',
      'gov_riesgos_esg': 'GOB - Evaluación riesgos ESG',
      'gov_equidad_genero': 'GOB - Equidad género directivas',
      'gov_stakeholders': 'GOB - Participación stakeholders',
      'gov_portal_transparencia_inst': 'GOB - Portal transparencia institucional'
    };
    
    const lastRow = sheet.getLastRow();
    console.log(`Current last row: ${lastRow}`);
    
    // Crear headers si no existen
    if (lastRow === 0) {
      console.log('Creating headers...');
      
      const baseHeaders = [
        'Timestamp', 'Nombre', 'Universidad', 
        'Puntuación General', 'Puntuación Ambiental', 'Puntuación Social', 'Puntuación Gobernanza',
        'Número Respuestas Total'
      ];
      
      // Agregar columnas para cada pregunta individual
      const questionHeaders = questionIds.map(id => questionTitles[id] || id);
      
      const additionalHeaders = [
        'Fortalezas Resumen', 'Debilidades Resumen', 'Recomendaciones Resumen',
        'Respuestas JSON Completas', 'ID Sesión'
      ];
      
      const allHeaders = [...baseHeaders, ...questionHeaders, ...additionalHeaders];
      console.log(`Total headers: ${allHeaders.length}`);
      
      sheet.getRange(1, 1, 1, allHeaders.length).setValues([allHeaders]);
      
      // Format headers
      const headerRange = sheet.getRange(1, 1, 1, allHeaders.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#4285f4');
      headerRange.setFontColor('white');
      headerRange.setWrap(true);
      
      console.log('Headers created successfully');
    }
    
    // Crear mapa de respuestas por questionId
    const responseMap = {};
    if (data.rawResponses) {
      try {
        const responses = typeof data.rawResponses === 'string' 
          ? JSON.parse(data.rawResponses) 
          : data.rawResponses;
        
        console.log(`Processing ${responses.length} responses`);
        responses.forEach(response => {
          responseMap[response.questionId] = response.score;
        });
        
      } catch (e) {
        console.error('Error parsing responses:', e);
      }
    }
    
    // Preparar los datos base
    const baseData = [
      data.timestamp || new Date().toISOString(),
      data.name || '',
      data.university || '',
      data.overallScore || '',
      data.ambientalScore || '',
      data.socialScore || '',
      data.gobernanzaScore || '',
      data.responseCount || ''
    ];
    
    // Agregar puntuaciones individuales de cada pregunta
    const questionScores = questionIds.map(questionId => {
      return responseMap[questionId] || ''; // Vacío si no hay respuesta
    });
    
    // Datos adicionales
    const additionalData = [
      data.strengths || '',
      data.weaknesses || '',
      data.recommendations || '',
      data.rawResponses || '',
      data.sessionId || `session_${Date.now()}`
    ];
    
    // Combinar todos los datos
    const fullRow = [...baseData, ...questionScores, ...additionalData];
    console.log(`Full row length: ${fullRow.length}`);
    
    // Insertar la fila
    const newRowIndex = sheet.getLastRow() + 1;
    console.log(`Inserting data at row: ${newRowIndex}`);
    
    sheet.getRange(newRowIndex, 1, 1, fullRow.length).setValues([fullRow]);
    
    console.log(`✅ Data saved successfully to row ${newRowIndex} with ${fullRow.length} columns`);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Detailed data saved successfully',
        row: newRowIndex,
        columns: fullRow.length,
        questionsIncluded: questionIds.length,
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error saving to sheet:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        error: error.message,
        stack: error.stack,
        success: false,
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Función de prueba que no requiere parámetros
function testSave() {
  const testData = {
    timestamp: new Date().toISOString(),
    name: 'Usuario de Prueba Manual',
    university: 'Universidad de La Sabana',
    overallScore: '4.2',
    ambientalScore: '4.1', 
    socialScore: '4.5',
    gobernanzaScore: '4.0',
    responseCount: '43',
    strengths: 'Gestión ambiental; Responsabilidad social; Transparencia',
    weaknesses: 'Movilidad sostenible; Evaluación RSU',
    recommendations: 'Mejorar comunicación; Implementar políticas; Fortalecer seguimiento',
    rawResponses: JSON.stringify([
      {questionId: 'amb_energias', score: 4},
      {questionId: 'amb_consumo_energetico', score: 3},
      {questionId: 'soc_transparencia_salarial', score: 5},
      {questionId: 'gov_plan', score: 4}
    ]),
    sessionId: `test_manual_${Date.now()}`
  };
  
  const result = saveResponseToSheet(testData);
  console.log('Manual test result:', result.getContent());
  return result;
}