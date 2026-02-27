import api from './axios';

/**
 * Manager API Service
 * Connects the Manager Dashboard and reporting pages with backend APIs.
 */

export const fetchManagerSummary = async () => {
    const response = await api.get('/manager/summary');
    return response.data?.data || { leadsToday: 0, qualified: 0, converted: 0, enrolled: 0 };
};

export const fetchManagerFunnel = async () => {
    const response = await api.get('/manager/funnel');
    return response.data?.data || [];
};

export const fetchCountryPerformance = async () => {
    const response = await api.get('/manager/country-performance');
    return response.data?.data || [];
};

export const fetchSlaMetrics = async () => {
    const response = await api.get('/manager/sla');
    return response.data?.data || [];
};

export const fetchConversionStats = async () => {
    const response = await api.get('/manager/conversion');
    return response.data?.data || [];
};

export const fetchTeamPerformance = async () => {
    const response = await api.get('/manager/team-performance');
    return response.data?.data || [];
};

export const fetchCallReports = async () => {
    const response = await api.get('/manager/calls');
    return response.data?.data || [];
};

export const exportManagerReport = async (type) => {
    // This would typically return a blob or a URL to download
    const response = await api.get(`/manager/export/${type}`, { responseType: 'blob' });
    return response.data;
};
