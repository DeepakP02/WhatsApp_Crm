import { AuditService } from '../services/audit.service.js';
import { paginatedResponse } from '../utils/response.js';

export const getAuditLogs = async (req, res, next) => {
    try {
        const { logs, total } = await AuditService.getLogs(req.query, req.user);
        const { page = 1, limit = 50 } = req.query;
        return paginatedResponse(res, logs, page, limit, total);
    } catch (error) {
        next(error);
    }
};
