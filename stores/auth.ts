// stores/auth.ts
import { defineStore } from 'pinia'
import { useApi } from '@/composables/useApi'

interface User {
  id:                number;
  name:              string;
  email:             string;
  email_verified_at: Date;
  created_at:        Date;
  updated_at:        Date;
}

interface AuthState {
  user: User | null;
  access_token: string | null;
  token_type: string | null;
  expires_in: Date | null;
}

interface ErrorResponse {
  message: string;
  errors: any;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    access_token: null,
    token_type: null,
    expires_in: null,
  }),
  getters: {
    isAuthenticated: (): boolean => {
      const token = useCookie('accessToken')
      return !!token.value
    },
  },
  actions: {
    async login(email: string, password: string): Promise<void> {
      const payload = {
        email: email,
        password: password
      }
      const { data, error } = await useApi('/auth/login', {
        method: 'POST',
        body: payload,
      })

      if(data.value) {
        const accessToken = useCookie('accessToken')

        if (data.value && data.value.data) {
          const loginData = data.value.data as AuthState;
          this.user = loginData.user;
          accessToken.value = loginData.access_token;
        }
      }

      if (error.value) {
        const errorResponse: ErrorResponse = error.value.data;
        if(errorResponse.statusCode === 401) {
          throw errorResponse;
        }
        throw errorResponse;
      }
    },
    async logout(): Promise<void> {
      const token = useCookie('accessToken')
      token.value = null
      await useApi('/auth/logout', { method: 'POST' })
      this.user = null
      this.access_token = null
    },
    async fetchUser(): Promise<void> {
      const { data, error } = await useApi('/auth/me', {
        method: 'GET',
        immediateResponse: true
      })

      if(data.value) {
        this.user = data.value.data as User
      }
      
      if (error.value) {
        this.logout()
      }
    },
    async register(data: RegisterData): Promise<void> {
      const { data: response, error } = await useApi('/auth/register', {
        method: 'POST',
        body: data,
      })

      if(response.value) {
        const accessToken = useCookie('accessToken')

        if (response.value && response.value.data) {
          const loginData = response.value.data as AuthState;
          this.user = loginData.user;
          accessToken.value = loginData.access_token;
        }
      }

      if (error.value) {
        throw error.value.data;
      }
    },
  },
})
