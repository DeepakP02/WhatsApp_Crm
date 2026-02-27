import { AuthService } from '../services/auth.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await AuthService.login(email, password);
        return successResponse(res, result);
    } catch (error) {
        if (error.message === 'Invalid credentials' || error.message === 'Account inactive') {
            return errorResponse(res, error.message, 401);
        }
        next(error);
    }
};

export const getProfile = async (req, res, next) => {
    try {
        const profile = await AuthService.getProfile(req.user.id);
        return successResponse(res, profile);
    } catch (error) {
        next(error);
    }
};

export const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        await AuthService.changePassword(req.user.id, currentPassword, newPassword);
        return successResponse(res, null, 'Password updated successfully');
    } catch (error) {
        if (error.message === 'Incorrect current password') {
            return errorResponse(res, error.message, 400);
        }
        next(error);
    }
};
