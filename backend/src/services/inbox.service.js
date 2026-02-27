import prisma from '../config/prisma.js';
import { getPaginationOptions } from '../utils/pagination.js';
import { ROLES } from '../constants/roles.js';

export class InboxService {
    static async getConversations(filters, user) {
        const { page = 1, limit = 20, channel } = filters;
        const { take, skip } = getPaginationOptions(page, limit);

        const where = {};
        if (channel) where.channel = channel;

        // Role-based filtering for conversations
        if (user.role === ROLES.COUNSELOR) {
            where.lead = { assignedToId: user.id };
        } else if (user.role === ROLES.TEAM_LEADER) {
            const team = await prisma.team.findFirst({ where: { leaderId: user.id } });
            if (team) {
                const teamMemberIds = await prisma.user.findMany({
                    where: { teamId: team.id },
                    select: { id: true }
                }).then(users => users.map(u => u.id));
                where.lead = { assignedToId: { in: teamMemberIds } };
            } else {
                where.lead = { assignedToId: -1 }; // Hide if not leading a team
            }
        }
        // Support and Admin/SA can see all conversations based on filters

        const [conversations, total] = await Promise.all([
            prisma.conversation.findMany({
                where,
                take,
                skip,
                orderBy: { updatedAt: 'desc' },
                include: {
                    lead: { select: { id: true, name: true, phone: true } }
                }
            }),
            prisma.conversation.count({ where })
        ]);

        return { conversations, total };
    }

    static async getMessages(conversationId, user) {
        const conversation = await prisma.conversation.findUnique({
            where: { id: Number(conversationId) },
            include: { lead: true }
        });

        if (!conversation) throw new Error('Conversation not found');

        if (user.role === ROLES.COUNSELOR && conversation.lead.assignedToId !== user.id) {
            throw new Error('Forbidden: Not authorized to view this conversation');
        }

        // Reset unread count when fetching messages
        await prisma.conversation.update({
            where: { id: Number(conversationId) },
            data: { unreadCount: 0 }
        });

        return prisma.message.findMany({
            where: { conversationId: Number(conversationId) },
            orderBy: { sentAt: 'asc' },
            include: {
                sender: { select: { id: true, name: true } }
            }
        });
    }

    static async sendMessage(conversationId, bodyContent, user) {
        const conversation = await prisma.conversation.findUnique({
            where: { id: Number(conversationId) },
            include: { lead: true }
        });

        if (!conversation) throw new Error('Conversation not found');

        if (user.role === ROLES.COUNSELOR && conversation.lead.assignedToId !== user.id) {
            throw new Error('Forbidden: Not authorized to send messages here');
        }

        const message = await prisma.message.create({
            data: {
                conversationId: Number(conversationId),
                senderId: user.id,
                body: bodyContent,
                direction: 'OUTBOUND'
            }
        });

        // Update conversation's last message and timestamp
        await prisma.conversation.update({
            where: { id: Number(conversationId) },
            data: { lastMessage: bodyContent }
        });

        // Reset SLA Status on Outbound Message (Response SLA met)
        const slaStatus = await prisma.slaStatus.findUnique({ where: { conversationId: Number(conversationId) } });
        if (slaStatus) {
            await prisma.slaStatus.update({
                where: { id: slaStatus.id },
                data: { lastResponseAt: new Date(), isBreached: false }
            });
        } else {
            await prisma.slaStatus.create({
                data: { conversationId: Number(conversationId), lastResponseAt: new Date() }
            });
        }

        return message;
    }

    static async getUnreadCount(user) {
        const where = { unreadCount: { gt: 0 } };

        if (user.role === ROLES.COUNSELOR) {
            where.lead = { assignedToId: user.id };
        }

        const totalUnread = await prisma.conversation.aggregate({
            where,
            _sum: { unreadCount: true }
        });

        return { totalUnread: totalUnread._sum.unreadCount || 0 };
    }
}
