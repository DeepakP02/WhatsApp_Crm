import prisma from '../config/prisma.js';
import { LeadService } from './lead.service.js';
import { ROLES } from '../constants/roles.js';

export class NoteService {
    static async addNote(leadId, content, user) {
        // Check if user has access to the lead
        await LeadService.getLeadById(leadId, user);

        return prisma.note.create({
            data: {
                leadId: Number(leadId),
                authorId: user.id,
                content
            },
            include: {
                author: { select: { id: true, name: true } }
            }
        });
    }

    static async getNotes(leadId, user) {
        // Check if user has access to the lead
        await LeadService.getLeadById(leadId, user);

        return prisma.note.findMany({
            where: { leadId: Number(leadId) },
            orderBy: { createdAt: 'desc' },
            include: {
                author: { select: { id: true, name: true } }
            }
        });
    }

    static async getAllNotes(user) {
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

        return prisma.note.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                author: { select: { id: true, name: true } },
                lead: { select: { id: true, name: true } }
            }
        });
    }
}
