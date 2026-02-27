import prisma from '../config/prisma.js';

export const auditAction = (moduleName) => {
    return async (req, res, next) => {
        // Capture the original send to log after response is sent
        const originalSend = res.json;
        res.json = function (body) {
            res.json = originalSend;

            // Only log successful modifications (POST, PUT, PATCH, DELETE)
            if (res.statusCode >= 200 && res.statusCode < 300 && req.method !== 'GET') {
                // Fire and forget auditing
                prisma.auditLog.create({
                    data: {
                        userId: req.user.id,
                        action: `${req.method}_${moduleName}`.toUpperCase(),
                        module: moduleName,
                        ip: req.ip || req.connection.remoteAddress,
                        userAgent: req.get('user-agent'),
                        detail: `Path: ${req.originalUrl}`
                    }
                }).catch(err => console.error('Audit log failed:', err));
            }

            return res.json(body);
        };
        next();
    };
};
