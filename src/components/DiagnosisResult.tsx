import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, FileSpreadsheet, MessageCircle, RotateCcw } from 'lucide-react';
import type { DiagnosisResult } from '@/types/chat';
import { questions } from '@/data/questionnaire';

interface DiagnosisResultProps {
  diagnosis: DiagnosisResult;
  onContinueChat: () => void;
  onRestart: () => void;
}

export const DiagnosisResultComponent = ({ diagnosis, onContinueChat, onRestart }: DiagnosisResultProps) => {
  const downloadPDF = () => {
    const content = generatePDFContent(diagnosis);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diagnostico-exportador-${diagnosis.company}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadCSV = () => {
    const csvContent = generateCSVContent(diagnosis);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diagnostico-exportador-${diagnosis.company}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generatePDFContent = (diagnosis: DiagnosisResult) => {
    return `DIAGNÓSTICO DE CAPACIDAD EXPORTADORA
===============================================

DATOS DE LA EVALUACIÓN
----------------------
Empresa: ${diagnosis.company}
Responsable: ${diagnosis.name}
Ciudad: ${diagnosis.city}
Fecha: ${diagnosis.date}
Categoría: ${diagnosis.category}
Puntuación: ${diagnosis.score}/100

FORTALEZAS IDENTIFICADAS
------------------------
${diagnosis.strengths.map(s => `• ${s}`).join('\n')}

ÁREAS DE MEJORA
----------------
${diagnosis.weaknesses.map(w => `• ${w}`).join('\n')}

RECOMENDACIONES ESTRATÉGICAS
----------------------------
${diagnosis.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}

PRÓXIMOS PASOS
---------------
El Laboratorio de Gobierno y el Laboratorio de Comercio Internacional de la Universidad de La Sabana ofrecen:
• Programas especializados en comercio internacional
• Servicios de consultoría para exportadores
• Capacitaciones en preparación exportadora
• Inteligencia de mercados y oportunidades comerciales

Contacto: Laboratorio de Gobierno y Laboratorio de Comercio Internacional
Universidad de La Sabana
Email: comercio.internacional@unisabana.edu.co

Desarrollado por el Laboratorio de Gobierno con el apoyo del Laboratorio de Comercio Internacional - Universidad de La Sabana © 2024`;
  };

  const generateCSVContent = (diagnosis: DiagnosisResult) => {
    const headers = [
      'Campo',
      'Valor'
    ];
    
    const rows = [
      ['Empresa', diagnosis.company],
      ['Responsable', diagnosis.name],
      ['Ciudad', diagnosis.city],
      ['Fecha', diagnosis.date],
      ['Categoría', diagnosis.category],
      ['Puntuación', diagnosis.score.toString()],
      ['', ''],
      ['FORTALEZAS', ''],
      ...diagnosis.strengths.map(s => ['', s]),
      ['', ''],
      ['ÁREAS DE MEJORA', ''],
      ...diagnosis.weaknesses.map(w => ['', w]),
      ['', ''],
      ['RECOMENDACIONES', ''],
      ...diagnosis.recommendations.map((r, i) => ['', `${i + 1}. ${r}`])
    ];

    return [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Principiante':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Intermedio':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Avanzado':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Experto':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 max-h-[600px] overflow-y-auto p-6">
      <Card className="border-2 border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-primary">
            🎯 Diagnóstico Completado
          </CardTitle>
          <p className="text-muted-foreground">
            Tu empresa ha sido evaluada exitosamente
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Empresa</p>
              <p className="font-semibold">{diagnosis.company}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Responsable</p>
              <p className="font-semibold">{diagnosis.name}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Ciudad</p>
              <p className="font-semibold">{diagnosis.city}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Fecha</p>
              <p className="font-semibold">{diagnosis.date}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-4">
            <Badge className={`px-4 py-2 text-lg font-semibold ${getCategoryColor(diagnosis.category)}`}>
              {diagnosis.category}
            </Badge>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{diagnosis.score}</p>
              <p className="text-sm text-muted-foreground">puntos / 100</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-green-700 flex items-center gap-2">
              ✅ Fortalezas Identificadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {diagnosis.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span className="text-sm">{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-orange-700 flex items-center gap-2">
              ⚠️ Áreas de Mejora
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {diagnosis.weaknesses.map((weakness, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span className="text-sm">{weakness}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-blue-700 flex items-center gap-2">
            🎯 Recomendaciones Estratégicas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            {diagnosis.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  {index + 1}
                </span>
                <span className="text-sm">{recommendation}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          onClick={downloadPDF}
          variant="outline"
          className="flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          Descargar txt
        </Button>
        <Button
          onClick={downloadCSV}
          variant="outline"
          className="flex items-center gap-2"
        >
          <FileSpreadsheet className="w-4 h-4" />
          Descargar CSV
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          onClick={onContinueChat}
          className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary-light"
        >
          <MessageCircle className="w-4 h-4" />
          Continuar Chateando
        </Button>
        <Button
          onClick={onRestart}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Reiniciar Evaluación
        </Button>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-blue-800 mb-2">📞 Próximos Pasos</h3>
          <p className="text-sm text-blue-700 mb-3">
            El <strong>Laboratorio de Gobierno</strong> y el <strong>Laboratorio de Comercio Internacional de la Universidad de La Sabana</strong> ofrecen:
          </p>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• <strong>Programas especializados</strong> en comercio internacional</li>
            <li>• <strong>Servicios de consultoría</strong> para exportadores</li>
            <li>• <strong>Capacitaciones</strong> en preparación exportadora</li>
            <li>• <strong>Inteligencia de mercados</strong> y oportunidades comerciales</li>
          </ul>
          <p className="text-sm text-blue-700 mt-3">
            <strong>Contacto:</strong> comercio.internacional@unisabana.edu.co
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
