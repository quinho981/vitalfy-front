import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/axios';
import Cookies from 'js-cookie'
import { useUserStore } from '@/stores/userStore'

const REMEMBER_DAYS = 30

export const authStore = defineStore('auth', () => {
    const token    = ref(Cookies.get('token') || null)
    const remember = ref(Cookies.get('remember') === 'true')

    const register = async (payload) => {
        try {
            const response = await api.post('/register', payload)
            return response.data
        } catch (error) {
            return Promise.reject(error)
        }
    }

    const login = async (payload) => {
        try {
            const response = await api.post('/login', payload)
            const { access_token, remember: rememberMe } = response.data

            token.value    = access_token
            remember.value = rememberMe

            const cookieOptions = rememberMe ? { expires: REMEMBER_DAYS } : {}
            Cookies.set('token',    access_token,       cookieOptions)
            Cookies.set('remember', String(rememberMe), cookieOptions)

            return response.data
        } catch (error) {
            return Promise.reject(error)
        }
    }

    const logout = async () => {
        const userStore = useUserStore()
        const authToken = Cookies.get('token')

        try {
            const response = await api.post('/logout', null, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            })

            token.value = null
            userStore.reset()

            Cookies.remove('id')
            Cookies.remove('token')
            Cookies.remove('remember')
            Cookies.remove('username')
            Cookies.remove('user_email')
            Cookies.remove('user_phone')
            Cookies.remove('plan')
            Cookies.remove('active')
            
            return response.data
        } catch (error) {
            return Promise.reject(error)
        }
    }

    const setToken = (value, rememberMe = true) => {
        token.value    = value
        remember.value = rememberMe
        const cookieOptions = rememberMe ? { expires: REMEMBER_DAYS } : {}
        Cookies.set('token',    value,              cookieOptions)
        Cookies.set('remember', String(rememberMe), cookieOptions)
    }

    const forgotPassword = async (email) => {
        const response = await api.post('/forgot-password', { email })
        return response.data
    }

    const resetPassword = async (payload) => {
        const response = await api.post('/reset-password', payload)
        return response.data
    }

    const isAuthenticated = computed(() => !!token.value)

    return {
        token,
        remember,
        register,
        login,
        logout,
        setToken,
        forgotPassword,
        resetPassword,
        isAuthenticated
    }
})