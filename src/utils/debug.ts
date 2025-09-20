// Debug utility for sustainability assistant
export const debugSustainabilityApp = () => {
  console.group('🔍 Debug Sustainability App');
  
  // Check localStorage
  console.log('📦 LocalStorage contents:');
  const storageKeys = [
    'sustainability_assistant_state',
    'sustainability_assistant_messages', 
    'sustainability_assistant_last_session'
  ];
  
  storageKeys.forEach(key => {
    const value = localStorage.getItem(key);
    console.log(`  ${key}:`, value ? JSON.parse(value) : 'null');
  });
  
  console.groupEnd();
};

export const clearAllSustainabilityData = () => {
  console.log('🗑️ Clearing all sustainability data...');
  localStorage.removeItem('sustainability_assistant_state');
  localStorage.removeItem('sustainability_assistant_messages');
  localStorage.removeItem('sustainability_assistant_last_session');
  console.log('✅ All data cleared. Refresh the page.');
};

export const recalculateResults = () => {
  console.log('🔄 Forzando recálculo de resultados...');
  const stateData = localStorage.getItem('sustainability_assistant_state');
  if (stateData) {
    const state = JSON.parse(stateData);
    console.log('📊 Respuestas encontradas:', state.responses?.length || 0);
    console.log('🔍 Detalles de respuestas:', state.responses);
    
    if (state.responses && state.responses.length > 0) {
      console.log('✅ Hay respuestas guardadas. El problema está en el cálculo.');
    } else {
      console.log('❌ No hay respuestas guardadas. El usuario debe completar el cuestionario.');
    }
  }
};

export const showResultsDebugInfo = () => {
  console.group('📊 Debug Results Info');
  
  const keys = [
    'sustainability_assistant_state',
    'sustainability_assistant_messages',
    'sustainability_results_backup'
  ];
  
  keys.forEach(key => {
    const data = localStorage.getItem(key);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        console.log(`${key}:`, parsed);
      } catch {
        console.log(`${key} (raw):`, data);
      }
    } else {
      console.log(`${key}: null`);
    }
  });
  
  console.groupEnd();
};

// Add to window for browser console access
if (typeof window !== 'undefined') {
  (window as any).debugSustainabilityApp = debugSustainabilityApp;
  (window as any).clearAllSustainabilityData = clearAllSustainabilityData;
  (window as any).recalculateResults = recalculateResults;
  (window as any).showResultsDebugInfo = showResultsDebugInfo;
}
