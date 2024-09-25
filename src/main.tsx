import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { _L } from './Tools/_L.ts';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register(`/src/service-worker.js`)
    .then((registration) => {
      registration.update();
    })
    .catch((error) => console.log('Service Worker registration failed', error));
}
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {<App />}
  </StrictMode>,
)
