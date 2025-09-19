import { AssistantState } from '@/hooks/useSustainabilityAssistant';
import { ChatMessage } from '@/hooks/useSustainabilityAssistant';

const STORAGE_KEYS = {
  ASSISTANT_STATE: 'sustainability_assistant_state',
  MESSAGES: 'sustainability_assistant_messages',
  LAST_SESSION: 'sustainability_assistant_last_session'
} as const;

export interface PersistedData {
  state: AssistantState;
  messages: ChatMessage[];
  timestamp: Date;
}

export const persistAssistantData = (state: AssistantState, messages: ChatMessage[]) => {
  try {
    const data: PersistedData = {
      state,
      messages,
      timestamp: new Date()
    };
    
    localStorage.setItem(STORAGE_KEYS.ASSISTANT_STATE, JSON.stringify(state));
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
    localStorage.setItem(STORAGE_KEYS.LAST_SESSION, new Date().toISOString());
    
    console.log('✅ Datos del asistente guardados en localStorage');
  } catch (error) {
    console.error('❌ Error al guardar datos del asistente:', error);
  }
};

export const loadAssistantData = (): PersistedData | null => {
  try {
    const stateData = localStorage.getItem(STORAGE_KEYS.ASSISTANT_STATE);
    const messagesData = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    const lastSession = localStorage.getItem(STORAGE_KEYS.LAST_SESSION);

    if (!stateData || !messagesData || !lastSession) {
      return null;
    }

    const state = JSON.parse(stateData) as AssistantState;
    const messages = JSON.parse(messagesData) as ChatMessage[];
    const timestamp = new Date(lastSession);

    // Verificar si la sesión es muy antigua (más de 24 horas)
    const hoursSinceLastSession = (Date.now() - timestamp.getTime()) / (1000 * 60 * 60);
    if (hoursSinceLastSession > 24) {
      console.log('🕒 Sesión anterior expirada, iniciando nueva sesión');
      clearAssistantData();
      return null;
    }

    // Reconvertir fechas en mensajes y respuestas
    messages.forEach(message => {
      message.timestamp = new Date(message.timestamp);
    });

    state.responses.forEach(response => {
      response.timestamp = new Date(response.timestamp);
    });

    if (state.results) {
      state.results.completedAt = new Date(state.results.completedAt);
      state.results.responses.forEach(response => {
        response.timestamp = new Date(response.timestamp);
      });
    }

    console.log('✅ Datos del asistente cargados desde localStorage');
    return { state, messages, timestamp };
  } catch (error) {
    console.error('❌ Error al cargar datos del asistente:', error);
    clearAssistantData();
    return null;
  }
};

export const clearAssistantData = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.ASSISTANT_STATE);
    localStorage.removeItem(STORAGE_KEYS.MESSAGES);
    localStorage.removeItem(STORAGE_KEYS.LAST_SESSION);
    console.log('🗑️ Datos del asistente limpiados');
  } catch (error) {
    console.error('❌ Error al limpiar datos del asistente:', error);
  }
};

export const hasPersistedData = (): boolean => {
  return !!(
    localStorage.getItem(STORAGE_KEYS.ASSISTANT_STATE) &&
    localStorage.getItem(STORAGE_KEYS.MESSAGES) &&
    localStorage.getItem(STORAGE_KEYS.LAST_SESSION)
  );
};

export const getSessionInfo = (): { hasSession: boolean; lastAccess?: Date; timeAgo?: string } => {
  const lastSession = localStorage.getItem(STORAGE_KEYS.LAST_SESSION);
  
  if (!lastSession) {
    return { hasSession: false };
  }

  const lastAccess = new Date(lastSession);
  const now = new Date();
  const diffMs = now.getTime() - lastAccess.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffMinutes = diffMs / (1000 * 60);

  let timeAgo: string;
  if (diffHours > 1) {
    timeAgo = `hace ${Math.floor(diffHours)} hora${Math.floor(diffHours) !== 1 ? 's' : ''}`;
  } else {
    timeAgo = `hace ${Math.floor(diffMinutes)} minuto${Math.floor(diffMinutes) !== 1 ? 's' : ''}`;
  }

  return {
    hasSession: true,
    lastAccess,
    timeAgo
  };
};