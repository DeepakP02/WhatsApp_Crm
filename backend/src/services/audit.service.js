import prisma from '../config/prisma.js';
import { getPaginationOptions } from '../utils/pagination.js';

export class AuditService {
    static async getLogs(query, user) {
        const { page = 1, limit = 50, module, userId, dateFrom, dateTo } = query;
        const { take, skip } = getPaginationOptions(page, limit);
        const { ROLES } = await import('../constants/roles.js');

        const where = {};
        if (module) where.module = module;

        // Role-based access control for logs
        if (user.role === ROLES.TEAM_LEADER) {
            const team = await prisma.team.findFirst({ where: { leaderId: user.id } });
            if (team) {
                const teamMemberIds = await prisma.user.findMany({
                    where: { teamId: team.id },
                    select: { id: true }
                }).then(users => users.map(u => u.id));

                if (userId) {
                    if (teamMemberIds.includes(Number(userId))) {
                        where.userId = Number(userId);
                    } else {
                        where.userId = -1; // Unauthorized for this specific user's logs
                    }
                } else {
                    where.userId = { in: teamMemberIds };
                }
            } else {
                where.userId = -1; // No team leads
            }
        } else if (userId) {
            where.userId = Number(userId);
        }

        const [logs, total] = await Promise.all([
            prisma.auditLog.findMany({
                where,
                take,
                skip,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: { select: { id: true, name: true, role: true } }
                }
            }),
            prisma.auditLog.count({ where })
        ]);

        return { logs, total };
    }
}
