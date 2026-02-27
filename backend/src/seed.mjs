import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    const password = await bcrypt.hash('password123', 10);

    // Users
    const superAdmin = await prisma.user.upsert({
        where: { email: 'superadmin@crm.com' },
        update: {},
        create: {
            name: 'Super Admin',
            email: 'superadmin@crm.com',
            password,
            role: 'SUPER_ADMIN'
        }
    });

    const admin = await prisma.user.upsert({
        where: { email: 'admin@crm.com' },
        update: {},
        create: {
            name: 'Admin User',
            email: 'admin@crm.com',
            password,
            role: 'ADMIN'
        }
    });

    const tl = await prisma.user.upsert({
        where: { email: 'tl@crm.com' },
        update: {},
        create: {
            name: 'Team Leader',
            email: 'tl@crm.com',
            password,
            role: 'TEAM_LEADER',
            country: 'India'
        }
    });

    const counselor1 = await prisma.user.upsert({
        where: { email: 'counselor1@crm.com' },
        update: {},
        create: {
            name: 'Counselor One',
            email: 'counselor1@crm.com',
            password,
            role: 'COUNSELOR',
            country: 'India'
        }
    });

    const counselor2 = await prisma.user.upsert({
        where: { email: 'counselor2@crm.com' },
        update: {},
        create: {
            name: 'Counselor Two',
            email: 'counselor2@crm.com',
            password,
            role: 'COUNSELOR',
            country: 'UAE'
        }
    });

    const support = await prisma.user.upsert({
        where: { email: 'support@crm.com' },
        update: {},
        create: {
            name: 'Customer Support',
            email: 'support@crm.com',
            password,
            role: 'CUSTOMER_SUPPORT'
        }
    });

    const manager = await prisma.user.upsert({
        where: { email: 'manager@crm.com' },
        update: {},
        create: {
            name: 'Manager User',
            email: 'manager@crm.com',
            password,
            role: 'MANAGER'
        }
    });

    // Teams
    const team1 = await prisma.team.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            name: 'India Sales Team',
            country: 'India',
            leaderId: tl.id,
            members: {
                connect: [{ id: counselor1.id }]
            }
        }
    });

    // Sla Config
    const sla = await prisma.slaConfig.findFirst();
    if (!sla) {
        await prisma.slaConfig.create({
            data: {
                responseMinutes: 60,
                escalateMinutes: 120
            }
        });
    }

    // Leads - Using findFirst to check existence by phone before creating
    const existingLead1 = await prisma.lead.findFirst({ where: { phone: '+919876543210' } });
    if (!existingLead1) {
        await prisma.lead.create({
            data: {
                name: 'John Doe',
                phone: '+919876543210',
                email: 'john@example.com',
                country: 'India',
                source: 'WhatsApp',
                program: 'MBA',
                intake: 'Jan 2025',
                budget: 50000,
                stage: 'QUALIFIED',
                assignedToId: counselor1.id,
                notes: {
                    create: {
                        content: 'Interested in early enrollment.',
                        authorId: counselor1.id
                    }
                },
                activities: {
                    create: {
                        type: 'LEAD_CREATED',
                        description: 'Lead created from WhatsApp',
                        userId: admin.id
                    }
                }
            }
        });
    }

    const existingLead2 = await prisma.lead.findFirst({ where: { phone: '+971501234567' } });
    if (!existingLead2) {
        await prisma.lead.create({
            data: {
                name: 'Jane Smith',
                phone: '+971501234567',
                email: 'jane@example.com',
                country: 'UAE',
                source: 'Facebook',
                program: 'BBA',
                intake: 'Sep 2025',
                budget: 30000,
                stage: 'NEW'
            }
        });
    }

    console.log('Seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
