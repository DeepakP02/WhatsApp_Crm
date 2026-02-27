import { DashboardService } from '../services/dashboard.service.js';
import { successResponse } from '../utils/response.js';

export const getKpis = async (req, res, next) => {
    try {
        const kpis = await DashboardService.getKpis(req.user);
        return successResponse(res, kpis);
    } catch (error) {
        next(error);
    }
};
