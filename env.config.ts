// Configuración de variables de entorno
export const env = {
  // OpenAI Configuration
  OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY || '',
  OPENAI_MODEL: import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini',
  
  // App Configuration
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Exporta Check',
  
  // Feature Flags
  ENABLE_CHAT: import.meta.env.VITE_ENABLE_CHAT === 'true' || false,
  ENABLE_QUESTIONNAIRE: import.meta.env.VITE_ENABLE_QUESTIONNAIRE === 'true' || true,
  
  // Development
  IS_DEV: import.meta.env.DEV || false,
};
