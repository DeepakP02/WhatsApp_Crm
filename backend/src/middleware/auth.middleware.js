import { verifyToken } from '../config/jwt.js';
import prisma from '../config/prisma.js';
import { errorResponse } from '../utils/response.js';

export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return errorResponse(res, 'Authentication required', 401);
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return errorResponse(res, 'Invalid token format', 401);
        }

        const decoded = verifyToken(token);
        console.log('[AUTH] Decoded Token:', decoded);
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, role: true, status: true, uuid: true, country: true }
        });

        if (!user) {
            return errorResponse(res, 'User not found', 401);
        }

        if (user.status !== 'ACTIVE') {
            return errorResponse(res, 'Account is inactive', 401);
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return errorResponse(res, 'Token expired', 401);
        }
        return errorResponse(res, 'Invalid token', 401);
    }
};
