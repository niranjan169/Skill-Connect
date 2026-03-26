import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/variables.css'
import './styles/animations.css'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster 
          position="top-right" 
          toastOptions={{
            style: {
              background: '#111827',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              fontSize: '14px',
              fontWeight: 500
            }
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
