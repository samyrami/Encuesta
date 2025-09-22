import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MarkdownRenderer } from './MarkdownRenderer';
import { UniversitySelect } from './UniversitySelect';
import { Sparkles, User } from 'lucide-react';
import unisabanaLogo from '@/assets/unisabana-logo-oficial.png';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  options?: string[];
  specialInput?: 'university-select';
}

interface ChatMessageProps {
  message: ChatMessage;
  onOptionSelect?: (option: string) => void;
}

export const ChatMessage = ({ message, onOptionSelect }: ChatMessageProps) => {
  const isBot = message.type === 'bot';

  return (
    <div className={cn("flex gap-2 sm:gap-3 mb-4 sm:mb-6 px-1 sm:px-0", isBot ? "justify-start" : "justify-end")}>
      {isBot && (
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border-2 border-green-200 flex items-center justify-center shadow-soft overflow-hidden flex-shrink-0">
          <img 
            src={unisabanaLogo} 
            alt="Universidad de La Sabana" 
            className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
          />
        </div>
      )}
      
      <div className={cn("max-w-[85%] sm:max-w-[80%] space-y-2", !isBot && "order-first")}>
        <div
          className={cn(
            "px-3 py-2.5 sm:px-4 sm:py-3 rounded-2xl shadow-soft animate-fade-in",
            isBot
              ? "bg-chat-bubble-bot text-chat-bubble-bot-foreground border border-card-border"
              : "bg-chat-bubble-user text-chat-bubble-user-foreground"
          )}
        >
          {isBot ? (
            <MarkdownRenderer 
              content={message.content} 
              className="text-chat-bubble-bot-foreground [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
            />
          ) : (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          )}
        </div>
        
        {/* Selector especial de universidades */}
        {message.specialInput === 'university-select' && (
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <UniversitySelect 
              onSelect={(university) => onOptionSelect?.(university)}
              placeholder="Selecciona la universidad a calificar..."
            />
          </div>
        )}
        
        {/* Opciones normales como botones - Mobile Optimized */}
        {message.options && message.options.length > 0 && !message.specialInput && (
          <div className="flex flex-col gap-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {message.options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => onOptionSelect?.(option)}
                className="justify-start text-left text-xs sm:text-sm h-auto py-2.5 sm:py-3 px-3 sm:px-4 hover:bg-accent hover:scale-[1.02] transition-all duration-200 min-h-[44px] touch-manipulation"
                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
              >
                {option}
              </Button>
            ))}
          </div>
        )}
      </div>
      
      {!isBot && (
        <Avatar className="w-7 h-7 sm:w-8 sm:h-8 bg-secondary flex-shrink-0">
          <AvatarFallback className="bg-secondary text-secondary-foreground">
            <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};