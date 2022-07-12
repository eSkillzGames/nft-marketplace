/*
SQLyog Community v13.1.6 (64 bit)
MySQL - 10.4.11-MariaDB : Database - unityserver
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`unityserver` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `unityserver`;

/*Table structure for table `tbl_hash` */

DROP TABLE IF EXISTS `tbl_hash`;

CREATE TABLE `tbl_hash` (
  `address` varchar(255) DEFAULT NULL,
  `transactionHash` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `tbl_hash` */

insert  into `tbl_hash`(`address`,`transactionHash`,`type`) values 
('0x778eb5aea11c8f0f2bc2280ce0305cd61b3d3714','0x439904b51cc1276183296800f9a07905aca118772a0dbe89c0027d43468f685c','sport'),
('0x89c30f2af966ed9e733e5dcfc76ae984eaaf5373','0x5a51c479e7b4c18a9dd7c7629de8566d28f904ca1784b4d3548ed9a8a0edcfb8','sport');

/*Table structure for table `tbl_transaction` */

DROP TABLE IF EXISTS `tbl_transaction`;

CREATE TABLE `tbl_transaction` (
  `address` varchar(255) DEFAULT NULL,
  `result` varchar(255) DEFAULT NULL,
  `contract` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `tbl_transaction` */

insert  into `tbl_transaction`(`address`,`result`,`contract`) values 
('0x778eb5aea11c8f0f2bc2280ce0305cd61b3d3714','end','sport'),
('0x778eb5aea11c8f0f2bc2280ce0305cd61b3d3714','end','bet'),
('0x89c30f2af966ed9e733e5dcfc76ae984eaaf5373','end','sport'),
('0x89c30f2af966ed9e733e5dcfc76ae984eaaf5373','end','bet'),
('0x89c30f2af966ed9e733e5dcfc76ae984eaaf5373','end','cuenft'),
('0x778eb5AEA11c8F0f2BC2280ce0305cD61B3D3714','end','cuenft');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
