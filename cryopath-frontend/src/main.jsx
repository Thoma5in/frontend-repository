import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Layout from './components/layout/Layout.jsx'
import Profile from './pages/profile/Profile.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/*" element={<App />} />
          <Route path='/profile' element={<Profile />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  </StrictMode>,
)
