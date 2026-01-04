import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getCurrentUsuario, getUserRoles } from '../services/usuarioApi.js'

const STORAGE_KEY = 'cryopath-auth'

const readStoredAuth = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(() => {
    if (typeof window === 'undefined') return null
    return readStoredAuth()
  })

  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)

  const token = authState?.session?.access_token

  // Persistencia
  useEffect(() => {
    if (!authState) {
      localStorage.removeItem(STORAGE_KEY)
      return
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authState))
  }, [authState])

  // Perfil
  useEffect(() => {
    if (!token) return

    let active = true

    getCurrentUsuario(token)
      .then((profile) => {
        if (!active) return
        setAuthState((prev) => prev ? { ...prev, profile } : prev)
      })
      .catch(() => logout())

    return () => { active = false }
  }, [token])

  // Admin
  useEffect(() => {
    if (!token) {
      setRoles([])
      setLoading(false)
      return
    }

    setLoading(true)

    getUserRoles(token)
    .then (({ roles }) => setRoles(roles))
    .catch(() => setRoles([]))
    .finally(() => setLoading(false))
  }, [token])


  const login = ({ session, user, profile = null }) => {
    setAuthState({ session, user, profile })
  }

  const logout = () => {
    setAuthState(null)
    setRoles([])
  }

  const isAdmin = roles.includes('admin')
  const isWorker = roles.includes('trabajador')

  const value = useMemo(() => ({
    session: authState?.session || null,
    user: authState?.user || null,
    profile: authState?.profile || null,
    isAuthenticated: Boolean(token),
    isAdmin,
    isWorker,
    canManageProducts: isAdmin || isWorker,
    loading,
    login,
    logout,
  }), [authState, roles, loading])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
