/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 110702
 Source Host           : localhost:3306
 Source Schema         : fastfood

 Target Server Type    : MySQL
 Target Server Version : 110702
 File Encoding         : 65001

 Date: 15/04/2026 18:50:58
*/

-- =========[MANUAL ADDITIONS]==============
DROP DATABASE IF EXISTS fastfood;
CREATE DATABASE fastfood;

DROP USER IF EXISTS 'fastfood'@'localhost';
CREATE USER 'fastfood'@'localhost' IDENTIFIED BY 'fastfood';

GRANT ALL PRIVILEGES ON fastfood.* TO 'fastfood'@'localhost';

USE fastfood;
-- ========[END OF ADDITIONS]==============


SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for products
-- ----------------------------
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `price` float NULL DEFAULT NULL,
  `image_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of products
-- ----------------------------
INSERT INTO `products` VALUES (1, 'big mac', 'aa', 3, '/burgir.jpg');
INSERT INTO `products` VALUES (2, 'aa', 'aa', NULL, '/burgir.jpg');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL,
  `password_bcrypt` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `tier` int(255) NULL DEFAULT NULL,
  `session_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (8, 'og_smith', '$2b$10$jPgBslim26S.VBOh9gL1XusgfHS5sDR9bWcgRS6xU/F13mw8gC.8q', 1, '53852e43871aa9f037237d3618a16a0d9e81af66a6563751f214ae478556c5ffed1e532367725a39ec79eea19a4b098a1b83215e98fb33f3ec986f172df93def');

SET FOREIGN_KEY_CHECKS = 1;
