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
import AgregarProducto from './components/dashboard-components/AgregarProducto.jsx'
import EditarProducto from './components/dashboard-components/EditarProducto.jsx'
import AsignarRoles from './components/dashboard-components/AsignarRoles.jsx'
import EliminarProducto from './components/dashboard-components/EliminarProducto.jsx'
import CambiarEstadoUsuario from './components/dashboard-components/CambiarEstadoUsuario.jsx'
import EliminarUsuario from './components/dashboard-components/EliminarUsuario.jsx'
import Categorias from './components/dashboard-components/categorias.jsx'
import ProductDetails from './pages/product-detail/ProductDetail.jsx'
import Cart from './pages/carrito/Cart.jsx'
import Vender from './pages/vender/Vender.jsx'
import Mensaje from './pages/mensaje/Mensaje.jsx'
import Supermarket from './pages/supermarket/Supermarket.jsx'
import PasarelaPagos from './pages/pagos/PasarelaPagos.jsx'
import PagoExitoso from './pages/pagos/PagoExitoso.jsx'



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/*" element={<Home />} />
            <Route path='/product-details/:id' element={<ProductDetails />} />
            <Route path='/supermercado' element={<Supermarket />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
            <Route path='/edit' element={<PerfilEditar />} />
            <Route path='/assistant' element={<Assistant />} />
            <Route path='/vender' element={<Vender/>} />
            <Route path='/admin' element={<ProtectedAdminRoute> <AdminDashboard /> </ProtectedAdminRoute>}/>
            <Route path='/admin/productos/nuevo' element={<ProtectedAdminRoute> <AgregarProducto /> </ProtectedAdminRoute>} />
            <Route path='/admin/productos/:id/editar' element={<ProtectedAdminRoute> <EditarProducto /> </ProtectedAdminRoute>} />
            <Route path='/admin/productos/:id/eliminar' element={<ProtectedAdminRoute> <EliminarProducto /> </ProtectedAdminRoute>} />
            <Route path='/admin/asignar-roles' element={<ProtectedAdminRoute> <AsignarRoles /> </ProtectedAdminRoute>} />
            <Route path='/admin/cambiar-estado' element={<ProtectedAdminRoute> <CambiarEstadoUsuario /> </ProtectedAdminRoute>} />
            <Route path='/admin/eliminar-usuarios' element={<ProtectedAdminRoute> <EliminarUsuario /> </ProtectedAdminRoute>} />
            <Route path='/admin/categorias' element={<ProtectedAdminRoute> <Categorias /> </ProtectedAdminRoute>} />
            <Route path='/cart' element={<Cart/>} />
            <Route path='/pagos' element={<PasarelaPagos />} />
            <Route path='/conversaciones/:id' element={<Mensaje />} />
            <Route path='/mensajes/:id' element={<Mensaje />} />
            <Route path='/pago-exitoso' element={<PagoExitoso />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
