import prisma from './src/config/prisma.js';

async function migrate() {
    try {
        console.log("Creating AIConfig table...");
        await prisma.$executeRawUnsafe(`
            CREATE TABLE IF NOT EXISTS \`AIConfig\` (
                \`id\` INTEGER NOT NULL AUTO_INCREMENT,
                \`isEnabled\` BOOLEAN NOT NULL DEFAULT true,
                \`autoQualifyLeads\` BOOLEAN NOT NULL DEFAULT true,
                \`model\` VARCHAR(191) NOT NULL DEFAULT 'GPT-4o',
                \`confidenceScore\` INTEGER NOT NULL DEFAULT 80,
                \`updatedAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
                \`updatedById\` INTEGER NOT NULL,

                PRIMARY KEY (\`id\`)
            ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
        `);

        console.log("Adding Foreign Key to AIConfig...");
        try {
            await prisma.$executeRawUnsafe(`
                ALTER TABLE \`AIConfig\` ADD CONSTRAINT \`AIConfig_updatedById_fkey\` FOREIGN KEY (\`updatedById\`) REFERENCES \`User\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE;
            `);
        } catch (e) {
            console.log("FK might already exist: ", e.message);
        }

        console.log("Creating WorkingHours table...");
        await prisma.$executeRawUnsafe(`
            CREATE TABLE IF NOT EXISTS \`WorkingHours\` (
                \`id\` INTEGER NOT NULL AUTO_INCREMENT,
                \`dayOfWeek\` INTEGER NOT NULL,
                \`isActive\` BOOLEAN NOT NULL DEFAULT true,
                \`startTime\` VARCHAR(191) NOT NULL DEFAULT '09:00',
                \`endTime\` VARCHAR(191) NOT NULL DEFAULT '17:00',
                \`timezone\` VARCHAR(191) NOT NULL DEFAULT 'UTC',
                \`updatedAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

                UNIQUE INDEX \`WorkingHours_dayOfWeek_timezone_key\`(\`dayOfWeek\`, \`timezone\`),
                PRIMARY KEY (\`id\`)
            ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
        `);

        console.log("Adding isActive to RoutingRule...");
        try {
            await prisma.$executeRawUnsafe(`
                ALTER TABLE \`RoutingRule\` ADD COLUMN \`isActive\` BOOLEAN NOT NULL DEFAULT true;
            `);
        } catch (e) {
            console.log("Column might already exist: ", e.message);
        }

        console.log("Migration complete!");
    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        await prisma.$disconnect();
    }
}

migrate();
