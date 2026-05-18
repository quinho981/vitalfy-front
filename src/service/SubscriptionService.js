import api from '@/services/axios';
import Cookies from 'js-cookie';

export const SubscriptionService = {
    async getSubscription() {
        const token = Cookies.get('token');
        try {
            const response = await api.get('/subscription', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching subscription:', error);
            throw error;
        }
    },

    async verifyCheckout(sessionId) {
        const token = Cookies.get('token');
        try {
            const response = await api.get('/subscription/verify-checkout', {
                params: { session_id: sessionId },
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error verifying checkout:', error);
            throw error;
        }
    },

    async createCheckout(plan) {
        const token = Cookies.get('token');
        try {
            const response = await api.post('/subscription/checkout', { plan }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating checkout:', error);
            throw error;
        }
    },

    async cancelSubscription() {
        const token = Cookies.get('token');
        try {
            const response = await api.post('/subscription/cancel', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error cancelling subscription:', error);
            throw error;
        }
    },
};
