import prisma from '../config/prisma.js';

export class SlaService {
    static async getConfig() {
        let config = await prisma.slaConfig.findFirst();

        if (!config) {
            config = await prisma.slaConfig.create({
                data: {
                    responseMinutes: 60,
                    escalateMinutes: 120
                }
            });
        }

        return config;
    }

    static async updateConfig(data) {
        let config = await prisma.slaConfig.findFirst();

        if (!config) {
            config = await prisma.slaConfig.create({ data });
        } else {
            config = await prisma.slaConfig.update({
                where: { id: config.id },
                data
            });
        }

        return config;
    }

    static async getSlaStatus() {
        return prisma.slaStatus.findMany({
            include: {
                conversation: {
                    include: {
                        lead: { select: { id: true, name: true, assignedToId: true } }
                    }
                }
            }
        });
    }
}
