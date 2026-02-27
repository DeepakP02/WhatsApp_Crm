import { InboxService } from '../services/inbox.service.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response.js';

export const getConversations = async (req, res, next) => {
    try {
        const { conversations, total } = await InboxService.getConversations(req.query, req.user);
        const { page = 1, limit = 20 } = req.query;
        return paginatedResponse(res, conversations, page, limit, total);
    } catch (error) {
        next(error);
    }
};

export const getMessages = async (req, res, next) => {
    try {
        const messages = await InboxService.getMessages(req.params.id, req.user);
        return successResponse(res, messages);
    } catch (error) {
        if (error.message.includes('Forbidden') || error.message.includes('not found')) {
            return errorResponse(res, error.message, error.message.includes('Forbidden') ? 403 : 404);
        }
        next(error);
    }
};

export const sendMessage = async (req, res, next) => {
    try {
        const message = await InboxService.sendMessage(req.params.id, req.body.body, req.user);
        return successResponse(res, message, 'Message sent successfully', 201);
    } catch (error) {
        if (error.message.includes('Forbidden') || error.message.includes('not found')) {
            return errorResponse(res, error.message, error.message.includes('Forbidden') ? 403 : 404);
        }
        next(error);
    }
};

export const getUnreadCount = async (req, res, next) => {
    try {
        const count = await InboxService.getUnreadCount(req.user);
        return successResponse(res, count);
    } catch (error) {
        next(error);
    }
};
