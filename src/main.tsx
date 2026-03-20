import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.tsx'
import Flow from './Flow'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Flow />
  </StrictMode>,
)
