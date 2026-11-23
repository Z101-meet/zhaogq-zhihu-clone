/* 姓名：赵国庆 | 学号：24002120201 | 时间：2026-11-23 | 大模型：DeepSeek-V4.1-Flash */
/* 知识库种子脚本：生成 2 个主知识库文件（docx/pptx）+ 6 个 FAQ 文本，解析入库，并导出可重建的 SQL */

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const { Document, Packer, Paragraph, TextRun, HeadingLevel } = require('docx');
const PptxGenJS = require('pptxgenjs');
const Zhaogq_pool = require('../config/Zhaogq_db');
const Zhaogq_kbModel = require('../models/Zhaogq_kbModel');
const Zhaogq_docParser = require('../utils/Zhaogq_docParser');

const Zhaogq_DIR = path.join(__dirname, '..', 'uploads', 'Zhaogq_kb');

/* ---------- 文档内容 ---------- */
const Zhaogq_DOCX_SECTIONS = [
  ['一、公司简介', '星图智能科技（以下简称“星图”）成立于 2018 年，总部位于杭州，专注于智能家居与家庭安防产品，主要产品包括 HomeHub 智能网关、智能音箱、智能摄像头和智能门锁，服务用户超过 300 万户。'],
  ['二、退换货政策', '自签收之日起 7 天内，商品未激活且包装完好，可申请无理由退货，运费由买家承担。15 天内出现非人为质量问题，可选择换新或退货，运费由星图承担。定制类商品、已激活的软件服务不支持无理由退货。'],
  ['三、配送时效', '江浙沪地区次日达，全国大部分城市 48 小时内送达，偏远地区 3-5 天。单笔订单满 199 元包邮，未满收取 8 元运费。每日 16:00 前付款当天发货，节假日顺延。'],
  ['四、保修政策', 'HomeHub 网关主机保修 2 年，智能音箱、摄像头、门锁整机保修 1 年，配件（电源适配器、数据线）保修 6 个月。人为损坏、私自拆机、进水不在保修范围内。'],
  ['五、发票说明', '订单确认收货后 3 个工作日内开具电子普通发票，可在“我的订单-发票”中下载。企业客户可申请增值税专用发票，需在购买前提交开票资料。'],
  ['六、会员与积分', '注册会员消费 1 元积 1 分，100 积分可抵 1 元，单笔最多抵扣订单金额的 10%。积分有效期为 12 个月，过期自动清零，退货订单对应积分同步扣回。'],
  ['七、客服联系方式', '客服热线 400-880-2020，服务时间每日 9:00-21:00；官方邮箱 service@xingtu-demo.com；在线客服入口位于 App“我的-帮助与客服”。']
];

const Zhaogq_PPTX_SLIDES = [
  ['星图智能产品培训讲义', ['培训对象：客服与售前团队', '培训目标：掌握产品线、核心卖点与常见问题处理', '版本：2026 年 11 月']],
  ['一、产品线概览', ['HomeHub 智能网关：全屋设备中枢，支持 Zigbee 3.0 与 Wi-Fi 6', '智能音箱：语音助手与家庭娱乐入口', '智能摄像头：2K 超清、AI 人形侦测', '智能门锁：指纹、密码、NFC 与临时密码']],
  ['二、HomeHub 核心功能', ['最多接入 128 个子设备，断网后本地场景仍可执行', '本地 AI 引擎，隐私数据不出户', '双频 Wi-Fi 6，覆盖 120 平方米', '支持米家、HomeKit 场景联动（需固件 2.3 以上）']],
  ['三、套餐与价格', ['基础套餐 399 元：HomeHub + 安装指导', '安心套餐 899 元：HomeHub + 摄像头 + 门磁', '尊享套餐 1599 元：HomeHub + 摄像头 + 智能门锁', '老用户以旧换新可抵扣 100 元']],
  ['四、常见问题', ['配网失败：确认手机连接 2.4G Wi-Fi，长按重置键 5 秒', '设备离线：检查路由器是否开启 AP 隔离', '门锁电量低：App 提示后 7 天内更换 4 节 5 号电池', '售后升级：拨打 400-880-2020 转 2']]
];

const Zhaogq_TXT_FILES = {
  '售后FAQ.txt': [
    '【售后退换货常见问题】',
    '1. 收到商品有破损怎么办？请在签收后 48 小时内拍照并联系在线客服，核实后可免费补发或退货，运费由星图承担。',
    '2. 超过 7 天还能退货吗？无理由退货仅限签收后 7 天内；超过 7 天但存在质量问题的，按保修政策处理。',
    '3. 换货需要多久？仓库签收后 1 个工作日内发出新机，物流时效与原订单一致。',
    '4. 赠品需要一起退回吗？退货时赠品需保持完好并一并退回，否则按赠品价值扣减退款。',
    '5. 退款到账时间：原路退回，微信/支付宝 1-3 个工作日，银行卡 3-7 个工作日。',
    '6. 如何查询售后进度？App“我的-售后服务”可查看工单状态，也可拨打 400-880-2020 查询。'
  ].join('\n'),
  '配送与安装说明.txt': [
    '【配送与安装说明】',
    '配送范围：全国除港澳台地区均可配送，新疆、西藏部分偏远地区可能延迟。',
    '发货时间：每日 16:00 前付款当天发出，16:00 后顺延至次日；大促期间可能延迟 24 小时。',
    '物流查询：订单发货后可在“我的订单”查看物流单号，也可在承运商官网查询。',
    '安装服务：智能门锁、摄像头提供付费上门安装，基础安装费 99 元，师傅上门前会电话预约。',
    '自行安装：HomeHub 网关与音箱支持自助安装，App 内有图文与视频引导。',
    '改地址：发货前可在订单详情修改收货地址；已发货需联系客服尝试拦截，不保证成功。'
  ].join('\n'),
  '会员与积分规则.txt': [
    '【会员与积分规则】',
    '会员等级：普通会员、银卡会员（累计消费 1000 元）、金卡会员（累计消费 5000 元）。',
    '积分获取：消费 1 元积 1 分，参与评价额外获得 10 分，签到每日 2 分。',
    '积分使用：100 积分抵 1 元，单笔订单最多抵扣 10%，积分不可提现、不可转让。',
    '积分有效期：自获得之日起 12 个月，到期未使用自动清零。',
    '会员权益：银卡享受免费上门安装 1 次，金卡享受延保 1 年与专属客服通道。',
    '退货影响：订单退货后对应积分与等级成长值同步扣回；积分不足时按 0 分处理。'
  ].join('\n'),
  '发票与报销指引.txt': [
    '【发票与报销指引】',
    '开票类型：默认开具电子普通发票，企业客户可申请增值税专用发票。',
    '开票时间：确认收货后 3 个工作日内开具，发票将发送至预留邮箱。',
    '修改发票：开票前可在订单详情修改抬头与税号；已开票需申请红冲后重新开具。',
    '专票资料：企业名称、纳税人识别号、注册地址、电话、开户行及账号。',
    '报销提示：电子发票与纸质发票具有同等法律效力，可直接打印报销。',
    '发票问题：拨打 400-880-2020 转 3 或发送邮件至 invoice@xingtu-demo.com。'
  ].join('\n'),
  '保修条款.txt': [
    '【保修条款】',
    '保修期限：HomeHub 网关主机 2 年，智能音箱、摄像头、智能门锁整机 1 年，配件 6 个月。',
    '保修起算：以签收日期为准，需提供订单号或发票。',
    '保修范围：正常使用下的硬件故障，免费维修或更换同型号良品。',
    '不在保修范围：人为摔损、进水、私自拆机、非官方配件导致的故障。',
    '延保服务：金卡会员自动获得 1 年延保，其他用户可在购买后 30 天内加购延保。',
    '维修时效：寄修签收后 3 个工作日内完成检测并反馈方案。'
  ].join('\n'),
  '隐私与数据安全说明.txt': [
    '【隐私与数据安全说明】',
    '数据采集：仅采集设备运行状态、配网信息与必要的故障日志，不采集与业务无关的个人信息。',
    '本地优先：HomeHub 的自动化场景与摄像头人形侦测默认在本地完成，视频不上传云端。',
    '云端存储：用户主动开启云存储后，视频加密保存 7 天，可随时关闭并删除。',
    '账号安全：支持双重验证，异常登录会通过短信与应用内消息提醒。',
    '数据删除：注销账号后 15 天内删除云端个人信息，法律法规要求留存的除外。',
    '联系我们：隐私相关问题可发送邮件至 privacy@xingtu-demo.com。'
  ].join('\n')
};

/* ---------- 文件生成 ---------- */
async function Zhaogq_createDocx(Zhaogq_target) {
  const Zhaogq_children = [
    new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun('星图智能客服手册')] })
  ];
  Zhaogq_DOCX_SECTIONS.forEach(([Zhaogq_title, Zhaogq_body]) => {
    Zhaogq_children.push(new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(Zhaogq_title)] }));
    Zhaogq_children.push(new Paragraph({ children: [new TextRun(Zhaogq_body)] }));
  });
  const Zhaogq_doc = new Document({ sections: [{ children: Zhaogq_children }] });
  fs.writeFileSync(Zhaogq_target, await Packer.toBuffer(Zhaogq_doc));
}

async function Zhaogq_createPptx(Zhaogq_target) {
  const Zhaogq_pptx = new PptxGenJS();
  Zhaogq_pptx.layout = 'LAYOUT_16x9';
  Zhaogq_PPTX_SLIDES.forEach(([Zhaogq_title, Zhaogq_lines], Zhaogq_index) => {
    const Zhaogq_slide = Zhaogq_pptx.addSlide();
    Zhaogq_slide.addText(Zhaogq_title, {
      x: 0.6, y: 0.45, w: 8.8, h: 0.9, fontSize: Zhaogq_index === 0 ? 30 : 24,
      bold: true, color: '056DE8'
    });
    Zhaogq_slide.addText(
      Zhaogq_lines.map((Zhaogq_line) => ({ text: Zhaogq_line, options: { bullet: true, breakLine: true } })),
      { x: 0.75, y: 1.6, w: 8.5, h: 3.6, fontSize: 15, color: '333333' }
    );
  });
  await Zhaogq_pptx.writeFile({ fileName: Zhaogq_target });
}

/* ---------- SQL 导出 ---------- */
function Zhaogq_escapeSql(Zhaogq_value) {
  return String(Zhaogq_value).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
}

async function Zhaogq_dumpSql() {
  const [Zhaogq_files] = await Zhaogq_pool.query('SELECT * FROM Zhaogq_kb_file ORDER BY Zhaogq_id ASC');
  const [Zhaogq_chunks] = await Zhaogq_pool.query('SELECT * FROM Zhaogq_kb_chunk ORDER BY Zhaogq_id ASC');

  let Zhaogq_sql = '-- 知识库数据重建脚本（由 Zhaogq_kbSeed.js 生成）\n';
  Zhaogq_sql += Zhaogq_kbModel.Zhaogq_CREATE_FILE_SQL.trim() + ';\n';
  Zhaogq_sql += Zhaogq_kbModel.Zhaogq_CREATE_CHUNK_SQL.trim() + ';\n\n';
  Zhaogq_sql += 'DELETE FROM Zhaogq_kb_chunk;\nDELETE FROM Zhaogq_kb_file;\n\n';

  Zhaogq_files.forEach((Zhaogq_f) => {
    Zhaogq_sql += 'INSERT INTO Zhaogq_kb_file (Zhaogq_id, Zhaogq_name, Zhaogq_ext, Zhaogq_size, Zhaogq_path, Zhaogq_chunk_count) VALUES (' +
      Zhaogq_f.Zhaogq_id + ", '" + Zhaogq_escapeSql(Zhaogq_f.Zhaogq_name) + "', '" +
      Zhaogq_f.Zhaogq_ext + "', " + Zhaogq_f.Zhaogq_size + ", '" +
      Zhaogq_escapeSql(Zhaogq_f.Zhaogq_path) + "', " + Zhaogq_f.Zhaogq_chunk_count + ');\n';
  });

  Zhaogq_sql += '\n';
  Zhaogq_chunks.forEach((Zhaogq_c) => {
    Zhaogq_sql += 'INSERT INTO Zhaogq_kb_chunk (Zhaogq_id, Zhaogq_file_id, Zhaogq_chunk_index, Zhaogq_content) VALUES (' +
      Zhaogq_c.Zhaogq_id + ', ' + Zhaogq_c.Zhaogq_file_id + ', ' + Zhaogq_c.Zhaogq_chunk_index + ", '" +
      Zhaogq_escapeSql(Zhaogq_c.Zhaogq_content) + "');\n";
  });

  fs.writeFileSync(path.join(__dirname, '..', 'Zhaogq_kb_seed.sql'), Zhaogq_sql);
}

/* ---------- 主流程 ---------- */
async function Zhaogq_main() {
  fs.mkdirSync(Zhaogq_DIR, { recursive: true });
  await Zhaogq_kbModel.Zhaogq_ensureTables();

  const [[Zhaogq_existing]] = await Zhaogq_pool.query('SELECT COUNT(*) AS Zhaogq_count FROM Zhaogq_kb_file');
  if (Zhaogq_existing.Zhaogq_count > 0 && !process.argv.includes('--force')) {
    console.log('[Zhaogq] 知识库已有数据，如需重建请执行：node scripts/Zhaogq_kbSeed.js --force');
    await Zhaogq_pool.end();
    return;
  }

  await Zhaogq_pool.query('DELETE FROM Zhaogq_kb_chunk');
  await Zhaogq_pool.query('DELETE FROM Zhaogq_kb_file');
  await Zhaogq_pool.query('ALTER TABLE Zhaogq_kb_file AUTO_INCREMENT = 1');
  await Zhaogq_pool.query('ALTER TABLE Zhaogq_kb_chunk AUTO_INCREMENT = 1');

  await Zhaogq_createDocx(path.join(Zhaogq_DIR, '星图智能客服手册.docx'));
  await Zhaogq_createPptx(path.join(Zhaogq_DIR, '星图产品培训讲义.pptx'));
  Object.entries(Zhaogq_TXT_FILES).forEach(([Zhaogq_name, Zhaogq_content]) => {
    fs.writeFileSync(path.join(Zhaogq_DIR, Zhaogq_name), Zhaogq_content, 'utf8');
  });

  const Zhaogq_names = [
    '星图智能客服手册.docx',
    '星图产品培训讲义.pptx',
    ...Object.keys(Zhaogq_TXT_FILES)
  ];

  for (const Zhaogq_name of Zhaogq_names) {
    const Zhaogq_absolute = path.join(Zhaogq_DIR, Zhaogq_name);
    const Zhaogq_text = await Zhaogq_docParser.Zhaogq_extractText(Zhaogq_absolute);
    const Zhaogq_chunks = Zhaogq_docParser.Zhaogq_splitChunks(Zhaogq_text);
    const Zhaogq_fileId = await Zhaogq_kbModel.Zhaogq_saveFile({
      name: Zhaogq_name,
      ext: path.extname(Zhaogq_name).replace('.', ''),
      size: fs.statSync(Zhaogq_absolute).size,
      path: 'uploads/Zhaogq_kb/' + Zhaogq_name
    }, Zhaogq_chunks);
    console.log('[Zhaogq] 入库 #' + Zhaogq_fileId + ' ' + Zhaogq_name + ' → ' + Zhaogq_chunks.length + ' 个片段，文本 ' + Zhaogq_text.length + ' 字');
  }

  await Zhaogq_dumpSql();
  console.log('[Zhaogq] 知识库种子数据完成，SQL 已导出到 backend/Zhaogq_kb_seed.sql');
  await Zhaogq_pool.end();
}

Zhaogq_main().catch(async (Zhaogq_err) => {
  console.error('[Zhaogq] 种子脚本失败：', Zhaogq_err);
  await Zhaogq_pool.end();
  process.exit(1);
});
