import api from './axios';

/**
 * Super Admin API Service
 */

export const fetchSuperAdminSummary = async () => {
    const response = await api.get('/super-admin/summary');
    return response.data?.data || {};
};

export const fetchSuperAdminActivity = async () => {
    const response = await api.get('/super-admin/activity');
    return response.data?.data || [];
};

export const fetchGlobalUsers = async () => {
    const response = await api.get('/super-admin/users');
    return response.data?.data || [];
};

export const createUser = async (data) => {
    const response = await api.post('/super-admin/users', data);
    return response.data;
};

export const updateUser = async (id, data) => {
    const response = await api.put(`/super-admin/users/${id}`, data);
    return response.data;
};

export const updateUserStatus = async (id, status) => {
    const response = await api.patch(`/super-admin/users/${id}/status`, { status });
    return response.data;
};

export const fetchAuditLogs = async (params) => {
    const response = await api.get('/super-admin/audit-logs', { params });
    return response.data?.data || { logs: [], total: 0 };
};

export const dispatchLead = async (data) => {
    const response = await api.post('/super-admin/dispatch', data);
    return response.data;
};

export const fetchManualLeads = async () => {
    const response = await api.get('/super-admin/manual-leads');
    return response.data?.data || [];
};
