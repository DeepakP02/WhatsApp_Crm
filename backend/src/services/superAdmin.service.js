import prisma from '../config/prisma.js';

export class SuperAdminService {
    static async getSummary() {
        const [totalLeads, totalRevenueData, activeUsers, activeChannels, convertedLeads] = await Promise.all([
            prisma.lead.count(),
            prisma.revenue.aggregate({
                _sum: { amount: true }
            }),
            prisma.user.count({
                where: { status: 'ACTIVE' }
            }),
            prisma.channels.count({
                where: { isActive: true }
            }),
            prisma.lead.count({
                where: { stage: 'CONVERTED' }
            })
        ]);

        const totalRevenue = totalRevenueData._sum.amount || 0;
        const globalConversionRate = totalLeads > 0
            ? ((convertedLeads / totalLeads) * 100).toFixed(2)
            : 0;

        return {
            totalLeads,
            totalRevenue,
            activeUsers,
            activeChannels,
            globalConversionRate: parseFloat(globalConversionRate)
        };
    }

    static async getActivity() {
        return await prisma.activityLog.findMany({
            take: 20,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { name: true, role: true }
                },
                lead: {
                    select: { name: true }
                }
            }
        });
    }

    static async getManualLeads() {
        return await prisma.lead.findMany({
            where: {
                stage: 'NEW',
                assignedToId: null
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    static async dispatchLead(data, adminId) {
        const { leadId, teamId, counselorId, priority } = data;

        return await prisma.$transaction(async (tx) => {
            const lead = await tx.lead.update({
                where: { id: parseInt(leadId) },
                data: {
                    assignedToId: counselorId ? parseInt(counselorId) : null,
                    stage: 'CONTACTED'
                }
            });

            await tx.activityLog.create({
                data: {
                    leadId: parseInt(leadId),
                    userId: adminId,
                    type: 'DISPATCH',
                    description: `Lead dispatched to counselor ${counselorId || 'None'} with priority ${priority || 'NORMAL'}`
                }
            });

            return lead;
        });
    }
}
