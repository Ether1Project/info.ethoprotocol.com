-- MySQL dump 10.13  Distrib 8.0.18, for macos10.14 (x86_64)
--
-- Host: localhost    Database: info
-- ------------------------------------------------------
-- Server version	8.0.18

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `info`
--

DROP TABLE IF EXISTS `info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `coin_1_id` int(11) NOT NULL,
  `coin_1_name` varchar(25) NOT NULL,
  `coin_1_symbol` varchar(25) NOT NULL,
  `coin_1_rank` int(11) NOT NULL,
  `coin_1_markets` int(11) NOT NULL,
  `coin_1_supply` decimal(36,18) DEFAULT NULL,
  `coin_1_quote` decimal(36,18) DEFAULT NULL,
  `coin_1_percent1d` int(8) DEFAULT NULL,
  `coin_1_percent7d` int(8) DEFAULT NULL,
  `coin_1_percent30d` int(8) DEFAULT NULL,
  `coin_2_id` int(11) NOT NULL,
  `coin_2_name` varchar(25) NOT NULL,
  `coin_2_symbol` varchar(25) NOT NULL,
  `coin_2_rank` int(11) NOT NULL,
  `coin_2_markets` int(11) NOT NULL,
  `coin_2_supply` decimal(36,18) DEFAULT NULL,
  `coin_2_quote` decimal(36,18) DEFAULT NULL,
  `coin_2_percent1d` int(8) DEFAULT NULL,
  `coin_2_percent7d` int(8) DEFAULT NULL,
  `coin_2_percent30d` int(8) DEFAULT NULL,
  `coin_3_id` int(11) NOT NULL,
  `coin_3_name` varchar(25) NOT NULL,
  `coin_3_symbol` varchar(25) NOT NULL,
  `coin_3_rank` int(11) NOT NULL,
  `coin_3_markets` int(11) NOT NULL,
  `coin_3_supply` decimal(36,18) DEFAULT NULL,
  `coin_3_quote` decimal(36,18) DEFAULT NULL,
  `coin_3_percent1d` int(8) DEFAULT NULL,
  `coin_3_percent7d` int(8) DEFAULT NULL,
  `coin_3_percent30d` int(8) DEFAULT NULL,
  `coin_4_id` int(11) NOT NULL,
  `coin_4_name` varchar(25) NOT NULL,
  `coin_4_symbol` varchar(25) NOT NULL,
  `coin_4_rank` int(11) NOT NULL,
  `coin_4_markets` int(11) NOT NULL,
  `coin_4_supply` decimal(36,18) DEFAULT NULL,
  `coin_4_quote` decimal(36,18) DEFAULT NULL,
  `coin_4_percent1d` int(8) DEFAULT NULL,
  `coin_4_percent7d` int(8) DEFAULT NULL,
  `coin_4_percent30d` int(8) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `etho_trending` int(8) DEFAULT NULL,
  `etho_watchlist` int(11) DEFAULT NULL,
  `etho_activeUploadContracts` decimal(16,0) DEFAULT NULL,
  `etho_totalNetworkStorageUse` decimal(16,0) DEFAULT NULL,
  `etho_networkStorageAvailable` decimal(16,0) DEFAULT NULL,
  `etho_active_gatewaynodes` decimal(16,0) DEFAULT NULL,
  `etho_active_masternode` decimal(16,0) DEFAULT NULL,
  `etho_active_servicenodes` decimal(16,0) DEFAULT NULL,
  `etho_hashrate` decimal(16,0) DEFAULT NULL,
  `etho_difficulty` decimal(16,0) DEFAULT NULL,
  `etho_exchange_stex` decimal(16,0) DEFAULT NULL,
  `etho_exchange_probit` decimal(16,0) DEFAULT NULL,
  `etho_exchange_graviex` decimal(16,0) DEFAULT NULL,
  `etho_exchange_mercatox` decimal(16,0) DEFAULT NULL,
  `etho_devfund` decimal(16,0) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `info`
--

LOCK TABLES `info` WRITE;
/*!40000 ALTER TABLE `info` DISABLE KEYS */;

/*!40000 ALTER TABLE `info` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-05-15 18:12:00
