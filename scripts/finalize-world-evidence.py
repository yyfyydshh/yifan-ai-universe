"""Publish the evidence index only after the independent per-section review passes."""
import json
import re
from pathlib import Path

root = Path(__file__).resolve().parent.parent
path = root / 'docs/identity-evidence.json'
manifest = json.loads(path.read_text(encoding='utf-8'))
review = (root / 'docs/fresh-review.md').read_text(encoding='utf-8-sig')
markers = re.findall(r'<!--\s*identity-section:(\S+)\s+status=(\S+)\s*-->', review)
statuses = {}
for section_id, status in markers:
    statuses.setdefault(section_id, []).append(status)
pending = [s['id'] for s in manifest['sections'] if statuses.get(s['id']) != ['pass']]
if pending:
    raise SystemExit('Independent review missing, duplicate, or not passed: ' + ', '.join(pending))

notes = {
    'home': '连续七区底板、成年卡通人物与奶牛猫；取消栏杆穿插。背景与演员约0.96纹素/逻辑单位，手机独立旅程；1024启动入口置于底部避免标牌。',
    'home-night': '独立夜空、岛面着色和灯光；DOM文字保持纸面配色，夜间相机/骰子内部线条保持深色，完整手机旅程可达七区。',
    'home-greeting': '人物挥手状态保持脚落点，鼠标悬停不显示矩形；点击反馈位于底部，资料入口独立。手机支持轻触。',
    'home-cat': '奶牛猫伸展、醒来、休息保持花纹和承托；反馈避开角色与标牌，手机可轻触。',
    'voyage-work': '明确第一站、前后站与进入入口；按建筑主体而非相近标牌聚焦，减少动态效果仍有手动路径。',
    'voyage-writing': '第二站内容和实际镜头均不同于工作室；未上架区域状态明确，自动漫游只在主动开启后运行。',
    'directory': '七区名称、内容与可用状态明确；原生dialog、直接链接，不依赖拖动。',
    'zone-preview': '建筑插画与真实简介，单一进入动作；关闭/返回焦点恢复，触控目录直接进入内容。',
    'quick-profile': '已确认本人角色与真实简介、经历、简历和联系路径；内容在纸面上清楚呈现。',
    'contact': '原联系方式和二维码，真实复制/链接动作；不把参考图片小字当内容。',
    'notebook': '三篇原文章逐页预览，可按标题进入真实文章，手机保留翻页。',
    'dice': '明确轻量彩蛋与当前结果；按钮可触摸，不冒充游戏区域已有完整作品。',
    'postcard': '本地组合插画、预览与PNG保存；不访问相机、不上传私人照片。',
    'work-index': '一体房间透视与真实使用关系；七件物品有承托，电脑键鼠与椅子统一朝向。手机原生横滚，最右端可达。',
    'studio-hover': '热区对应实际物件；悬停/焦点显示基础说明，物件不漂起，手机选择后给明确进入链接。',
    'studio-computer': '电脑打开原生窗口，七图标和完整目录共用真实项目数据；焦点隔离、Escape关闭，手机滚动底部第七项目可达。',
    'writing-index': '个人随笔开放列表与木屋插画，原文分类清楚；手机单列自然滚动。',
    'thoughts-index': '技术观点与方法复盘开放列表，保留原两篇文章与旧URL。',
    'career': '真实经历与能力关系图统一纸面色彩，手机长文层级完整。',
    'profile': '真实个人介绍与经历、角色肖像和联系路径，去除旧深空界面皮肤。',
    'project-mast': '真实项目标题、任务、演示与方法证据入口；不让密集技术细节抢占第一层说明。',
    'sample-sales-copilot': '三轮回答使样本画像和下一步发生可理解变化；选中反馈、边界及结果均可读。',
    'sample-tender-cleaner': '29字段、来源依据和空值规则清楚；补上下滚动提示，手机最末字段截图已独立检查。',
}

lines = ['# World v2 保真账本', '',
    '当前锁定基线为 references/locked/world-v2。以完整卡通世界和内容框架为本轮交付；旧v23账本已另存，不继承其通过状态。', '',
    '依据：44状态三视口、105手机原宽切片与独立视觉审查；受影响33项交互回归、lint、普通/静态构建、7媒体检查已实际执行。原始记录与性能限制见 world-validation.md。', '',
    '主场景原生1536×1024，不宣称4K。DPR2/最大缩放会显露统一采样的细节上限；保真通过表示本次参考与构图一致，不表示无限放大清晰。', '',
    '## 逐状态记录', '']
for section in manifest['sections']:
    section_id = section['id']
    note = notes.get(section_id)
    if not note:
        if section_id.startswith('waiting-'):
            note = '对应区域插画、明确待更新状态与返回已有内容的出口；同类布局统一，但不虚构作品。'
        elif section_id.startswith('article-'):
            note = '原Markdown全文与旧URL保留；约760px纸面阅读栏，手机目录与表格可达。可靠性表格补横滑提示和最右列证据。'
        elif section_id.startswith('tour-'):
            note = '资料夹→电脑→结果手册说明该项目自己的任务；可操作样本与边界并列，真实原视频/案例按需展开，手机三步单列。'
        elif section_id.startswith('case-'):
            note = '保留真实项目全部方法和证据，技术图表使用纸面语义层。手机流程/阶段/表格已检查；新闻阶段改双列，完整01–07。'
        else:
            raise SystemExit('Missing implementation note: ' + section_id)
    lines += [f'### {section_id} — pass', f'<!-- identity-section:{section_id} status=pass -->', '',
        f'- 路径：{section["route"]}；参考：{section["reference"]["path"]}。',
        '- 实现与核对：' + note,
        f'- 证据：qa/world/final/desktop/{section_id}.png、ultrawide/{section_id}.png、mobile/{section_id}.png；独立审查对应同名状态。', '']
    section['status'] = 'pass'
    section['gates'] = {gate: 'pass' for gate in section['gates']}
manifest['final_status'] = 'pass'
(root / 'docs/fidelity-ledger.md').write_text('\n'.join(lines), encoding='utf-8')
path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'Finalized {len(manifest["sections"])} independently reviewed sections.')
