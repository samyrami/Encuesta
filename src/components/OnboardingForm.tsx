import { useState } from 'react';
import { ContactInfo } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UniversityBranding } from './UniversityBranding';

interface OnboardingFormProps {
  onComplete: (contactInfo: ContactInfo) => void;
  initialData?: Partial<ContactInfo>;
}

const contactFields = [
  { key: 'name' as keyof ContactInfo, label: 'Nombre completo', placeholder: 'Ingrese su nombre completo', type: 'text', required: true },
  { key: 'company' as keyof ContactInfo, label: 'Empresa', placeholder: 'Nombre de su empresa', type: 'text', required: true },
  { key: 'nit' as keyof ContactInfo, label: 'NIT', placeholder: 'Número de identificación tributaria', type: 'text', required: true },
  { key: 'email' as keyof ContactInfo, label: 'Email', placeholder: 'correo@empresa.com', type: 'email', required: true },
  { key: 'phone' as keyof ContactInfo, label: 'Teléfono', placeholder: 'Número de contacto', type: 'tel', required: true },
  { key: 'city' as keyof ContactInfo, label: 'Ciudad', placeholder: 'Ciudad donde opera su empresa', type: 'text', required: true },
];

export const OnboardingForm = ({ onComplete, initialData = {} }: OnboardingFormProps) => {
  const [formData, setFormData] = useState<Partial<ContactInfo>>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactInfo, string>>>({});

  const handleInputChange = (key: keyof ContactInfo, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    // Clear error when user starts typing
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof ContactInfo, string>> = {};
    
    contactFields.forEach(field => {
      if (field.required && !formData[field.key]?.trim()) {
        newErrors[field.key] = `${field.label} es requerido`;
      }
    });

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ingrese un email válido';
    }

    // NIT validation (basic)
    if (formData.nit && !/^\d{9,15}$/.test(formData.nit.replace(/[^0-9]/g, ''))) {
      newErrors.nit = 'Ingrese un NIT válido (solo números)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Save to localStorage
      localStorage.setItem('termometro_contact_info', JSON.stringify(formData));
      onComplete(formData as ContactInfo);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-chat-background to-background">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <UniversityBranding />
        
        <Card className="shadow-strong border-card-border">
          <CardHeader className="bg-gradient-to-r from-primary to-primary-light text-primary-foreground">
            <CardTitle className="text-2xl">Exporta Check</CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Cuestionario de Evaluación de Capacidad Exportadora
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">📋 Datos de Contacto</h3>
              <p className="text-muted-foreground text-sm">
                Para comenzar con la evaluación, necesitamos algunos datos básicos de su empresa. 
                Esta información será utilizada únicamente para personalizar su diagnóstico.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {contactFields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <Label htmlFor={field.key} className="text-sm font-medium">
                    {field.label} {field.required && <span className="text-destructive">*</span>}
                  </Label>
                  <Input
                    id={field.key}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={formData[field.key] || ''}
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                    className={errors[field.key] ? 'border-destructive' : ''}
                  />
                  {errors[field.key] && (
                    <p className="text-sm text-destructive">{errors[field.key]}</p>
                  )}
                </div>
              ))}

              <div className="pt-4 border-t border-card-border">
                <Button 
                  type="submit" 
                  className="w-full"
                  size="lg"
                >
                  Continuar con el Cuestionario
                </Button>
              </div>
            </form>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="font-medium text-sm mb-2">📝 Sobre este cuestionario:</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Evalúa 20 aspectos clave de su capacidad exportadora</li>
                <li>• Tiempo estimado: 10-15 minutos</li>
                <li>• Genera diagnóstico personalizado con recomendaciones</li>
                <li>• Toda la información se mantiene en su dispositivo (localStorage)</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
