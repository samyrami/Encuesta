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
  const downloadPDF = async () => {
    try {
      // Dynamic import to reduce initial bundle size
      const html2pdf = (await import('html2pdf.js')).default;
      
      // Create a temporary div with the content for PDF
      const element = document.createElement('div');
      element.innerHTML = generateHTMLContent(diagnosis);
      element.style.padding = '20px';
      element.style.fontFamily = 'Arial, sans-serif';
      element.style.lineHeight = '1.6';
      
      // Temporarily add to body for rendering
      document.body.appendChild(element);
      
      const opt = {
        margin: 1,
        filename: `diagnostico-exportador-${diagnosis.company}-${new Date().toISOString().split('T')[0]}.pdf`,
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
      downloadTXT();
    }
  };
  
  const downloadTXT = () => {
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

  const generateHTMLContent = (diagnosis: DiagnosisResult) => {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px;">
          <h1 style="color: #333; font-size: 28px; margin-bottom: 10px;">DIAGNÓSTICO DE CAPACIDAD EXPORTADORA</h1>
          <p style="color: #666; font-size: 16px;">Universidad de La Sabana - Laboratorio de Gobierno</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #333; font-size: 20px; margin-bottom: 15px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">DATOS DE LA EVALUACIÓN</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px;">
            <p><strong>Empresa:</strong> ${diagnosis.company}</p>
            <p><strong>Responsable:</strong> ${diagnosis.name}</p>
            <p><strong>Ciudad:</strong> ${diagnosis.city}</p>
            <p><strong>Fecha:</strong> ${diagnosis.date}</p>
            <p><strong>Categoría:</strong> ${diagnosis.category}</p>
            <p><strong>Puntuación:</strong> ${diagnosis.score}/100</p>
          </div>
        </div>
        
        <div style="margin-bottom: 25px;">
          <h2 style="color: #28a745; font-size: 18px; margin-bottom: 15px;">✅ FORTALEZAS IDENTIFICADAS</h2>
          <ul style="padding-left: 20px; line-height: 1.8;">
            ${diagnosis.strengths.map(s => `<li style="margin-bottom: 8px; color: #333;">${s}</li>`).join('')}
          </ul>
        </div>
        
        <div style="margin-bottom: 25px;">
          <h2 style="color: #dc3545; font-size: 18px; margin-bottom: 15px;">⚠️ ÁREAS DE MEJORA</h2>
          <ul style="padding-left: 20px; line-height: 1.8;">
            ${diagnosis.weaknesses.map(w => `<li style="margin-bottom: 8px; color: #333;">${w}</li>`).join('')}
          </ul>
        </div>
        
        <div style="margin-bottom: 25px;">
          <h2 style="color: #007bff; font-size: 18px; margin-bottom: 15px;">🎯 RECOMENDACIONES ESTRATÉGICAS</h2>
          <ol style="padding-left: 20px; line-height: 1.8;">
            ${diagnosis.recommendations.map((r, i) => `<li style="margin-bottom: 8px; color: #333;">${r}</li>`).join('')}
          </ol>
        </div>
        
        <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; border-left: 4px solid #2196f3;">
          <h2 style="color: #1976d2; font-size: 18px; margin-bottom: 15px;">📞 PRÓXIMOS PASOS</h2>
          <p style="margin-bottom: 15px; color: #333;">El <strong>Laboratorio de Gobierno</strong> de la Universidad de La Sabana ofrece:</p>
          <ul style="padding-left: 20px; line-height: 1.8; color: #333;">
            <li>Programas especializados en comercio internacional</li>
            <li>Servicios de consultoría para exportadores</li>
            <li>Capacitaciones en preparación exportadora</li>
            <li>Inteligencia de mercados y oportunidades comerciales</li>
          </ul>
          
          <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #bbdefb;">
            <p style="margin-bottom: 5px; color: #333;"><strong>Contacto:</strong></p>
            <p style="color: #333; font-size: 14px;">Laboratorio de Gobierno<br/>Universidad de La Sabana<br/>Email: comercio.internacional@unisabana.edu.co</p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
          <p><em>Desarrollado por el Laboratorio de Gobierno - Universidad de La Sabana © 2024</em></p>
        </div>
      </div>
    `;
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
El Laboratorio de Gobierno de la Universidad de La Sabana ofrece:
• Programas especializados en comercio internacional
• Servicios de consultoría para exportadores
• Capacitaciones en preparación exportadora
• Inteligencia de mercados y oportunidades comerciales

Contacto: Laboratorio de Gobierno
Universidad de La Sabana
Email: comercio.internacional@unisabana.edu.co

Desarrollado por el Laboratorio de Gobierno - Universidad de La Sabana © 2024
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
        return 'bg-red-50 text-red-600 border-red-100';
      case 'Intermedio':
        return 'bg-yellow-50 text-yellow-600 border-yellow-100';
      case 'Avanzado':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Experto':
        return 'bg-green-50 text-green-600 border-green-100';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-100';
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
          <Download className="w-4 h-4" />
          Descargar PDF
        </Button>
        <Button
          onClick={downloadTXT}
          variant="outline"
          className="flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          Descargar TXT
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
            El <strong>Laboratorio de Gobierno de la Universidad de La Sabana</strong> ofrece:
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
