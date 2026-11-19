-- 姓名：赵国庆 | 学号：24002120201 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash
-- 科技新闻聚合平台 数据库重建脚本（可在新机器上直接执行）

CREATE DATABASE IF NOT EXISTS `zhaogq_tech_news`
  DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

USE `zhaogq_tech_news`;

DROP TABLE IF EXISTS `Zhaogq_news`;
CREATE TABLE `Zhaogq_news` (
  `Zhaogq_id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '新闻主键',
  `Zhaogq_title` VARCHAR(200) NOT NULL COMMENT '新闻标题',
  `Zhaogq_category` VARCHAR(50) NOT NULL COMMENT '新闻分类',
  `Zhaogq_summary` VARCHAR(500) NOT NULL COMMENT '新闻摘要',
  `Zhaogq_content` TEXT COMMENT '新闻正文',
  `Zhaogq_author` VARCHAR(50) NOT NULL COMMENT '作者',
  `Zhaogq_source` VARCHAR(100) NOT NULL COMMENT '来源媒体',
  `Zhaogq_publish_time` DATETIME NOT NULL COMMENT '发布时间',
  `Zhaogq_views` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '浏览量',
  `Zhaogq_cover` VARCHAR(255) DEFAULT '' COMMENT '封面图路径',
  `Zhaogq_create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '入库时间',
  PRIMARY KEY (`Zhaogq_id`),
  KEY `Zhaogq_idx_category` (`Zhaogq_category`),
  KEY `Zhaogq_idx_publish_time` (`Zhaogq_publish_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='科技新闻表';

INSERT INTO `Zhaogq_news`
(`Zhaogq_title`, `Zhaogq_category`, `Zhaogq_summary`, `Zhaogq_content`, `Zhaogq_author`, `Zhaogq_source`, `Zhaogq_publish_time`, `Zhaogq_views`, `Zhaogq_cover`) VALUES
('国产大模型发布新一代多模态推理架构', '人工智能', '新架构在图文理解与长文本推理两类基准上同时刷新纪录，推理成本下降约四成。', '该模型在统一的视觉-语言编码器中引入稀疏专家路由，使训练算力利用率显著提升，并支持最长 200 万 token 的上下文窗口。', '林知远', '智元科技观察', '2026-11-18 09:30:00', 18240, 'images/Zhaogq_img_1.svg'),
('可折叠屏手机铰链寿命突破六十万次', '消费电子', '第三方实验室完成折叠测试，折痕控制在肉眼难辨水平，量产机型预计明年一季度上市。', '测试采用每秒一次的折叠频率，并在高温高湿环境下交替进行，最终在第六十万次折叠后屏幕显示与触控功能保持正常。', '周可欣', '数码前线', '2026-11-17 14:10:00', 15230, 'images/Zhaogq_img_2.svg'),
('量子计算原型机完成千比特级纠错实验', '前沿科技', '研究团队实现表面码逻辑量子比特稳定运行，为容错量子计算提供了新的工程路径。', '实验在超导量子处理器上完成，逻辑错误率较物理量子比特降低一个数量级，并连续运行超过两小时。', '陈子墨', '粒子科学周刊', '2026-11-16 10:05:00', 9640, 'images/Zhaogq_img_3.svg'),
('云厂商上线液冷数据中心集群', '云计算', '新一代集群采用冷板式液冷方案，单机柜功率密度提升至 80 千瓦，PUE 降至 1.08。', '该集群面向大模型训练场景，配套提供高速互联网络与弹性存储服务，已向首批企业客户开放试用。', '赵一鸣', '云端产业报', '2026-11-15 16:45:00', 7420, 'images/Zhaogq_img_4.svg'),
('城市级自动驾驶路测里程突破一亿公里', '智能汽车', '多城联合发布的报告中，自动驾驶车辆在复杂路口的接管率同比下降 37%。', '报告覆盖十二座城市共三千余辆测试车，数据显示夜间与雨天场景的感知稳定性提升最为明显。', '孙嘉禾', '出行时代', '2026-11-14 08:20:00', 12810, 'images/Zhaogq_img_5.svg'),
('开源社区发布轻量级边缘推理框架', '人工智能', '新框架可在 2GB 内存设备上运行七亿参数模型，首字延迟控制在 300 毫秒以内。', '框架通过算子融合与动态量化技术降低内存占用，并提供了面向摄像头、车载终端等场景的示例工程。', '吴清和', '开源技术日报', '2026-11-13 19:30:00', 11050, 'images/Zhaogq_img_6.svg'),
('卫星互联网完成手机直连视频通话验证', '前沿科技', '在无地面基站覆盖的远海区域，普通智能手机与卫星之间完成了双向视频通话。', '本次验证使用低轨星座与地面信关站协同调度，通话时延约 220 毫秒，可持续通话十五分钟以上。', '郑南星', '空天通信观察', '2026-11-12 11:15:00', 8730, 'images/Zhaogq_img_7.svg'),
('工业机器人视觉分拣精度提升至零点一毫米', '智能汽车', '视觉算法与力控模块协同后，精密零件分拣良率提升到 99.6%，产线换型时间缩短一半。', '系统采用多相机标定与在线补偿策略，可在零件姿态随机摆放的情况下完成稳定抓取。', '何书言', '智能制造周刊', '2026-11-11 15:00:00', 6890, 'images/Zhaogq_img_8.svg');

DROP TABLE IF EXISTS `Zhaogq_gallery`;
CREATE TABLE `Zhaogq_gallery` (
  `Zhaogq_id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '图文主键',
  `Zhaogq_title` VARCHAR(200) NOT NULL COMMENT '图文标题',
  `Zhaogq_image` VARCHAR(255) NOT NULL COMMENT '图片路径',
  `Zhaogq_description` VARCHAR(500) NOT NULL COMMENT '图文描述',
  `Zhaogq_tech` VARCHAR(50) NOT NULL COMMENT '所属技术领域',
  `Zhaogq_create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`Zhaogq_id`),
  KEY `Zhaogq_idx_tech` (`Zhaogq_tech`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='科技图文表';

INSERT INTO `Zhaogq_gallery`
(`Zhaogq_title`, `Zhaogq_image`, `Zhaogq_description`, `Zhaogq_tech`) VALUES
('神经网络可视化实验室', 'images/Zhaogq_img_1.svg', '研究团队将千层网络的计算过程转化为可交互的三维图谱，帮助工程师定位训练瓶颈。', '人工智能'),
('折叠屏铰链耐久测试台', 'images/Zhaogq_img_2.svg', '机械臂以恒定节奏完成开合动作，传感器实时记录扭矩与形变数据。', '消费电子'),
('量子芯片低温测量装置', 'images/Zhaogq_img_3.svg', '稀释制冷机内，量子芯片在接近绝对零度的环境中完成相干时间测量。', '前沿科技'),
('液冷数据中心机房', 'images/Zhaogq_img_4.svg', '冷板式液冷管路沿着机柜排布，将芯片热量直接带离服务器。', '云计算'),
('城市道路自动驾驶测试车', 'images/Zhaogq_img_5.svg', '测试车顶部集成多颗激光雷达与摄像头，实时构建周围环境模型。', '智能汽车'),
('边缘计算开发套件', 'images/Zhaogq_img_6.svg', '手掌大小的开发板上运行轻量推理框架，可离线完成图像识别任务。', '人工智能'),
('低轨卫星星座示意', 'images/Zhaogq_img_7.svg', '多颗低轨卫星组成通信星座，为偏远地区提供广域网络覆盖。', '前沿科技'),
('智能分拣机械臂', 'images/Zhaogq_img_8.svg', '机械臂搭载视觉相机与力控末端执行器，实现精密零件的自动分拣。', '智能制造');
