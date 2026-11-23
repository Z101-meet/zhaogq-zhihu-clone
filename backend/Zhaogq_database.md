# Zhaogq_database.md — 数据库变更记录

> 按执行顺序追加；仅凭本文件即可在新机器上完整重建数据库。
> 执行方式：`mysql -uroot -p --default-character-set=utf8mb4 < backend/Zhaogq_init.sql`

---

## 2026-11-19 10:35:00 · 创建数据库

```sql
CREATE DATABASE IF NOT EXISTS `zhaogq_tech_news`
  DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

USE `zhaogq_tech_news`;
```

## 2026-11-19 10:35:00 · 创建科技新闻表 Zhaogq_news

```sql
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
```

## 2026-11-19 10:35:00 · 插入科技新闻测试数据（8 条）

```sql
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
```

## 2026-11-19 10:35:00 · 创建科技图文表 Zhaogq_gallery

```sql
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
```

## 2026-11-19 10:35:00 · 插入科技图文测试数据（8 条）

```sql
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
```

## 2026-11-19 10:36:00 · 验证结果

```sql
SELECT COUNT(*) FROM `Zhaogq_news`;     -- 8
SELECT COUNT(*) FROM `Zhaogq_gallery`;  -- 8
```

## 2026-11-23 14:55:00 · 创建知识库表并导入种子数据（8 个文件 / 11 个片段）

> 与 backend/Zhaogq_kb_seed.js 生成结果一致，可直接执行重建。

```sql
-- 知识库数据重建脚本（由 Zhaogq_kbSeed.js 生成）
CREATE TABLE IF NOT EXISTS Zhaogq_kb_file (
  Zhaogq_id INT AUTO_INCREMENT PRIMARY KEY,
  Zhaogq_name VARCHAR(255) NOT NULL COMMENT '文件名',
  Zhaogq_ext VARCHAR(16) NOT NULL COMMENT '扩展名',
  Zhaogq_size INT NOT NULL DEFAULT 0 COMMENT '字节数',
  Zhaogq_path VARCHAR(512) NOT NULL DEFAULT '' COMMENT '存储路径',
  Zhaogq_chunk_count INT NOT NULL DEFAULT 0 COMMENT '片段数',
  Zhaogq_create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_Zhaogq_create_time (Zhaogq_create_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='知识库文件表';
CREATE TABLE IF NOT EXISTS Zhaogq_kb_chunk (
  Zhaogq_id INT AUTO_INCREMENT PRIMARY KEY,
  Zhaogq_file_id INT NOT NULL COMMENT '所属文件ID',
  Zhaogq_chunk_index INT NOT NULL COMMENT '片段序号',
  Zhaogq_content TEXT NOT NULL COMMENT '片段内容',
  Zhaogq_create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_Zhaogq_file_id (Zhaogq_file_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='知识库片段表';

DELETE FROM Zhaogq_kb_chunk;
DELETE FROM Zhaogq_kb_file;

INSERT INTO Zhaogq_kb_file (Zhaogq_id, Zhaogq_name, Zhaogq_ext, Zhaogq_size, Zhaogq_path, Zhaogq_chunk_count) VALUES (1, '星图智能客服手册.docx', 'docx', 10664, 'uploads/Zhaogq_kb/星图智能客服手册.docx', 2);
INSERT INTO Zhaogq_kb_file (Zhaogq_id, Zhaogq_name, Zhaogq_ext, Zhaogq_size, Zhaogq_path, Zhaogq_chunk_count) VALUES (2, '星图产品培训讲义.pptx', 'pptx', 72880, 'uploads/Zhaogq_kb/星图产品培训讲义.pptx', 2);
INSERT INTO Zhaogq_kb_file (Zhaogq_id, Zhaogq_name, Zhaogq_ext, Zhaogq_size, Zhaogq_path, Zhaogq_chunk_count) VALUES (3, '售后FAQ.txt', 'txt', 774, 'uploads/Zhaogq_kb/售后FAQ.txt', 1);
INSERT INTO Zhaogq_kb_file (Zhaogq_id, Zhaogq_name, Zhaogq_ext, Zhaogq_size, Zhaogq_path, Zhaogq_chunk_count) VALUES (4, '配送与安装说明.txt', 'txt', 693, 'uploads/Zhaogq_kb/配送与安装说明.txt', 1);
INSERT INTO Zhaogq_kb_file (Zhaogq_id, Zhaogq_name, Zhaogq_ext, Zhaogq_size, Zhaogq_path, Zhaogq_chunk_count) VALUES (5, '会员与积分规则.txt', 'txt', 634, 'uploads/Zhaogq_kb/会员与积分规则.txt', 1);
INSERT INTO Zhaogq_kb_file (Zhaogq_id, Zhaogq_name, Zhaogq_ext, Zhaogq_size, Zhaogq_path, Zhaogq_chunk_count) VALUES (6, '发票与报销指引.txt', 'txt', 599, 'uploads/Zhaogq_kb/发票与报销指引.txt', 1);
INSERT INTO Zhaogq_kb_file (Zhaogq_id, Zhaogq_name, Zhaogq_ext, Zhaogq_size, Zhaogq_path, Zhaogq_chunk_count) VALUES (7, '保修条款.txt', 'txt', 573, 'uploads/Zhaogq_kb/保修条款.txt', 1);
INSERT INTO Zhaogq_kb_file (Zhaogq_id, Zhaogq_name, Zhaogq_ext, Zhaogq_size, Zhaogq_path, Zhaogq_chunk_count) VALUES (8, '隐私与数据安全说明.txt', 'txt', 651, 'uploads/Zhaogq_kb/隐私与数据安全说明.txt', 1);

INSERT INTO Zhaogq_kb_chunk (Zhaogq_id, Zhaogq_file_id, Zhaogq_chunk_index, Zhaogq_content) VALUES (1, 1, 1, '星图智能客服手册\n一、公司简介\n星图智能科技（以下简称“星图”）成立于 2018 年，总部位于杭州，专注于智能家居与家庭安防产品，主要产品包括 HomeHub 智能网关、智能音箱、智能摄像头和智能门锁，服务用户超过 300 万户。\n二、退换货政策\n自签收之日起 7 天内，商品未激活且包装完好，可申请无理由退货，运费由买家承担。15 天内出现非人为质量问题，可选择换新或退货，运费由星图承担。定制类商品、已激活的软件服务不支持无理由退货。\n三、配送时效\n江浙沪地区次日达，全国大部分城市 48 小时内送达，偏远地区 3-5 天。单笔订单满 199 元包邮，未满收取 8 元运费。每日 16:00 前付款当天发货，节假日顺延。\n四、保修政策\nHomeHub 网关主机保修 2 年，智能音箱、摄像头、门锁整机保修 1 年，配件（电源适配器、数据线）保修 6 个月。人为损坏、私自拆机、进水不在保修范围内。\n五、发票说明\n订单确认收货后 3 个工作日内开具电子普通发票，可在“我的订单-发票”中下载。企业客户可申请增值税专用发票，需在购买前提交开票资料。\n六、会员与积分');
INSERT INTO Zhaogq_kb_chunk (Zhaogq_id, Zhaogq_file_id, Zhaogq_chunk_index, Zhaogq_content) VALUES (2, 1, 2, '发票说明\n订单确认收货后 3 个工作日内开具电子普通发票，可在“我的订单-发票”中下载。企业客户可申请增值税专用发票，需在购买前提交开票资料。\n六、会员与积分\n注册会员消费 1 元积 1 分，100 积分可抵 1 元，单笔最多抵扣订单金额的 10%。积分有效期为 12 个月，过期自动清零，退货订单对应积分同步扣回。\n七、客服联系方式\n客服热线 400-880-2020，服务时间每日 9:00-21:00；官方邮箱 service@xingtu-demo.com；在线客服入口位于 App“我的-帮助与客服”。');
INSERT INTO Zhaogq_kb_chunk (Zhaogq_id, Zhaogq_file_id, Zhaogq_chunk_index, Zhaogq_content) VALUES (3, 2, 1, '星图智能产品培训讲义\n- 培训对象：客服与售前团队\n- 培训目标：掌握产品线、核心卖点与常见问题处理\n- 版本：2026 年 11 月\n1\n一、产品线概览\n- HomeHub 智能网关：全屋设备中枢，支持 Zigbee 3.0 与 Wi-Fi 6\n- 智能音箱：语音助手与家庭娱乐入口\n- 智能摄像头：2K 超清、AI 人形侦测\n- 智能门锁：指纹、密码、NFC 与临时密码\n2\n二、HomeHub 核心功能\n- 最多接入 128 个子设备，断网后本地场景仍可执行\n- 本地 AI 引擎，隐私数据不出户\n- 双频 Wi-Fi 6，覆盖 120 平方米\n- 支持米家、HomeKit 场景联动（需固件 2.3 以上）\n3\n三、套餐与价格\n- 基础套餐 399 元：HomeHub + 安装指导\n- 安心套餐 899 元：HomeHub + 摄像头 + 门磁\n- 尊享套餐 1599 元：HomeHub + 摄像头 + 智能门锁\n- 老用户以旧换新可抵扣 100 元\n4\n四、常见问题\n- 配网失败：确认手机连接 2.4G Wi-Fi，长按重置键 5 秒\n- 设备离线：检查路由器是否开启 AP 隔离');
INSERT INTO Zhaogq_kb_chunk (Zhaogq_id, Zhaogq_file_id, Zhaogq_chunk_index, Zhaogq_content) VALUES (4, 2, 2, '旧换新可抵扣 100 元\n4\n四、常见问题\n- 配网失败：确认手机连接 2.4G Wi-Fi，长按重置键 5 秒\n- 设备离线：检查路由器是否开启 AP 隔离\n- 门锁电量低：App 提示后 7 天内更换 4 节 5 号电池\n- 售后升级：拨打 400-880-2020 转 2\n5');
INSERT INTO Zhaogq_kb_chunk (Zhaogq_id, Zhaogq_file_id, Zhaogq_chunk_index, Zhaogq_content) VALUES (5, 3, 1, '【售后退换货常见问题】\n1. 收到商品有破损怎么办？请在签收后 48 小时内拍照并联系在线客服，核实后可免费补发或退货，运费由星图承担。\n2. 超过 7 天还能退货吗？无理由退货仅限签收后 7 天内；超过 7 天但存在质量问题的，按保修政策处理。\n3. 换货需要多久？仓库签收后 1 个工作日内发出新机，物流时效与原订单一致。\n4. 赠品需要一起退回吗？退货时赠品需保持完好并一并退回，否则按赠品价值扣减退款。\n5. 退款到账时间：原路退回，微信/支付宝 1-3 个工作日，银行卡 3-7 个工作日。\n6. 如何查询售后进度？App“我的-售后服务”可查看工单状态，也可拨打 400-880-2020 查询。');
INSERT INTO Zhaogq_kb_chunk (Zhaogq_id, Zhaogq_file_id, Zhaogq_chunk_index, Zhaogq_content) VALUES (6, 4, 1, '【配送与安装说明】\n配送范围：全国除港澳台地区均可配送，新疆、西藏部分偏远地区可能延迟。\n发货时间：每日 16:00 前付款当天发出，16:00 后顺延至次日；大促期间可能延迟 24 小时。\n物流查询：订单发货后可在“我的订单”查看物流单号，也可在承运商官网查询。\n安装服务：智能门锁、摄像头提供付费上门安装，基础安装费 99 元，师傅上门前会电话预约。\n自行安装：HomeHub 网关与音箱支持自助安装，App 内有图文与视频引导。\n改地址：发货前可在订单详情修改收货地址；已发货需联系客服尝试拦截，不保证成功。');
INSERT INTO Zhaogq_kb_chunk (Zhaogq_id, Zhaogq_file_id, Zhaogq_chunk_index, Zhaogq_content) VALUES (7, 5, 1, '【会员与积分规则】\n会员等级：普通会员、银卡会员（累计消费 1000 元）、金卡会员（累计消费 5000 元）。\n积分获取：消费 1 元积 1 分，参与评价额外获得 10 分，签到每日 2 分。\n积分使用：100 积分抵 1 元，单笔订单最多抵扣 10%，积分不可提现、不可转让。\n积分有效期：自获得之日起 12 个月，到期未使用自动清零。\n会员权益：银卡享受免费上门安装 1 次，金卡享受延保 1 年与专属客服通道。\n退货影响：订单退货后对应积分与等级成长值同步扣回；积分不足时按 0 分处理。');
INSERT INTO Zhaogq_kb_chunk (Zhaogq_id, Zhaogq_file_id, Zhaogq_chunk_index, Zhaogq_content) VALUES (8, 6, 1, '【发票与报销指引】\n开票类型：默认开具电子普通发票，企业客户可申请增值税专用发票。\n开票时间：确认收货后 3 个工作日内开具，发票将发送至预留邮箱。\n修改发票：开票前可在订单详情修改抬头与税号；已开票需申请红冲后重新开具。\n专票资料：企业名称、纳税人识别号、注册地址、电话、开户行及账号。\n报销提示：电子发票与纸质发票具有同等法律效力，可直接打印报销。\n发票问题：拨打 400-880-2020 转 3 或发送邮件至 invoice@xingtu-demo.com。');
INSERT INTO Zhaogq_kb_chunk (Zhaogq_id, Zhaogq_file_id, Zhaogq_chunk_index, Zhaogq_content) VALUES (9, 7, 1, '【保修条款】\n保修期限：HomeHub 网关主机 2 年，智能音箱、摄像头、智能门锁整机 1 年，配件 6 个月。\n保修起算：以签收日期为准，需提供订单号或发票。\n保修范围：正常使用下的硬件故障，免费维修或更换同型号良品。\n不在保修范围：人为摔损、进水、私自拆机、非官方配件导致的故障。\n延保服务：金卡会员自动获得 1 年延保，其他用户可在购买后 30 天内加购延保。\n维修时效：寄修签收后 3 个工作日内完成检测并反馈方案。');
INSERT INTO Zhaogq_kb_chunk (Zhaogq_id, Zhaogq_file_id, Zhaogq_chunk_index, Zhaogq_content) VALUES (10, 8, 1, '【隐私与数据安全说明】\n数据采集：仅采集设备运行状态、配网信息与必要的故障日志，不采集与业务无关的个人信息。\n本地优先：HomeHub 的自动化场景与摄像头人形侦测默认在本地完成，视频不上传云端。\n云端存储：用户主动开启云存储后，视频加密保存 7 天，可随时关闭并删除。\n账号安全：支持双重验证，异常登录会通过短信与应用内消息提醒。\n数据删除：注销账号后 15 天内删除云端个人信息，法律法规要求留存的除外。\n联系我们：隐私相关问题可发送邮件至 privacy@xingtu-demo.com。');
```

