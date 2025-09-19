import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { ChevronDown, Search, Check } from 'lucide-react';
import { universities } from '@/data/universities';

interface UniversitySelectProps {
  onSelect: (university: string) => void;
  placeholder?: string;
}

export const UniversitySelect = ({ onSelect, placeholder = "Selecciona una universidad..." }: UniversitySelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState<string>('');

  const filteredUniversities = universities.filter(university =>
    university.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (university: string) => {
    setSelectedUniversity(university);
    setIsOpen(false);
    setSearchTerm('');
    onSelect(university);
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative w-full">
      <Button
        variant="outline"
        onClick={handleToggle}
        className="w-full justify-between text-left h-auto py-3 px-4"
      >
        <span className={selectedUniversity ? "text-foreground" : "text-muted-foreground"}>
          {selectedUniversity || placeholder}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-popover border border-border rounded-md shadow-lg">
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar universidad..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                autoFocus
              />
            </div>
          </div>
          
          <ScrollArea className="h-64">
            <div className="p-2">
              {filteredUniversities.length > 0 ? (
                filteredUniversities.map((university, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    onClick={() => handleSelect(university)}
                    className="w-full justify-start text-left py-2 px-3 h-auto"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm">{university}</span>
                      {selectedUniversity === university && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  </Button>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  No se encontraron universidades
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};