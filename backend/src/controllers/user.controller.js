import { UserService } from '../services/user.service.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response.js';

export const getUsers = async (req, res, next) => {
    try {
        const { users, total } = await UserService.getUsers(req.query);
        const { page = 1, limit = 20 } = req.query;
        return paginatedResponse(res, users, page, limit, total);
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

export const getUserById = async (req, res, next) => {
    try {
        const user = await UserService.getUserById(req.params.id);
        return successResponse(res, user);
    } catch (error) {
        if (error.message === 'User not found') return errorResponse(res, error.message, 404);
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

export const updateStatus = async (req, res, next) => {
    try {
        await UserService.updateStatus(req.params.id, req.body.status);
        return successResponse(res, null, 'User status updated');
    } catch (error) {
        next(error);
    }
};
