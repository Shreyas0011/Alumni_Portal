// Clear stale data from previous version
// (runs once per browser; the marker is set even when there was nothing to clear,
// otherwise the first sign-in would be wiped on the next page load)
if (!localStorage.getItem('ac_version_2')) {
  if (localStorage.getItem('alumni_portal_user')) localStorage.clear();
  localStorage.setItem('ac_version_2', 'true');
}

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { SocialProvider } from './context/SocialContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <SocialProvider>
            <App />
          </SocialProvider>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
