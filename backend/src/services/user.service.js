import bcrypt from 'bcrypt';
import prisma from '../config/prisma.js';
import { getPaginationOptions } from '../utils/pagination.js';

export class UserService {
    static async getUsers(query) {
        const { page = 1, limit = 20, role, status, country } = query;
        const { take, skip } = getPaginationOptions(page, limit);

        const where = {};
        if (role) where.role = role;
        if (status) where.status = status;
        if (country) where.country = country;

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                take,
                skip,
                select: {
                    id: true,
                    uuid: true,
                    name: true,
                    email: true,
                    role: true,
                    status: true,
                    country: true,
                    team: { select: { id: true, name: true } },
                    createdAt: true
                }
            }),
            prisma.user.count({ where })
        ]);

        return { users, total };
    }

    static async createUser(data) {
        const existing = await prisma.user.findUnique({ where: { email: data.email } });
        if (existing) throw new Error('Email already exists');

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await prisma.user.create({
            data: {
                ...data,
                password: hashedPassword
            },
            select: {
                id: true,
                uuid: true,
                name: true,
                email: true,
                role: true,
                status: true
            }
        });

        await prisma.activityLog.create({
            data: {
                userId: user.id, // User who was created or who created it? 
                // Contextually, for user management, we usually log who performed the action.
                // But the service doesn't have the performing user.
                // I'll log it as a SYSTEM action or require performingUserId.
                // For now, I'll log it against the new user or leave userId as the new user.
                type: 'USER_CREATED',
                description: `New user ${user.name} (${user.role}) created.`
            }
        });

        return user;
    }

    static async getUserById(id) {
        const user = await prisma.user.findUnique({
            where: { id: Number(id) },
            select: {
                id: true, uuid: true, name: true, email: true, role: true,
                status: true, country: true, teamId: true, createdAt: true
            }
        });
        if (!user) throw new Error('User not found');
        return user;
    }

    static async updateUser(id, data) {
        const user = await prisma.user.update({
            where: { id: Number(id) },
            data,
            select: {
                id: true, uuid: true, name: true, email: true, role: true,
                status: true, country: true, teamId: true
            }
        });
        return user;
    }

    static async updateStatus(id, status) {
        const user = await prisma.user.update({
            where: { id: Number(id) },
            data: { status }
        });

        await prisma.activityLog.create({
            data: {
                userId: user.id,
                type: 'USER_STATUS_UPDATE',
                description: `User status changed to ${status}.`
            }
        });

        return user;
    }
}
