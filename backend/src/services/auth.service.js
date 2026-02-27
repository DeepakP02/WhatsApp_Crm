import bcrypt from 'bcrypt';
import prisma from '../config/prisma.js';
import { generateToken } from '../config/jwt.js';

export class AuthService {
    static async login(email, password) {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            throw new Error('Invalid credentials');
        }

        if (user.status !== 'ACTIVE') {
            throw new Error('Account inactive');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        const token = generateToken({
            userId: user.id,
            role: user.role,
            email: user.email
        });

        return {
            token,
            user: {
                id: user.id,
                uuid: user.uuid,
                name: user.name,
                email: user.email,
                role: user.role,
                country: user.country
            }
        };
    }

    static async getProfile(userId) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                country: true,
                team: {
                    select: { id: true, name: true }
                }
            }
        });

        if (!user) throw new Error('User not found');
        return user;
    }

    static async changePassword(userId, currentPassword, newPassword) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error('User not found');

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) throw new Error('Incorrect current password');

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        });

        return true;
    }
}
