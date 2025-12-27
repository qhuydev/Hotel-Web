import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import authApi from '../api/authApi.js'

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setAuth: (authData) => {
        localStorage.setItem('accessToken', authData.accessToken)
        localStorage.setItem('refreshToken', authData.refreshToken)

        set({
          user: authData.user,
          accessToken: authData.accessToken,
          refreshToken: authData.refreshToken,
          isAuthenticated: true,
          error: null,
        })
      },

      login: async (credentials) => {
  set({ isLoading: true, error: null })
  try {
    const response = await authApi.login(credentials)
    // response = { success, message, data }
    set(() => {
      return {}
    })
    // GỌI THẲNG
    useAuthStore.getState().setAuth(response.data)
    return { success: true }
  } catch (error) {
    const message =
      error.response?.data?.message || 'Login failed'
    set({ error: message })
    return { success: false, error: message }
  } finally {
    set({ isLoading: false })
  }
},


      register: async (userData) => {
  set({ isLoading: true, error: null })
  try {
    const response = await authApi.register(userData)
    useAuthStore.getState().setAuth(response.data)
    return { success: true }
  } catch (error) {
    const message =
      error.response?.data?.message || 'Registration failed'
    set({ error: message })
    return { success: false, error: message }
  } finally {
    set({ isLoading: false })
  }
},

      // Initialize auth state on app startup using refresh token
      initAuth: async () => {
        const refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken) return
        set({ isLoading: true, error: null })
        try {
          const response = await authApi.refreshToken(refreshToken)
          // response is { success, message, data }
          useAuthStore.getState().setAuth(response.data)
        } catch (err) {
          // Failed to refresh, clear tokens
          console.error('Auth refresh failed', err)
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          set({ error: null, user: null, accessToken: null, refreshToken: null, isAuthenticated: false })
        } finally {
          set({ isLoading: false })
        }
      },


      logout: () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
        })
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

export default useAuthStore
