import prisma from '../config/prisma.js';
import { LeadService } from './lead.service.js';

export class CallService {
    static async logCall(leadId, data, user) {
        // Lead permission check (handled inside LeadService)
        await LeadService.getLeadById(leadId, user);

        const callLog = await prisma.callLog.create({
            data: {
                ...data,
                leadId: Number(leadId),
                userId: user.id
            }
        });

        // Add activity for the call
        await prisma.activityLog.create({
            data: {
                leadId: Number(leadId),
                userId: user.id,
                type: 'CALL_LOGGED',
                description: `Call logged with outcome: ${data.outcome || 'N/A'}`
            }
        });

        return callLog;
    }

    static async getCallLogs(leadId, user) {
        await LeadService.getLeadById(leadId, user);

        return prisma.callLog.findMany({
            where: { leadId: Number(leadId) },
            orderBy: { calledAt: 'desc' },
            include: {
                user: { select: { id: true, name: true } }
            }
        });
    }

    static async getAllCallLogs(user) {
        const { ROLES } = await import('../constants/roles.js');
        const where = {
            lead: {}
        };

        if (user.role === ROLES.COUNSELOR) {
            where.lead.assignedToId = user.id;
        } else if (user.role === ROLES.TEAM_LEADER) {
            const team = await prisma.team.findFirst({ where: { leaderId: user.id } });
            if (team) {
                const teamMemberIds = await prisma.user.findMany({
                    where: { teamId: team.id },
                    select: { id: true }
                }).then(users => users.map(u => u.id));
                where.lead.assignedToId = { in: teamMemberIds };
            }
        }

        return prisma.callLog.findMany({
            where,
            orderBy: { calledAt: 'desc' },
            include: {
                user: { select: { id: true, name: true } },
                lead: { select: { id: true, name: true } }
            }
        });
    }
}
