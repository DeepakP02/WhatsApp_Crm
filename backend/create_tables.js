import prisma from './src/config/prisma.js';

async function main() {
    try {
        console.log('Attempting to create basic tables without FKs first...');

        await prisma.$executeRawUnsafe(`
            CREATE TABLE IF NOT EXISTS ActivityLog (
                id INT AUTO_INCREMENT PRIMARY KEY,
                leadId INT,
                userId INT NOT NULL,
                type VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3)
            )
        `);

        await prisma.$executeRawUnsafe(`
            CREATE TABLE IF NOT EXISTS Revenue (
                id INT AUTO_INCREMENT PRIMARY KEY,
                amount DOUBLE NOT NULL,
                source VARCHAR(255),
                leadId INT,
                createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3)
            )
        `);

        await prisma.$executeRawUnsafe(`
            CREATE TABLE IF NOT EXISTS Channels (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                type ENUM('WHATSAPP', 'FACEBOOK', 'WEBSITE') NOT NULL,
                isActive BOOLEAN DEFAULT true,
                createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
                updatedAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
            )
        `);

        console.log('Tables created successfully.');
    } catch (error) {
        console.error('Failed to create tables:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
