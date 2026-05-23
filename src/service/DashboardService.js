import api from '@/services/axios';
import Cookies from 'js-cookie';

export const DashboardService = {

    async summary(period = 'today') {
        const token = Cookies.get('token');

        try {
            const response = await api.get('/dashboard/summary', { 
                headers: { Authorization: `Bearer ${token}` },
                params: { period }
            });
            return response.data
        } catch (error) {
            console.error(error);
        }
    },
    async charts() {
        const token = Cookies.get('token');

        try {
            const response = await api.get('/dashboard/charts', { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            return response.data
        } catch (error) {
            console.error(error);
        }
    },
    async latestRecentTranscripts() {
        const token = Cookies.get('token');

        try {
            const response = await api.get('/dashboard/last-transcripts', { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            return response.data
        } catch (error) {
            console.error(error);
        }
    }
}