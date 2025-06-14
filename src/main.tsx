/**
 * @file main.tsx
 * @description This is the main entry point for the React application.
 * It sets up the React DOM, wraps the App component with BrowserRouter for routing,
 * and enables React StrictMode. It also imports necessary global styles.
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import '@radix-ui/themes/styles.css' // Radix UI global styles
import './index.css' // Custom global styles

// Mount the application to the DOM
// The root element with ID 'root' is expected to be in the public/index.html file.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)