// Google Apps Script para manejar escritura en Google Sheets
// Despliega como Web App con acceso público

function doPost(e) {
  try {
    console.log('Received POST request:', e);
    
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    console.log('Parsed data:', data);
    
    if (data.action === 'saveResponse') {
      return saveResponseToSheet(data.data);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({error: 'Unknown action'}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error in doPost:', error);
    return ContentService
      .createTextOutput(JSON.stringify({error: error.message}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // Simple health check
  return ContentService
    .createTextOutput(JSON.stringify({status: 'OK', timestamp: new Date().toISOString()}))
    .setMimeType(ContentService.MimeType.JSON);
}

function saveResponseToSheet(data) {
  try {
    console.log('Saving data to sheet:', data);
    
    // Open the specific spreadsheet
    const SHEET_ID = '1wjNTHAdEN4gCF2WP00dqKTu3Vu9UHB360aKMa0DCIM8';
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    
    // Try to get existing sheet or create new one
    let sheet;
    try {
      sheet = spreadsheet.getSheetByName('Responses');
    } catch (e) {
      try {
        sheet = spreadsheet.getSheetByName('Sheet1');
      } catch (e) {
        try {
          sheet = spreadsheet.getSheetByName('Hoja1');
        } catch (e) {
          // Create new sheet if none exist
          sheet = spreadsheet.insertSheet('Responses');
        }
      }
    }
    
    // Check if we need to add headers
    const lastRow = sheet.getLastRow();
    if (lastRow === 0) {
      const headers = [
        'Timestamp',
        'Nombre',
        'Universidad',
        'Puntuación General',
        'Puntuación Ambiental',
        'Puntuación Social',
        'Puntuación Gobernanza',
        'Número Respuestas',
        'Fortalezas',
        'Debilidades',
        'Recomendaciones',
        'Respuestas Completas',
        'ID Sesión'
      ];
      
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // Format headers
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#4285f4');
      headerRange.setFontColor('white');
    }
    
    // Prepare the data row
    const row = [
      data.timestamp || new Date().toISOString(),
      data.name || '',
      data.university || '',
      data.overallScore || '',
      data.ambientalScore || '',
      data.socialScore || '',
      data.gobernanzaScore || '',
      data.responseCount || '',
      data.strengths || '',
      data.weaknesses || '',
      data.recommendations || '',
      data.rawResponses || '',
      data.sessionId || `session_${Date.now()}`
    ];
    
    // Add the row to the sheet
    const newRowIndex = sheet.getLastRow() + 1;
    sheet.getRange(newRowIndex, 1, 1, row.length).setValues([row]);
    
    console.log(`Data saved successfully to row ${newRowIndex}`);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Data saved successfully',
        row: newRowIndex,
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error saving to sheet:', error);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        error: error.message,
        success: false,
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function - can be run manually
function testSaveResponse() {
  const testData = {
    timestamp: new Date().toISOString(),
    name: 'Test User',
    university: 'Universidad de Prueba',
    overallScore: '4.2',
    ambientalScore: '4.1',
    socialScore: '4.5',
    gobernanzaScore: '4.0',
    responseCount: '1',
    strengths: 'Gestión ambiental; Responsabilidad social',
    weaknesses: 'Transparencia',
    recommendations: 'Mejorar comunicación; Implementar políticas',
    rawResponses: '[{"questionId":"test","score":4,"answer":"Test answer"}]',
    sessionId: `test_session_${Date.now()}`
  };
  
  const result = saveResponseToSheet(testData);
  console.log('Test result:', result.getContent());
}