import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getCurrentUsuario, getUserRoles } from '../services/usuarioApi.js'
import { obtenerCarrito } from '../services/cartApi.js'

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
  const [cartCount, setCartCount] = useState(0)

  const token = authState?.session?.access_token

  const computeCartCountFromItems = useCallback((items) => {
    if (!Array.isArray(items)) return 0

    // Queremos contar productos distintos en el carrito, no la suma de cantidades.
    // Preferimos id_producto si existe; si no, usamos id del item.
    const unique = new Set()
    for (const item of items) {
      const key = item?.id_producto ?? item?.id
      if (key !== null && key !== undefined) unique.add(String(key))
    }
    return unique.size
  }, [])

  const normalizeCartPayloadToItems = useCallback((payload) => {
    if (!payload) return []
    if (Array.isArray(payload)) return payload
    if (Array.isArray(payload.items)) return payload.items
    if (Array.isArray(payload.data)) return payload.data
    if (Array.isArray(payload.carrito)) return payload.carrito
    return []
  }, [])

  const refreshCartCount = useCallback(async (itemsOverride = null) => {
    // Permite que páginas como Cart actualicen el contador sin otro request
    if (Array.isArray(itemsOverride)) {
      setCartCount(computeCartCountFromItems(itemsOverride))
      return
    }

    const userId = authState?.profile?.id
    if (!token || !userId) {
      setCartCount(0)
      return
    }

    try {
      const payload = await obtenerCarrito(token, userId)
      const items = normalizeCartPayloadToItems(payload)
      setCartCount(computeCartCountFromItems(items))
    } catch {
      // No bloquear la UI del header si falla el conteo
      setCartCount(0)
    }
  }, [authState?.profile?.id, computeCartCountFromItems, normalizeCartPayloadToItems, token])

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

  // Conteo carrito
  useEffect(() => {
    if (!token) {
      setCartCount(0)
      return
    }

    let active = true

    ;(async () => {
      try {
        if (!active) return
        await refreshCartCount()
      } catch {
        // noop
      }
    })()

    return () => { active = false }
  }, [token, authState?.profile?.id, refreshCartCount])

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
    setCartCount(0)
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
    cartCount,
    refreshCartCount,
    loading,
    login,
    logout,
  }), [authState, roles, loading, token, isAdmin, isWorker, cartCount, refreshCartCount])

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
