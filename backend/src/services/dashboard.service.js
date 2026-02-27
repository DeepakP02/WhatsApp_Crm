import prisma from '../config/prisma.js';
import { ROLES } from '../constants/roles.js';

export class DashboardService {
    static async getKpis(user) {
        switch (user.role) {
            case ROLES.SUPER_ADMIN:
                return this.getSuperAdminKpis();
            case ROLES.MANAGER:
                return this.getManagerKpis();
            case ROLES.TEAM_LEADER:
                return this.getTeamLeaderKpis(user.id);
            case ROLES.COUNSELOR:
                return this.getCounselorKpis(user.id);
            case ROLES.CUSTOMER_SUPPORT:
                return this.getSupportKpis();
            default:
                return {};
        }
    }

    static async getSuperAdminKpis() {
        const [totalUsers, totalLeads, activeChannels, totalTeams] = await Promise.all([
            prisma.user.count(),
            prisma.lead.count(),
            prisma.template.groupBy({ by: ['channel'] }).then(res => res.length), // Proxy for active channels
            prisma.team.count()
        ]);

        // Revenue calculation (mocked for now as billing structure is minimal)
        const revenueThisMonth = 84000;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const leadsToday = await prisma.lead.count({
            where: { createdAt: { gte: today } }
        });

        return { totalUsers, totalLeads, activeChannels, totalTeams, leadsToday, revenueThisMonth };
    }

    static async getManagerKpis() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [leadsToday, qualified, converted, enrolled, slaBreaches] = await Promise.all([
            prisma.lead.count({ where: { createdAt: { gte: today } } }),
            prisma.lead.count({ where: { stage: 'QUALIFIED' } }),
            prisma.lead.count({ where: { stage: 'CONVERTED' } }),
            prisma.lead.count({ where: { stage: 'ENROLLED' } }),
            prisma.slaStatus.count({ where: { isBreached: true } })
        ]);

        const conversionRate = leadsToday > 0 ? ((converted / leadsToday) * 100).toFixed(1) : 0;

        return { leadsToday, qualified, converted, enrolled, slaBreaches, conversionRate: Number(conversionRate) };
    }

    static async getTeamLeaderKpis(userId) {
        const team = await prisma.team.findFirst({ where: { leaderId: userId } });
        if (!team) return { teamLeads: 0, pendingReplies: 0, slaBreaches: 0, counselors: 0 };

        const teamUserIds = await prisma.user.findMany({
            where: { teamId: team.id },
            select: { id: true }
        }).then(users => users.map(u => u.id));

        const [teamLeads, slaBreaches, counselors] = await Promise.all([
            prisma.lead.count({ where: { assignedToId: { in: teamUserIds } } }),
            prisma.slaStatus.count({
                where: { isBreached: true, conversation: { lead: { assignedToId: { in: teamUserIds } } } }
            }),
            teamUserIds.length
        ]);

        const pendingReplies = await prisma.conversation.count({
            where: { lead: { assignedToId: { in: teamUserIds } }, unreadCount: { gt: 0 } }
        });

        return { teamLeads, pendingReplies, slaBreaches, counselors };
    }

    static async getCounselorKpis(userId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [assignedLeads, hotLeads, unreadMessages, followUpsToday] = await Promise.all([
            prisma.lead.count({ where: { assignedToId: userId } }),
            prisma.lead.count({
                where: { assignedToId: userId, qualification: { category: 'Hot' } }
            }),
            prisma.conversation.count({
                where: { lead: { assignedToId: userId }, unreadCount: { gt: 0 } }
            }),
            prisma.callLog.count({
                where: { userId, calledAt: { gte: today } }
            })
        ]);

        return { assignedLeads, hotLeads, followUpsToday, unreadMessages };
    }

    static async getSupportKpis() {
        const [newMessages, unassignedLeads, aiActiveChats] = await Promise.all([
            prisma.conversation.count({ where: { unreadCount: { gt: 0 } } }),
            prisma.lead.count({ where: { assignedToId: null } }),
            prisma.conversation.count({ where: { lastMessage: { startsWith: '[AI]' } } }) // Simple proxy for AI active
        ]);

        return { newMessages, unassignedLeads, aiActiveChats };
    }
}
