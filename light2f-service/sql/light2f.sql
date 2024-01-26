/*
 Navicat Premium Data Transfer

 Source Server         : 101.34.63.4
 Source Server Type    : MySQL
 Source Server Version : 50738
 Source Host           : 101.34.63.4:3306
 Source Schema         : light2f

 Target Server Type    : MySQL
 Target Server Version : 50738
 File Encoding         : 65001

 Date: 26/01/2024 16:39:31
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for component
-- ----------------------------
DROP TABLE IF EXISTS `component`;
CREATE TABLE `component`  (
  `component_id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NULL DEFAULT NULL,
  `component_from_id` int(11) NULL DEFAULT NULL,
  `component_des` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `component_name` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `component_data_list` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `create_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` tinyint(2) NULL DEFAULT 0,
  `component_relations` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '关联',
  `component_sort` int(11) NOT NULL DEFAULT 0,
  `component_group` varchar(24) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `component_type` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `component_img` varchar(1204) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '介绍图',
  `component_use_tip` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`component_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 103 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '项目组件' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for component_prop_doc
-- ----------------------------
DROP TABLE IF EXISTS `component_prop_doc`;
CREATE TABLE `component_prop_doc`  (
  `component_prop_doc_id` int(11) NOT NULL AUTO_INCREMENT,
  `plug_id` int(11) NULL DEFAULT NULL,
  `component_prop_doc_prop` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '对应的prop',
  `component_prop_doc_name` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '如click,多个 cilck 通过sort 组件一组文档',
  `component_prop_doc_rem` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '注释',
  `component_prop_doc_code` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '代码',
  `component_prop_doc_sort` tinyint(2) NULL DEFAULT 0,
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` tinyint(2) NULL DEFAULT 0,
  PRIMARY KEY (`component_prop_doc_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 276 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '组件属性文档' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for file
-- ----------------------------
DROP TABLE IF EXISTS `file`;
CREATE TABLE `file`  (
  `file_id` int(11) NOT NULL AUTO_INCREMENT,
  `parent_id` int(11) NULL DEFAULT NULL COMMENT '没有parentId',
  `file_name` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `file_type` tinyint(2) NULL DEFAULT NULL COMMENT '1:文件夹',
  `is_deleted` tinyint(2) NULL DEFAULT 0,
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`file_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '文件' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for init_code
-- ----------------------------
DROP TABLE IF EXISTS `init_code`;
CREATE TABLE `init_code`  (
  `init_code_id` int(11) NOT NULL AUTO_INCREMENT,
  `page_id` int(11) NULL DEFAULT NULL,
  `init_code_type` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '代码类型\r\nvar: 变量\r\nfn: 函数\r\neffect: 副作用\r\nref: ref',
  `init_code_name` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '变量名',
  `init_code_effect` json NULL COMMENT '影响',
  `init_code_value` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '变量值',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` tinyint(2) NULL DEFAULT 0,
  PRIMARY KEY (`init_code_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4957 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '页面初始化代码' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for issue
-- ----------------------------
DROP TABLE IF EXISTS `issue`;
CREATE TABLE `issue`  (
  `issue_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NULL DEFAULT NULL,
  `issue_title` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `issue_content` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `issue_type` tinyint(2) NULL DEFAULT NULL COMMENT '问题类型',
  `issue_comment_count` int(11) NULL DEFAULT 0 COMMENT '问题评论数量',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` tinyint(2) NULL DEFAULT 0,
  PRIMARY KEY (`issue_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 23 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '问题' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for issue_comment
-- ----------------------------
DROP TABLE IF EXISTS `issue_comment`;
CREATE TABLE `issue_comment`  (
  `issue_comment_id` int(11) NOT NULL AUTO_INCREMENT,
  `parent_id` int(11) NULL DEFAULT NULL,
  `user_id` int(11) NULL DEFAULT NULL,
  `issue_id` int(11) NULL DEFAULT NULL,
  `issue_comment_content` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `issue_comment_star` int(11) NULL DEFAULT 0,
  `is_deleted` tinyint(2) NULL DEFAULT 0,
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`issue_comment_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 103 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '问题评论' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for issue_comment_star
-- ----------------------------
DROP TABLE IF EXISTS `issue_comment_star`;
CREATE TABLE `issue_comment_star`  (
  `issue_comment_star_id` int(11) NOT NULL AUTO_INCREMENT,
  `issue_comment_id` int(11) NULL DEFAULT NULL,
  `issue_comment_star_iam` tinyint(4) NULL DEFAULT NULL,
  `user_id` int(11) NULL DEFAULT NULL,
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`issue_comment_star_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '评论评分' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for log
-- ----------------------------
DROP TABLE IF EXISTS `log`;
CREATE TABLE `log`  (
  `log_id` int(11) NOT NULL AUTO_INCREMENT,
  `log_type` varchar(12) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `log_info` mediumtext CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` tinyint(2) NOT NULL DEFAULT 0,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`log_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 31 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for masterplate_page
-- ----------------------------
DROP TABLE IF EXISTS `masterplate_page`;
CREATE TABLE `masterplate_page`  (
  `masterplate_page_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NULL DEFAULT NULL,
  `masterplate_page_name` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '模版名称',
  `masterplate_page_master` tinyint(2) NULL DEFAULT 0,
  `masterplate_page_type` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT 'private' COMMENT 'public:公共的\nprivate:私有的\nsys:系统模版',
  `masterplate_page_des` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '描述',
  `is_deleted` tinyint(2) NULL DEFAULT 0,
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `masterplate_page_tmp` varchar(4096) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '{    }',
  PRIMARY KEY (`masterplate_page_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 202 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '页面母版' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for masterplate_project
-- ----------------------------
DROP TABLE IF EXISTS `masterplate_project`;
CREATE TABLE `masterplate_project`  (
  `masterplate_project_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NULL DEFAULT NULL,
  `masterplate_project_name` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `masterplate_project_base_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '路径//http://localhost:3000',
  `masterplate_project_token_name` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `masterplate_project_content_type` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `masterplate_project_grammar` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT 'hook' COMMENT '语法//保存字段\nhook\nclass',
  `masterplate_project_data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '全局数据',
  `masterplate_project_freedomen_config` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '组件配置',
  `masterplate_project_style` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `masterplate_project_des` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '描述',
  `masterplate_project_type` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT 'private' COMMENT 'public: 公共的\nprivate: 私有的\nsys:系统模版',
  `is_deleted` tinyint(2) NULL DEFAULT 0,
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`masterplate_project_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 182 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '项目模板' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for name_translator
-- ----------------------------
DROP TABLE IF EXISTS `name_translator`;
CREATE TABLE `name_translator`  (
  `name_translator_id` int(11) NOT NULL AUTO_INCREMENT,
  `name_translator_form` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `name_translatorto` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` tinyint(2) NULL DEFAULT 0,
  PRIMARY KEY (`name_translator_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '忘记了，可能没有用' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for notice
-- ----------------------------
DROP TABLE IF EXISTS `notice`;
CREATE TABLE `notice`  (
  `notice_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NULL DEFAULT NULL,
  `send_user_id` int(11) NULL DEFAULT NULL,
  `notice_title` varchar(68) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `notice_content` varchar(2048) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `notice_is_read` tinyint(4) NULL DEFAULT 0,
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` tinyint(4) NULL DEFAULT 0,
  PRIMARY KEY (`notice_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 43 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '通知' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for notice_copy1
-- ----------------------------
DROP TABLE IF EXISTS `notice_copy1`;
CREATE TABLE `notice_copy1`  (
  `notice_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NULL DEFAULT NULL,
  `send_user_id` int(11) NULL DEFAULT NULL,
  `notice_title` varchar(68) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `notice_content` varchar(2048) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `notice_is_read` tinyint(4) NULL DEFAULT 0,
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` tinyint(4) NULL DEFAULT 0,
  PRIMARY KEY (`notice_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 43 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for page
-- ----------------------------
DROP TABLE IF EXISTS `page`;
CREATE TABLE `page`  (
  `page_id` int(11) NOT NULL AUTO_INCREMENT,
  `masterplate_page_id` int(11) NULL DEFAULT NULL COMMENT '母版ID，可以为空',
  `parent_id` int(11) NULL DEFAULT NULL,
  `project_id` int(11) NULL DEFAULT NULL,
  `page_name` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '页面名称',
  `page_file_name` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT 'model' COMMENT '文件名称',
  `page_roles` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '可访问的角色',
  `page_hidden` tinyint(2) NULL DEFAULT 1 COMMENT '隱藏顯示\n1: 顯示\n2:隱藏',
  `page_router` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '路由',
  `page_data_list` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `page_sort` int(11) NULL DEFAULT NULL,
  `page_type` tinyint(4) NULL DEFAULT 0 COMMENT '页面类型\n\n-1:系统登录模版\n0:普通页面\n1:登录页面',
  `page_style` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `page_class` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT 'freedomen-page',
  `page_less` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `is_deleted` tinyint(2) NULL DEFAULT 0,
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`page_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2544 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '页面' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for plug
-- ----------------------------
DROP TABLE IF EXISTS `plug`;
CREATE TABLE `plug`  (
  `plug_id` int(11) NOT NULL AUTO_INCREMENT,
  `plug_same_id` int(11) NULL DEFAULT NULL COMMENT '同一个组件同一个ctype,用于区分版本，更新的时候以这个为依据，version + 1',
  `plug_tname` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '组件缺省type如：cinput',
  `user_id` int(11) NULL DEFAULT NULL,
  `plug_uid` varchar(225) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '组件对应的资源id',
  `plug_npm_libs` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `plug_name` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `plug_tooltip` varchar(12) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `plug_tags` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `plug_des` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `plug_version` int(11) NULL DEFAULT NULL,
  `plug_base_props` varchar(225) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `plug_custom_props` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `plug_star_count` int(11) NULL DEFAULT 0 COMMENT 'star数',
  `plug_comment_count` int(11) NULL DEFAULT 0 COMMENT '评论数',
  `plug_doc` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '组件使用文档',
  `plug_fav_count` int(11) NULL DEFAULT 0 COMMENT '收藏数',
  `plug_status` tinyint(4) NULL DEFAULT NULL COMMENT '组件状态\n1: private\n2: public',
  `plug_type` int(11) NULL DEFAULT NULL COMMENT '组件类型，容器，组件？\n1: 组件 \n2: 容器',
  `is_deleted` tinyint(2) NULL DEFAULT 0,
  `plug_log` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`plug_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 33 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '自定义组件，plug logs 版本控制' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for plug_comment
-- ----------------------------
DROP TABLE IF EXISTS `plug_comment`;
CREATE TABLE `plug_comment`  (
  `plug_comment_id` int(11) NOT NULL AUTO_INCREMENT,
  `plug_id` int(11) NULL DEFAULT NULL,
  `parent_id` int(11) NULL DEFAULT NULL,
  `user_id` int(11) NULL DEFAULT NULL,
  `plug_comment_content` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `is_deleted` tinyint(2) NULL DEFAULT 0,
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`plug_comment_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '组件评论' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for plug_fav
-- ----------------------------
DROP TABLE IF EXISTS `plug_fav`;
CREATE TABLE `plug_fav`  (
  `plug_fav_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NULL DEFAULT NULL,
  `plug_id` int(11) NULL DEFAULT NULL,
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` tinyint(4) NULL DEFAULT 0,
  PRIMARY KEY (`plug_fav_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '收藏' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for plug_same
-- ----------------------------
DROP TABLE IF EXISTS `plug_same`;
CREATE TABLE `plug_same`  (
  `plug_same_id` int(11) NOT NULL AUTO_INCREMENT,
  `last_plug_id` int(11) NULL DEFAULT NULL COMMENT '最后的组件id',
  `is_deleted` tinyint(4) NULL DEFAULT 0,
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`plug_same_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 25 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '每个组件，当前最新版本' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for plug_star
-- ----------------------------
DROP TABLE IF EXISTS `plug_star`;
CREATE TABLE `plug_star`  (
  `plug_star_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NULL DEFAULT NULL,
  `plug_id` int(11) NULL DEFAULT NULL,
  `plug_star_iam` tinyint(4) NULL DEFAULT NULL,
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` tinyint(4) NULL DEFAULT 0,
  PRIMARY KEY (`plug_star_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for plug_use
-- ----------------------------
DROP TABLE IF EXISTS `plug_use`;
CREATE TABLE `plug_use`  (
  `plug_use_id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NULL DEFAULT NULL,
  `user_id` int(11) NULL DEFAULT NULL,
  `plug_id` int(11) NULL DEFAULT NULL,
  `plug_use_name` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `plug_use_type` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `plug_use_version` int(11) NULL DEFAULT NULL,
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` tinyint(4) NULL DEFAULT 0,
  PRIMARY KEY (`plug_use_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 71 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '用户使用的组件' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for project
-- ----------------------------
DROP TABLE IF EXISTS `project`;
CREATE TABLE `project`  (
  `project_id` int(11) NOT NULL AUTO_INCREMENT,
  `masterplate_project_id` int(11) NULL DEFAULT NULL,
  `masterplate_page_id` int(11) NULL DEFAULT NULL COMMENT '母版ID,可以为空,记录系统是否很用一键生成',
  `user_id` int(11) NULL DEFAULT NULL,
  `project_name` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `project_roles` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '项目角色',
  `project_type` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT 'private' COMMENT 'private:私有的\npublic:公共的',
  `project_des` varchar(225) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '没有相关描述',
  `col_filter` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `database_url` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `database_username` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `database_password` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`project_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 253 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for service
-- ----------------------------
DROP TABLE IF EXISTS `service`;
CREATE TABLE `service`  (
  `service_id` int(11) NOT NULL AUTO_INCREMENT,
  `page_id` int(11) NULL DEFAULT NULL,
  `service_method` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT 'post' COMMENT '方法\nPOST\nGET\nPUT\nDELETE',
  `service_url` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `service_name` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `service_comment` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '注释',
  `service_response_type` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` tinyint(2) NULL DEFAULT 0,
  PRIMARY KEY (`service_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4868 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '接口' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_avatar` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '头像KEY',
  `user_account` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '帐号',
  `user_name` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '小红' COMMENT '用户名',
  `user_password` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `user_email` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '邮箱',
  `user_phone` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '手机号',
  `user_major` varchar(12) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '职业',
  `user_city` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '用户城市',
  `user_max_page` int(11) NULL DEFAULT 999,
  `user_max_project` int(11) NULL DEFAULT 999,
  `download_count` int(11) NULL DEFAULT 0 COMMENT '下载次数',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` tinyint(4) NULL DEFAULT 0,
  PRIMARY KEY (`user_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 70 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
