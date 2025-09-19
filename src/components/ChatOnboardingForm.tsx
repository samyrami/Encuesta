import { useState, useEffect, useRef } from 'react';
import { ContactInfo } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UniversityBranding } from './UniversityBranding';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sparkles, User, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatOnboardingFormProps {
  onComplete: (contactInfo: ContactInfo) => void;
  initialData?: Partial<ContactInfo>;
}

interface ChatMessage {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
  fieldKey?: keyof ContactInfo;
  isTyping?: boolean;
}

const contactFields = [
  { key: 'company' as keyof ContactInfo, label: 'empresa', placeholder: 'Nombre de su empresa', type: 'text', required: true },
  { key: 'name' as keyof ContactInfo, label: 'nombre completo', placeholder: 'Su nombre completo', type: 'text', required: true },
  { key: 'email' as keyof ContactInfo, label: 'email', placeholder: 'correo@empresa.com', type: 'email', required: true },
  { key: 'phone' as keyof ContactInfo, label: 'teléfono', placeholder: 'Número de contacto', type: 'tel', required: true },
  { key: 'nit' as keyof ContactInfo, label: 'NIT', placeholder: 'Número de identificación tributaria', type: 'text', required: true },
  { key: 'city' as keyof ContactInfo, label: 'ciudad', placeholder: 'Ciudad donde opera', type: 'text', required: true },
];

export const ChatOnboardingForm = ({ onComplete, initialData = {} }: ChatOnboardingFormProps) => {
  const [formData, setFormData] = useState<Partial<ContactInfo>>(initialData);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isWaitingForInput, setIsWaitingForInput] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentField = contactFields[currentFieldIndex];
  const isComplete = currentFieldIndex >= contactFields.length;

  // Initialize chat
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        type: 'bot',
        content: `¡Hola! 👋 Soy el asistente del **Exporta Check** de la Universidad de La Sabana.\n\nAntes de comenzar con la evaluación, necesito conocer algunos datos básicos de su empresa. Esta información será utilizada únicamente para personalizar su diagnóstico.\n\n¿Empezamos? 🚀`,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
      
      setTimeout(() => {
        askNextField();
      }, 2000);
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const askNextField = () => {
    if (currentFieldIndex >= contactFields.length) return;

    setIsTyping(true);
    
    setTimeout(() => {
      const field = contactFields[currentFieldIndex];
      const questionMessage: ChatMessage = {
        id: `question-${field.key}`,
        type: 'bot',
        content: `Por favor, ingrese el **${field.label}** de su empresa:`,
        timestamp: new Date(),
        fieldKey: field.key
      };
      
      setMessages(prev => [...prev, questionMessage]);
      setIsTyping(false);
      setIsWaitingForInput(true);
    }, 1000 + Math.random() * 1000);
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !isWaitingForInput) return;

    const field = contactFields[currentFieldIndex];
    const value = inputValue.trim();

    // Validate input
    const validation = validateField(field.key, value);
    if (!validation.isValid) {
      const errorMessage: ChatMessage = {
        id: `error-${field.key}-${Date.now()}`,
        type: 'bot',
        content: `❌ ${validation.error}\n\nPor favor, ingrese un **${field.label}** válido:`,
        timestamp: new Date(),
        fieldKey: field.key
      };
      setMessages(prev => [...prev, errorMessage]);
      setInputValue('');
      return;
    }

    // Add user response
    const userMessage: ChatMessage = {
      id: `answer-${field.key}`,
      type: 'user',
      content: value,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Update form data
    const updatedFormData = { ...formData, [field.key]: value };
    setFormData(updatedFormData);
    
    // Clear input
    setInputValue('');
    setIsWaitingForInput(false);

    // Bot acknowledgment
    setTimeout(() => {
      const ackMessage: ChatMessage = {
        id: `ack-${field.key}`,
        type: 'bot',
        content: getAcknowledgmentMessage(field.key, value),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, ackMessage]);

      // Move to next field or complete
      if (currentFieldIndex + 1 >= contactFields.length) {
        setTimeout(() => {
          const completionMessage: ChatMessage = {
            id: 'completion',
            type: 'bot',
            content: `¡Perfecto! 🎉\n\nYa tengo toda la información necesaria. Ahora procederemos con la evaluación de capacidad exportadora de **${updatedFormData.company}**.\n\n¿Está listo para comenzar con las preguntas?`,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, completionMessage]);
          
          setTimeout(() => {
            handleComplete(updatedFormData as ContactInfo);
          }, 2000);
        }, 1000);
      } else {
        setCurrentFieldIndex(prev => prev + 1);
        setTimeout(() => {
          askNextField();
        }, 1500);
      }
    }, 500);
  };

  const validateField = (key: keyof ContactInfo, value: string) => {
    if (!value.trim()) {
      return { isValid: false, error: 'Este campo es requerido.' };
    }

    switch (key) {
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return { isValid: false, error: 'Por favor ingrese un email válido.' };
        }
        break;
      case 'nit':
        if (!/^\d{9,15}$/.test(value.replace(/[^0-9]/g, ''))) {
          return { isValid: false, error: 'Por favor ingrese un NIT válido (solo números).' };
        }
        break;
      case 'phone':
        if (!/^\+?[\d\s\-\(\)]{7,15}$/.test(value)) {
          return { isValid: false, error: 'Por favor ingrese un número de teléfono válido.' };
        }
        break;
    }

    return { isValid: true };
  };

  const getAcknowledgmentMessage = (key: keyof ContactInfo, value: string): string => {
    switch (key) {
      case 'company':
        return `¡Excelente! Trabajaremos con **${value}**. 🏢`;
      case 'name':
        return `Mucho gusto, **${value}**! 👋`;
      case 'email':
        return `Perfecto! Tengo su email: **${value}** 📧`;
      case 'phone':
        return `Genial! Su teléfono: **${value}** 📱`;
      case 'nit':
        return `Entendido! NIT registrado: **${value}** 📄`;
      case 'city':
        return `¡Perfecto! Empresa ubicada en **${value}** 📍`;
      default:
        return '¡Perfecto! ✅';
    }
  };

  const handleComplete = (contactInfo: ContactInfo) => {
    localStorage.setItem('termometro_contact_info', JSON.stringify(contactInfo));
    onComplete(contactInfo);
  };

  const getCurrentPlaceholder = () => {
    if (!isWaitingForInput || !currentField) return "Escriba su respuesta...";
    return currentField.placeholder;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-chat-background to-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <UniversityBranding />
        
        {/* Progress Header */}
        <div className="bg-card border border-card-border rounded-lg p-4 mb-6 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Registro de Información</h2>
            <span className="text-sm text-muted-foreground">
              {currentFieldIndex} de {contactFields.length} campos completados
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300" 
              style={{ width: `${(currentFieldIndex / contactFields.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Chat Container */}
        <div className="bg-card border border-card-border rounded-lg shadow-strong overflow-hidden">
          <div className="h-[500px] overflow-y-auto p-6 space-y-6">
            {messages.map((message) => (
              <ChatMessageComponent key={message.id} message={message} />
            ))}
            
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <Avatar className="w-8 h-8 bg-gradient-to-br from-primary to-primary-light shadow-soft">
                  <AvatarFallback className="bg-transparent text-primary-foreground">
                    <Sparkles className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-chat-bubble-bot border border-card-border rounded-2xl px-4 py-3 shadow-soft">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input Area */}
          {isWaitingForInput && (
            <div className="border-t border-card-border p-4">
              <form onSubmit={handleInputSubmit} className="flex gap-2 items-center">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={getCurrentPlaceholder()}
                  className="flex-1 bg-input border-input-border focus:ring-primary"
                  type={currentField?.type || 'text'}
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  disabled={!inputValue.trim()}
                  className="shrink-0 bg-primary hover:bg-primary-light transition-colors"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>
            Desarrollado por el <strong>Laboratorio de Gobierno</strong> con el apoyo del <strong>Laboratorio de Comercio Internacional</strong><br />
            Universidad de La Sabana © 2024
          </p>
        </div>
      </div>
    </div>
  );
};

interface ChatMessageComponentProps {
  message: ChatMessage;
}

const ChatMessageComponent = ({ message }: ChatMessageComponentProps) => {
  const isBot = message.type === 'bot';

  return (
    <div className={cn("flex gap-3", isBot ? "justify-start" : "justify-end")}>
      {isBot && (
        <Avatar className="w-8 h-8 bg-gradient-to-br from-primary to-primary-light shadow-soft">
          <AvatarFallback className="bg-transparent text-primary-foreground">
            <Sparkles className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      )}
      
      {!isBot && (
        <Avatar className="w-8 h-8 bg-gradient-to-br from-secondary to-secondary-light shadow-soft order-2">
          <AvatarFallback className="bg-transparent text-secondary-foreground">
            <User className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={cn("max-w-[80%] space-y-2", !isBot && "order-first")}>
        <div
          className={cn(
            "px-4 py-3 rounded-2xl shadow-soft",
            isBot
              ? "bg-chat-bubble-bot text-chat-bubble-bot-foreground border border-card-border"
              : "bg-chat-bubble-user text-chat-bubble-user-foreground"
          )}
        >
          <div className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content.split('\n').map((line, index) => (
              <div key={index}>
                {line.includes('**') ? (
                  <div dangerouslySetInnerHTML={{ 
                    __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                  }} />
                ) : (
                  <div>{line}</div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground">
          {message.timestamp.toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};
