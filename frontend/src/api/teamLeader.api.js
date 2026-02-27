import axios from './axios';

const teamLeaderApi = {
    fetchDashboard: async () => {
        const response = await axios.get('/team-leader/dashboard');
        return response.data;
    },

    fetchPerformance: async (filters) => {
        const response = await axios.get('/team-leader/performance', { params: filters });
        return response.data;
    },

    fetchSlaAlerts: async (filters) => {
        const response = await axios.get('/team-leader/sla-alerts', { params: filters });
        return response.data;
    },

    fetchActivityLogs: async (filters) => {
        const response = await axios.get('/audit', { params: filters });
        return response.data;
    },

    reassignLeads: async (leadIds, assignedToId) => {
        const response = await axios.post('/leads/bulk-assign', { leadIds, assignedToId });
        return response.data;
    },

    fetchTeamLeads: async (filters) => {
        const response = await axios.get('/leads', { params: filters });
        return response.data;
    }
};

export default teamLeaderApi;
