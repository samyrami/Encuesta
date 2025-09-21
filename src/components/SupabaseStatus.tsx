import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, Database, Settings, BarChart3, Download } from 'lucide-react';
import { supabaseService } from '@/services/supabaseService';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export const SupabaseStatus = () => {
  const [isConfigured, setIsConfigured] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [isTestingSave, setIsTestingSave] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [stats, setStats] = useState<any[]>([]);

  useEffect(() => {
    // Check if Supabase is configured
    setIsConfigured(supabaseService.isReady());
  }, []);

  const handleTestConnection = async () => {
    try {
      setIsTestingConnection(true);
      const isConnected = await supabaseService.testConnection();
      
      if (isConnected) {
        alert('✅ ¡Conexión exitosa! Supabase está funcionando correctamente.');
        setIsConfigured(true);
      } else {
        alert('❌ Error de conexión con Supabase. Revisa la configuración.');
        setIsConfigured(false);
      }
    } catch (error) {
      console.error('Error testing connection:', error);
      alert('❌ Error al probar la conexión: ' + (error as Error).message);
      setIsConfigured(false);
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleTestSave = async () => {
    try {
      setIsTestingSave(true);
      const success = await supabaseService.testSaveResponse();
      
      if (success) {
        alert('✅ ¡Prueba exitosa! Se guardó una respuesta de prueba en Supabase.');
      } else {
        alert('❌ Error: No se pudo guardar la respuesta de prueba. Revisa los logs de la consola para más detalles.');
      }
    } catch (error) {
      console.error('Error testing save:', error);
      alert('❌ Error al probar el guardado. Revisa la consola para más detalles.');
    } finally {
      setIsTestingSave(false);
    }
  };

  const handleMigration = async () => {
    try {
      setIsMigrating(true);
      const success = await supabaseService.migrateFromGoogleSheetsBackup();
      
      if (success) {
        alert('✅ ¡Migración exitosa! Los datos de Google Sheets han sido transferidos a Supabase.');
      } else {
        alert('ℹ️ No se encontraron datos de Google Sheets para migrar.');
      }
    } catch (error) {
      console.error('Error during migration:', error);
      alert('❌ Error durante la migración. Revisa la consola para más detalles.');
    } finally {
      setIsMigrating(false);
    }
  };

  const loadStats = async () => {
    try {
      const statistics = await supabaseService.getSurveyStatistics();
      setStats(statistics || []);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
    loadStats();
  };

  const exportBackupData = async () => {
    try {
      const backupData = await supabaseService.getBackupData();
      if (backupData.length === 0) {
        alert('ℹ️ No hay datos de backup para exportar.');
        return;
      }

      const dataStr = JSON.stringify(backupData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `supabase_backup_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      alert('✅ Datos de backup exportados exitosamente.');
    } catch (error) {
      console.error('Error exporting backup:', error);
      alert('❌ Error al exportar datos de backup.');
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
          title={isConfigured ? 'Supabase configurado' : 'Click para verificar configuración de Supabase'}
          onClick={handleOpenDialog}
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
            Estado de Supabase
          </DialogTitle>
          <DialogDescription>
            {isConfigured ? (
              <span className="text-green-600">
                ✅ Supabase está configurado y funcionando. Las respuestas se guardan automáticamente.
              </span>
            ) : (
              <span className="text-orange-600">
                ⚠️ Verificando configuración de Supabase...
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Status Card */}
          <div className={`p-4 border rounded-lg ${
            isConfigured 
              ? 'bg-green-50 border-green-200' 
              : 'bg-orange-50 border-orange-200'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {isConfigured ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-700" />
                  <span className="font-medium text-green-700">Sistema Activo</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-orange-700" />
                  <span className="font-medium text-orange-700">Verificando Estado</span>
                </>
              )}
            </div>
            <p className={`text-sm ${isConfigured ? 'text-green-600' : 'text-orange-600'}`}>
              {isConfigured 
                ? '✅ Base de datos Supabase conectada y lista para guardar respuestas.'
                : '⚠️ Verificando conexión con la base de datos...'
              }
            </p>
          </div>

          {/* Statistics */}
          {stats.length > 0 && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 text-blue-700 mb-2">
                <BarChart3 className="w-5 h-5" />
                <span className="font-medium">Estadísticas</span>
              </div>
              <p className="text-sm text-blue-600">
                📊 Total de respuestas guardadas: {stats.length}
              </p>
              {stats.length > 0 && (
                <p className="text-xs text-blue-500 mt-1">
                  Última respuesta: {new Date(stats[stats.length - 1]?.timestamp || '').toLocaleString()}
                </p>
              )}
            </div>
          )}
          
          {/* Configuration Details */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>Base de datos:</strong> Supabase PostgreSQL</p>
            <p><strong>Esquema:</strong> Tablas normalizadas (survey_responses, question_responses, etc.)</p>
            <p><strong>Backup:</strong> Automático con respaldo local</p>
          </div>
          
          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button 
              onClick={handleTestConnection}
              disabled={isTestingConnection}
              variant="outline"
              size="sm"
            >
              {isTestingConnection ? 'Probando...' : 'Test Conexión'}
            </Button>
            <Button 
              onClick={handleTestSave}
              disabled={isTestingSave}
              variant="outline"
              size="sm"
            >
              {isTestingSave ? 'Guardando...' : 'Test Guardado'}
            </Button>
          </div>

          {/* Migration and Backup */}
          <div className="grid grid-cols-2 gap-2">
            <Button 
              onClick={handleMigration}
              disabled={isMigrating}
              variant="secondary"
              size="sm"
            >
              {isMigrating ? 'Migrando...' : 'Migrar desde GSheets'}
            </Button>
            <Button 
              onClick={exportBackupData}
              variant="secondary"
              size="sm"
            >
              <Download className="w-4 h-4 mr-1" />
              Exportar Backup
            </Button>
          </div>
          
          {/* Close Button */}
          <Button 
            variant="outline" 
            onClick={() => setIsDialogOpen(false)}
            className="w-full"
          >
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};