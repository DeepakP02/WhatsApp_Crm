import api from '../api/axios';

const leadService = {
    getLeads: async (params) => {
        const response = await api.get('/leads', { params });
        return response.data;
    },

    getLeadById: async (id) => {
        const response = await api.get(`/leads/${id}`);
        return response.data;
    },

    createLead: async (data) => {
        const response = await api.post('/leads', data);
        return response.data;
    },

    updateStage: async (id, stage) => {
        const response = await api.patch(`/leads/${id}/stage`, { stage });
        return response.data;
    },

    assignLead: async (id, userId) => {
        const response = await api.patch(`/leads/${id}/assign`, { userId });
        return response.data;
    },

    getNotes: async (leadId) => {
        const response = await api.get(`/leads/${leadId}/notes`);
        return response.data;
    },

    addNote: async (leadId, content) => {
        const response = await api.post(`/leads/${leadId}/notes`, { content });
        return response.data;
    },

    getCallLogs: async (leadId) => {
        const response = await api.get(`/leads/${leadId}/calls`);
        return response.data;
    },

    logCall: async (leadId, callData) => {
        const response = await api.post(`/leads/${leadId}/calls`, callData);
        return response.data;
    },

    getActivities: async (leadId) => {
        const response = await api.get(`/leads/${leadId}/activities`);
        return response.data;
    }
};

export default leadService;
