import unisabanaLogoOficial from '@/assets/unisabana-logo-oficial.png';
import govlabLogo from '@/assets/govlab-logo.jpeg';
import exportaCheckLogo from '@/assets/exporta-check-logo.jpg';

export const UniversityBranding = () => {
  return (
    <div className="text-center mb-6 p-6 bg-card border border-card-border rounded-2xl shadow-soft animate-fade-in">
      <div className="flex items-center justify-center gap-6 mb-4">
        <img 
          src={unisabanaLogoOficial} 
          alt="Universidad de La Sabana" 
          className="h-16 w-auto object-contain"
        />
        <div className="w-px h-12 bg-gray-300"></div>
        <img 
          src={exportaCheckLogo} 
          alt="Exporta Check Aguacate" 
          className="h-16 w-auto object-contain"
        />
      </div>
      <h1 className="text-2xl font-bold text-primary mb-2">
        Exporta Check
      </h1>
      <p className="text-sm text-muted-foreground">
        <strong>Laboratorio de Gobierno</strong> • <strong>Laboratorio de Comercio Internacional</strong><br />
        Universidad de La Sabana
      </p>
      <div className="flex items-center justify-center gap-4 mt-4">
        <img 
          src={govlabLogo} 
          alt="Laboratorio de Gobierno" 
          className="h-12 w-auto object-contain"
        />
      </div>
      <div className="w-16 h-0.5 bg-gradient-to-r from-primary to-secondary mx-auto mt-3"></div>
    </div>
  );
};