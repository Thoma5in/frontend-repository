import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Layout from './components/layout/Layout.jsx'
import Profile from './pages/profile/Profile.jsx'
import Home from './pages/home/Home.jsx'
import Register from './pages/register/Register.jsx'
import Login from './pages/login/Login.jsx'
import PerfilEditar from './pages/editar-perfil/EditarPerfil.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import AdminDashboard from './pages/dashboard/AdminDashboard.jsx'
import Assistant from './pages/assistant/assistant.jsx'
import ProtectedAdminRoute from './components/ProtectedAdminRoute.jsx'




createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/*" element={<Home />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
            <Route path='/edit' element={<PerfilEditar />} />
            <Route path='/assistant' element={<Assistant />} />
            <Route path = '/admin' element = {<ProtectedAdminRoute> <AdminDashboard /> </ProtectedAdminRoute>}/>
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
