import { errorResponse } from '../utils/response.js';

export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    if (err.name === 'PrismaClientKnownRequestError') {
        // Handle Prisma specific errors (e.g., unique constraint violations)
        if (err.code === 'P2002') {
            return errorResponse(res, 'Unique constraint failed', 400);
        }
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    return errorResponse(res, message, statusCode);
};
