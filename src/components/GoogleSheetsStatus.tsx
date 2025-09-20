import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, Database, Settings } from 'lucide-react';
import { googleSheetsService } from '@/services/googleSheetsService';
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
  const [serviceAccountJson, setServiceAccountJson] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [isTestingSave, setIsTestingSave] = useState(false);

  const handleSaveServiceAccount = async () => {
    if (!serviceAccountJson.trim()) return;
    
    try {
      setIsTestingConnection(true);
      googleSheetsService.setServiceAccount(serviceAccountJson);
      
      // Test the connection
      const isConnected = await googleSheetsService.testConnection();
      
      if (isConnected) {
        setIsConfigured(true);
        setIsDialogOpen(false);
        setServiceAccountJson('');
        alert('✅ ¡Google Sheets configurado exitosamente! Las respuestas se guardarán automáticamente.');
      } else {
        alert('❌ Error: No se pudo conectar con Google Sheets. Verifica que el Service Account sea válido y tenga permisos.');
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
                Configura tu Service Account de Google para guardar automáticamente las respuestas de la encuesta.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        
        {!isConfigured && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="serviceAccount">Service Account JSON</Label>
              <textarea
                id="serviceAccount"
                className="w-full min-h-[120px] p-3 text-sm border border-gray-300 rounded-md resize-vertical font-mono"
                placeholder='Pega aquí el contenido completo del archivo JSON de tu Service Account...\n\nEjemplo:\n{\n  "type": "service_account",\n  "project_id": "tu-proyecto",\n  "private_key_id": "...",\n  "private_key": "...",\n  ...\n}'
                value={serviceAccountJson}
                onChange={(e) => setServiceAccountJson(e.target.value)}
              />
            </div>
            
            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>¿Cómo crear un Service Account?</strong></p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Ve a <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Cloud Console</a></li>
                <li>Crea un proyecto o selecciona uno existente</li>
                <li>Habilita la API de Google Sheets</li>
                <li>Ve a IAM y administración &gt; Cuentas de servicio</li>
                <li>Crea una nueva cuenta de servicio</li>
                <li>Descarga el archivo JSON de credenciales</li>
                <li>Comparte tu Google Sheet con el email del Service Account (con permisos de editor)</li>
              </ol>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleSaveServiceAccount}
                disabled={!serviceAccountJson.trim() || isTestingConnection}
                className="flex-1"
              >
                {isTestingConnection ? 'Probando conexión...' : 'Guardar y Probar'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}
        
        {isConfigured && (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Configuración Activa</span>
              </div>
              <p className="text-sm text-green-600 mt-1">
                Las respuestas de la encuesta se guardarán automáticamente en tu Google Sheet.
              </p>
            </div>
            
            <div className="text-xs text-muted-foreground">
              <p><strong>ID de la hoja:</strong> 1wjNTHAdEN4gCF2WP00dqKTu3Vu9UHB360aKMa0DCIM8</p>
              <p className="mt-1">Si necesitas cambiar la configuración, recarga la página.</p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
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
        )}
      </DialogContent>
    </Dialog>
  );
};