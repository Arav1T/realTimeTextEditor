# 📝 Real-Time Collaborative Text Editor

A lightweight collaborative text editor built with **React**, **TypeScript**, **Tailwind CSS**, and **Firebase Firestore**. Multiple users can edit a shared document and see each other's changes in real time.

---

## 🚀 Features

Real-time collaborative editing using Firebase Firestore.

Simple contenteditable-based rich text editor TipTap.

User identification via username prompt.

Live display of which user last edited the document.

Responsive UI styled with TailwindCSS.

## 📁 Project Structure



src/
  components/
    Editor.tsx        # The main editor component with contenteditable div
    Login.tsx # Prompt for username input
  context/
    UserContext.tsx    # React context for user management
 
  firebase/
    firebase.ts        # Firebase initialization
  utils/
    useCursors.ts       # Utility function
App.tsx               # Main app component


Installation:
1- Clone the repository:
git clone https://github.com/yourusername/realtime-collaborative-editor.git
cd realtime-collaborative-editor

2- Install dependencies:
npm install

3- Create a .env file in the root directory and add your Firebase config variables:
VITE_APPKEY=your_firebase_apiKey
VITE_AUTHDOMAIN=your_firebase_authDomain
VITE_PROJECT_ID=your_firebase_projectId
VITE_STORAGE_BUCKET=your_firebase_storageBucket
VITE_MESSAGING_SENDER_ID=your_firebase_messagingSenderId
VITE_APP_ID=your_firebase_appId

4- npm run dev





























# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
