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

// Add to window for browser console access
if (typeof window !== 'undefined') {
  (window as any).debugSustainabilityApp = debugSustainabilityApp;
  (window as any).clearAllSustainabilityData = clearAllSustainabilityData;
}