import { useState } from 'react';
import { DiagnosisResult } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { UniversityBranding } from './UniversityBranding';
import { Download, RefreshCw, Sparkles, CheckCircle, AlertTriangle, Lightbulb, RotateCcw } from 'lucide-react';
import { refineDiagnosisWithOpenAI } from '@/lib/diagnosis';
import { useToast } from '@/hooks/use-toast';

interface DiagnosisSummaryProps {
  diagnosis: DiagnosisResult;
  onRestart: () => void;
  onUpdateDiagnosis: (newDiagnosis: DiagnosisResult) => void;
}

export const DiagnosisSummary = ({ 
  diagnosis, 
  onRestart, 
  onUpdateDiagnosis 
}: DiagnosisSummaryProps) => {
  const [isRefining, setIsRefining] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const getScoreLevel = (score: number) => {
    if (score >= 80) return { level: 'Excelente', color: 'bg-green-500', description: 'Alto potencial exportador' };
    if (score >= 60) return { level: 'Bueno', color: 'bg-blue-500', description: 'Buena preparación con algunas mejoras' };
    if (score >= 40) return { level: 'Moderado', color: 'bg-yellow-500', description: 'Preparación básica, requiere desarrollo' };
    return { level: 'Inicial', color: 'bg-red-500', description: 'Necesita desarrollo significativo' };
  };

  const scoreInfo = getScoreLevel(diagnosis.score);

  const handleRefineWithAI = async () => {
    const apiKey = localStorage.getItem('openai_api_key');
    
    if (!apiKey) {
      const userApiKey = prompt(
        'Para mejorar el diagnóstico con IA, ingrese su clave API de OpenAI:\n\n' +
        '(Esta clave se guardará localmente en su navegador y no se comparte)'
      );
      
      if (!userApiKey) return;
      
      localStorage.setItem('openai_api_key', userApiKey);
    }

    setIsRefining(true);
    
    try {
      const refinedDiagnosis = await refineDiagnosisWithOpenAI(
        diagnosis, 
        apiKey || localStorage.getItem('openai_api_key')!
      );
      
      onUpdateDiagnosis(refinedDiagnosis);
      
      toast({
        title: "Diagnóstico mejorado",
        description: "El texto ha sido refinado usando inteligencia artificial.",
      });
    } catch (error) {
      toast({
        title: "Error al refinar diagnóstico",
        description: "No se pudo conectar con OpenAI. Se muestra el diagnóstico original.",
        variant: "destructive"
      });
    } finally {
      setIsRefining(false);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    
    try {
      // Dynamic import to reduce initial bundle size
      const html2pdf = (await import('html2pdf.js')).default;
      
      const element = document.getElementById('diagnosis-content');
      if (!element) {
        throw new Error('Contenido no encontrado');
      }

      const opt = {
        margin: 1,
        filename: `Diagnóstico_Exportador_${diagnosis.metadata.empresa}_${new Date().getFullYear()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(element).save();
      
      toast({
        title: "PDF exportado exitosamente",
        description: "El diagnóstico ha sido descargado como PDF.",
      });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast({
        title: "Error al exportar PDF",
        description: "No se pudo generar el archivo PDF.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-chat-background to-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <UniversityBranding />
        
        {/* Actions Header */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-center sm:text-left">
            📊 Diagnóstico de Capacidad Exportadora
          </h1>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleRefineWithAI}
              disabled={isRefining}
              className="flex items-center gap-2"
            >
              {isRefining ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {isRefining ? 'Refinando...' : 'Mejorar con IA'}
            </Button>
            
            <Button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="flex items-center gap-2"
            >
              {isExporting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {isExporting ? 'Exportando...' : 'Descargar PDF'}
            </Button>
            
            <Button
              variant="outline"
              onClick={onRestart}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Nuevo
            </Button>
          </div>
        </div>

        {/* Diagnosis Content */}
        <div id="diagnosis-content" className="space-y-6">
          
          {/* Score Card */}
          <Card className="shadow-strong border-card-border">
            <CardHeader className="bg-gradient-to-r from-primary to-primary-light text-primary-foreground">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Índice de Preparación Exportadora</CardTitle>
                  <CardDescription className="text-primary-foreground/80">
                    {diagnosis.metadata.empresa} - {diagnosis.metadata.fecha}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{diagnosis.score}/100</div>
                  <Badge className={`${scoreInfo.color} text-white`}>
                    {scoreInfo.level}
                  </Badge>
                </div>
              </div>
              
              <div className="mt-4">
                <Progress value={diagnosis.score} className="h-3" />
                <p className="text-primary-foreground/80 text-sm mt-2">
                  {scoreInfo.description}
                </p>
              </div>
            </CardHeader>
          </Card>

          {/* Company Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                👤 Información de la Evaluación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Empresa:</span> {diagnosis.metadata.empresa}
                </div>
                <div>
                  <span className="font-medium">Responsable:</span> {diagnosis.metadata.responsable}
                </div>
                <div>
                  <span className="font-medium">Ciudad:</span> {diagnosis.metadata.ciudad}
                </div>
                <div>
                  <span className="font-medium">Fecha:</span> {diagnosis.metadata.fecha}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Strengths */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <CheckCircle className="w-5 h-5" />
                ✅ Fortalezas Identificadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {diagnosis.fortalezas.map((fortaleza, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-green-800">{fortaleza}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weaknesses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <AlertTriangle className="w-5 h-5" />
                ⚠️ Áreas de Mejora Identificadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {diagnosis.debilidades.map((debilidad, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-orange-800">{debilidad}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Lightbulb className="w-5 h-5" />
                🎯 Recomendaciones Estratégicas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {diagnosis.recomendaciones.map((recomendacion, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-800">{recomendacion}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle>📞 Próximos Pasos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p>
                  El <strong>Laboratorio de Gobierno</strong> y el <strong>Laboratorio de Comercio Internacional de la Universidad de La Sabana</strong> ofrecen:
                </p>
                <ul className="space-y-2 mt-4">
                  <li>🎓 <strong>Programas especializados</strong> en comercio internacional</li>
                  <li>🔬 <strong>Servicios de consultoría</strong> para exportadores</li>
                  <li>📚 <strong>Capacitaciones</strong> en preparación exportadora</li>
                  <li>🌐 <strong>Inteligencia de mercados</strong> y oportunidades comerciales</li>
                </ul>
                
                <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                  <p className="font-medium">📧 Contacto:</p>
                  <p className="text-sm">
                    Laboratorio de Gobierno y Laboratorio de Comercio Internacional<br />
                    Universidad de La Sabana<br />
                    Email: comercio.internacional@unisabana.edu.co
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-sm text-muted-foreground">
                <p className="mb-2">
                  ¡<strong>Gracias</strong> por participar en esta evaluación! Este diagnóstico puede servir 
                  como base para tomar decisiones estratégicas sobre la <strong>internacionalización de su empresa</strong>.
                </p>
                <p className="text-xs">
                  <em>Desarrollado por el Laboratorio de Gobierno con el apoyo del Laboratorio de Comercio Internacional - Universidad de La Sabana © 2024</em>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
