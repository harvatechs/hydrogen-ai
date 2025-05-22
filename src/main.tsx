import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

// Import styles
import "./index.css";
import "@/styles/chatgpt-theme.css";
import "@/styles/enhanced-ui.css";
import "@/styles/mermaid.css";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
