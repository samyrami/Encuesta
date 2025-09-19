import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Download, FileText, MessageSquare, RotateCcw, TrendingUp, TrendingDown, CheckCircle } from 'lucide-react';
import { SustainabilityResults as Results } from '@/data/sustainability-questionnaire.v2';

interface SustainabilityResultsProps {
  results: Results;
  onContinueChat: () => void;
  onRestart: () => void;
}

export const SustainabilityResults = ({ results, onContinueChat, onRestart }: SustainabilityResultsProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 4.0) return 'text-green-600';
    if (score >= 3.0) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 4.0) return 'Excelente';
    if (score >= 3.0) return 'Bueno';
    if (score >= 2.0) return 'Regular';
    return 'Requiere Mejora';
  };

  const exportToPDF = () => {
    // Implementar exportación a PDF
    console.log('Exportar a PDF');
  };

  const exportToText = () => {
    const textContent = `
EVALUACIÓN DE SOSTENIBILIDAD UNIVERSITARIA
Universidad de La Sabana

INFORMACIÓN DEL EVALUADOR
Nombre: ${results.profile.name}
Universidad: ${results.profile.university}
Fecha: ${results.completedAt.toLocaleDateString()}

PUNTUACIÓN GENERAL: ${results.overallScore.toFixed(1)}/5.0 - ${getScoreLabel(results.overallScore)}

RESULTADOS POR DIMENSIÓN:

🌍 AMBIENTAL: ${results.dimensions.ambiental.score.toFixed(1)}/5.0
Fortalezas (${results.dimensions.ambiental.strengths.length}):
${results.dimensions.ambiental.strengths.map(s => `• ${s}`).join('\n')}

Áreas de mejora (${results.dimensions.ambiental.weaknesses.length}):
${results.dimensions.ambiental.weaknesses.map(w => `• ${w}`).join('\n')}

Recomendaciones principales:
${results.dimensions.ambiental.recommendations.slice(0, 3).map(r => `• ${r}`).join('\n')}

👥 SOCIAL: ${results.dimensions.social.score.toFixed(1)}/5.0
Fortalezas (${results.dimensions.social.strengths.length}):
${results.dimensions.social.strengths.map(s => `• ${s}`).join('\n')}

Áreas de mejora (${results.dimensions.social.weaknesses.length}):
${results.dimensions.social.weaknesses.map(w => `• ${w}`).join('\n')}

Recomendaciones principales:
${results.dimensions.social.recommendations.slice(0, 3).map(r => `• ${r}`).join('\n')}

🏛️ GOBERNANZA: ${results.dimensions.gobernanza.score.toFixed(1)}/5.0
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
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <CheckCircle className="w-12 h-12 text-green-600" />
            <div>
              <h1 className="text-3xl font-bold text-primary">Evaluación Completada</h1>
              <p className="text-muted-foreground">Diagnóstico de Sostenibilidad Universitaria</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4">
            <h2 className="text-xl font-semibold">{results.profile.university}</h2>
            <p className="text-sm text-muted-foreground">
              Evaluado por: {results.profile.name} • {results.completedAt.toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Overall Score */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Puntuación General</span>
              <Badge variant="secondary" className={`text-lg px-3 py-1 ${getScoreColor(results.overallScore)}`}>
                {results.overallScore.toFixed(1)}/5.0
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Nivel de Sostenibilidad:</span>
                <span className={`font-semibold ${getScoreColor(results.overallScore)}`}>
                  {getScoreLabel(results.overallScore)}
                </span>
              </div>
              <Progress value={results.overallScore * 20} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Dimensions Results */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Ambiental */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>🌍 Ambiental</span>
              </CardTitle>
              <div className="text-2xl font-bold text-green-600">
                {results.dimensions.ambiental.score.toFixed(1)}/5.0
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={results.dimensions.ambiental.score * 20} className="h-2" />
              
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>👥 Social</span>
              </CardTitle>
              <div className="text-2xl font-bold text-blue-600">
                {results.dimensions.social.score.toFixed(1)}/5.0
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={results.dimensions.social.score * 20} className="h-2" />
              
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>🏛️ Gobernanza</span>
              </CardTitle>
              <div className="text-2xl font-bold text-purple-600">
                {results.dimensions.gobernanza.score.toFixed(1)}/5.0
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={results.dimensions.gobernanza.score * 20} className="h-2" />
              
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

        {/* Detailed Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>🎯 Recomendaciones Principales</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-4">
                {/* Ambiental Recommendations */}
                {results.dimensions.ambiental.recommendations.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2">🌍 Dimensión Ambiental</h4>
                    <div className="space-y-1 ml-4">
                      {results.dimensions.ambiental.recommendations.slice(0, 3).map((rec, index) => (
                        <p key={index} className="text-sm text-muted-foreground">• {rec}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Social Recommendations */}
                {results.dimensions.social.recommendations.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-blue-700 mb-2">👥 Dimensión Social</h4>
                    <div className="space-y-1 ml-4">
                      {results.dimensions.social.recommendations.slice(0, 3).map((rec, index) => (
                        <p key={index} className="text-sm text-muted-foreground">• {rec}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Gobernanza Recommendations */}
                {results.dimensions.gobernanza.recommendations.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-purple-700 mb-2">🏛️ Dimensión Gobernanza</h4>
                    <div className="space-y-1 ml-4">
                      {results.dimensions.gobernanza.recommendations.slice(0, 3).map((rec, index) => (
                        <p key={index} className="text-sm text-muted-foreground">• {rec}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button onClick={exportToPDF} className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Descargar PDF</span>
          </Button>
          
          <Button variant="outline" onClick={exportToText} className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Exportar Texto</span>
          </Button>
          
          <Button variant="secondary" onClick={onContinueChat} className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4" />
            <span>Chat Especializado</span>
          </Button>
          
          <Button variant="outline" onClick={onRestart} className="flex items-center space-x-2">
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