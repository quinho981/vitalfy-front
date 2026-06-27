import api from '@/services/axios';
import Cookies from 'js-cookie';

// TODO: Mudar para documentService
export const AnamneseService = {

    async generator(payload) {
        const token = Cookies.get('token');
        try {
            const response = await api.post('/documents/generate', payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },
    async refine(payload) {
        const token = Cookies.get('token');
        try {
            const response = await api.post('/documents/refine', payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            return response.data;
        } catch (error) {
            throw error
        }
    },
    async generatePdf(documentId) {
        const token = Cookies.get('token');
        try {
            const response = await api.get(`/documents/${documentId}/pdf`, { 
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });
            
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },
    async update(documentId, content) {
        const token = Cookies.get('token');
        try {
            const response = await api.put(`/documents/${documentId}`, content, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
}