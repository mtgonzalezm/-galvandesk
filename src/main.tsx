import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App, { VisorDocumentos } from './App.jsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <VisorDocumentos />
  </StrictMode>,
)
