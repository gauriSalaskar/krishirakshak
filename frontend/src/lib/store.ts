import { create } from 'zustand'
import { authAPI } from './api'
import { User } from '../types'

interface AuthStore {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  loadFromStorage: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  loadFromStorage: () => {
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')
    if (token && userStr) {
      set({ token, user: JSON.parse(userStr), isAuthenticated: true })
    }
  },

  login: async (email, password) => {
    const res = await authAPI.login(email, password)
    const { access_token, user } = res.data
    localStorage.setItem('token', access_token)
    localStorage.setItem('user', JSON.stringify(user))
    set({ token: access_token, user, isAuthenticated: true })
  },

  register: async (name, email, password) => {
    const res = await authAPI.register(name, email, password)
    const { access_token, user } = res.data
    localStorage.setItem('token', access_token)
    localStorage.setItem('user', JSON.stringify(user))
    set({ token: access_token, user, isAuthenticated: true })
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ token: null, user: null, isAuthenticated: false })
  },
}))
