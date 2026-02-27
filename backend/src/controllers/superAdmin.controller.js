import { SuperAdminService } from '../services/superAdmin.service.js';
import { UserService } from '../services/user.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getSummary = async (req, res, next) => {
    try {
        const data = await SuperAdminService.getSummary();
        return successResponse(res, data);
    } catch (error) {
        next(error);
    }
};

export const getActivity = async (req, res, next) => {
    try {
        const data = await SuperAdminService.getActivity();
        return successResponse(res, data);
    } catch (error) {
        next(error);
    }
};

export const getUsers = async (req, res, next) => {
    try {
        const data = await UserService.getUsers(req.query);
        return successResponse(res, data);
    } catch (error) {
        next(error);
    }
};

export const createUser = async (req, res, next) => {
    try {
        const user = await UserService.createUser(req.body);
        return successResponse(res, user, 'User created successfully', 201);
    } catch (error) {
        if (error.message === 'Email already exists') {
            return errorResponse(res, error.message, 400);
        }
        next(error);
    }
};

export const updateUser = async (req, res, next) => {
    try {
        const user = await UserService.updateUser(req.params.id, req.body);
        return successResponse(res, user, 'User updated successfully');
    } catch (error) {
        next(error);
    }
};

export const updateUserStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const user = await UserService.updateStatus(req.params.id, status);
        return successResponse(res, user, `User ${status.toLowerCase()} successfully`);
    } catch (error) {
        next(error);
    }
};

export const getManualLeads = async (req, res, next) => {
    try {
        const data = await SuperAdminService.getManualLeads();
        return successResponse(res, data);
    } catch (error) {
        next(error);
    }
};

export const dispatchLead = async (req, res, next) => {
    try {
        const data = await SuperAdminService.dispatchLead(req.body, req.user.id);
        return successResponse(res, data, 'Lead dispatched successfully');
    } catch (error) {
        next(error);
    }
};

export const getAuditLogs = async (req, res, next) => {
    try {
        const { AuditService } = await import('../services/audit.service.js');
        const { logs, total } = await AuditService.getLogs(req.query, req.user);
        return successResponse(res, { logs, total });
    } catch (error) {
        next(error);
    }
};
