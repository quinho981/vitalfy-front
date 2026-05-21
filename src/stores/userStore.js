import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/axios';
import Cookies from 'js-cookie'

export const useUserStore = defineStore('user', () => {
    const userId = ref(Cookies.get('id') || null)
    const username = ref(Cookies.get('username') || null)
    const userEmail = ref(Cookies.get('user_email') || null)
    const userPhone = ref(Cookies.get('user_phone') || null)
    const plan = ref(Cookies.get('plan') || null)
    const active = ref(Cookies.get('active') || null)
    const remaining = ref(localStorage.getItem('remaining') || null)
    const recordingTourCompleted = ref(localStorage.getItem('recording_tour_completed') === 'true')

    const getUserInfo = async () => {
        const token = Cookies.get('token')
        try {
            const response = await api.get('/user', {
                headers: { Authorization: `Bearer ${token}` }
            })

            userId.value = response.data.user.id
            username.value = response.data.user.name
            userEmail.value = response.data.user.email
            userPhone.value = response.data.user.phone
            plan.value = response.data.plan.name
            active.value = response.data.plan.name !== 'Free'
            remaining.value = response.data.remaining
            recordingTourCompleted.value = response.data.user.recording_tour_completed || false

            Cookies.set('id', userId.value)
            Cookies.set('username', username.value)
            Cookies.set('user_email', userEmail.value)
            Cookies.set('user_phone', userPhone.value || '')
            Cookies.set('plan', plan.value)
            Cookies.set('active', active.value)
            localStorage.setItem('remaining', remaining.value)
            localStorage.setItem('recording_tour_completed', recordingTourCompleted.value)

            return response.data
        } catch (error) {
            console.error(error)
        }
    }

    const reset = () => {
        userId.value = null
        username.value = null
        userEmail.value = null
        userPhone.value = null
        plan.value = null
        active.value = null
        remaining.value = null
        recordingTourCompleted.value = false
    }

    return {
        userId,
        username,
        userEmail,
        userPhone,
        plan,
        active,
        remaining,
        recordingTourCompleted,
        getUserInfo,
        reset
    }
})