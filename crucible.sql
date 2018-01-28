-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jan 28, 2018 at 03:05 PM
-- Server version: 5.5.53-0ubuntu0.14.04.1
-- PHP Version: 5.5.9-1ubuntu4.22

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `crucible`
--

-- --------------------------------------------------------

--
-- Table structure for table `episodes`
--

CREATE TABLE IF NOT EXISTS `episodes` (
  `show` varchar(1024) DEFAULT NULL COMMENT 'internal show name',
  `season` int(11) NOT NULL DEFAULT '0' COMMENT 'season number',
  `episode` int(11) NOT NULL DEFAULT '0' COMMENT 'episode number',
  `ismovie` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'used for series movies/ovas. specifies to place movie after season''s episodes, but not count as an episode.',
  `magnet` varchar(2048) DEFAULT NULL COMMENT 'torrent magnet link to video',
  `nickname` varchar(1024) DEFAULT NULL COMMENT 'OPTIONAL only used for series movie titles. will be ignored if not movie / OVA'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `shows`
--

CREATE TABLE IF NOT EXISTS `shows` (
  `name` varchar(1024) DEFAULT NULL COMMENT 'Internal name (used for coverart and links)',
  `nickname` varchar(1024) DEFAULT NULL COMMENT 'External name (displayed on frontend)',
  `ismove` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Movies only have 1 linked episode. will autostart that.'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
