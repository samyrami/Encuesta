import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // For Railway deployment, we need to be more permissive with hosts
  const isProduction = mode === 'production';
  const isRailway = process.env.RAILWAY_ENVIRONMENT !== undefined;
  
  return {
    server: {
      host: "::",
      port: 8080,
      allowedHosts: 'all', // Allow all hosts in development
    },
    preview: {
      host: "0.0.0.0",
      port: parseInt(process.env.PORT || "3000"),
      allowedHosts: isRailway || mode === 'development' ? 'all' : [
        "encuesta-production-85e1.up.railway.app",
        "exporta-facil-bot-production.up.railway.app",
        ".railway.app",
        ".up.railway.app",
        "localhost",
        "127.0.0.1",
        "0.0.0.0"
      ],
    },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
    build: {
      outDir: "dist",
      assetsDir: "assets",
    },
  };
});
