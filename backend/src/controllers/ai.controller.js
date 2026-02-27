import { AiService } from '../services/ai.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getSummary = async (req, res, next) => {
    try {
        const summary = await AiService.getSummary(req.params.leadId, req.user);
        return successResponse(res, summary);
    } catch (error) {
        if (error.message.includes('Forbidden') || error.message.includes('not found')) {
            return errorResponse(res, error.message, error.message.includes('Forbidden') ? 403 : 404);
        }
        next(error);
    }
};

export const qualifyLead = async (req, res, next) => {
    try {
        const qualification = await AiService.qualifyLead(req.params.leadId, req.body, req.user);
        return successResponse(res, qualification, 'Lead qualified by AI', 201);
    } catch (error) {
        if (error.message.includes('Forbidden') || error.message.includes('not found')) {
            return errorResponse(res, error.message, error.message.includes('Forbidden') ? 403 : 404);
        }
        next(error);
    }
};
