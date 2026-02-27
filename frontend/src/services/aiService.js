import api from '../api/axios';

const aiService = {
    getSummary: async (leadId) => {
        const response = await api.get(`/ai/${leadId}/summary`);
        return response.data;
    },

    qualifyLead: async (leadId, data) => {
        const response = await api.post(`/ai/${leadId}/qualify`, data);
        return response.data;
    }
};

export default aiService;
