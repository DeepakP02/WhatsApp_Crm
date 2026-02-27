import { CallService } from '../services/call.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const logCall = async (req, res, next) => {
    try {
        const callLog = await CallService.logCall(req.params.leadId, req.body, req.user);
        return successResponse(res, callLog, 'Call logged successfully', 201);
    } catch (error) {
        if (error.message.includes('Forbidden') || error.message.includes('not found')) {
            return errorResponse(res, error.message, error.message.includes('Forbidden') ? 403 : 404);
        }
        next(error);
    }
};

export const getCallLogs = async (req, res, next) => {
    try {
        const callLogs = await CallService.getCallLogs(req.params.leadId, req.user);
        return successResponse(res, callLogs);
    } catch (error) {
        if (error.message.includes('Forbidden') || error.message.includes('not found')) {
            return errorResponse(res, error.message, error.message.includes('Forbidden') ? 403 : 404);
        }
        next(error);
    }
};
export const getAllCallLogs = async (req, res, next) => {
    try {
        const callLogs = await CallService.getAllCallLogs(req.user);
        return successResponse(res, callLogs);
    } catch (error) {
        next(error);
    }
};
