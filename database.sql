-- Create syntax for TABLE 'area_requests'
CREATE TABLE `area_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `onboardingProcessId` int NOT NULL,
  `areaId` int NOT NULL,
  `status` varchar(50) DEFAULT 'Pendiente',
  `deadline` date NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `onboardingProcessId` (`onboardingProcessId`),
  KEY `areaId` (`areaId`),
  CONSTRAINT `area_requests_ibfk_1` FOREIGN KEY (`onboardingProcessId`) REFERENCES `onboarding_processes` (`id`),
  CONSTRAINT `area_requests_ibfk_2` FOREIGN KEY (`areaId`) REFERENCES `areas` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create syntax for TABLE 'areas'
CREATE TABLE `areas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create syntax for TABLE 'assets_deliveries'
CREATE TABLE `assets_deliveries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `onboardingProcessId` int NOT NULL,
  `itemName` varchar(100) NOT NULL,
  `serialNumber` varchar(100) DEFAULT NULL,
  `isDelivered` tinyint(1) DEFAULT '0',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `onboardingProcessId` (`onboardingProcessId`),
  CONSTRAINT `assets_deliveries_ibfk_1` FOREIGN KEY (`onboardingProcessId`) REFERENCES `onboarding_processes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create syntax for TABLE 'onboarding_processes'
CREATE TABLE `onboarding_processes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `processCode` varchar(50) NOT NULL,
  `fullName` varchar(150) NOT NULL,
  `documentType` varchar(20) NOT NULL,
  `documentNumber` varchar(50) NOT NULL,
  `position` varchar(100) NOT NULL,
  `areaId` int NOT NULL,
  `startDate` date NOT NULL,
  `managerId` int NOT NULL,
  `status` varchar(50) DEFAULT 'Pendiente',
  `signatureToken` varchar(100) DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `processCode` (`processCode`),
  KEY `areaId` (`areaId`),
  KEY `managerId` (`managerId`),
  CONSTRAINT `onboarding_processes_ibfk_1` FOREIGN KEY (`areaId`) REFERENCES `areas` (`id`),
  CONSTRAINT `onboarding_processes_ibfk_2` FOREIGN KEY (`managerId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create syntax for TABLE 'position_templates'
CREATE TABLE `position_templates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `positionName` varchar(100) NOT NULL,
  `suggestedComputerType` varchar(50) DEFAULT NULL,
  `suggestedSoftware` text,
  `suggestedTraining` text,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create syntax for TABLE 'roles'
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create syntax for TABLE 'technical_requirements'
CREATE TABLE `technical_requirements` (
  `id` int NOT NULL AUTO_INCREMENT,
  `onboardingProcessId` int NOT NULL,
  `computerType` varchar(50) DEFAULT NULL,
  `softwareLicenses` text,
  `clothingSizes` text,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `onboardingProcessId` (`onboardingProcessId`),
  CONSTRAINT `technical_requirements_ibfk_1` FOREIGN KEY (`onboardingProcessId`) REFERENCES `onboarding_processes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create syntax for TABLE 'training_plans'
CREATE TABLE `training_plans` (
  `id` int NOT NULL AUTO_INCREMENT,
  `onboardingProcessId` int NOT NULL,
  `courseName` varchar(150) NOT NULL,
  `description` text,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `onboardingProcessId` (`onboardingProcessId`),
  CONSTRAINT `training_plans_ibfk_1` FOREIGN KEY (`onboardingProcessId`) REFERENCES `onboarding_processes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create syntax for TABLE 'users'
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `roleId` int NOT NULL,
  `areaId` int DEFAULT NULL,
  `fullName` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `roleId` (`roleId`),
  KEY `areaId` (`areaId`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`),
  CONSTRAINT `users_ibfk_2` FOREIGN KEY (`areaId`) REFERENCES `areas` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create syntax for TABLE 'workstations'
CREATE TABLE `workstations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `seatCode` varchar(20) NOT NULL,
  `status` varchar(50) DEFAULT 'Disponible',
  `onboardingProcessId` int DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `seatCode` (`seatCode`),
  KEY `onboardingProcessId` (`onboardingProcessId`),
  CONSTRAINT `workstations_ibfk_1` FOREIGN KEY (`onboardingProcessId`) REFERENCES `onboarding_processes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;