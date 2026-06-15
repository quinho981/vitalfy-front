import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/axios';
import Cookies from 'js-cookie'
import { useUserStore } from '@/stores/userStore'

export const authStore = defineStore('auth', () => {
    const token = ref(Cookies.get('token') || null)

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

            token.value = response.data.access_token
            Cookies.set('token', token.value)

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
        register,
        login,
        logout,
        forgotPassword,
        resetPassword,
        isAuthenticated
    }
})