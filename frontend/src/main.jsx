import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from '/src/context/AuthContext.jsx'
import { CriminalProvider } from '/src/context/CriminalContext.jsx'
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/firebase-messaging-sw.js')
    .then((registration) => {
      console.log('Service Worker registered for Firebase Messaging:', registration);
    })
    .catch((err) => {
      console.error('Service Worker registration failed:', err);
    });
}
ReactDOM.createRoot(document.getElementById('root')).render(
    <AuthProvider>
      <CriminalProvider>
        <App />
      </CriminalProvider>
    </AuthProvider>
)