import { AnalyticsService } from '../services/analytics.service.js';
import { successResponse } from '../utils/response.js';

export const getFunnelData = async (req, res, next) => {
    try {
        const result = await AnalyticsService.getFunnelData(req.query);
        return successResponse(res, result);
    } catch (error) {
        next(error);
    }
};

export const getCountryPerformance = async (req, res, next) => {
    try {
        const result = await AnalyticsService.getCountryPerformance(req.query);
        return successResponse(res, result);
    } catch (error) {
        next(error);
    }
};

export const getSlaReports = async (req, res, next) => {
    try {
        const result = await AnalyticsService.getSlaReports(req.query);
        return successResponse(res, result);
    } catch (error) {
        next(error);
    }
};

export const getCounselorPerformance = async (req, res, next) => {
    try {
        const result = await AnalyticsService.getCounselorPerformance(req.query, req.user);
        return successResponse(res, result);
    } catch (error) {
        next(error);
    }
};
