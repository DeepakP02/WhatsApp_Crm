import prisma from '../config/prisma.js';

export class AnalyticsService {
    static async getSummaryData(filters) {
        const where = this._buildWhereClause(filters);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [leadsToday, qualified, converted, enrolled] = await Promise.all([
            prisma.lead.count({ where: { ...where, createdAt: { gte: today } } }),
            prisma.lead.count({ where: { ...where, stage: 'QUALIFIED' } }),
            prisma.lead.count({ where: { ...where, stage: 'CONVERTED' } }),
            prisma.lead.count({ where: { ...where, stage: 'ENROLLED' } })
        ]);

        return { leadsToday, qualified, converted, enrolled };
    }

    static async getFunnelData(filters) {
        const where = this._buildWhereClause(filters);

        const stages = await prisma.lead.groupBy({
            by: ['stage'],
            where,
            _count: { id: true }
        });

        // Map stages to counts
        const counts = { NEW: 0, CONTACTED: 0, QUALIFIED: 0, CONVERTED: 0, ENROLLED: 0, LOST: 0 };
        stages.forEach(s => counts[s.stage] = s._count.id);

        const funnel = [
            { stage: 'New', count: counts.NEW + counts.CONTACTED, prevStagePct: '-', team: 'Admissions', avgTime: '2h 15m' },
            { stage: 'Qualified', count: counts.QUALIFIED, prevStagePct: this._calcPct(counts.QUALIFIED, counts.NEW + counts.CONTACTED), team: 'Sales', avgTime: '1d 4h' },
            { stage: 'Converted', count: counts.CONVERTED, prevStagePct: this._calcPct(counts.CONVERTED, counts.QUALIFIED), team: 'Finance', avgTime: '3d 2h' },
            { stage: 'Enrolled', count: counts.ENROLLED, prevStagePct: this._calcPct(counts.ENROLLED, counts.CONVERTED), team: 'Operations', avgTime: '1w 2d' },
        ];

        return funnel;
    }

    static _calcPct(current, prev) {
        if (!prev || prev === 0) return '0%';
        return ((current / prev) * 100).toFixed(1) + '%';
    }

    static async getCountryPerformance(filters) {
        const where = this._buildWhereClause(filters);

        const countryLeads = await prisma.lead.groupBy({
            by: ['country', 'stage'],
            where,
            _count: { id: true }
        });

        // Group by country and calculate stats
        const performance = {};
        countryLeads.forEach(row => {
            if (!performance[row.country]) {
                performance[row.country] = { total: 0, converted: 0, qualified: 0 };
            }
            performance[row.country].total += row._count.id;
            if (row.stage === 'CONVERTED' || row.stage === 'ENROLLED') {
                performance[row.country].converted += row._count.id;
            }
            if (row.stage === 'QUALIFIED') {
                performance[row.country].qualified += row._count.id;
            }
        });

        // Add conversion rates per country
        return Object.keys(performance).map(country => {
            const p = performance[country];
            p.conversionRate = p.total > 0 ? Number(((p.converted / p.total) * 100).toFixed(1)) : 0;
            return { country, ...p };
        }).sort((a, b) => b.total - a.total);
    }

    static async getSlaReports(filters) {
        const where = this._buildWhereClause(filters);

        // SLA breach count based on the lead filters (when they were created)
        const breachedLeads = await prisma.slaStatus.count({
            where: {
                isBreached: true,
                conversation: {
                    lead: {
                        createdAt: where.createdAt,
                        country: where.country
                    }
                }
            }
        });

        const totalConversations = await prisma.conversation.count({
            where: {
                lead: {
                    createdAt: where.createdAt,
                    country: where.country
                }
            }
        });

        const breachRate = totalConversations > 0 ? ((breachedLeads / totalConversations) * 100).toFixed(1) : 0;

        return { breachedLeads, totalConversations, breachRate: Number(breachRate) };
    }

    static async getTeamPerformance(filters) {
        const where = this._buildWhereClause(filters);

        const teams = await prisma.team.findMany({
            include: {
                members: {
                    select: { id: true }
                },
                routingRules: {
                    select: { strategy: true }
                }
            }
        });

        const performance = await Promise.all(teams.map(async (team) => {
            const memberIds = team.members.map(m => m.id);
            const stats = await prisma.lead.groupBy({
                by: ['stage'],
                where: {
                    ...where,
                    assignedToId: { in: memberIds }
                },
                _count: { id: true }
            });

            const counts = { total: 0, qualified: 0, converted: 0 };
            stats.forEach(s => {
                counts.total += s._count.id;
                if (s.stage === 'QUALIFIED') counts.qualified += s._count.id;
                if (s.stage === 'CONVERTED' || s.stage === 'ENROLLED') counts.converted += s._count.id;
            });

            return {
                team: team.name,
                activeLeads: counts.total,
                qualified: counts.qualified,
                converted: counts.converted,
                avgResponse: '2.4m', // Placeholder
                counselors: team.members.length
            };
        }));

        return performance;
    }

    static async getCallReports(filters) {
        const where = this._buildWhereClause(filters);

        const calls = await prisma.callLog.findMany({
            where: {
                lead: {
                    country: where.country,
                    createdAt: where.createdAt
                }
            },
            include: {
                user: { select: { name: true } },
                lead: { select: { name: true, country: true } }
            },
            take: 50,
            orderBy: { calledAt: 'desc' }
        });

        return calls.map(c => ({
            id: c.id,
            counselor: c.user.name,
            lead: c.lead.name,
            country: c.lead.country,
            duration: `${Math.floor(c.duration / 60)}m ${c.duration % 60}s`,
            outcome: c.outcome || 'No Outcome',
            date: c.calledAt.toISOString().split('T')[0]
        }));
    }

    static async getConversionStats(filters) {
        const teamPerf = await this.getTeamPerformance(filters);
        return teamPerf.map(t => ({
            team: t.team,
            assigned: t.activeLeads,
            qualified: t.qualified,
            converted: t.converted,
            enrolled: Math.floor(t.converted * 0.6), // Proxy
            conversion: t.activeLeads > 0 ? ((t.converted / t.activeLeads) * 100).toFixed(1) + '%' : '0%'
        }));
    }

    static async getCounselorPerformance(filters, user) {
        const where = this._buildWhereClause(filters);
        const { ROLES } = await import('../constants/roles.js');

        if (user.role === ROLES.TEAM_LEADER) {
            const team = await prisma.team.findFirst({ where: { leaderId: user.id } });
            if (!team) return [];
            const teamMemberIds = await prisma.user.findMany({
                where: { teamId: team.id }, select: { id: true }
            }).then(u => u.map(m => m.id));
            where.assignedToId = { in: teamMemberIds };
        }

        const rawData = await prisma.lead.groupBy({
            by: ['assignedToId', 'stage'],
            where: { ...where, assignedToId: { not: null } },
            _count: { id: true }
        });

        const assignedUserIds = [...new Set(rawData.map(r => r.assignedToId))];
        const users = await prisma.user.findMany({
            where: { id: { in: assignedUserIds } },
            select: { id: true, name: true, team: { select: { name: true } } }
        });
        const userMap = new Map(users.map(u => [u.id, u]));

        const performance = {};
        rawData.forEach(row => {
            const sId = row.assignedToId;
            if (!performance[sId]) {
                const u = userMap.get(sId);
                performance[sId] = {
                    counselorId: sId,
                    counselorName: u ? u.name : 'Unknown',
                    team: u && u.team ? u.team.name : 'No Team',
                    total: 0, qualified: 0, converted: 0
                };
            }
            performance[sId].total += row._count.id;
            if (row.stage === 'QUALIFIED') performance[sId].qualified += row._count.id;
            if (row.stage === 'CONVERTED' || row.stage === 'ENROLLED') performance[sId].converted += row._count.id;
        });

        return Object.values(performance).map(p => {
            p.conversionRate = p.total > 0 ? Number(((p.converted / p.total) * 100).toFixed(1)) : 0;
            return p;
        }).sort((a, b) => b.total - a.total);
    }
    static async getTeamSummary(filters, user) {
        const { ROLES } = await import('../constants/roles.js');
        const where = this._buildWhereClause(filters);

        if (user.role === ROLES.TEAM_LEADER) {
            const team = await prisma.team.findFirst({ where: { leaderId: user.id } });
            if (team) {
                const teamMemberIds = await prisma.user.findMany({
                    where: { teamId: team.id },
                    select: { id: true }
                }).then(users => users.map(u => u.id));
                where.assignedToId = { in: teamMemberIds };
            } else {
                return { teamLeads: 0, pendingReplies: 0, slaBreaches: 0 };
            }
        }

        const [teamLeads, slaBreaches] = await Promise.all([
            prisma.lead.count({ where }),
            prisma.slaStatus.count({
                where: {
                    isBreached: true,
                    conversation: {
                        lead: where
                    }
                }
            })
        ]);

        return {
            teamLeads: teamLeads.toString(),
            pendingReplies: (teamLeads * 0.4).toFixed(0), // Proxy for demo
            slaBreaches: slaBreaches.toString()
        };
    }

    static async getCounselorSummary(user) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [assignedLeads, hotLeads, followUps] = await Promise.all([
            prisma.lead.count({ where: { assignedToId: user.id } }),
            prisma.lead.count({ where: { assignedToId: user.id, score: { gte: 80 } } }),
            prisma.lead.count({ where: { assignedToId: user.id, stage: 'PENDING' } })
        ]);

        return {
            assignedLeads,
            hotLeads,
            followUps
        };
    }


    static async getSlaAlerts(filters, user) {
        const where = this._buildWhereClause(filters);
        const { ROLES } = await import('../constants/roles.js');

        const slaWhere = {
            isBreached: true,
            conversation: {
                lead: {}
            }
        };

        if (where.country) slaWhere.conversation.lead.country = where.country;
        if (where.createdAt) slaWhere.conversation.lead.createdAt = where.createdAt;

        if (user.role === ROLES.TEAM_LEADER) {
            const team = await prisma.team.findFirst({ where: { leaderId: user.id } });
            if (team) {
                const teamMemberIds = await prisma.user.findMany({
                    where: { teamId: team.id },
                    select: { id: true }
                }).then(users => users.map(u => u.id));
                slaWhere.conversation.lead.assignedToId = { in: teamMemberIds };
            } else {
                return [];
            }
        }

        const breaches = await prisma.slaStatus.findMany({
            where: slaWhere,
            include: {
                conversation: {
                    include: {
                        lead: {
                            include: {
                                assignedTo: { select: { name: true } }
                            }
                        }
                    }
                }
            },
            orderBy: { updatedAt: 'desc' },
            take: 20
        });

        return breaches.map(b => ({
            id: b.conversation.leadId,
            leadName: b.conversation.lead.name,
            counselor: b.conversation.lead.assignedTo?.name || 'Unassigned',
            delay: Math.floor((new Date() - new Date(b.updatedAt)) / 60000),
            limit: 15, // Mock limit
            status: 'Breached',
            breachTime: b.updatedAt.toISOString()
        }));
    }

    static _buildWhereClause(filters) {
        const { dateFrom, dateTo, country } = filters;
        const where = {};
        if (country) where.country = country;

        if (dateFrom || dateTo) {
            where.createdAt = {};
            if (dateFrom && !isNaN(new Date(dateFrom).getTime())) {
                where.createdAt.gte = new Date(dateFrom);
            }
            if (dateTo && !isNaN(new Date(dateTo).getTime())) {
                where.createdAt.lte = new Date(dateTo);
            }
            if (Object.keys(where.createdAt).length === 0) {
                delete where.createdAt;
            }
        }
        return where;
    }
}
