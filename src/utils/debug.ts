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

// Supabase debugging functions
export const testSupabaseIntegration = async () => {
  console.group('🧪 Testing Supabase Integration');
  
  try {
    // Import the service dynamically to avoid circular imports
    const { supabaseService } = await import('@/services/supabaseService');
    
    // Check configuration
    const status = supabaseService.getStatus();
    console.log('📄 Current Status:', status);
    
    if (!status.isConfigured) {
      console.error('❌ Supabase not configured properly.');
      console.groupEnd();
      return false;
    }
    
    // Test connection first
    console.log('🔍 Testing connection...');
    const connectionTest = await supabaseService.testConnection();
    console.log('🔗 Connection test result:', connectionTest);
    
    if (!connectionTest) {
      console.error('❌ Connection test failed.');
      console.groupEnd();
      return false;
    }
    
    // Test saving data
    console.log('💾 Testing data save...');
    const saveTest = await supabaseService.testSaveResponse();
    console.log('💾 Save test result:', saveTest);
    
    if (saveTest) {
      console.log('✅ Supabase integration is working correctly!');
      console.groupEnd();
      return true;
    } else {
      console.error('❌ Save test failed.');
      console.groupEnd();
      return false;
    }
    
  } catch (error) {
    console.error('❌ Error during Supabase test:', error);
    console.groupEnd();
    return false;
  }
};

export const getSupabaseBackup = async () => {
  console.log('💾 Getting Supabase backup data...');
  try {
    const { supabaseService } = await import('@/services/supabaseService');
    const backupData = await supabaseService.getBackupData();
    console.log('📋 Backup data found:', backupData);
    return backupData;
  } catch (error) {
    console.error('❌ Error getting backup data:', error);
    return [];
  }
};

export const clearSupabaseData = () => {
  console.log('🗑️ Clearing Supabase backup data...');
  localStorage.removeItem('supabase_backup');
  localStorage.removeItem('sheets_backup'); // Also clear old Google Sheets backup
  console.log('✅ Supabase data cleared.');
};

export const migrateFromGoogleSheets = async () => {
  console.log('🔄 Starting migration from Google Sheets to Supabase...');
  try {
    const { supabaseService } = await import('@/services/supabaseService');
    const success = await supabaseService.migrateFromGoogleSheetsBackup();
    console.log('✅ Migration result:', success);
    return success;
  } catch (error) {
    console.error('❌ Migration error:', error);
    return false;
  }
};

export const showDebugCommands = () => {
  console.log('🧠 Available debug commands:');
  console.log('  debugSustainabilityApp() - Show current app state');
  console.log('  clearAllSustainabilityData() - Clear all stored data');
  console.log('  recalculateResults() - Force recalculate results');
  console.log('  showResultsDebugInfo() - Show detailed results info');
  console.log('  testSupabaseIntegration() - Test Supabase functionality');
  console.log('  getSupabaseBackup() - Show backup data');
  console.log('  clearSupabaseData() - Clear Supabase backup data');
  console.log('  migrateFromGoogleSheets() - Migrate Google Sheets data to Supabase');
  console.log('  showDebugCommands() - Show this help');
};

// Add to window for browser console access
if (typeof window !== 'undefined') {
  (window as any).debugSustainabilityApp = debugSustainabilityApp;
  (window as any).clearAllSustainabilityData = clearAllSustainabilityData;
  (window as any).recalculateResults = recalculateResults;
  (window as any).showResultsDebugInfo = showResultsDebugInfo;
  (window as any).testSupabaseIntegration = testSupabaseIntegration;
  (window as any).getSupabaseBackup = getSupabaseBackup;
  (window as any).clearSupabaseData = clearSupabaseData;
  (window as any).migrateFromGoogleSheets = migrateFromGoogleSheets;
  (window as any).showDebugCommands = showDebugCommands;
}
