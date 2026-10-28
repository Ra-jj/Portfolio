import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Self-hosted variable fonts (Fontsource ships font-display: swap).
// Archivo: weight axis only. Martian Mono: the width-axis file, so the receipt
// can be set at font-stretch 87.5%. Doto: weight axis, ROND stays at its
// default 0 (square dots).
import '@fontsource-variable/archivo'
import '@fontsource-variable/martian-mono/wdth.css'
import '@fontsource-variable/doto'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
