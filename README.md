# Three.js Template

Vite + Three.js + lil-gui + GSAP + stats.js

## Nouveau projet

```bash
npx degit TOMitom910/threejs-template mon-projet
cd mon-projet
npm install
npm run dev
```

## Commandes

- `npm run dev` : serveur de dev
- `npm run build` : build de production dans `dist/`
- `npm run preview` : prévisualiser le build

## Debug

Ajoute `#debug` à l'URL (ex : `http://localhost:5173/#debug`) pour afficher lil-gui et stats.js.

## Arborescence

```
src/
  Experience/Experience.js   scène, caméra, renderer, loaders, boucle
  shaders/
  utils/
  index.html
  index.js
  style.css
static/                      assets servis à la racine (/models/..., /textures/...)
```
