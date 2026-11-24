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
Messages are sent directly from the site to the email address configured in `src/data.js` using FormSubmit. On first use, FormSubmit emails a one-time confirmation link; confirm it to enable delivery. After confirmation, visitors can submit without leaving the page.
