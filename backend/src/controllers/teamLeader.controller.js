import { AnalyticsService } from '../services/analytics.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

export class TeamLeaderController {
    static async getPerformance(req, res) {
        try {
            const data = await AnalyticsService.getCounselorPerformance(req.query, req.user);
            // Map to frontend format
            const formatted = data.map(p => ({
                id: p.counselorId,
                counselor: p.counselorName,
                totalLeads: p.total,
                replies: Math.floor(p.total * 0.8), // Proxy
                conversions: p.converted,
                avgResponse: '2.4m', // Proxy
                activeConv: Math.floor(p.total * 0.3) // Proxy
            }));
            return successResponse(res, formatted);
        } catch (error) {
            return errorResponse(res, error.message);
        }
    }

    static async getSlaAlerts(req, res) {
        try {
            const data = await AnalyticsService.getSlaAlerts(req.query, req.user);
            return successResponse(res, data);
        } catch (error) {
            return errorResponse(res, error.message);
        }
    }

    static async getDashboardSummary(req, res) {
        try {
            const data = await AnalyticsService.getTeamSummary(req.query, req.user);
            return successResponse(res, data);
        } catch (error) {
            return errorResponse(res, error.message);
        }
    }
}
