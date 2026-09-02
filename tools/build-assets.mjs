// LumioGames 组织主页素材生成器 · GameTech 亮底版。
// 视觉语言来自 LumioVideoWorkFlow/design-system（gametech.css / gt-deco.css）：
// 色板照用，体素三面用同一套 color-mix 公式，图标块用「有色外投影 + 白色内顶高光」配方。
// 像素字用 5×7 位图现画（Silkscreen 的角色：只承担拉丁与数字），中文走观看者系统字体。
// 产物：profile/assets/*.svg。用法：node tools/build-assets.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'profile', 'assets');
fs.mkdirSync(OUT, { recursive: true });

// ── 色板（design-system tokens，身份，照用）──
const C = {
  primary: '#7C8CFF', primaryD: '#6171F0', mint: '#5DE2C6', amber: '#FFB86B', rose: '#FF7EA6',
  ink: '#1E2A3A', title: '#243056', muted: '#6B7894', faint: '#9AA6BE', line: '#E7ECF6', field: '#F7FAFF',
  gridLine: 'rgba(124,140,255,.12)',
};
// 注意：这两个字符串会进双引号属性，字体名只能用单引号，否则 SVG 直接坏掉
const FONT_ZH = `'Noto Sans SC','PingFang SC','Hiragino Sans GB','Microsoft YaHei','Source Han Sans SC',sans-serif`;
const FONT_EN = `Inter,-apple-system,'Segoe UI',Helvetica,Arial,sans-serif`;

// color-mix(in srgb, tone P%, other) 的 JS 版
function hex2rgb(h) { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
function mix(tone, pct, other) {
  const a = hex2rgb(tone), b = hex2rgb(other), p = pct / 100;
  return '#' + a.map((v, i) => Math.round(v * p + b[i] * (1 - p)).toString(16).padStart(2, '0')).join('');
}
// 体素三面：顶 42% 提亮 / 右 88% 本色 / 左 82% 压暗（gametech.css .gt-voxel）
const vox = (tone) => [mix(tone, 42, '#ffffff'), mix(tone, 88, '#ffffff'), mix(tone, 82, '#000000')];
// 图标块渐变：150deg，tone 86% 白 → tone 84% 黑（gt-layout.css .gt-feat__icon）
const iconGrad = (tone) => [mix(tone, 86, '#ffffff'), mix(tone, 84, '#000000')];

// ── 5×7 位图字体 ──────────────────────────────────────────────
const G = {
  A: ['.###.', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  B: ['####.', '#...#', '#...#', '####.', '#...#', '#...#', '####.'],
  C: ['.####', '#....', '#....', '#....', '#....', '#....', '.####'],
  D: ['####.', '#...#', '#...#', '#...#', '#...#', '#...#', '####.'],
  E: ['#####', '#....', '#....', '####.', '#....', '#....', '#####'],
  F: ['#####', '#....', '#....', '####.', '#....', '#....', '#....'],
  G: ['.####', '#....', '#....', '#..##', '#...#', '#...#', '.####'],
  H: ['#...#', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  I: ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '#####'],
  J: ['..###', '...#.', '...#.', '...#.', '...#.', '#..#.', '.##..'],
  K: ['#...#', '#..#.', '#.#..', '##...', '#.#..', '#..#.', '#...#'],
  L: ['#....', '#....', '#....', '#....', '#....', '#....', '#####'],
  M: ['#...#', '##.##', '#.#.#', '#.#.#', '#...#', '#...#', '#...#'],
  N: ['#...#', '##..#', '#.#.#', '#..##', '#...#', '#...#', '#...#'],
  O: ['.###.', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  P: ['####.', '#...#', '#...#', '####.', '#....', '#....', '#....'],
  Q: ['.###.', '#...#', '#...#', '#...#', '#.#.#', '#..#.', '.##.#'],
  R: ['####.', '#...#', '#...#', '####.', '#.#..', '#..#.', '#...#'],
  S: ['.####', '#....', '#....', '.###.', '....#', '....#', '####.'],
  T: ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '..#..'],
  U: ['#...#', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  V: ['#...#', '#...#', '#...#', '#...#', '#...#', '.#.#.', '..#..'],
  W: ['#...#', '#...#', '#...#', '#.#.#', '#.#.#', '##.##', '#...#'],
  X: ['#...#', '#...#', '.#.#.', '..#..', '.#.#.', '#...#', '#...#'],
  Y: ['#...#', '#...#', '.#.#.', '..#..', '..#..', '..#..', '..#..'],
  Z: ['#####', '....#', '...#.', '..#..', '.#...', '#....', '#####'],
  0: ['.###.', '#...#', '#..##', '#.#.#', '##..#', '#...#', '.###.'],
  1: ['..#..', '.##..', '..#..', '..#..', '..#..', '..#..', '.###.'],
  2: ['.###.', '#...#', '....#', '...#.', '..#..', '.#...', '#####'],
  3: ['####.', '....#', '....#', '.###.', '....#', '....#', '####.'],
  4: ['...#.', '..##.', '.#.#.', '#..#.', '#####', '...#.', '...#.'],
  5: ['#####', '#....', '####.', '....#', '....#', '#...#', '.###.'],
  6: ['.###.', '#....', '#....', '####.', '#...#', '#...#', '.###.'],
  7: ['#####', '....#', '...#.', '..#..', '.#...', '.#...', '.#...'],
  8: ['.###.', '#...#', '#...#', '.###.', '#...#', '#...#', '.###.'],
  9: ['.###.', '#...#', '#...#', '.####', '....#', '....#', '.###.'],
  ' ': ['...', '...', '...', '...', '...', '...', '...'],
  '.': ['..', '..', '..', '..', '..', '##', '##'],
  ':': ['..', '##', '##', '..', '##', '##', '..'],
  '-': ['....', '....', '....', '####', '....', '....', '....'],
  '!': ['##', '##', '##', '##', '##', '..', '##'],
  '?': ['.###.', '#...#', '....#', '...#.', '..#..', '.....', '..#..'],
  '>': ['#...', '##..', '###.', '####', '###.', '##..', '#...'],
  '/': ['....#', '....#', '...#.', '..#..', '.#...', '#....', '#....'],
  '+': ['.....', '..#..', '..#..', '#####', '..#..', '..#..', '.....'],
  '*': ['..#..', '..#..', '#####', '.###.', '.###.', '#...#', '.....'],
  '=': ['.....', '.....', '#####', '.....', '#####', '.....', '.....'],
  '[': ['###', '#..', '#..', '#..', '#..', '#..', '###'],
  ']': ['###', '..#', '..#', '..#', '..#', '..#', '###'],
  '_': ['.....', '.....', '.....', '.....', '.....', '.....', '#####'],
  ',': ['..', '..', '..', '..', '..', '##', '.#'],
  "'": ['#', '#', '.', '.', '.', '.', '.'],
  '·': ['..', '..', '..', '##', '##', '..', '..'],
};

/** 位图文字 → 一条 <path>。每个亮点是 s×s 方块。 */
function pixText(str, x, y, s, fill, opts = {}) {
  let d = '';
  let cx = x;
  for (const ch of str.toUpperCase()) {
    const g = G[ch] || G['?'];
    const w = g[0].length;
    g.forEach((row, ry) => {
      for (let rx = 0; rx < row.length; rx++) {
        if (row[rx] === '#') d += `M${cx + rx * s} ${y + ry * s}h${s}v${s}h-${s}z`;
      }
    });
    cx += (w + 1) * s;
  }
  const inner = opts.inner || '';
  const attrs = opts.attrs || '';
  return { path: `<path d="${d}" fill="${fill}" ${attrs}>${inner}</path>`, width: cx - x - s };
}
function pixWidth(str, s) {
  let w = 0;
  for (const ch of str.toUpperCase()) w += ((G[ch] || G['?'])[0].length + 1) * s;
  return w - s;
}

/** 位图 sprite。map：'#' 白、'o' 半透白、'x' 半透黑，也可传自定义调色。 */
function sprite(rows, x, y, s, pal = {}, gap = 0) {
  const P = { '#': '#FFFFFF', o: 'rgba(255,255,255,.55)', x: 'rgba(20,28,63,.40)', ...pal };
  const buckets = {};
  rows.forEach((row, ry) => {
    for (let rx = 0; rx < row.length; rx++) {
      const k = row[rx];
      if (!P[k]) continue;
      buckets[k] = (buckets[k] || '') + `M${x + rx * s} ${y + ry * s}h${s - gap}v${s - gap}h-${s - gap}z`;
    }
  });
  return Object.entries(buckets).map(([k, d]) => `<path d="${d}" fill="${P[k]}"/>`).join('');
}
/** design-system 的 .gt-sprite：格子带 2px 圆角、底部 inset 暗边。这里用 rect 组实现。 */
function gtSprite(rows, x, y, px, tone, gap = 2) {
  let out = '';
  rows.forEach((row, ry) => {
    for (let rx = 0; rx < row.length; rx++) {
      if (row[rx] !== 'X') continue;
      const X = x + rx * (px + gap), Y = y + ry * (px + gap);
      out += `<rect x="${X}" y="${Y}" width="${px}" height="${px}" rx="2" fill="${tone}"/><rect x="${X}" y="${Y + px - 3}" width="${px}" height="3" rx="1" fill="rgba(0,0,0,.09)"/>`;
    }
  });
  return out;
}
const SPRITES = {
  heart: ['.X.X.', 'XXXXX', 'XXXXX', '.XXX.', '..X..'],
  star: ['..X..', '.XXX.', 'XXXXX', '.X.X.', 'X...X'],
  gem: ['.XXX.', 'XXXXX', '.XXX.', '..X..'],
  bolt: ['..XX.', '.XX..', 'XXXX.', '..XX.', '.X...'],
};

/** 等距体素：三个可见面，顶 / 右 / 左。cx 是顶点 x，top 是顶点 y，size 是菱形半宽。 */
function isoCube(cx, top, size, tone, radius = 0) {
  const h = size * 0.58, depth = size * 1.05;
  const [t, r, l] = vox(tone);
  const rx = radius ? ` rx="${radius}"` : '';
  return `<g${rx ? '' : ''}>
<polygon points="${cx},${top} ${cx + size},${top + h} ${cx},${top + 2 * h} ${cx - size},${top + h}" fill="${t}"/>
<polygon points="${cx - size},${top + h} ${cx},${top + 2 * h} ${cx},${top + 2 * h + depth} ${cx - size},${top + h + depth}" fill="${l}"/>
<polygon points="${cx + size},${top + h} ${cx},${top + 2 * h} ${cx},${top + 2 * h + depth} ${cx + size},${top + h + depth}" fill="${r}"/>
</g>`;
}
/** 常驻微动包装（design-system 的 Idle）：上下 bob，delay 错开。 */
function idle(inner, amp = 8, dur = 4, delay = 0) {
  return `<g><animateTransform attributeName="transform" type="translate" values="0 0;0 -${amp};0 0" dur="${dur}s" begin="-${delay}s" repeatCount="indefinite" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1"/>${inner}</g>`;
}

// ── 公共 defs：面板渐变、线网格、点阵、投影 ──
function defs(id, W, H, extra = '') {
  return `<defs>
  <linearGradient id="${id}-panel" x1="0.33" y1="0" x2="0.67" y2="1"><stop offset="0" stop-color="#DCE4FF"/><stop offset=".38" stop-color="#E4ECFF"/><stop offset="1" stop-color="#DFF7F0"/></linearGradient>
  <linearGradient id="${id}-banner" x1="0" y1="0" x2="1" y2=".4"><stop offset="0" stop-color="#F3F6FF"/><stop offset="1" stop-color="#EEFBF6"/></linearGradient>
  <pattern id="${id}-grid" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48 0H0V48" fill="none" stroke="${C.gridLine}"/></pattern>
  <pattern id="${id}-dots" width="36" height="36" patternUnits="userSpaceOnUse"><circle cx="18" cy="18" r="3" fill="${C.gridLine}"/></pattern>
  <linearGradient id="${id}-fadeL" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".7" stop-color="#000"/></linearGradient>
  <linearGradient id="${id}-fadeR" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".7" stop-color="#000"/></linearGradient>
  <mask id="${id}-mL"><rect width="${W}" height="${H}" fill="url(#${id}-fadeL)"/></mask>
  <mask id="${id}-mR"><rect width="${W}" height="${H}" fill="url(#${id}-fadeR)"/></mask>
  <clipPath id="${id}-round"><rect width="${W}" height="${H}" rx="26"/></clipPath>
  ${extra}
</defs>`;
}
/** 立体感配方：有色外投影 + 白色内顶高光（.gt-emboss） */
function emboss(id, tone) {
  return `<filter id="${id}" x="-40%" y="-40%" width="180%" height="200%"><feDropShadow dx="0" dy="12" stdDeviation="10" flood-color="${tone}" flood-opacity=".55"/></filter>`;
}
/** 渐变图标块（.gt-feat__icon 配方）。 */
function iconBlock(x, y, size, tone, inner, fid) {
  const [a, b] = iconGrad(tone);
  const r = size * 0.25;
  return `<defs><linearGradient id="${fid}-g" x1="0" y1="0" x2="0.87" y2="0.5"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>${emboss(fid + '-s', tone)}</defs>
<g filter="url(#${fid}-s)"><rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${r}" fill="url(#${fid}-g)"/></g>
<rect x="${x + 1}" y="${y + 1}" width="${size - 2}" height="${size - 2}" rx="${r - 1}" fill="none" stroke="#fff" stroke-opacity=".38" stroke-width="1.5"/>
${inner}`;
}
/** 品牌像素标（.gt-brand）：渐变方块 + 3×3 十字点阵 + LUMIO / GAMES */
function brandMark(x, y, size = 48, opacity = 1, textColor = C.ink) {
  const pix = size * 0.13, gap = size * 0.04, start = (size - 3 * pix - 2 * gap) / 2;
  let dots = '';
  for (let i = 0; i < 9; i++) {
    const cx = x + start + (i % 3) * (pix + gap), cy = y + start + Math.floor(i / 3) * (pix + gap);
    dots += `<rect x="${cx}" y="${cy}" width="${pix}" height="${pix}" rx="2" fill="#fff" fill-opacity="${i % 2 ? .35 : 1}"/>`;
  }
  return `<g opacity="${opacity}">
<defs><linearGradient id="brand-g" x1="0" y1="0" x2="0.87" y2="0.5"><stop offset="0" stop-color="${C.primary}"/><stop offset="1" stop-color="#9AA6FF"/></linearGradient><filter id="brand-s" x="-40%" y="-40%" width="180%" height="200%"><feDropShadow dx="0" dy="10" stdDeviation="8" flood-color="${C.primary}" flood-opacity=".7"/></filter></defs>
<g filter="url(#brand-s)"><rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${size * 0.29}" fill="url(#brand-g)"/></g>
${dots}
<text x="${x + size * 1.25}" y="${y + size * 0.5}" font-family="${FONT_EN}" font-weight="800" font-size="${size * 0.47}" fill="${textColor}">LUMIO</text>
<text x="${x + size * 1.25}" y="${y + size * 0.86}" font-family="${FONT_EN}" font-weight="700" font-size="${size * 0.26}" letter-spacing="${size * 0.26 * 0.22}" fill="${C.faint}">GAMES</text>
</g>`;
}
/** 胶囊标签（.gt-chip）：白底、细描边、tone 色块 */
function chip(x, y, text, tone, fs = 18) {
  const w = text.length * fs * 0.6 + 52;
  return { svg: `<g><rect x="${x}" y="${y}" width="${w}" height="${fs * 2.1}" rx="999" fill="#fff" stroke="${C.line}"/>
<rect x="${x + 18}" y="${y + fs * 1.05 - 5}" width="10" height="10" rx="3" fill="${tone}"/>
<text x="${x + 36}" y="${y + fs * 1.05}" dominant-baseline="central" font-family="${FONT_EN}" font-size="${fs}" font-weight="600" fill="${C.muted}">${text}</text></g>`, width: w };
}
/** 徽章币（.gt-coin）：厚描边 + 有色投影，中间 slot 放 ★ */
function coin(cx, cy, size, tone, fid) {
  const border = size * 0.08;
  return `<defs><radialGradient id="${fid}-g" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="${mix(tone, 50, '#ffffff')}"/><stop offset=".7" stop-color="${tone}"/></radialGradient><filter id="${fid}-s" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="10" stdDeviation="8" flood-color="${tone}" flood-opacity=".6"/></filter></defs>
<g filter="url(#${fid}-s)"><circle cx="${cx}" cy="${cy}" r="${size / 2 - border / 2}" fill="url(#${fid}-g)" stroke="${mix(tone, 82, '#000000')}" stroke-width="${border}"/></g>
${gtSprite(SPRITES.star, cx - 2.5 * (size * 0.09) - 4, cy - 2.5 * (size * 0.09) - 3, size * 0.09, mix(tone, 52, '#000000'), 2)}`;
}

// ═══════════════════════ HERO（封面版式：左文右体素堆）═══════════════════════
function hero() {
  const W = 1200, H = 480, id = 'h';
  // 右侧体素堆：仿样张的阶梯堆法，primary 为主、mint / amber 点缀
  const S = 44;
  const stack = [
    [980, 250, C.primary], [980 + S, 250 - S * 0.58, C.primary], [980 - S, 250 - S * 0.58, C.mint],
    [980, 250 - 2 * S * 0.58, C.amber], [980 + S, 250 - 2 * S * 0.58 - S * 1.05, C.primary],
    [980, 250 - S * 1.05 - 2 * S * 0.58, C.primary], [980 - S, 250 - 2 * S * 0.58 - S * 1.05, C.primary],
    [980, 250 - 2 * S * 1.05 - 2 * S * 0.58, C.mint],
  ];
  // 画序：先远后近（y 小的先画）
  stack.sort((a, b) => (a[1] + (a[0] > 980 ? 1 : a[0] < 980 ? -1 : 0)) - (b[1] + (b[0] > 980 ? 1 : b[0] < 980 ? -1 : 0)));
  let cubes = '';
  for (const [x, y, t] of stack) cubes += isoCube(x, y, S, t);

  const eyebrow = pixText('PLAYER 1 / VOXEL ENGINE / AGENT CREW', 72, 78, 2.4, C.primaryD);
  const title = pixText('LUMIO GAMES', 72, 112, 8.6, C.title);
  const press = pixText('> PRESS START', 72, 358, 3.4, mix(C.amber, 70, '#000000'), {
    inner: `<animate attributeName="opacity" values="1;1;.15;.15" keyTimes="0;.6;.61;1" dur="1.2s" repeatCount="indefinite"/>`,
  });
  const corner = pixText('GAMETECH / ORG PROFILE', W - 36 - pixWidth('GAMETECH / ORG PROFILE', 2.2), 30, 2.2, C.faint);
  const stage = pixText('STAGE CLEAR: HELLO WORLD', 72, H - 52, 2.4, C.faint);

  const c1 = chip(72, 296, 'Rust', C.amber);
  const c2 = chip(72 + c1.width + 12, 296, 'C#', C.primary);
  const c3 = chip(72 + c1.width + c2.width + 24, 296, 'Agent Plugins 1.0.0', C.mint);

  let hearts = '';
  for (let i = 0; i < 3; i++) hearts += gtSprite(SPRITES.heart, 72 + i * 52, 30 + (i === 2 ? 0 : 0), 6, i < 3 ? C.rose : C.line, 2);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="LUMIO GAMES · 体素游戏引擎 × AI Agent 开发队伍 · PRESS START">
${defs(id, W, H)}
<g clip-path="url(#${id}-round)">
  <rect width="${W}" height="${H}" fill="url(#${id}-panel)"/>
  <rect width="${W}" height="${H}" fill="url(#${id}-grid)"/>
  <rect width="${W}" height="${H}" fill="url(#${id}-dots)" mask="url(#${id}-mL)"/>
  <rect width="${W}" height="${H}" fill="url(#${id}-dots)" mask="url(#${id}-mR)"/>

  ${hearts}
  ${corner.path}
  ${eyebrow.path}
  ${title.path}
  <text x="72" y="222" font-family="${FONT_ZH}" font-size="30" font-weight="700" fill="${C.ink}">用 Rust + C# 造一台体素游戏引擎，</text>
  <text x="72" y="262" font-family="${FONT_ZH}" font-size="30" font-weight="700" fill="${C.ink}">再让一支 AI Agent 队伍把游戏做出来。</text>
  ${c1.svg}${c2.svg}${c3.svg}
  ${press.path}
  ${stage.path}

  ${idle(cubes, 6, 5, 0)}
  ${idle(gtSprite(SPRITES.heart, 790, 150, 12, C.rose), 8, 4, 1.2)}
  ${idle(gtSprite(SPRITES.bolt, 1120, 300, 10, C.amber), 7, 3.6, 2)}
  ${idle(isoCube(1130, 96, 22, C.amber), 9, 4.4, 0.6)}
  ${idle(isoCube(830, 330, 18, C.mint), 6, 3.8, 2.4)}
  ${idle(coin(880, 92, 64, C.amber, 'hc'), 6, 5.2, 1.6)}

  ${brandMark(W - 36 - 48 - 100, H - 36 - 48, 48, .9)}
  <rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="26" fill="none" stroke="${C.line}"/>
</g>
</svg>`;
}

// ═══════════════════════ 章节标记（.gt-sec：竖条 + 中文 + 英文小标）═══════════════════════
function section(zh, en, tone, dark) {
  const W = 900, H = 64;
  const inkZh = dark ? '#E7ECF6' : C.ink;
  const en1 = pixText(en, 26, 44, 2.4, C.faint);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${zh} · ${en}">
<rect x="0" y="6" width="6" height="52" rx="3" fill="${tone}"/>
<text x="26" y="34" font-family="${FONT_ZH}" font-size="34" font-weight="700" fill="${inkZh}">${zh}</text>
${en1.path}
</svg>`;
}

// ═══════════════════════ 仓库图标（.gt-feat__icon 配方 + 16×16 像素画）═══════════════════════
const ICONS = {
  castle: [
    '................', '..#.#.#..#.#.#..', '..#####..#####..', '..#####..#####..',
    '..#ooo#..#ooo#..', '..#ooo####ooo#..', '..#ooo#..#ooo#..', '..#ooo#..#ooo#..',
    '..############..', '..#oooooooooo#..', '..#oo######oo#..', '..#oo#xxxx#oo#..',
    '..#oo#xxxx#oo#..', '..#oo#xxxx#oo#..', '..#oo#xxxx#oo#..', '..############..',
  ],
  gear: [
    '......####......', '......#oo#......', '..##..#oo#..##..', '.#oo###oo###oo#.',
    '.#oooooooooooo#.', '..#oooooooooo#..', '###ooo####ooo###', '#ooooo#..#ooooo#',
    '#ooooo#..#ooooo#', '###ooo####ooo###', '..#oooooooooo#..', '.#oooooooooooo#.',
    '.#oo###oo###oo#.', '..##..#oo#..##..', '......#oo#......', '......####......',
  ],
  scroll: [
    '................', '..#########.....', '..#########o....', '..#########oo...',
    '..###########...', '..#xx#xx#####...', '..###########...', '..#xxxxxxx###...',
    '..###########...', '..#xxxxx#####...', '..###########...', '..#xxxxxxx###...',
    '..###########...', '..###########...', '................', '................',
  ],
  plug: [
    '................', '....##....##....', '....##....##....', '....##....##....',
    '..############..', '..#oooooooooo#..', '..#oooooooooo#..', '..#oooooooooo#..',
    '...##oooooo##...', '.....######.....', '......#oo#......', '......#oo#......',
    '.......##.......', '......##........', '.....##.........', '................',
  ],
  cube: [
    '................', '......####......', '....##oooo##....', '..##oooooooo##..',
    '.#oooooooooooo#.', '.#o###oooo###o#.', '.#o#xx######xx#.', '.#o#xxxx##xxxx#.',
    '.#o#xxxx##xxxx#.', '.#o#xxxx##xxxx#.', '.#o#xxxx##xxxx#.', '..##xxxx##xxx#..',
    '....##xx##x##...', '......####......', '................', '................',
  ],
  heart: [
    '................', '................', '...###...###....', '..#ooo#.#ooo#...',
    '.#oo#oo#oooo#...', '.#o#ooooooooo#..', '.#ooooooooooo#..', '.#ooooooooooo#..',
    '..#ooooooooo#...', '...#ooooooo#....', '....#ooooo#.....', '.....#ooo#......',
    '......#o#.......', '.......#........', '................', '................',
  ],
  sword: [
    '..........####..', '.........#oo##..', '........#oo##...', '.......#oo##....',
    '......#oo##.....', '.....#oo##......', '..#.#oo##.......', '...##o##........',
    '...###..........', '..#x##..........', '.#x#.##.........', '#x#...#.........',
    '.#..............', '................', '................', '................',
  ],
};
function icon(name, tone) {
  const W = 120, H = 128, size = 88, x = 16, y = 12, px = 4, off = (size - 16 * px) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${name}">
${iconBlock(x, y, size, tone, sprite(ICONS[name], x + off, y + off, px), 'i-' + name)}
</svg>`;
}

// ═══════════════════════ 页脚（.gt-banner：双色渐变底 + 发光图标 + 主副文案）═══════════════════════
function footer() {
  const W = 1200, H = 190, id = 'f';
  const title = pixText('CONTINUE?  > YES', 176, 52, 4.6, C.title);
  const cursor = pixText('_', 176 + pixWidth('CONTINUE?  > YES', 4.6) + 14, 52, 4.6, C.primary, {
    inner: `<animate attributeName="opacity" values="1;1;0;0" keyTimes="0;.5;.51;1" dur="1s" repeatCount="indefinite"/>`,
  });
  const S = 26;
  const cubes = isoCube(1040, 70, S, C.primary) + isoCube(1040 + S, 70 - S * 0.58, S, C.mint) + isoCube(1040, 70 - S * 1.05 - 2 * S * 0.58, S, C.amber);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Continue? Yes. 给仓库点一颗星就算投币。">
${defs(id, W, H)}
<g clip-path="url(#${id}-round)">
  <rect width="${W}" height="${H}" fill="url(#${id}-banner)"/>
  <rect width="${W}" height="${H}" fill="url(#${id}-dots)" mask="url(#${id}-mR)"/>
  ${iconBlock(48, 47, 96, C.primary, gtSprite(SPRITES.star, 48 + 18, 47 + 20, 10, '#fff', 2), 'f-ico')}
  ${title.path}${cursor.path}
  <text x="176" y="130" font-family="${FONT_ZH}" font-size="24" fill="${C.muted}">给仓库点一颗 ★ 就算投币。Issue 和 PR 都欢迎，带证据来。</text>
  ${idle(cubes, 6, 5, 0)}
  ${idle(gtSprite(SPRITES.gem, 1130, 120, 9, C.rose), 7, 4, 1.5)}
  <rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="26" fill="none" stroke="${C.line}"/>
</g>
</svg>`;
}

// ═══════════════════════ 写出 ═══════════════════════
const files = {
  'hero.svg': hero(),
  'footer.svg': footer(),
  'sec-stage-select.svg': section('主线', 'STAGE SELECT', C.primary, false),
  'sec-stage-select-dark.svg': section('主线', 'STAGE SELECT', C.primary, true),
  'sec-tech-tree.svg': section('技能树', 'TECH TREE', C.mint, false),
  'sec-tech-tree-dark.svg': section('技能树', 'TECH TREE', C.mint, true),
  'sec-the-crew.svg': section('队伍', 'THE CREW', C.amber, false),
  'sec-the-crew-dark.svg': section('队伍', 'THE CREW', C.amber, true),
  'sec-3-lives.svg': section('三条命', '3 LIVES', C.rose, false),
  'sec-3-lives-dark.svg': section('三条命', '3 LIVES', C.rose, true),
  'sec-join.svg': section('入队', 'JOIN THE PARTY', C.primaryD, false),
  'sec-join-dark.svg': section('入队', 'JOIN THE PARTY', C.primaryD, true),
  'icon-game.svg': icon('castle', C.primary),
  'icon-engine.svg': icon('gear', C.mint),
  'icon-spec.svg': icon('scroll', C.amber),
  'icon-workflow.svg': icon('plug', C.rose),
  'icon-cube.svg': icon('cube', C.mint),
  'icon-heart.svg': icon('heart', C.rose),
  'icon-sword.svg': icon('sword', C.primary),
};
for (const [name, svg] of Object.entries(files)) fs.writeFileSync(path.join(OUT, name), svg.trim() + '\n');
console.log(`wrote ${Object.keys(files).length} files → ${path.relative(ROOT, OUT)}`);
