import api from '../api/axios';

const analyticService = {
    getFunnelData: async (params) => {
        const response = await api.get('/analytics/funnel', { params });
        return response.data;
    },

    getCountryPerformance: async (params) => {
        const response = await api.get('/analytics/country', { params });
        return response.data;
    },

    getSlaReports: async (params) => {
        const response = await api.get('/analytics/sla', { params });
        return response.data;
    },

    getCounselorPerformance: async (params) => {
        const response = await api.get('/analytics/performance', { params });
        return response.data;
    }
};

export default analyticService;
