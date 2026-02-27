import api from './axios';

/**
 * Admin API Service
 * Connects the Frontend Admin Dashboard and management pages with backend APIs.
 */

// Channels
export const fetchChannelStats = async () => {
    const response = await api.get('/admin/channels');
    return response.data?.data || {};
};

export const connectChannel = async (type) => {
    const response = await api.post('/admin/channels/connect', { type });
    return response.data;
};

export const disconnectChannel = async (type) => {
    const response = await api.post('/admin/channels/disconnect', { type });
    return response.data;
};

// Teams
export const fetchTeams = async () => {
    const response = await api.get('/teams');
    return response.data?.data || [];
};

// Routing
export const fetchRoutingRules = async () => {
    const response = await api.get('/admin/routing');
    return response.data?.data || [];
};

export const createRoutingRule = async (data) => {
    const response = await api.post('/admin/routing', data);
    return response.data;
};

export const updateRoutingRule = async (id, data) => {
    const response = await api.put(`/admin/routing/${id}`, data);
    return response.data;
};

// User Management
export const fetchUsers = async () => {
    const response = await api.get('/admin/users');
    return response.data?.data || [];
};

export const createUser = async (data) => {
    const response = await api.post('/admin/users', data);
    return response.data;
};

export const updateUser = async (id, data) => {
    const response = await api.put(`/admin/users/${id}`, data);
    return response.data;
};

export const updateUserStatus = async (id, status) => {
    const response = await api.patch(`/admin/users/${id}/status`, { status });
    return response.data;
};

// AI Config
export const fetchAiConfig = async () => {
    const response = await api.get('/admin/ai-config');
    return response.data?.data || {};
};

export const updateAiConfig = async (data) => {
    const response = await api.put('/admin/ai-config', data);
    return response.data;
};

// Working Hours
export const fetchWorkingHours = async () => {
    const response = await api.get('/admin/working-hours');
    return response.data?.data || { schedule: [] };
};

export const updateWorkingHours = async (data) => {
    const response = await api.put('/admin/working-hours', data);
    return response.data;
};

// Templates
export const fetchTemplates = async (params) => {
    const response = await api.get('/admin/templates', { params });
    return response.data || { success: true, data: [] };
};

export const createTemplate = async (data) => {
    const response = await api.post('/admin/templates', data);
    return response.data;
};

export const updateTemplate = async (id, data) => {
    const response = await api.put(`/admin/templates/${id}`, data);
    return response.data;
};

export const deleteTemplate = async (id) => {
    const response = await api.delete(`/admin/templates/${id}`);
    return response.data;
};
