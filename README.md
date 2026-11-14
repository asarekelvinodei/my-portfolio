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
It sends through FormSubmit, which needs no account. The first time you send a test message, FormSubmit emails you an activation link. Click it, then send another test. If sending ever fails, the form offers to open the message in your email app instead.
To use Formspree instead, put its form ID into `formId` in `src/data.js`.
