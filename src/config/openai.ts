// Configuración de OpenAI
export const OPENAI_CONFIG = {
  // La API key se obtiene desde variables de entorno
  API_KEY: import.meta.env.VITE_OPENAI_API_KEY || '',
  MODEL: 'gpt-3.5-turbo',
  MAX_TOKENS: 1000,
  TEMPERATURE: 0.7,
  BASE_URL: 'https://api.openai.com/v1'
};

// Función para obtener la API key desde variables de entorno o configuración local
export const getOpenAIKey = (): string => {
  // Prioridad 1: Variable de entorno (para producción)
  if (import.meta.env.VITE_OPENAI_API_KEY) {
    return import.meta.env.VITE_OPENAI_API_KEY;
  }
  
  // Prioridad 2: localStorage (para desarrollo)
  const storedKey = localStorage.getItem('openai_api_key');
  if (storedKey) {
    return storedKey;
  }
  
  // Prioridad 3: Prompt al usuario
  const userKey = prompt('Por favor, ingresa tu API key de OpenAI:');
  if (userKey) {
    // Guardar en localStorage para futuras sesiones
    localStorage.setItem('openai_api_key', userKey);
    return userKey;
  }
  
  throw new Error('No se pudo obtener la API key de OpenAI. Por favor, crea un archivo .env con VITE_OPENAI_API_KEY=tu-api-key-aqui');
};

// Función para verificar si la API key está configurada
export const isOpenAIConfigured = (): boolean => {
  return !!(import.meta.env.VITE_OPENAI_API_KEY || localStorage.getItem('openai_api_key'));
};
