import api from '../api/axios';

const inboxService = {
    getConversations: async (params) => {
        const response = await api.get('/inbox/conversations', { params });
        return response.data;
    },

    getMessages: async (conversationId) => {
        const response = await api.get(`/inbox/conversations/${conversationId}/messages`);
        return response.data;
    },

    sendMessage: async (conversationId, body) => {
        const response = await api.post(`/inbox/conversations/${conversationId}/messages`, { body });
        return response.data;
    },

    getUnreadCount: async () => {
        const response = await api.get('/inbox/unread-count');
        return response.data;
    }
};

export default inboxService;
