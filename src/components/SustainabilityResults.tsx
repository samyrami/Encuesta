import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Download, FileText, MessageSquare, RotateCcw, TrendingUp, TrendingDown, CheckCircle } from 'lucide-react';
import { SustainabilityResults as Results } from '@/data/sustainability-questionnaire.v2';
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

// Custom Progress component with lighter colors
const LightProgress = ({ value, className, ...props }: React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & { value?: number }) => (
  <ProgressPrimitive.Root
    className={cn(
      "relative h-3 w-full overflow-hidden rounded-full bg-gray-200",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-gradient-to-r from-blue-300 to-green-300 transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
)

interface SustainabilityResultsProps {
  results: Results;
  onContinueChat: () => void;
  onRestart: () => void;
}

export const SustainabilityResults = ({ results, onContinueChat, onRestart }: SustainabilityResultsProps) => {
  const getScoreColor = (score: number | undefined | null) => {
    if (!score && score !== 0) return 'text-gray-500';
    if (score >= 4.0) return 'text-green-600';
    if (score >= 3.0) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number | undefined | null) => {
    if (!score && score !== 0) return 'Sin evaluar';
    if (score >= 4.0) return 'Excelente';
    if (score >= 3.0) return 'Bueno';
    if (score >= 2.0) return 'Regular';
    return 'Requiere Mejora';
  };

  // Safe score display function
  const displayScore = (score: number | undefined | null) => {
    return (score ?? 0).toFixed(1);
  };

  const exportToPDF = async () => {
    try {
      // Dynamic import to reduce initial bundle size
      const html2pdf = (await import('html2pdf.js')).default;
      
      // Create a temporary div with the content for PDF
      const element = document.createElement('div');
      element.innerHTML = generateHTMLContent(results);
      element.style.padding = '20px';
      element.style.fontFamily = 'Arial, sans-serif';
      element.style.lineHeight = '1.6';
      
      // Temporarily add to body for rendering
      document.body.appendChild(element);
      
      const opt = {
        margin: 1,
        filename: `evaluacion-sostenibilidad-${results.profile.university?.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      
      await html2pdf().set(opt).from(element).save();
      
      // Remove temporary element
      document.body.removeChild(element);
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback to text download
      exportToText();
    }
  };
  
  const generateHTMLContent = (results: Results) => {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px;">
          <h1 style="color: #333; font-size: 28px; margin-bottom: 10px;">EVALUACIÓN DE SOSTENIBILIDAD UNIVERSITARIA</h1>
          <p style="color: #666; font-size: 16px;">Universidad de La Sabana - Laboratorio de Gobierno</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #333; font-size: 20px; margin-bottom: 15px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">INFORMACIÓN DEL EVALUADOR</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px;">
            <p><strong>Nombre:</strong> ${results.profile.name}</p>
            <p><strong>Universidad:</strong> ${results.profile.university}</p>
            <p><strong>Fecha:</strong> ${results.completedAt.toLocaleDateString()}</p>
            <p><strong>Puntuación General:</strong> ${displayScore(results.overallScore)}/5.0 - ${getScoreLabel(results.overallScore)}</p>
          </div>
        </div>
        
        <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #2e7d32; font-size: 18px; margin-bottom: 15px;">🌍 DIMENSIÓN AMBIENTAL: ${displayScore(results.dimensions.ambiental.score)}/5.0</h2>
          <div style="margin-bottom: 15px;">
            <h3 style="color: #388e3c; font-size: 16px; margin-bottom: 10px;">Fortalezas:</h3>
            <ul style="padding-left: 20px; line-height: 1.6;">
              ${results.dimensions.ambiental.strengths.map(s => `<li style="margin-bottom: 5px; color: #333;">${s}</li>`).join('')}
            </ul>
          </div>
          <div style="margin-bottom: 15px;">
            <h3 style="color: #f57c00; font-size: 16px; margin-bottom: 10px;">Áreas de mejora:</h3>
            <ul style="padding-left: 20px; line-height: 1.6;">
              ${results.dimensions.ambiental.weaknesses.map(w => `<li style="margin-bottom: 5px; color: #333;">${w}</li>`).join('')}
            </ul>
          </div>
          <div>
            <h3 style="color: #1976d2; font-size: 16px; margin-bottom: 10px;">Recomendaciones principales:</h3>
            <ul style="padding-left: 20px; line-height: 1.6;">
              ${results.dimensions.ambiental.recommendations.slice(0, 3).map(r => `<li style="margin-bottom: 5px; color: #333;">${r}</li>`).join('')}
            </ul>
          </div>
        </div>
        
        <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #1565c0; font-size: 18px; margin-bottom: 15px;">👥 DIMENSIÓN SOCIAL: ${displayScore(results.dimensions.social.score)}/5.0</h2>
          <div style="margin-bottom: 15px;">
            <h3 style="color: #388e3c; font-size: 16px; margin-bottom: 10px;">Fortalezas:</h3>
            <ul style="padding-left: 20px; line-height: 1.6;">
              ${results.dimensions.social.strengths.map(s => `<li style="margin-bottom: 5px; color: #333;">${s}</li>`).join('')}
            </ul>
          </div>
          <div style="margin-bottom: 15px;">
            <h3 style="color: #f57c00; font-size: 16px; margin-bottom: 10px;">Áreas de mejora:</h3>
            <ul style="padding-left: 20px; line-height: 1.6;">
              ${results.dimensions.social.weaknesses.map(w => `<li style="margin-bottom: 5px; color: #333;">${w}</li>`).join('')}
            </ul>
          </div>
          <div>
            <h3 style="color: #1976d2; font-size: 16px; margin-bottom: 10px;">Recomendaciones principales:</h3>
            <ul style="padding-left: 20px; line-height: 1.6;">
              ${results.dimensions.social.recommendations.slice(0, 3).map(r => `<li style="margin-bottom: 5px; color: #333;">${r}</li>`).join('')}
            </ul>
          </div>
        </div>
        
        <div style="background: #f3e5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #7b1fa2; font-size: 18px; margin-bottom: 15px;">🏦 DIMENSIÓN GOBERNANZA: ${displayScore(results.dimensions.gobernanza.score)}/5.0</h2>
          <div style="margin-bottom: 15px;">
            <h3 style="color: #388e3c; font-size: 16px; margin-bottom: 10px;">Fortalezas:</h3>
            <ul style="padding-left: 20px; line-height: 1.6;">
              ${results.dimensions.gobernanza.strengths.map(s => `<li style="margin-bottom: 5px; color: #333;">${s}</li>`).join('')}
            </ul>
          </div>
          <div style="margin-bottom: 15px;">
            <h3 style="color: #f57c00; font-size: 16px; margin-bottom: 10px;">Áreas de mejora:</h3>
            <ul style="padding-left: 20px; line-height: 1.6;">
              ${results.dimensions.gobernanza.weaknesses.map(w => `<li style="margin-bottom: 5px; color: #333;">${w}</li>`).join('')}
            </ul>
          </div>
          <div>
            <h3 style="color: #1976d2; font-size: 16px; margin-bottom: 10px;">Recomendaciones principales:</h3>
            <ul style="padding-left: 20px; line-height: 1.6;">
              ${results.dimensions.gobernanza.recommendations.slice(0, 3).map(r => `<li style="margin-bottom: 5px; color: #333;">${r}</li>`).join('')}
            </ul>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
          <p><em>Generado por el Asistente Virtual de Sostenibilidad Universitaria</em></p>
          <p><em>Universidad de La Sabana © 2024</em></p>
        </div>
      </div>
    `;
  };

  const exportToText = () => {
    const textContent = `
EVALUACIÓN DE SOSTENIBILIDAD UNIVERSITARIA
Universidad de La Sabana

INFORMACIÓN DEL EVALUADOR
Nombre: ${results.profile.name}
Universidad: ${results.profile.university}
Fecha: ${results.completedAt.toLocaleDateString()}

PUNTUACIÓN GENERAL: ${displayScore(results.overallScore)}/5.0 - ${getScoreLabel(results.overallScore)}

RESULTADOS POR DIMENSIÓN:

🌍 AMBIENTAL: ${displayScore(results.dimensions.ambiental.score)}/5.0
Fortalezas (${results.dimensions.ambiental.strengths.length}):
${results.dimensions.ambiental.strengths.map(s => `• ${s}`).join('\n')}

Áreas de mejora (${results.dimensions.ambiental.weaknesses.length}):
${results.dimensions.ambiental.weaknesses.map(w => `• ${w}`).join('\n')}

Recomendaciones principales:
${results.dimensions.ambiental.recommendations.slice(0, 3).map(r => `• ${r}`).join('\n')}

👥 SOCIAL: ${displayScore(results.dimensions.social.score)}/5.0
Fortalezas (${results.dimensions.social.strengths.length}):
${results.dimensions.social.strengths.map(s => `• ${s}`).join('\n')}

Áreas de mejora (${results.dimensions.social.weaknesses.length}):
${results.dimensions.social.weaknesses.map(w => `• ${w}`).join('\n')}

Recomendaciones principales:
${results.dimensions.social.recommendations.slice(0, 3).map(r => `• ${r}`).join('\n')}

🏛️ GOBERNANZA: ${displayScore(results.dimensions.gobernanza.score)}/5.0
Fortalezas (${results.dimensions.gobernanza.strengths.length}):
${results.dimensions.gobernanza.strengths.map(s => `• ${s}`).join('\n')}

Áreas de mejora (${results.dimensions.gobernanza.weaknesses.length}):
${results.dimensions.gobernanza.weaknesses.map(w => `• ${w}`).join('\n')}

Recomendaciones principales:
${results.dimensions.gobernanza.recommendations.slice(0, 3).map(r => `• ${r}`).join('\n')}

---
Generado por el Asistente Virtual de Sostenibilidad Universitaria
Universidad de La Sabana © 2024
    `.trim();

    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `evaluacion-sostenibilidad-${results.profile.university?.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-3 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        {/* Header - Mobile Optimized */}
        <div className="text-center space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-2">
            <CheckCircle className="w-8 h-8 sm:w-12 sm:h-12 text-green-600 flex-shrink-0" />
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-3xl font-bold text-primary leading-tight">Evaluación Completada</h1>
              <p className="text-sm text-muted-foreground">Diagnóstico de Sostenibilidad Universitaria</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-3 sm:p-4">
            <h2 className="text-lg sm:text-xl font-semibold truncate">{results.profile.university}</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Evaluado por: <span className="font-medium">{results.profile.name}</span>
              <span className="block sm:inline"> • {results.completedAt.toLocaleDateString()}</span>
            </p>
          </div>
        </div>

        {/* Overall Score */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Puntuación General</span>
              <Badge variant="secondary" className="text-lg px-3 py-1 text-black bg-gray-100">
                {displayScore(results.overallScore)}/5.0
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Nivel de Sostenibilidad:</span>
                <span className="font-semibold text-black">
                  {getScoreLabel(results.overallScore)}
                </span>
              </div>
              <LightProgress value={(results.overallScore ?? 0) * 20} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Dimensions Results - Mobile Optimized */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {/* Ambiental */}
          <Card className="bg-green-50/50 border-green-200/50">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm sm:text-base">🌍 Ambiental</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-green-800">
                  {displayScore(results.dimensions.ambiental.score)}/5.0
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 pt-0">
              <LightProgress value={(results.dimensions.ambiental.score ?? 0) * 20} className="h-2" />
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">
                    Fortalezas ({results.dimensions.ambiental.strengths.length})
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <TrendingDown className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium">
                    Áreas de mejora ({results.dimensions.ambiental.weaknesses.length})
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social */}
          <Card className="bg-blue-50/50 border-blue-200/50">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm sm:text-base">👥 Social</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-blue-800">
                  {displayScore(results.dimensions.social.score)}/5.0
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 pt-0">
              <LightProgress value={(results.dimensions.social.score ?? 0) * 20} className="h-2" />
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">
                    Fortalezas ({results.dimensions.social.strengths.length})
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <TrendingDown className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium">
                    Áreas de mejora ({results.dimensions.social.weaknesses.length})
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gobernanza */}
          <Card className="bg-purple-50/50 border-purple-200/50">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm sm:text-base">🏦 Gobernanza</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-purple-800">
                  {displayScore(results.dimensions.gobernanza.score)}/5.0
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 pt-0">
              <LightProgress value={(results.dimensions.gobernanza.score ?? 0) * 20} className="h-2" />
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">
                    Fortalezas ({results.dimensions.gobernanza.strengths.length})
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <TrendingDown className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium">
                    Áreas de mejora ({results.dimensions.gobernanza.weaknesses.length})
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Recommendations - Mobile Optimized */}
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-base sm:text-lg">🎯 Recomendaciones Principales</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-48 sm:h-64">
              <div className="space-y-3 sm:space-y-4">
                {/* Ambiental Recommendations */}
                {results.dimensions.ambiental.recommendations.length > 0 && (
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-green-700 mb-1.5 sm:mb-2">🌍 Dimensión Ambiental</h4>
                    <div className="space-y-1 ml-2 sm:ml-4">
                      {results.dimensions.ambiental.recommendations.slice(0, 3).map((rec, index) => (
                        <p key={index} className="text-xs sm:text-sm text-muted-foreground leading-relaxed">• {rec}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Social Recommendations */}
                {results.dimensions.social.recommendations.length > 0 && (
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-blue-700 mb-1.5 sm:mb-2">👥 Dimensión Social</h4>
                    <div className="space-y-1 ml-2 sm:ml-4">
                      {results.dimensions.social.recommendations.slice(0, 3).map((rec, index) => (
                        <p key={index} className="text-xs sm:text-sm text-muted-foreground leading-relaxed">• {rec}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Gobernanza Recommendations */}
                {results.dimensions.gobernanza.recommendations.length > 0 && (
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-purple-700 mb-1.5 sm:mb-2">🏦 Dimensión Gobernanza</h4>
                    <div className="space-y-1 ml-2 sm:ml-4">
                      {results.dimensions.gobernanza.recommendations.slice(0, 3).map((rec, index) => (
                        <p key={index} className="text-xs sm:text-sm text-muted-foreground leading-relaxed">• {rec}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Debug Section - Only show if results are empty */}
        {results.overallScore === 0 && (
          <Card className="border-2 border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-700 flex items-center gap-2">
                ⚠️ Problema con los Resultados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700 mb-4">
                Los resultados muestran 0.0 en todas las dimensiones. Esto puede deberse a:
              </p>
              <ul className="text-sm text-red-600 list-disc list-inside mb-4">
                <li>Las respuestas no se guardaron correctamente</li>
                <li>Error en el cálculo de puntuaciones</li>
                <li>Problema de persistencia de datos</li>
              </ul>
              <div className="text-xs bg-red-100 p-3 rounded font-mono">
                <strong>Debug Info:</strong><br/>
                Respuestas guardadas: {results.responses.length}<br/>
                Perfil: {results.profile.name} - {results.profile.university}
              </div>
              <p className="text-sm text-red-600 mt-3">
                💡 <strong>Sugerencia:</strong> Abre la consola del navegador (F12) para ver más detalles del error.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center">
          <Button onClick={exportToPDF} className="flex items-center justify-center space-x-2 w-full sm:w-auto min-h-[44px]">
            <Download className="w-4 h-4" />
            <span>Descargar PDF</span>
          </Button>
          
          <Button variant="outline" onClick={exportToText} className="flex items-center justify-center space-x-2 w-full sm:w-auto min-h-[44px]">
            <FileText className="w-4 h-4" />
            <span>Exportar Texto</span>
          </Button>
          
          <Button variant="secondary" onClick={onContinueChat} className="flex items-center justify-center space-x-2 w-full sm:w-auto min-h-[44px]">
            <MessageSquare className="w-4 h-4" />
            <span>Chat Especializado</span>
          </Button>
          
          <Button variant="outline" onClick={onRestart} className="flex items-center justify-center space-x-2 w-full sm:w-auto min-h-[44px]">
            <RotateCcw className="w-4 h-4" />
            <span>Nueva Evaluación</span>
          </Button>
        </div>

        <Separator />

        <div className="text-center text-sm text-muted-foreground">
          <p>
            Evaluación generada por el <strong>Asistente Virtual de Sostenibilidad Universitaria</strong>
          </p>
          <p>
            Universidad de La Sabana © 2024
          </p>
        </div>
      </div>
    </div>
  );
};