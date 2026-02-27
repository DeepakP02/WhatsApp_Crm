import prisma from '../config/prisma.js';

export class TeamService {
    static async getTeams() {
        return prisma.team.findMany({
            include: {
                leader: { select: { id: true, name: true } },
                _count: { select: { members: true } }
            }
        });
    }

    static async createTeam(data) {
        return prisma.team.create({
            data: {
                name: data.name,
                country: data.country,
                leaderId: data.leaderId
            }
        });
    }

    static async updateTeam(id, data) {
        // Check if team exists
        const team = await prisma.team.findUnique({ where: { id: Number(id) } });
        if (!team) throw new Error('Team not found');

        return prisma.team.update({
            where: { id: Number(id) },
            data
        });
    }

    static async addMember(teamId, userId) {
        const team = await prisma.team.findUnique({ where: { id: Number(teamId) } });
        if (!team) throw new Error('Team not found');

        const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
        if (!user) throw new Error('User not found');

        return prisma.user.update({
            where: { id: Number(userId) },
            data: { teamId: Number(teamId) }
        });
    }
}
