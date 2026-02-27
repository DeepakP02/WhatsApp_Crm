import prisma from '../config/prisma.js';

export class BillingService {
    static async getPlans() {
        return prisma.billing.findMany({
            orderBy: { createdAt: 'desc' }
        });
    }

    static async createPlan(data) {
        return prisma.billing.create({
            data: {
                planName: data.planName,
                price: Number(data.price),
                cycle: data.cycle,
                startDate: new Date(),
                status: data.status || 'ACTIVE'
            }
        });
    }

    static async updatePlan(id, data) {
        return prisma.billing.update({
            where: { id: Number(id) },
            data: {
                ...data,
                price: data.price ? Number(data.price) : undefined
            }
        });
    }

    static async getSubscriptions() {
        // Currently returns plans as active subscriptions (structural only)
        return prisma.billing.findMany({
            where: { status: 'ACTIVE' },
            orderBy: { startDate: 'desc' }
        });
    }
}
