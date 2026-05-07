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

 Date: 07/05/2026 20:13:14
*/

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
) ENGINE = InnoDB AUTO_INCREMENT = 25 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of products
-- ----------------------------
INSERT INTO `products` VALUES (16, 'Lame Burger', 'A very lame burger with no taste.', 6, '/img/NNbaagaa.png');
INSERT INTO `products` VALUES (17, 'Mediocre Fries', 'Fries that are just okay, nothing special.', 2.99, '/img/NNfries.png');
INSERT INTO `products` VALUES (18, 'Bland Chicken Burger', 'A bland chicken burger that tastes like nothing.', 4.99, '/img/NNchickenbaaga.png');
INSERT INTO `products` VALUES (19, 'Nuggets of Doom and Despair', 'Chicken nuggets that will make you question your life choices.', 3.99, '/img/NNnugs.png');
INSERT INTO `products` VALUES (20, 'Big Burger for Big Sadness', 'A sad burger that tastes like disappointment.', 13.99, '/img/NNiso.png');
INSERT INTO `products` VALUES (21, 'Small Burger of Existential Dread', 'A tiny burger that encapsulates the feeling of existential dread.', 2.99, '/img/NNpieni.png');
INSERT INTO `products` VALUES (22, 'Sad Soda', 'A sad soda for sad people.', 1.99, '/img/NNdrink.png');
INSERT INTO `products` VALUES (23, 'Milkshake of Misery', 'A milkshake that is as miserable as it sounds.', 5.99, '/img/NNcmilks.png');
INSERT INTO `products` VALUES (24, 'Pink Milkshake from the Cows of Despair', 'This one is not even so bad', 5.49, '/img/NNsmilks.png');

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
INSERT INTO `users` VALUES (8, 'og_smith', '$2b$10$jPgBslim26S.VBOh9gL1XusgfHS5sDR9bWcgRS6xU/F13mw8gC.8q', 1, '91378496c3edd9e1fe3c4512cfdb13d40d9ef12f33b3236dc19cb7382f5ccfc5583863b673a917fb3dde58620f15823b56c287e233e2e04fd847038d2fa5e8db');

SET FOREIGN_KEY_CHECKS = 1;
