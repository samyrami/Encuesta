# 📊 Guía de Configuración de Google Sheets

## 🔧 Problema Actual
La integración muestra "configurada" pero no se están guardando los datos en el Google Sheet.

## ✅ Solución Paso a Paso

### 1. Verificar la Configuración de la API Key

**Abrir la consola del navegador** (F12) y ejecutar:
```javascript
testGoogleSheetsIntegration()
```

Esto te dirá exactamente qué está fallando.

### 2. Configurar Correctamente Google Sheets API

#### Paso A: Crear/Verificar el Proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Ve a **APIs y servicios** > **Biblioteca**
4. Busca "Google Sheets API" y **habilítala**

#### Paso B: Crear Credenciales

1. Ve a **APIs y servicios** > **Credenciales**
2. Haz clic en **Crear credenciales** > **Clave de API**
3. **IMPORTANTE**: Configura las restricciones:
   - **Restricciones de aplicación**: Selecciona "Referentes HTTP"
   - Agrega tus dominios:
     - `http://localhost:*`
     - `https://localhost:*`
     - `https://*.railway.app/*` (si usas Railway)
   - **Restricciones de API**: Selecciona "Google Sheets API"

#### Paso C: Configurar el Google Sheet

1. Abre tu Google Sheet: [https://docs.google.com/spreadsheets/d/1wjNTHAdEN4gCF2WP00dqKTu3Vu9UHB360aKMa0DCIM8/](https://docs.google.com/spreadsheets/d/1wjNTHAdEN4gCF2WP00dqKTu3Vu9UHB360aKMa0DCIM8/)

2. **IMPORTANTE**: El sheet debe ser público o tener permisos de edición
   - Haz clic en **Compartir** (botón azul)
   - En "Obtener vínculo" > **Cambiar**
   - Selecciona **"Cualquier persona con el vínculo"**
   - Asegúrate de que sea **"Editor"** (no solo "Visor")

3. Verificar que tengas una hoja llamada **"Sheet1"** o **"Hoja1"**

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

#### Error 403: "The caller does not have permission"
- **Solución**: El Google Sheet no es público o no tiene permisos de edición
- Ve al Sheet > Compartir > Cambiar a "Cualquier persona con el vínculo" > "Editor"

#### Error 400: "Unable to parse range"
- **Solución**: Nombre de la hoja incorrecto
- Asegúrate de que tu hoja se llame "Sheet1" o "Hoja1"

#### Error 404: "Requested entity was not found"
- **Solución**: ID del Sheet incorrecto o sheet privado
- Verifica que el ID sea: `1wjNTHAdEN4gCF2WP00dqKTu3Vu9UHB360aKMa0DCIM8`

#### Error 403: "API key not valid"
- **Solución**: API key incorrecta o sin permisos
- Verifica que la API key tenga acceso a Google Sheets API
- Revisa las restricciones de dominio

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