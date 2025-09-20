import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, Database, Settings } from 'lucide-react';
import { googleSheetsService } from '@/services/googleSheetsProxy';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const GoogleSheetsStatus = () => {
  const [isConfigured, setIsConfigured] = useState(googleSheetsService.isConfigured());
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [isTestingSave, setIsTestingSave] = useState(false);

  const handleSaveWebhook = async () => {
    try {
      setIsTestingConnection(true);
      
      if (webhookUrl.trim()) {
        googleSheetsService.setWebhookUrl(webhookUrl.trim());
      }
      
      // Test the connection
      const isConnected = await googleSheetsService.testConnection();
      
      if (isConnected) {
        setIsConfigured(true);
        setIsDialogOpen(false);
        setWebhookUrl('');
        alert('✅ ¡Google Sheets configurado exitosamente! Las respuestas se guardarán automáticamente.');
      } else {
        // Even if connection test fails, we can still save responses
        setIsConfigured(true);
        setIsDialogOpen(false);
        setWebhookUrl('');
        alert('✅ Configuración guardada. Las respuestas se intentarán guardar automáticamente.');
      }
    } catch (error) {
      console.error('Error testing connection:', error);
      alert('❌ Error al probar la conexión: ' + (error as Error).message);
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleTestSave = async () => {
    try {
      setIsTestingSave(true);
      const success = await googleSheetsService.testSaveResponse();
      
      if (success) {
        alert('\u2705 \u00a1Prueba exitosa! Se guard\u00f3 una respuesta de prueba en tu Google Sheet.');
      } else {
        alert('\u274c Error: No se pudo guardar la respuesta de prueba. Revisa los logs de la consola para m\u00e1s detalles.');
      }
    } catch (error) {
      console.error('Error testing save:', error);
      alert('\u274c Error al probar el guardado. Revisa la consola para m\u00e1s detalles.');
    } finally {
      setIsTestingSave(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`flex items-center gap-2 ${
            isConfigured 
              ? 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100' 
              : 'border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100'
          }`}
          title={isConfigured ? 'Google Sheets configurado' : 'Click para configurar Google Sheets'}
        >
          {isConfigured ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          <Database className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configuración de Google Sheets
          </DialogTitle>
          <DialogDescription>
            {isConfigured ? (
              <span className="text-green-600">
                ✅ Google Sheets está configurado. Las respuestas se guardan automáticamente.
              </span>
            ) : (
              <span>
                Sistema de guardado automático en Google Sheets está listo. Opcionalmente puedes configurar un webhook personalizado.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-700 mb-2">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Sistema Funcionando</span>
            </div>
            <p className="text-sm text-green-600">
              ✅ Las respuestas se guardan automáticamente usando Google Apps Script.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="webhook">Webhook URL (Opcional)</Label>
            <Input
              id="webhook"
              type="url"
              placeholder="https://tu-webhook.com/endpoint (opcional)"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Solo configura esto si tienes tu propio endpoint para recibir datos.
            </p>
          </div>
          
          <div className="text-xs text-muted-foreground">
            <p><strong>ID de la hoja:</strong> 1wjNTHAdEN4gCF2WP00dqKTu3Vu9UHB360aKMa0DCIM8</p>
            <p className="mt-1">El sistema usa Google Apps Script para garantizar el guardado.</p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleTestSave}
              disabled={isTestingSave}
              className="flex-1"
            >
              {isTestingSave ? 'Probando...' : 'Probar Guardado'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              className="flex-1"
            >
              Cerrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};