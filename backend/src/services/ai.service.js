import prisma from '../config/prisma.js';
import { LeadService } from './lead.service.js';

export class AiService {
    static async getSummary(leadId, user) {
        // Verify access to lead
        await LeadService.getLeadById(leadId, user);

        const summary = await prisma.aIQualification.findUnique({
            where: { leadId: Number(leadId) }
        });

        if (!summary) throw new Error('AI summary not found for this lead');
        return summary;
    }

    static async qualifyLead(leadId, data, user) {
        // Verify access to lead
        await LeadService.getLeadById(leadId, user);

        return prisma.aIQualification.upsert({
            where: { leadId: Number(leadId) },
            update: {
                answers: data.answers,
                score: data.score,
                category: data.score >= 80 ? 'Hot' : data.score >= 50 ? 'Warm' : 'Cold',
                summary: data.summary
            },
            create: {
                leadId: Number(leadId),
                answers: data.answers,
                score: data.score,
                category: data.score >= 80 ? 'Hot' : data.score >= 50 ? 'Warm' : 'Cold',
                summary: data.summary
            }
        });
    }
}
