# 🚀 Google Sheets - Guía Rápida

## ⚡ Configuración en 5 Minutos

### 1. Crear Service Account
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. **IAM y administración** > **Cuentas de servicio**
3. **Crear cuenta de servicio**
4. Nombre: `sustainability-survey`
5. **Crear** → **Listo**

### 2. Descargar Credenciales
1. Haz clic en el service account creado
2. **Claves** > **Agregar clave** > **Crear nueva clave**
3. Selecciona **JSON** > **Crear**
4. Se descarga automáticamente el archivo JSON

### 3. Configurar Google Sheet
1. Abre [tu Google Sheet](https://docs.google.com/spreadsheets/d/1wjNTHAdEN4gCF2WP00dqKTu3Vu9UHB360aKMa0DCIM8/)
2. **Compartir** > Pega el email del service account
3. Asignar permisos de **Editor** > **Enviar**

### 4. Configurar la App
1. Abre el archivo JSON descargado
2. **Copia TODO el contenido**
3. En la app: clic en ícono de base de datos 🗄️
4. Pega el JSON completo
5. **Guardar y Probar**

## ✅ ¡Listo!

Ahora las respuestas se guardarán automáticamente en tu Google Sheet.

## 🔍 Verificar que Funciona

```javascript
// En la consola del navegador (F12):
testGoogleSheetsIntegration()
```

## 📧 Email del Service Account

El email se encuentra en el archivo JSON en el campo `client_email`:
```json
{
  "type": "service_account",
  "client_email": "sustainability-survey@tu-proyecto.iam.gserviceaccount.com",
  ...
}
```

**Este email es el que debes usar para compartir el Google Sheet.**