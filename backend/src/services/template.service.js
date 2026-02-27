import prisma from '../config/prisma.js';

export class TemplateService {
    static async getTemplates(channel) {
        const where = { deletedAt: null };
        if (channel) where.channel = channel;

        return prisma.template.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                createdBy: { select: { id: true, name: true } }
            }
        });
    }

    static async createTemplate(data, userId) {
        // Unique name per channel check
        const existing = await prisma.template.findFirst({
            where: { name: data.name, channel: data.channel, deletedAt: null }
        });

        if (existing) {
            throw new Error(`Template with name '${data.name}' already exists in channel ${data.channel}`);
        }

        return prisma.template.create({
            data: {
                ...data,
                createdById: userId
            }
        });
    }

    static async updateTemplate(id, data) {
        if (data.name) {
            const template = await prisma.template.findUnique({ where: { id: Number(id) } });
            if (!template) throw new Error('Template not found');

            const existing = await prisma.template.findFirst({
                where: { name: data.name, channel: template.channel, deletedAt: null, id: { not: Number(id) } }
            });
            if (existing) throw new Error('Template name already exists in this channel');
        }

        return prisma.template.update({
            where: { id: Number(id) },
            data
        });
    }

    static async softDeleteTemplate(id) {
        return prisma.template.update({
            where: { id: Number(id) },
            data: { deletedAt: new Date() }
        });
    }
}
