import { validationResult } from 'express-validator';
import { errorResponse } from '../utils/response.js';

export const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return errorResponse(res, errors.array()[0].msg, 400);
    }
    next();
};
