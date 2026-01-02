import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getCurrentUsuario } from '../services/usuarioApi.js'
import { checkAdmin } from '../services/adminApi.js'

const STORAGE_KEY = 'cryopath-auth'

const readStoredAuth = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch (error) {
    console.warn('No se pudo recuperar la sesion del almacenamiento local.', error)
    return null
  }
}

const AuthContext = createContext({
  session: null,
  user: null,
  profile: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  isAdmin: false,
  loading: true,
})

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(() => {
    if (typeof window === 'undefined') return null
    return readStoredAuth()
  })

  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);


  const token = authState?.session?.access_token

  //Guardar sesión en localstorage
  useEffect(() => {
    if (!authState) {
      localStorage.removeItem(STORAGE_KEY)
      return
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(authState))
  }, [authState])

  // Cargar perfil del usuario
  useEffect(() => {
    if (!token) {
      setAuthState((prev) => {
        if (!prev || !prev.profile) return prev
        return { ...prev, profile: null }
      })
      return
    }

    let isActive = true

    getCurrentUsuario(token)
      .then((usuario) => {
        if (!isActive) return
        setAuthState((prev) => (prev ? { ...prev, profile: usuario } : prev))
      })
      .catch((error) => {
        console.error('No se pudo cargar el perfil del usuario.', error)
        if (!isActive) return
       
        logout()
      })

    return () => {
      isActive = false
    }
  }, [token])


   //Verificar si es admin
  useEffect(() => {
    if (!token) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    let isActive = true;
    setLoading(true);

    checkAdmin(token)
      .then(() => {
        if (!isActive) return;
        setIsAdmin(true);
      })
      .catch(() => {
        if (!isActive) return;
        setIsAdmin(false);
      })
      .finally(() => {
        if (!isActive) return;
        setLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [token]);

  const login = ({ session, user, profile = null }) => {
    if (!session) return
    setAuthState({ session, user: user ?? null, profile })
  }

  const logout = () => {
    setAuthState(null)
    setIsAdmin(false);
  }

  

  const updateProfile = (newProfile) => {
    setAuthState((prev) =>
      prev ? { ...prev, profile: newProfile } : prev
    )
  }

  const value = useMemo(() => ({
    session: authState?.session || null,
    user: authState?.user || null,
    profile: authState?.profile || null,
    login,
    logout,
    updateProfile,
    isAuthenticated: Boolean(authState?.session?.access_token),
    isAdmin,
    loading,
  }), [authState, isAdmin, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}