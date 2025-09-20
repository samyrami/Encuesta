# 📊 Guía de Configuración de Google Sheets

## 🔧 Problema Solucionado
**Google Sheets API ya no acepta API keys simples para escritura. Ahora usamos Service Account authentication.**

## ✅ Nueva Solución con Service Account

### 1. Verificar la Configuración Actual

**Abrir la consola del navegador** (F12) y ejecutar:
```javascript
testGoogleSheetsIntegration()
```

Esto te dirá exactamente qué está fallando.

### 2. Configurar Service Account en Google Cloud

#### Paso A: Crear/Verificar el Proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Ve a **APIs y servicios** > **Biblioteca**
4. Busca "Google Sheets API" y **habilítala**

#### Paso B: Crear Service Account

1. Ve a **IAM y administración** > **Cuentas de servicio**
2. Haz clic en **Crear cuenta de servicio**
3. Asigna un nombre: `sustainability-survey-collector`
4. Descripción: `Service account for collecting survey responses`
5. Haz clic en **Crear y continuar**
6. **No asignes roles especiales** (haz clic en "Continuar")
7. Haz clic en **Listo**

#### Paso C: Descargar Credenciales JSON

1. Encuentra tu service account en la lista
2. Haz clic en el email del service account
3. Ve a la pestaña **Claves**
4. Haz clic en **Agregar clave** > **Crear nueva clave**
5. Selecciona **JSON** y haz clic en **Crear**
6. Se descargará automáticamente el archivo JSON - **guárdalo en lugar seguro**

#### Paso D: Configurar el Google Sheet

1. Abre tu Google Sheet: [https://docs.google.com/spreadsheets/d/1wjNTHAdEN4gCF2WP00dqKTu3Vu9UHB360aKMa0DCIM8/](https://docs.google.com/spreadsheets/d/1wjNTHAdEN4gCF2WP00dqKTu3Vu9UHB360aKMa0DCIM8/)

2. **IMPORTANTE**: Compartir con el Service Account
   - Haz clic en **Compartir** (botón azul)
   - Copia el email del service account desde tu archivo JSON (campo `client_email`)
   - Pega el email en el campo "Agregar personas y grupos"
   - Asegúrate de que el permiso sea **"Editor"**
   - Haz clic en **Enviar**

3. Verificar que tengas una hoja llamada **"Sheet1"** o **"Hoja1"**

#### Paso E: Configurar la Aplicación

1. Abre el archivo JSON descargado en un editor de texto
2. Copia **todo el contenido** del archivo
3. En la aplicación, haz clic en el ícono de base de datos (Google Sheets)
4. Pega el contenido JSON completo en el campo de texto
5. Haz clic en **"Guardar y Probar"**

### 3. Probar la Integración

#### En la aplicación:
1. Abre el modal de Google Sheets (ícono de base de datos)
2. Haz clic en **"Probar Guardado"**
3. Deberías ver una respuesta de prueba en tu Google Sheet

#### En la consola del navegador:
```javascript
// Mostrar comandos disponibles
showDebugCommands()

// Probar la integración completa
testGoogleSheetsIntegration()

// Ver datos de backup local
getGoogleSheetsBackup()
```

### 4. Errores Comunes y Soluciones

#### Error 401: "UNAUTHENTICATED" o "API keys are not supported"
- **Solución**: Necesitas usar Service Account en lugar de API key
- Sigue la guía completa para configurar Service Account

#### Error 403: "The caller does not have permission"
- **Solución**: El Service Account no tiene acceso al Google Sheet
- Comparte tu Google Sheet con el email del Service Account (con permisos de "Editor")
- El email está en el campo `client_email` del archivo JSON

#### Error 400: "Unable to parse range"
- **Solución**: Nombre de la hoja incorrecto
- Asegúrate de que tu hoja se llame "Sheet1" o "Hoja1"

#### Error 404: "Requested entity was not found"
- **Solución**: ID del Sheet incorrecto o sheet no accesible
- Verifica que el ID sea: `1wjNTHAdEN4gCF2WP00dqKTu3Vu9UHB360aKMa0DCIM8`
- Verifica que hayas compartido el sheet con el service account

#### Error "Invalid service account JSON"
- **Solución**: El JSON del Service Account está malformado
- Verifica que hayas copiado **todo** el contenido del archivo JSON
- Asegúrate de que no haya caracteres extra o faltantes

### 5. Formato Esperado en Google Sheets

La aplicación guardará los datos en estas columnas:

| A | B | C | D | E | F | G | H | I | J | K | L | M |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Timestamp | Nombre | Universidad | Puntuación General | Puntuación Ambiental | Puntuación Social | Puntuación Gobernanza | Número Respuestas | Fortalezas | Debilidades | Recomendaciones | Respuestas Completas | ID Sesión |

### 6. Verificar que Funciona

Después de configurar correctamente:

1. Completa una evaluación de sostenibilidad en la app
2. Al final, deberías ver el mensaje: "📈 ¡Respuestas guardadas!"
3. Revisa tu Google Sheet para ver los datos

### 7. Comandos de Debug Útiles

```javascript
// Ver estado actual
debugSustainabilityApp()

// Limpiar configuración si hay problemas
clearGoogleSheetsData()

// Limpiar todos los datos y empezar de nuevo
clearAllSustainabilityData()

// Probar guardado manual
testGoogleSheets()
```

## 🆘 Si Sigue Sin Funcionar

1. **Revisa la consola del navegador** para errores específicos
2. **Ejecuta `testGoogleSheetsIntegration()`** para diagnóstico completo
3. **Verifica que el Google Sheet esté público** y sea editable
4. **Prueba con una API key diferente** si es necesario

## 📞 Contacto para Soporte

Si después de seguir esta guía sigue habiendo problemas, comparte:
- Los mensajes de error de la consola del navegador
- El resultado de ejecutar `testGoogleSheetsIntegration()`
- Una captura del estado de permisos de tu Google Sheet