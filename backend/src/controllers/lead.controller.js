import { LeadService } from '../services/lead.service.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response.js';

export const getLeads = async (req, res, next) => {
    try {
        const { leads, total } = await LeadService.getLeads(req.user, req.query);
        const { page = 1, limit = 20 } = req.query;
        return paginatedResponse(res, leads, page, limit, total);
    } catch (error) {
        next(error);
    }
};

export const getLeadById = async (req, res, next) => {
    try {
        const lead = await LeadService.getLeadById(req.params.id, req.user);
        return successResponse(res, lead);
    } catch (error) {
        if (error.message.includes('Forbidden') || error.message.includes('not found')) {
            return errorResponse(res, error.message, error.message.includes('Forbidden') ? 403 : 404);
        }
        next(error);
    }
};

export const createLead = async (req, res, next) => {
    try {
        const lead = await LeadService.createLead(req.body, req.user);
        return successResponse(res, lead, 'Lead created successfully', 201);
    } catch (error) {
        next(error);
    }
};

export const updateLead = async (req, res, next) => {
    try {
        const lead = await LeadService.updateLead(req.params.id, req.body, req.user);
        return successResponse(res, lead, 'Lead updated successfully');
    } catch (error) {
        if (error.message.includes('Forbidden') || error.message.includes('not found')) {
            return errorResponse(res, error.message, error.message.includes('Forbidden') ? 403 : 404);
        }
        next(error);
    }
};

export const updateStage = async (req, res, next) => {
    try {
        const lead = await LeadService.updateStage(req.params.id, req.body.stage, req.user);
        return successResponse(res, lead, 'Lead stage updated');
    } catch (error) {
        if (error.message.includes('Forbidden') || error.message.includes('not found')) {
            return errorResponse(res, error.message, error.message.includes('Forbidden') ? 403 : 404);
        }
        if (error.code === 'P2025') return errorResponse(res, 'Lead not found', 404);
        next(error);
    }
};

export const assignLead = async (req, res, next) => {
    try {
        const lead = await LeadService.assignLead(req.params.id, req.body.assignedToId, req.user);
        return successResponse(res, lead, 'Lead assigned successfully');
    } catch (error) {
        if (error.message.includes('not found')) {
            return errorResponse(res, error.message, 404);
        }
        next(error);
    }
};

export const bulkAssign = async (req, res, next) => {
    try {
        const result = await LeadService.bulkAssign(req.body.leadIds, req.body.assignedToId, req.user);
        return successResponse(res, result, `Successfully assigned ${result.updatedCount} leads`);
    } catch (error) {
        if (error.message.includes('not found')) {
            return errorResponse(res, error.message, 404);
        }
        next(error);
    }
};

export const getLeadActivities = async (req, res, next) => {
    try {
        const activities = await LeadService.getLeadActivities(req.params.id, req.user);
        return successResponse(res, activities);
    } catch (error) {
        if (error.message.includes('Forbidden') || error.message.includes('not found')) {
            return errorResponse(res, error.message, error.message.includes('Forbidden') ? 403 : 404);
        }
        next(error);
    }
};
export const getQualifications = async (req, res, next) => {
    try {
        const qualifications = await LeadService.getQualifications(req.user);
        return successResponse(res, qualifications);
    } catch (error) {
        next(error);
    }
};
