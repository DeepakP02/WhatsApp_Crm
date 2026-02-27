import { errorResponse } from '../utils/response.js';
import { ROLES } from '../constants/roles.js';

export const authorize = (...allowedRoles) => {
    const roles = allowedRoles.flat();
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            console.warn('Authorization failed: No user or role found in request');
            return errorResponse(res, 'Unauthorized', 403);
        }

        // Super Admin has access to everything
        if (req.user.role === ROLES.SUPER_ADMIN) {
            console.log('[AUTH DEBUG] Super Admin bypass triggered');
            return next();
        }

        if (!roles.includes(req.user.role)) {
            console.warn(`Forbidden: User role ${req.user.role} not in allowed roles: ${roles.join(', ')}`);
            return errorResponse(res, 'Forbidden: Insufficient permissions', 403);
        }

        next();
    };
};
