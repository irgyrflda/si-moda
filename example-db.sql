-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.4.32-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.7.0.6850
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for db_simoda
CREATE DATABASE IF NOT EXISTS `db_simoda` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `db_simoda`;

-- Dumping structure for table db_simoda.m_group
CREATE TABLE IF NOT EXISTS `m_group` (
  `kode_group` char(5) NOT NULL,
  `nama_group` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`kode_group`),
  KEY `Index 2` (`kode_group`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table db_simoda.m_group: ~4 rows (approximately)
INSERT INTO `m_group` (`kode_group`, `nama_group`) VALUES
	('G01', 'Mahasiswa'),
	('G02', 'Pembimbing'),
	('G03', 'Kaprodi'),
	('G04', 'Dekanat');

-- Dumping structure for table db_simoda.ref_menu1
CREATE TABLE IF NOT EXISTS `ref_menu1` (
  `kode_group` char(5) DEFAULT NULL,
  `kode_menu1` char(10) NOT NULL,
  `nama_menu1` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`kode_menu1`) USING BTREE,
  KEY `Index 2` (`kode_group`),
  KEY `Index 3` (`kode_menu1`),
  CONSTRAINT `FK_ref_menu_m_group` FOREIGN KEY (`kode_group`) REFERENCES `m_group` (`kode_group`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table db_simoda.ref_menu1: ~5 rows (approximately)
INSERT INTO `ref_menu1` (`kode_group`, `kode_menu1`, `nama_menu1`) VALUES
	('G01', 'G01.M01', 'Biodata'),
	('G01', 'G01.M02', 'Pembimbing'),
	('G01', 'G01.M03', 'Progres Tesis'),
	('G01', 'G01.M04', 'Agenda & Todo'),
	('G01', 'G01.M05', 'Reading List');

-- Dumping structure for table db_simoda.ref_menu2
CREATE TABLE IF NOT EXISTS `ref_menu2` (
  `kode_menu1` char(10) DEFAULT NULL,
  `kode_menu2` char(15) NOT NULL,
  `nama_menu2` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`kode_menu2`) USING BTREE,
  KEY `Index 2` (`kode_menu1`),
  KEY `Index 3` (`kode_menu2`),
  CONSTRAINT `FK_ref_menu2_ref_menu1` FOREIGN KEY (`kode_menu1`) REFERENCES `ref_menu1` (`kode_menu1`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table db_simoda.ref_menu2: ~5 rows (approximately)
INSERT INTO `ref_menu2` (`kode_menu1`, `kode_menu2`, `nama_menu2`) VALUES
	('G01.M03', 'G01.M03.M01', 'Bimbingan proposal'),
	('G01.M03', 'G01.M03.M02', 'BTR1'),
	('G01.M03', 'G01.M03.M03', 'Bimbingan tesis'),
	('G01.M03', 'G01.M03.M04', 'BTR2'),
	('G01.M03', 'G01.M03.M05', 'Sidang');

-- Dumping structure for table db_simoda.ref_menu3
CREATE TABLE IF NOT EXISTS `ref_menu3` (
  `kode_menu2` char(15) DEFAULT NULL,
  `kode_menu3` char(20) NOT NULL,
  `nama_menu3` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`kode_menu3`),
  KEY `Index 2` (`kode_menu2`),
  KEY `Index 3` (`kode_menu3`),
  CONSTRAINT `FK_ref_menu3_ref_menu2` FOREIGN KEY (`kode_menu2`) REFERENCES `ref_menu2` (`kode_menu2`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table db_simoda.ref_menu3: ~0 rows (approximately)

-- Dumping structure for table db_simoda.ref_user
CREATE TABLE IF NOT EXISTS `ref_user` (
  `nip` char(15) NOT NULL,
  `kode_group` char(5) NOT NULL,
  `token` varchar(255) DEFAULT NULL,
  `refresh_token` varchar(255) DEFAULT NULL,
  `token_expired` datetime DEFAULT NULL,
  `email_google` varchar(100) DEFAULT NULL,
  `email_ecampus` varchar(100) DEFAULT NULL,
  `ucr` char(50) DEFAULT NULL,
  `uch` char(50) DEFAULT NULL,
  `udcr` timestamp NULL DEFAULT current_timestamp(),
  `udch` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`nip`),
  KEY `Index 2` (`nip`),
  KEY `Index 3` (`kode_group`),
  CONSTRAINT `FK_ref_user_m_group` FOREIGN KEY (`kode_group`) REFERENCES `m_group` (`kode_group`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table db_simoda.ref_user: ~0 rows (approximately)

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
