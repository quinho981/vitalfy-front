import api from '@/services/axios';
import Cookies from 'js-cookie';

export const TranscriptsService = {
    async index(page = 1, perPage = 10) {
        const token = Cookies.get('token');
        try {
            const response = await api.get(`/user/transcripts?page=${page}&perPage=${perPage}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            return {
                transcripts: response.data.data,
                total: response.data.total,
                perPage: response.data.per_page
            };
        } catch (error) {
            console.error(error);
        }
    },
    store(formData) {
        const token = Cookies.get('token');
        try {
            const response = api.post(`/transcripts`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
            });

            return response;
        } catch (error) {
            console.error(error);
        }
    },
    storeAndGenerateDocument(formData) {
        const token = Cookies.get('token');
        try {
            const response = api.post(`/transcripts/generate-document`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
            });

            return response;
        } catch (error) {
            console.error(error);
        }
    },
    async show(id) {
        const token = Cookies.get('token');
        try {
            const response = await api.get(`/transcripts/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            return response.data;
        } catch (error) {
            console.error(error);
        }
    },
    delete(id) {
        const token = Cookies.get('token');
        try {
            const response = api.delete(`/transcripts/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            return response;
        } catch (error) {
            console.error(error);
        }
    },
    update(id, data) {
        const token = Cookies.get('token');
        try {
            const response = api.put(`/transcripts/${id}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            return response;
        } catch (error) {
            console.error(error);
        }
    },
    async getConversations(id) {
        const token = Cookies.get('token');
        try {
            const response = await api.get(`/transcripts/${id}/conversations`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            return response.data;
        } catch (error) {
            console.error(error);
        }
    },
    async filterTranscripts(user = null, date = null, type = null) {
        const token = Cookies.get('token');
        try {
            const response = await api.get(`/transcripts/user/filter`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: { user, date, type }
            });

            return response.data;
        } catch (error) {
            console.error(error);
        }
    },
    async regenerateInsights(documentId) {
        const token = Cookies.get('token');
        try {
            const response = await api.post(`/documents/${documentId}/regenerate-insights`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

}
