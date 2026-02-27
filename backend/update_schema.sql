CREATE TABLE `AIConfig` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `isEnabled` TINYINT(1) NOT NULL DEFAULT 1,
    `autoQualifyLeads` TINYINT(1) NOT NULL DEFAULT 1,
    `model` VARCHAR(191) NOT NULL DEFAULT 'GPT-4o',
    `confidenceScore` INT NOT NULL DEFAULT 80,
    `updatedAt` DATETIME(3) NOT NULL,
    `updatedById` INT NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `AIConfig_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `WorkingHours` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `dayOfWeek` INT NOT NULL,
    `isActive` TINYINT(1) NOT NULL DEFAULT 1,
    `startTime` VARCHAR(191) NOT NULL DEFAULT '09:00',
    `endTime` VARCHAR(191) NOT NULL DEFAULT '17:00',
    `timezone` VARCHAR(191) NOT NULL DEFAULT 'UTC',
    `updatedAt` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `WorkingHours_dayOfWeek_timezone_key`(`dayOfWeek`, `timezone`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `RoutingRule` ADD COLUMN `isActive` TINYINT(1) NOT NULL DEFAULT 1;
