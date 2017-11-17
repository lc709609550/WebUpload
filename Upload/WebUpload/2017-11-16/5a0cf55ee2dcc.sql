/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50622
Source Host           : localhost:3310
Source Database       : langfang2

Target Server Type    : MYSQL
Target Server Version : 50622
File Encoding         : 65001

Date: 2017-11-14 08:52:21
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `bh_fault_case`
-- ----------------------------
DROP TABLE IF EXISTS `bh_fault_case`;
CREATE TABLE `bh_fault_case` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `plant_uuid` char(32) NOT NULL DEFAULT '',
  `state_brief` varchar(255) DEFAULT NULL COMMENT '状态简述',
  `fault_chart` varchar(255) DEFAULT NULL COMMENT '故障特征',
  `fault_analy` varchar(255) DEFAULT NULL COMMENT '故障分析',
  `diag_sugges` varchar(255) DEFAULT NULL COMMENT '诊断建议',
  `state_assessment` varchar(50) DEFAULT NULL COMMENT '状态评估',
  `diag_company` varchar(50) DEFAULT NULL COMMENT '诊断单位',
  `diag_person` varchar(50) DEFAULT NULL COMMENT '诊断人员',
  `diag_time` datetime DEFAULT NULL COMMENT '诊断日期',
  `feedback` varchar(255) DEFAULT NULL COMMENT '检修反馈',
  `result` varchar(50) DEFAULT NULL COMMENT '验证结果',
  `record_user` varchar(50) NOT NULL COMMENT '记录人',
  `record_time` datetime NOT NULL COMMENT '记录时间',
  `diag_id` int(11) DEFAULT NULL COMMENT '诊断报告附件id',
  `repair_id` int(11) DEFAULT NULL COMMENT '维修记录附件id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of bh_fault_case
-- ----------------------------
INSERT INTO `bh_fault_case` VALUES ('16', '197aff27a87ded21390d193f87a4b3c2', '213', '123', '123', '123', '高值报警', '1', '1', '2017-11-10 15:39:23', '111', '正确', '管理员', '2017-11-10 15:39:11', '1201', '1202');
INSERT INTO `bh_fault_case` VALUES ('18', '13decb05f00c5bee17c1e307f3839e45', '123', '123', '123', '123', '基本正常', null, null, '2017-11-02 16:57:08', null, null, '管理员', '2017-11-10 16:56:55', null, null);
