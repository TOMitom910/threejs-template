import { defineConfig } from 'vite'

export default defineConfig({
    // index.html est dans src/
    root: 'src/',
    // Les fichiers de static/ sont servis à la racine (ex : static/models/a.glb -> /models/a.glb)
    publicDir: '../static/',
    server: {
        host: true, // accessible depuis le réseau local (pratique pour tester sur téléphone)
        open: true  // ouvre le navigateur au lancement
    },
    build: {
        outDir: '../dist',
        emptyOutDir: true,
        sourcemap: true,
        chunkSizeWarningLimit: 1000 // Three.js est lourd, on évite l'avertissement inutile
    }
})
