import { BillingService } from '../services/billing.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getPlans = async (req, res, next) => {
    try {
        const plans = await BillingService.getPlans();
        return successResponse(res, plans);
    } catch (error) {
        next(error);
    }
};

export const createPlan = async (req, res, next) => {
    try {
        const plan = await BillingService.createPlan(req.body);
        return successResponse(res, plan, 'Billing plan created', 201);
    } catch (error) {
        next(error);
    }
};

export const updatePlan = async (req, res, next) => {
    try {
        const plan = await BillingService.updatePlan(req.params.id, req.body);
        return successResponse(res, plan, 'Billing plan updated');
    } catch (error) {
        if (error.code === 'P2025') return errorResponse(res, 'Plan not found', 404);
        next(error);
    }
};

export const getSubscriptions = async (req, res, next) => {
    try {
        const subscriptions = await BillingService.getSubscriptions();
        return successResponse(res, subscriptions);
    } catch (error) {
        next(error);
    }
};
