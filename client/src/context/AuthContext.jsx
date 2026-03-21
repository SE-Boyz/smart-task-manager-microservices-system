import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { ApiError, getProfile } from '../lib/api.js'
import { clearStoredToken, getStoredToken, storeToken } from '../lib/storage.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredToken())
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(Boolean(getStoredToken()))

  useEffect(() => {
    let ignore = false

    async function loadProfile() {
      if (!token) {
        setUser(null)
        setIsLoading(false)
        return
      }

      setIsLoading(true)

      try {
        const profile = await getProfile()

        if (!ignore) {
          setUser(profile)
        }
      } catch (error) {
        if (!ignore) {
          const shouldClearSession =
            error instanceof ApiError && (error.status === 401 || error.status === 403)

          if (shouldClearSession) {
            clearStoredToken()
            setToken(null)
            setUser(null)
          }
        }
      } finally {
        if (!ignore) {
          setIsLoading(false)
        }
      }
    }

    loadProfile()

    return () => {
      ignore = true
    }
  }, [token])

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      isLoading,
      async login(nextToken) {
        storeToken(nextToken)
        setToken(nextToken)
      },
      logout() {
        clearStoredToken()
        setToken(null)
        setUser(null)
      },
      async refreshProfile() {
        const profile = await getProfile()
        setUser(profile)
        return profile
      },
    }),
    [token, user, isLoading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
