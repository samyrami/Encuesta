# Exporta Fácil Bot - Exporta Check

Herramienta de diagnóstico de capacidad exportadora desarrollada por el **Laboratorio de Gobierno** con el apoyo del **Laboratorio de Comercio Internacional de la Universidad de La Sabana**.

## 🎯 Descripción

Esta aplicación web permite a las empresas evaluar su preparación para la exportación a través de un cuestionario interactivo que analiza diferentes aspectos críticos:

- 🏆 **Certificaciones de calidad** (ISO, BPM, BPA)  
- 🌍 **Experiencia internacional**
- 🏭 **Capacidad productiva**
- 👥 **Recursos humanos especializados**
- 📦 **Adaptación de productos**
- 🚚 **Logística y operaciones**
- 🤝 **Alianzas y redes**
- 💰 **Financiamiento y estrategias**

## 🚀 Instalación y Configuración

**Prerrequisito**: Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Pasos básicos:

```sh
# 1. Clonar el repositorio
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# 2. Instalar dependencias
npm i

# 3. Iniciar servidor de desarrollo
npm run dev
```

### ⚙️ Configuración de OpenAI (Chat Especializado)

Para habilitar el chat con IA, crea un archivo `.env` en la raíz:

```env
VITE_OPENAI_API_KEY=tu-api-key-aqui
```

**¿No tienes API key?** Obtén una gratis en: [OpenAI Platform](https://platform.openai.com/api-keys)

> **Nota**: La aplicación funciona completamente sin API key. Solo el chat especializado requiere configuración.

## ✨ Características

- **Cuestionario interactivo**: 23 preguntas estratégicamente diseñadas
- **Diagnóstico personalizado**: Puntuación, categorización y recomendaciones específicas  
- **Chat especializado**: Asistente IA para resolver dudas sobre exportación
- **Exportación de resultados**: Descarga en PDF y CSV
- **Interfaz moderna**: Diseño responsivo y accesible

## 🛠️ Tecnologías

- **Vite** + **TypeScript** + **React 18**
- **Tailwind CSS** + **shadcn-ui** 
- **OpenAI API** (chat especializado)
- **Lucide React** (iconos)

## 📋 Uso de la Aplicación

1. **Completar datos de contacto**: Información básica de la empresa
2. **Responder cuestionario**: 17 preguntas sobre capacidad exportadora  
3. **Revisar diagnóstico**: Puntuación, categoría, fortalezas, debilidades y recomendaciones
4. **Descargar resultados**: PDF o CSV para revisión posterior
5. **Chat especializado**: Resolver dudas específicas sobre exportación

## 🐛 Problemas Solucionados

### ✅ El diagnóstico muestra 0 puntos
- **Problema**: Cálculo incorrecto de puntuación
- **Solución**: Se corrigió el algoritmo de puntuación en `useChatBot.ts`

### ✅ Error en el chat con OpenAI  
- **Problema**: API key no configurada o contexto incompleto
- **Solución**: Mejorado manejo de configuración y contexto del diagnóstico

## 👥 Desarrollado por

**Laboratorio de Gobierno** y **Laboratorio de Comercio Internacional** - Universidad de La Sabana

📧 **Contacto**: comercio.internacional@unisabana.edu.co

---

© 2024 Universidad de La Sabana - **Desarrollado con ❤️ para apoyar la internacionalización de empresas colombianas**
