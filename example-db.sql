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
  KEY `Index 1` (`kode_group`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table db_simoda.ref_bimbingan_mhs
CREATE TABLE IF NOT EXISTS `ref_bimbingan_mhs` (
  `id_bimbingan` int(11) NOT NULL AUTO_INCREMENT,
  `id_trx_bimbingan` int(11) NOT NULL,
  `id_dospem_mhs` int(11) NOT NULL,
  `status_persetujuan` enum('setuju','belum disetujui','tidak setuju') DEFAULT 'belum disetujui',
  `tgl_detail_review` varchar(50) DEFAULT NULL,
  `uc` char(50) DEFAULT NULL,
  `uu` char(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_bimbingan`),
  KEY `Index 1` (`id_bimbingan`),
  KEY `Index 2` (`id_trx_bimbingan`),
  KEY `Index 3` (`id_dospem_mhs`),
  CONSTRAINT `FK_bimbingan_dospem_mhs` FOREIGN KEY (`id_dospem_mhs`) REFERENCES `ref_dospem_mhs` (`id_dospem_mhs`),
  CONSTRAINT `FK_bimbingan_trx` FOREIGN KEY (`id_trx_bimbingan`) REFERENCES `trx_bimbingan_mhs` (`id_trx_bimbingan`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table db_simoda.ref_dospem
CREATE TABLE IF NOT EXISTS `ref_dospem` (
  `nidn` char(15) NOT NULL,
  `nama_dospem` varchar(255) NOT NULL,
  `uc` char(50) DEFAULT NULL,
  `uu` char(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`nidn`),
  KEY `Index 1` (`nidn`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table db_simoda.ref_dospem_mhs
CREATE TABLE IF NOT EXISTS `ref_dospem_mhs` (
  `id_dospem_mhs` int(11) NOT NULL AUTO_INCREMENT,
  `nidn` char(15) NOT NULL,
  `nim` char(15) NOT NULL,
  `keterangan_dospem` enum('dospem 1','dospem 2') DEFAULT NULL,
  `status_persetujuan` enum('setuju','belum disetujui','tidak setuju') DEFAULT NULL,
  `uc` char(50) DEFAULT NULL,
  `uu` char(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_dospem_mhs`),
  KEY `Index 1` (`id_dospem_mhs`),
  KEY `Index 2` (`nim`),
  KEY `Index 3` (`nidn`),
  CONSTRAINT `FK_ref_dospem_mhs_dospem` FOREIGN KEY (`nidn`) REFERENCES `ref_dospem` (`nidn`),
  CONSTRAINT `FK_ref_t_mhs_ref_dospem_mhs` FOREIGN KEY (`nim`) REFERENCES `ref_tesis_mahasiswa` (`nim`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table db_simoda.ref_group_user
CREATE TABLE IF NOT EXISTS `ref_group_user` (
  `id_group_user` int(11) NOT NULL AUTO_INCREMENT,
  `nomor_induk` char(15) NOT NULL,
  `kode_group` char(5) NOT NULL,
  PRIMARY KEY (`id_group_user`,`kode_group`),
  KEY `Index 1` (`id_group_user`),
  KEY `Index 2` (`kode_group`),
  KEY `Index 3` (`nomor_induk`),
  CONSTRAINT `FK_ref_group_m_group` FOREIGN KEY (`kode_group`) REFERENCES `m_group` (`kode_group`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_ref_user_ref_group` FOREIGN KEY (`nomor_induk`) REFERENCES `ref_user` (`nomor_induk`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table db_simoda.ref_materi_pembahasan
CREATE TABLE IF NOT EXISTS `ref_materi_pembahasan` (
  `id_materi_pembahasan` int(11) NOT NULL AUTO_INCREMENT,
  `materi_pembahasan` varchar(100) DEFAULT NULL,
  `uc` char(50) DEFAULT NULL,
  `uu` char(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_materi_pembahasan`),
  KEY `Index 1` (`id_materi_pembahasan`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table db_simoda.ref_menu1
CREATE TABLE IF NOT EXISTS `ref_menu1` (
  `kode_group` char(5) DEFAULT NULL,
  `kode_menu1` char(10) NOT NULL,
  `nama_menu1` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`kode_menu1`),
  KEY `Index 2` (`kode_group`),
  KEY `Index 3` (`kode_menu1`),
  CONSTRAINT `FK_ref_menu_m_group` FOREIGN KEY (`kode_group`) REFERENCES `m_group` (`kode_group`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table db_simoda.ref_menu2
CREATE TABLE IF NOT EXISTS `ref_menu2` (
  `kode_menu1` char(10) DEFAULT NULL,
  `kode_menu2` char(15) NOT NULL,
  `nama_menu2` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`kode_menu2`),
  KEY `Index 2` (`kode_menu1`),
  KEY `Index 3` (`kode_menu2`),
  CONSTRAINT `FK_ref_menu2_ref_menu1` FOREIGN KEY (`kode_menu1`) REFERENCES `ref_menu1` (`kode_menu1`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

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

-- Data exporting was unselected.

-- Dumping structure for table db_simoda.ref_status
CREATE TABLE IF NOT EXISTS `ref_status` (
  `kode_status` char(3) NOT NULL,
  `keterangan_status` varchar(255) DEFAULT NULL,
  `kategori_status` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`kode_status`),
  KEY `Index 1` (`kode_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table db_simoda.ref_sub_materi_pembahasan
CREATE TABLE IF NOT EXISTS `ref_sub_materi_pembahasan` (
  `id_sub_materi_pembahasan` int(11) NOT NULL AUTO_INCREMENT,
  `id_materi_pembahasan` int(11) NOT NULL,
  `sub_materi_pembahasan` varchar(100) DEFAULT NULL,
  `status_sub_materi` enum('optional','required') DEFAULT 'required',
  `uc` char(50) DEFAULT NULL,
  `uu` char(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_sub_materi_pembahasan`),
  KEY `Index 1` (`id_sub_materi_pembahasan`),
  KEY `Index 2` (`id_materi_pembahasan`),
  CONSTRAINT `Fk_mp_smp` FOREIGN KEY (`id_materi_pembahasan`) REFERENCES `ref_materi_pembahasan` (`id_materi_pembahasan`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table db_simoda.ref_tesis_mahasiswa
CREATE TABLE IF NOT EXISTS `ref_tesis_mahasiswa` (
  `nim` char(15) NOT NULL,
  `judul_tesis` varchar(255) NOT NULL,
  `kode_status` char(3) DEFAULT 'T01',
  `uc` char(50) DEFAULT NULL,
  `uu` char(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`nim`),
  KEY `Index 1` (`nim`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table db_simoda.ref_user
CREATE TABLE IF NOT EXISTS `ref_user` (
  `nomor_induk` char(15) NOT NULL,
  `nama_user` varchar(255) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `refresh_token` varchar(255) DEFAULT NULL,
  `token_expired` datetime DEFAULT NULL,
  `email_google` varchar(100) DEFAULT NULL,
  `email_ecampus` varchar(100) DEFAULT NULL,
  `uc` char(50) DEFAULT NULL,
  `uu` char(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`nomor_induk`),
  KEY `Index 2` (`nomor_induk`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table db_simoda.ref_user_sementara
CREATE TABLE IF NOT EXISTS `ref_user_sementara` (
  `email` varchar(100) NOT NULL,
  `token` varchar(255) NOT NULL,
  `refresh_token` varchar(255) NOT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table db_simoda.trx_agenda
CREATE TABLE IF NOT EXISTS `trx_agenda` (
  `id_trx_agenda` int(11) NOT NULL AUTO_INCREMENT,
  `nim` char(15) DEFAULT NULL,
  `nidn` char(15) DEFAULT NULL,
  `agenda_pertemuan` enum('online','offline') DEFAULT NULL,
  `kategori_agenda` enum('bimbingan','seminar proposal','seminar hasil','ujian sidang') NOT NULL,
  `keterangan_bimbingan` text NOT NULL,
  `status_persetujuan_jadwal` enum('setuju','belum disetujui') NOT NULL DEFAULT 'belum disetujui',
  `tgl_bimbingan` varchar(50) NOT NULL,
  `uc` char(50) DEFAULT NULL,
  `uu` char(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_trx_agenda`),
  KEY `Index 1` (`id_trx_agenda`),
  KEY `Index 2` (`nim`),
  KEY `Index 3` (`nidn`),
  CONSTRAINT `FK_dospem_agenda` FOREIGN KEY (`nidn`) REFERENCES `ref_dospem` (`nidn`),
  CONSTRAINT `FK_mhs_agenda` FOREIGN KEY (`nim`) REFERENCES `ref_tesis_mahasiswa` (`nim`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table db_simoda.trx_bimbingan_mhs
CREATE TABLE IF NOT EXISTS `trx_bimbingan_mhs` (
  `id_trx_bimbingan` int(11) NOT NULL AUTO_INCREMENT,
  `nim` char(15) NOT NULL,
  `id_sub_materi_pembahasan` int(11) NOT NULL,
  `url_path_doc` varchar(255) NOT NULL,
  `tgl_upload` varchar(50) NOT NULL,
  `tgl_review` varchar(50) DEFAULT NULL,
  `uc` char(50) DEFAULT NULL,
  `uu` char(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_trx_bimbingan`),
  KEY `Index 1` (`id_sub_materi_pembahasan`),
  KEY `Index 2` (`nim`),
  KEY `Index 3` (`id_sub_materi_pembahasan`),
  CONSTRAINT `FK_trx_bimbingan_mhs` FOREIGN KEY (`nim`) REFERENCES `ref_tesis_mahasiswa` (`nim`),
  CONSTRAINT `FK_trx_bimbingan_sub_m` FOREIGN KEY (`id_sub_materi_pembahasan`) REFERENCES `ref_sub_materi_pembahasan` (`id_sub_materi_pembahasan`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table db_simoda.trx_masukan_dospem
CREATE TABLE IF NOT EXISTS `trx_masukan_dospem` (
  `id_trx_masukan` int(11) NOT NULL AUTO_INCREMENT,
  `id_trx_bimbingan` int(11) NOT NULL,
  `id_dospem_mhs` int(11) NOT NULL,
  `masukan` text DEFAULT NULL,
  `uc` char(50) DEFAULT NULL,
  `uu` char(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_trx_masukan`),
  KEY `Index 1` (`id_trx_masukan`),
  KEY `Index 2` (`id_trx_bimbingan`),
  KEY `Index 3` (`id_dospem_mhs`),
  CONSTRAINT `FK_masukan_dsn_dospem_mhs` FOREIGN KEY (`id_dospem_mhs`) REFERENCES `ref_dospem_mhs` (`id_dospem_mhs`),
  CONSTRAINT `FK_masukan_dsn_trx_bimbingan` FOREIGN KEY (`id_trx_bimbingan`) REFERENCES `trx_bimbingan_mhs` (`id_trx_bimbingan`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table db_simoda.trx_notifikasi
CREATE TABLE IF NOT EXISTS `trx_notifikasi` (
  `id_notif` int(11) NOT NULL AUTO_INCREMENT,
  `nomor_induk` char(15) NOT NULL,
  `isi_notif` varchar(255) NOT NULL,
  `status_notif` char(1) NOT NULL DEFAULT '1',
  `uc` char(50) DEFAULT NULL,
  `uu` char(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_notif`),
  KEY `Index 2` (`id_notif`),
  KEY `Index 3` (`nomor_induk`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table db_simoda.trx_topik_penelitian
CREATE TABLE IF NOT EXISTS `trx_topik_penelitian` (
  `nomor_induk` char(15) NOT NULL,
  `id_topik` int(11) NOT NULL AUTO_INCREMENT,
  `topik_penelitian` varchar(100) NOT NULL,
  `uc` char(50) DEFAULT NULL,
  `uu` char(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_topik`),
  KEY `Index 1` (`id_topik`),
  KEY `Index 2` (`nomor_induk`),
  CONSTRAINT `FK_user_topik` FOREIGN KEY (`nomor_induk`) REFERENCES `ref_user` (`nomor_induk`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Data exporting was unselected.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
