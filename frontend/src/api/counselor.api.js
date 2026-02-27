import axios from './axios';

const counselorApi = {
    fetchDashboard: async () => {
        const response = await axios.get('/dashboard'); // Common dashboard endpoint, handles roles
        return response.data;
    },

    fetchLeads: async (params) => {
        const response = await axios.get('/leads', { params });
        return response.data;
    },

    updateStage: async (leadId, stage) => {
        const response = await axios.patch(`/leads/${leadId}/stage`, { stage });
        return response.data;
    },

    addNote: async (leadId, content) => {
        const response = await axios.post(`/leads/${leadId}/notes`, { content });
        return response.data;
    },

    fetchNotes: async (leadId) => {
        const response = await axios.get(`/leads/${leadId}/notes`);
        return response.data;
    },

    fetchAllNotes: async () => {
        const response = await axios.get('/leads/all/notes');
        return response.data;
    },

    fetchAllQualifications: async () => {
        const response = await axios.get('/leads/all/qualifications');
        return response.data;
    },

    fetchAllCalls: async () => {
        const response = await axios.get('/leads/all/calls');
        return response.data;
    },

    logCall: async (leadId, callData) => {
        const response = await axios.post(`/leads/${leadId}/calls`, callData);
        return response.data;
    }
};

export default counselorApi;
