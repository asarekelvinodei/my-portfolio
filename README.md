# My Portfolio

React + Vite. Dark and light themes (toggle in the top right, remembers the choice).

## Run it
```
npm install
npm run dev
```
Open the address it prints (usually http://localhost:5173).

## Make it yours
- `src/data.js`: name, role, intro, email, links, skills, projects and experience.
- `index.html`: the browser tab title and description.
- `src/styles.css`: colours are at the top (`--accent` and the rest).

## Build for hosting
```
npm run build
```
This creates a `dist` folder, which Vercel, Netlify or GitHub Pages can publish.

## Profile photo
Save your picture as `public/photo.jpg` (portrait, about 800 x 1000 px). Until then, your initials show instead.

## Contact form
1. Sign up free at formspree.io and create a new form.
2. Copy the ID from its endpoint (`https://formspree.io/f/abcd1234`, so the ID is `abcd1234`).
3. Paste it into `formId` in `src/data.js`.
