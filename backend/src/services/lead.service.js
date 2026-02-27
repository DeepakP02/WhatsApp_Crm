import prisma from '../config/prisma.js';
import { getPaginationOptions } from '../utils/pagination.js';
import { ROLES } from '../constants/roles.js';

export class LeadService {
    /**
     * Builds query where clause based on user role
     */
    static async _buildRoleBasedWhere(user, filters) {
        const where = {};
        const { stage, country, assignedTo, search, unassigned } = filters;

        if (stage) where.stage = stage;
        if (country) where.country = country;
        if (unassigned === 'true') where.assignedToId = null;
        if (search) {
            where.OR = [
                { name: { contains: search } },
                { phone: { contains: search } },
                { email: { contains: search } }
            ];
        }

        // Role filtering
        if (user.role === ROLES.COUNSELOR) {
            // Counselors see only their own leads
            where.assignedToId = user.id;
        } else if (user.role === ROLES.TEAM_LEADER) {
            // Team Leaders see their team's leads
            const team = await prisma.team.findFirst({ where: { leaderId: user.id } });
            if (team) {
                const teamMemberIds = await prisma.user.findMany({
                    where: { teamId: team.id },
                    select: { id: true }
                }).then(users => users.map(u => u.id));

                where.assignedToId = { in: teamMemberIds };
            } else {
                where.assignedToId = -1; // No team, return nothing
            }
        } else if (user.role === ROLES.MANAGER || user.role === ROLES.ADMIN || user.role === ROLES.SUPER_ADMIN) {
            // Can filter by specific counselor if provided
            if (assignedTo) where.assignedToId = Number(assignedTo);
        }

        // Support mostly deals with unassigned or all for inbox, but we follow standard restrictions
        if (user.role === ROLES.CUSTOMER_SUPPORT && assignedTo) {
            where.assignedToId = Number(assignedTo);
        }

        return where;
    }

    static async getLeads(user, query) {
        const { page = 1, limit = 20 } = query;
        const { take, skip } = getPaginationOptions(page, limit);

        const where = await this._buildRoleBasedWhere(user, query);

        const [leads, total] = await Promise.all([
            prisma.lead.findMany({
                where,
                take,
                skip,
                orderBy: { createdAt: 'desc' },
                include: {
                    assignedTo: { select: { id: true, name: true } }
                }
            }),
            prisma.lead.count({ where })
        ]);

        return { leads, total };
    }

    static async getLeadById(id, user) {
        const lead = await prisma.lead.findUnique({
            where: { id: Number(id) },
            include: {
                assignedTo: { select: { id: true, name: true, role: true } },
                qualification: true
            }
        });

        if (!lead) throw new Error('Lead not found');

        // Counselors can only view their own leads
        if (user.role === ROLES.COUNSELOR && lead.assignedToId !== user.id) {
            throw new Error('Forbidden: You can only access your own leads');
        }

        return lead;
    }

    static async createLead(data, user) {
        let lead = await prisma.lead.create({
            data: { ...data, status: 'ACTIVE' }
        });

        await prisma.activityLog.create({
            data: {
                leadId: lead.id,
                userId: user.id,
                type: 'LEAD_CREATED',
                description: 'Lead manually created in CRM'
            }
        });

        // 1. Check AI Configuration Rules
        const aiConfig = await prisma.aIConfig.findFirst();
        if (aiConfig?.isEnabled) {
            // Mock AI qualification (in a real app, this would call GPT)
            const score = Math.floor(Math.random() * 40) + 60; // 60-100 score
            const isHot = score >= aiConfig.confidenceScore;

            await prisma.aIQualification.create({
                data: {
                    leadId: lead.id,
                    answers: { test: "auto_analyzed" },
                    score,
                    category: isHot ? 'HOT' : 'WARM',
                    summary: `AI analyzed lead based on ${aiConfig.model}`
                }
            });

            await prisma.activityLog.create({
                data: {
                    leadId: lead.id,
                    userId: user.id,
                    type: 'AI_TRIGGERED',
                    description: `AI flow executed. Scored ${score}.`
                }
            });

            if (aiConfig.autoQualifyLeads && isHot && lead.stage === 'NEW') {
                lead = await prisma.lead.update({
                    where: { id: lead.id },
                    data: { stage: 'QUALIFIED' }
                });
            }
        }

        // 2. Check Routing Rules if lead is unassigned
        if (!lead.assignedToId) {
            import('./routing.service.js').then(async ({ RoutingService }) => {
                await RoutingService.runRouting(); // Triggers global routing for unassigned leads
            }).catch(console.error);
        }

        return lead;
    }

    static async updateLead(id, data, user) {
        // Auth check implicitly validates access
        await this.getLeadById(id, user);

        const lead = await prisma.lead.update({
            where: { id: Number(id) },
            data
        });

        await prisma.activityLog.create({
            data: {
                leadId: lead.id,
                userId: user.id,
                type: 'LEAD_UPDATED',
                description: 'Lead details updated'
            }
        });

        return lead;
    }

    static async updateStage(id, stage, user) {
        const lead = await this.getLeadById(id, user);

        const oldStage = lead.stage;

        return await prisma.$transaction(async (tx) => {
            const updated = await tx.lead.update({
                where: { id: Number(id) },
                data: { stage }
            });

            await tx.activityLog.create({
                data: {
                    leadId: updated.id,
                    userId: user.id,
                    type: 'STAGE_CHANGE',
                    description: `Stage changed from ${oldStage} to ${stage}`
                }
            });

            // AUTOMATION: If converted, create revenue entry
            if (stage === 'CONVERTED') {
                await tx.revenue.create({
                    data: {
                        amount: updated.budget || 0,
                        source: updated.source,
                        leadId: updated.id
                    }
                });

                await tx.activityLog.create({
                    data: {
                        leadId: updated.id,
                        userId: user.id,
                        type: 'REVENUE_GENERATED',
                        description: `Revenue entry created automatically for converted lead. Amount: ${updated.budget || 0}`
                    }
                });
            }

            return updated;
        });
    }

    static async assignLead(id, assignedToId, user) {
        const targetUser = await prisma.user.findUnique({ where: { id: assignedToId } });
        if (!targetUser) throw new Error('Target counselor not found');

        const lead = await prisma.lead.update({
            where: { id: Number(id) },
            data: { assignedToId }
        });

        await prisma.activityLog.create({
            data: {
                leadId: lead.id,
                userId: user.id,
                type: 'ASSIGNMENT',
                description: `Lead assigned to User ID ${targetUser.id} (${targetUser.name})`
            }
        });

        return lead;
    }

    static async bulkAssign(leadIds, assignedToId, user) {
        const targetUser = await prisma.user.findUnique({ where: { id: assignedToId } });
        if (!targetUser) throw new Error('Target counselor not found');

        const result = await prisma.lead.updateMany({
            where: { id: { in: leadIds } },
            data: { assignedToId }
        });

        // Create activity logs for all affected leads
        const activityData = leadIds.map(leadId => ({
            leadId,
            userId: user.id,
            type: 'ASSIGNMENT',
            description: `Lead bulk-assigned to User ID ${targetUser.id} (${targetUser.name})`
        }));

        await prisma.activityLog.createMany({ data: activityData });

        return { updatedCount: result.count };
    }

    static async getLeadActivities(leadId, user) {
        await this.getLeadById(leadId, user); // checks access

        return prisma.activityLog.findMany({
            where: { leadId: Number(leadId) },
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { id: true, name: true } }
            }
        });
    }

    static async getQualifications(user) {
        const where = {};
        if (user.role === ROLES.COUNSELOR) {
            where.lead = { assignedToId: user.id };
        } else if (user.role === ROLES.TEAM_LEADER) {
            const team = await prisma.team.findFirst({ where: { leaderId: user.id } });
            if (team) {
                const teamMemberIds = await prisma.user.findMany({
                    where: { teamId: team.id },
                    select: { id: true }
                }).then(users => users.map(u => u.id));
                where.lead = { assignedToId: { in: teamMemberIds } };
            }
        }

        return prisma.aIQualification.findMany({
            where,
            include: {
                lead: {
                    select: { id: true, name: true, country: true, program: true, intake: true, budget: true, score: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
}
