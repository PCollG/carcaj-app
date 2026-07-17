import { createContext, PropsWithChildren, use, useEffect, useState } from 'react'

import * as api from '@/lib/api'
import { deleteToken, getToken, setToken } from '@/lib/token-storage'

type AuthContextValue = {
  session: string | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (name: string, email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function SessionProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getToken().then((token) => {
      setSession(token)
      setIsLoading(false)
    })
  }, [])

  async function signIn(email: string, password: string) {
    const { token } = await api.login(email, password)
    await setToken(token)
    setSession(token)
  }

  async function signUp(name: string, email: string, password: string) {
    const { token } = await api.register(name, email, password)
    await setToken(token)
    setSession(token)
  }

  async function signOut() {
    await deleteToken()
    setSession(null)
  }

  return (
    <AuthContext value={{ session, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext>
  )
}

export function useSession() {
  const value = use(AuthContext)
  if (!value) {
    throw new Error('useSession must be used within a SessionProvider')
  }
  return value
}
