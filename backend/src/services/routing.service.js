import prisma from '../config/prisma.js';

export class RoutingService {
    static async getRules() {
        return prisma.routingRule.findMany({
            include: {
                team: { select: { id: true, name: true, leaderId: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    static async createRule(data) {
        if (data.isActive !== false) {
            const existingActive = await prisma.routingRule.findFirst({
                where: { country: data.country, isActive: true }
            });
            if (existingActive) {
                throw new Error(`An active routing rule for country '${data.country}' already exists. Please deactivate it first.`);
            }
        }

        const team = await prisma.team.findUnique({ where: { id: data.teamId } });
        if (!team) throw new Error('Team not found');

        return prisma.routingRule.create({ data });
    }

    static async updateRule(id, data) {
        const rule = await prisma.routingRule.findUnique({ where: { id: Number(id) } });
        if (!rule) throw new Error('Routing rule not found');

        if (data.isActive) {
            const countryToMerge = data.country || rule.country;
            const existingActive = await prisma.routingRule.findFirst({
                where: { country: countryToMerge, isActive: true, id: { not: Number(id) } }
            });
            if (existingActive) {
                throw new Error(`An active routing rule for country '${countryToMerge}' already exists. Please deactivate it first.`);
            }
        }

        if (data.teamId) {
            const team = await prisma.team.findUnique({ where: { id: data.teamId } });
            if (!team) throw new Error('Team not found');
        }

        return prisma.routingRule.update({
            where: { id: Number(id) },
            data
        });
    }

    static async deleteRule(id) {
        return prisma.routingRule.delete({ where: { id: Number(id) } });
    }

    /**
     * Assigns leads without an owner based on the routing rules
     */
    static async runRouting() {
        const unassignedLeads = await prisma.lead.findMany({
            where: { assignedToId: null, status: 'ACTIVE' }
        });

        if (unassignedLeads.length === 0) return { routed: 0 };

        const rules = await prisma.routingRule.findMany();
        let routedCount = 0;

        for (const lead of unassignedLeads) {
            const rule = rules.find(r => r.country.toLowerCase() === lead.country.toLowerCase());

            if (rule) {
                let assignedToId = null;

                const teamMembers = await prisma.user.findMany({
                    where: { teamId: rule.teamId, status: 'ACTIVE', role: 'COUNSELOR' },
                    select: { id: true }
                });

                if (teamMembers.length > 0) {
                    if (rule.strategy === 'LOAD_BASED') {
                        // Find counselor with fewest ACTIVE leads
                        const leadCounts = await Promise.all(
                            teamMembers.map(async (member) => {
                                const count = await prisma.lead.count({ where: { assignedToId: member.id, status: 'ACTIVE' } });
                                return { id: member.id, count };
                            })
                        );
                        leadCounts.sort((a, b) => a.count - b.count);
                        assignedToId = leadCounts[0].id;
                    } else {
                        // ROUND_ROBIN - Pick counselor who was assigned a lead the longest time ago
                        const assignments = await Promise.all(
                            teamMembers.map(async (member) => {
                                const lastActivity = await prisma.activityLog.findFirst({
                                    where: { userId: member.id, type: 'ASSIGNMENT' },
                                    orderBy: { createdAt: 'desc' },
                                    select: { createdAt: true }
                                });
                                return { id: member.id, lastAssigned: lastActivity?.createdAt || new Date(0) };
                            })
                        );
                        assignments.sort((a, b) => a.lastAssigned - b.lastAssigned);
                        assignedToId = assignments[0].id;
                    }

                    if (assignedToId) {
                        await prisma.lead.update({
                            where: { id: lead.id },
                            data: { assignedToId }
                        });

                        // Log Assignment Activity
                        await prisma.activityLog.create({
                            data: {
                                leadId: lead.id,
                                userId: assignedToId, // In context of system routing
                                type: 'ASSIGNMENT',
                                description: `Automatically routed to user ID ${assignedToId} via routing rules`
                            }
                        });

                        routedCount++;
                    }
                }
            }
        }

        return { routed: routedCount };
    }
}
