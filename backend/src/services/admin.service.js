import prisma from '../config/prisma.js';

export class AdminService {
    static async getChannelStats() {
        const [whatsappCount, facebookCount, websiteCount, activeChannels] = await Promise.all([
            prisma.lead.count({ where: { source: 'WhatsApp' } }),
            prisma.lead.count({ where: { source: 'Facebook Messenger' } }),
            prisma.lead.count({ where: { source: 'Website Widget' } }),
            prisma.channels.findMany()
        ]);

        return {
            whatsapp: whatsappCount,
            facebook: facebookCount,
            website: websiteCount,
            channels: activeChannels
        };
    }

    static async updateChannelStatus(type, status) {
        // Enums mapping back to UI keys
        const typeMap = {
            'whatsapp': 'WHATSAPP',
            'messenger': 'MESSENGER',
            'widget': 'WIDGET'
        };

        const dbType = typeMap[type.toLowerCase()] || 'WIDGET';
        const isActive = status === 'active';

        const existing = await prisma.channels.findFirst({
            where: { type: dbType }
        });

        if (existing) {
            return prisma.channels.update({
                where: { id: existing.id },
                data: { isActive, name: type }
            });
        }

        return prisma.channels.create({
            data: {
                name: type,
                type: dbType,
                isActive
            }
        });
    }

    static async getAiConfig() {
        let config = await prisma.aIConfig.findFirst();
        if (!config) {
            config = {
                isEnabled: true,
                autoQualifyLeads: true,
                model: 'GPT-4o',
                confidenceScore: 80
            };
        }
        return config;
    }

    static async updateAiConfig(data, userId) {
        const existing = await prisma.aIConfig.findFirst();

        const updateData = {
            isEnabled: data.isEnabled,
            autoQualifyLeads: data.autoQualifyLeads,
            model: data.model,
            confidenceScore: parseInt(data.confidenceScore),
            updatedById: userId
        };

        if (existing) {
            return prisma.aIConfig.update({
                where: { id: existing.id },
                data: updateData
            });
        }

        return prisma.aIConfig.create({
            data: updateData
        });
    }

    static async getWorkingHours() {
        return prisma.workingHours.findMany({
            orderBy: { dayOfWeek: 'asc' }
        });
    }

    static async updateWorkingHours(dataList) {
        // dataList is expected to be an array of WorkingHour objects
        return await prisma.$transaction(
            dataList.map(item =>
                prisma.workingHours.upsert({
                    where: {
                        dayOfWeek_timezone: {
                            dayOfWeek: parseInt(item.dayOfWeek),
                            timezone: item.timezone || 'UTC'
                        }
                    },
                    update: {
                        isActive: item.isActive,
                        startTime: item.startTime,
                        endTime: item.endTime
                    },
                    create: {
                        dayOfWeek: parseInt(item.dayOfWeek),
                        isActive: item.isActive,
                        startTime: item.startTime,
                        endTime: item.endTime,
                        timezone: item.timezone || 'UTC'
                    }
                })
            )
        );
    }
}
