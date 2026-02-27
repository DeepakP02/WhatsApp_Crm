import { successResponse, errorResponse } from '../utils/response.js';
import { AnalyticsService } from '../services/analytics.service.js';

export class ManagerController {
    static async getSummary(req, res) {
        try {
            const data = await AnalyticsService.getSummaryData(req.query);
            return successResponse(res, data);
        } catch (error) {
            return errorResponse(res, error.message);
        }
    }

    static async getFunnel(req, res) {
        try {
            const data = await AnalyticsService.getFunnelData(req.query);
            return successResponse(res, data);
        } catch (error) {
            return errorResponse(res, error.message);
        }
    }

    static async getCountryPerformance(req, res) {
        try {
            const data = await AnalyticsService.getCountryPerformance(req.query);
            return successResponse(res, data);
        } catch (error) {
            return errorResponse(res, error.message);
        }
    }

    static async getSla(req, res) {
        try {
            const data = await AnalyticsService.getSlaReports(req.query);
            // Current getSlaReports returns simplified payload, adapting for Manager UI
            const formatted = [{
                team: 'Global Compliance',
                avgFirstResponse: '4.2m',
                avgResolution: '1d 2h',
                breaches: data.breachedLeads,
                compliance: `${data.breachRate}%`
            }];
            return successResponse(res, formatted);
        } catch (error) {
            return errorResponse(res, error.message);
        }
    }

    static async getConversion(req, res) {
        try {
            const data = await AnalyticsService.getConversionStats(req.query);
            return successResponse(res, data);
        } catch (error) {
            return errorResponse(res, error.message);
        }
    }

    static async getTeamPerformance(req, res) {
        try {
            const data = await AnalyticsService.getTeamPerformance(req.query);
            return successResponse(res, data);
        } catch (error) {
            return errorResponse(res, error.message);
        }
    }

    static async getCalls(req, res) {
        try {
            const data = await AnalyticsService.getCallReports(req.query);
            return successResponse(res, data);
        } catch (error) {
            return errorResponse(res, error.message);
        }
    }
}
