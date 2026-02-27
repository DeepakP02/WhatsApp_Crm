import prisma from '../config/prisma.js';

export class SettingService {
    static async getSetting(key) {
        const setting = await prisma.setting.findUnique({ where: { key } });
        return setting ? setting.value : null;
    }

    static async getAllSettings() {
        return prisma.setting.findMany();
    }

    static async updateSetting(key, value) {
        return prisma.setting.upsert({
            where: { key },
            update: { value },
            create: { key, value }
        });
    }
}
