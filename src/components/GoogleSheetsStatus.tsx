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
  const [apiKey, setApiKey] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [isTestingSave, setIsTestingSave] = useState(false);

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) return;
    
    try {
      setIsTestingConnection(true);
      googleSheetsService.setApiKey(apiKey);
      
      // Test the connection
      const isConnected = await googleSheetsService.testConnection();
      
      if (isConnected) {
        setIsConfigured(true);
        setIsDialogOpen(false);
        setApiKey('');
        alert('¡Google Sheets configurado exitosamente! Las respuestas se guardarán automáticamente.');
      } else {
        alert('Error: No se pudo conectar con Google Sheets. Verifica que la API key sea válida y que tengas permisos para acceder a la hoja.');
      }
    } catch (error) {
      console.error('Error testing connection:', error);
      alert('Error al probar la conexión. Verifica que la API key sea válida.');
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
                Configura tu API key de Google Sheets para guardar automáticamente las respuestas de la encuesta.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        
        {!isConfigured && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key de Google Sheets</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Ingresa tu API key aquí..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSaveApiKey()}
              />
            </div>
            
            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>¿Cómo obtener la API key?</strong></p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Ve a <a href="https://console.developers.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Console</a></li>
                <li>Crea un proyecto o selecciona uno existente</li>
                <li>Habilita la API de Google Sheets</li>
                <li>Crea credenciales (API Key)</li>
                <li>Asegúrate de que tu hoja sea pública o comparta permisos</li>
              </ol>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleSaveApiKey}
                disabled={!apiKey.trim() || isTestingConnection}
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