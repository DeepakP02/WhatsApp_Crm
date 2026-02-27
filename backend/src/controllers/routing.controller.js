import { RoutingService } from '../services/routing.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getRules = async (req, res, next) => {
    try {
        const rules = await RoutingService.getRules();
        return successResponse(res, rules);
    } catch (error) {
        next(error);
    }
};

export const createRule = async (req, res, next) => {
    try {
        const rule = await RoutingService.createRule(req.body);
        return successResponse(res, rule, 'Routing rule created', 201);
    } catch (error) {
        if (error.message.includes('already exists') || error.message === 'Team not found') {
            return errorResponse(res, error.message, 400);
        }
        next(error);
    }
};

export const updateRule = async (req, res, next) => {
    try {
        const rule = await RoutingService.updateRule(req.params.id, req.body);
        return successResponse(res, rule, 'Routing rule updated');
    } catch (error) {
        if (error.message.includes('already exists') || error.message.includes('not found')) {
            return errorResponse(res, error.message, 400);
        }
        next(error);
    }
};

export const deleteRule = async (req, res, next) => {
    try {
        await RoutingService.deleteRule(req.params.id);
        return successResponse(res, null, 'Routing rule deleted');
    } catch (error) {
        if (error.code === 'P2025') {
            return errorResponse(res, 'Routing rule not found', 404);
        }
        next(error);
    }
};

export const runRouting = async (req, res, next) => {
    try {
        const result = await RoutingService.runRouting();
        return successResponse(res, result, `Successfully routed ${result.routed} leads`);
    } catch (error) {
        next(error);
    }
};
