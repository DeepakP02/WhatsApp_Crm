import { TemplateService } from '../services/template.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getTemplates = async (req, res, next) => {
    try {
        const templates = await TemplateService.getTemplates(req.query.channel);
        return successResponse(res, templates);
    } catch (error) {
        next(error);
    }
};

export const createTemplate = async (req, res, next) => {
    try {
        const template = await TemplateService.createTemplate(req.body, req.user.id);
        return successResponse(res, template, 'Template created successfully', 201);
    } catch (error) {
        if (error.message.includes('already exists')) {
            return errorResponse(res, error.message, 400);
        }
        next(error);
    }
};

export const updateTemplate = async (req, res, next) => {
    try {
        const template = await TemplateService.updateTemplate(req.params.id, req.body);
        return successResponse(res, template, 'Template updated successfully');
    } catch (error) {
        if (error.message.includes('already exists') || error.message === 'Template not found') {
            return errorResponse(res, error.message, 400);
        }
        next(error);
    }
};

export const deleteTemplate = async (req, res, next) => {
    try {
        await TemplateService.softDeleteTemplate(req.params.id);
        return successResponse(res, null, 'Template deleted successfully');
    } catch (error) {
        next(error);
    }
};
