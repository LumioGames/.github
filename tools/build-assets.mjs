// LumioGames 组织主页素材生成器 · GameTech 亮底版。
// 视觉语言来自 LumioVideoWorkFlow/design-system（gametech.css / gt-deco.css）：
// 色板照用，体素三面用同一套 color-mix 公式，图标块用「有色外投影 + 白色内顶高光」配方。
// 像素字用 5×7 位图现画（Silkscreen 的角色：只承担拉丁与数字），中文走观看者系统字体。
// 产物：profile/assets/*.svg。用法：node tools/build-assets.mjs
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
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

  const eyebrow = pixText('PLAYER 1 / VOXEL GAMEPLAY FRAMEWORK / AGENT CREW', 72, 78, 2.4, C.primaryD);
  const title = pixText('LUMIO GAMES', 72, 112, 8.6, C.title);
  const press = pixText('> PRESS START', 72, 372, 3.4, mix(C.amber, 70, '#000000'), {
    inner: `<animate attributeName="opacity" values="1;1;.15;.15" keyTimes="0;.6;.61;1" dur="1.2s" repeatCount="indefinite"/>`,
  });
  const corner = pixText('GAMETECH / ORG PROFILE', W - 36 - pixWidth('GAMETECH / ORG PROFILE', 2.2), 30, 2.2, C.faint);
  const stage = pixText('STAGE CLEAR: HELLO WORLD', 72, H - 52, 2.4, C.faint);


  let hearts = '';
  for (let i = 0; i < 3; i++) hearts += gtSprite(SPRITES.heart, 72 + i * 52, 30 + (i === 2 ? 0 : 0), 6, i < 3 ? C.rose : C.line, 2);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="LUMIO GAMES · Idea + Lumio + Agent + 游戏引擎 = 一个完整的商业化游戏 · Lumio 不是引擎，是一套 AI Native 的通用体素 Gameplay 框架 · PRESS START">
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
  <text x="72" y="222" font-family="${FONT_ZH}" font-size="32" font-weight="700" fill="${C.ink}">Idea + Lumio + Agent + 游戏引擎</text>
  <text x="72" y="264" font-family="${FONT_ZH}" font-size="32" font-weight="700" fill="${C.ink}">= 一个<tspan fill="${mix(C.amber, 70, '#000000')}">完整的商业化游戏</tspan></text>
  <text x="72" y="300" font-family="${FONT_ZH}" font-size="17" fill="${C.muted}">Lumio 不是引擎，是一套 AI Native 的通用体素 Gameplay 框架，也是一套架构。</text>
  <text x="72" y="326" font-family="${FONT_ZH}" font-size="17" fill="${C.muted}">渲染和物理交给你手里的引擎，玩法、服务器和 Agent 的规矩在这里。</text>
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
  bulb: [
    '................', '.....######.....', '....#oooooo#....', '...#oooooooo#...',
    '...#oo#oooo##...', '...#oo#ooooo#...', '...#oooooooo#...', '...#oooooooo#...',
    '....#oooooo#....', '.....#oooo#.....', '.....######.....', '.....#xxxx#.....',
    '.....######.....', '.....#xxxx#.....', '......####......', '................',
  ],
  robot: [
    '.......##.......', '.......##.......', '.....######.....', '..############..',
    '..#oooooooooo#..', '..#o###oo###o#..', '..#o#xx#oo#xx#..', '..#o###oo###o#..',
    '..#oooooooooo#..', '..#oo######oo#..', '..#oooooooooo#..', '..############..',
    '....##....##....', '..###########...', '..#oo#....#oo#..', '..####....####..',
  ],
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
  search: [
    '................', '......####......', '....##oooo##....', '...#oooooooo#...',
    '...#oooooooo#...', '..#oooooooooo#..', '..#oooooooooo#..', '..#oooooooooo#..',
    '...#oooooooo#...', '...#oooooooo#...', '....##oooo##....', '......####x#....',
    '.........#xx#...', '..........#xx#..', '...........#xx#.', '............##..',
  ],
  levelup: [
    '................', '.......##.......', '......#oo#......', '.....#oooo#.....',
    '....#oooooo#....', '...#oooooooo#...', '..#oooooooooo#..', '..####oooo####..',
    '.....#oooo#.....', '.....#oooo#.....', '.....#oooo#.....', '.....######.....',
    '................', '..############..', '..#oooooooooo#..', '..############..',
  ],
  sword: [
    '..........####..', '.........#oo##..', '........#oo##...', '.......#oo##....',
    '......#oo##.....', '.....#oo##......', '..#.#oo##.......', '...##o##........',
    '...###..........', '..#x##..........', '.#x#.##.........', '#x#...#.........',
    '.#..............', '................', '................', '................',
  ],
  brush: [
    '...........###..', '..........#oo#..', '.........#oo#...', '........#oo#....',
    '.......#oo#.....', '......#oo#......', '.....######.....', '....#oooo#......',
    '...#xxxx#.......', '..#xxxxx#.......', '..#xxxx#........', '.#xxxx#.........',
    '.#xx##..........', '..##....xx......', '.......xxxx.....', '........xx......',
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
  <text x="176" y="130" font-family="${FONT_ZH}" font-size="24" fill="${C.muted}">觉得有用就点个 ★。Issue 和 PR 都欢迎。</text>
  ${idle(cubes, 6, 5, 0)}
  ${idle(gtSprite(SPRITES.gem, 1130, 120, 9, C.rose), 7, 4, 1.5)}
  <rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="26" fill="none" stroke="${C.line}"/>
</g>
</svg>`;
}

// ═══════════════════════ 核心优势横幅（.gt-banner 外壳 + 三个职能站点串成一条管线）═══════════════════════
// 文案按 cui 口述定稿：主标是「一个人就是一个团队」，副标讲 AI Native 管线，下面按技术 / 策划 / 美术三个职能分。
function pipeline() {
  const W = 1200, H = 340, id = 'p';
  const eyebrow = pixText('SOLO PLAYER / FULL PARTY', 72, 44, 2.4, C.primaryD);
  const stations = [
    { key: 'tech', sprite: 'gear', tone: C.mint, en: 'TECH', zh: '技术', cx: 300 },
    { key: 'design', sprite: 'scroll', tone: C.amber, en: 'DESIGN', zh: '策划', cx: 600 },
    { key: 'art', sprite: 'brush', tone: C.rose, en: 'ART', zh: '美术', cx: 900, locked: true },
  ];
  const size = 80, top = 176, px = 4, off = (size - 16 * px) / 2;
  let body = '';
  stations.forEach((st, i) => {
    const x = st.cx - size / 2;
    const block = iconBlock(x, top, size, st.tone, sprite(ICONS[st.sprite], x + off, top + off, px), 'p-' + st.key);
    const en = pixText(st.en, st.cx - pixWidth(st.en, 2.4) / 2, 272, 2.4, C.title);
    const label = `<text x="${st.cx}" y="${314}" text-anchor="middle" font-family="${FONT_ZH}" font-size="17" font-weight="700" fill="${C.muted}">${st.zh}</text>`;
    let g = idle(block, 6, 4.4 + i * 0.4, i * 1.1) + en.path + label;
    if (st.locked) {
      const lk = pixText('LOCKED', x + size + 14, top + 10, 2, mix(C.amber, 70, '#000000'));
      g = `<g opacity=".6">${g}</g>${lk.path}`;
    }
    body += g;
    // 站点之间的管线：像素点阵 + 一个 > 箭头
    if (i < stations.length - 1) {
      const from = st.cx + size / 2 + 18, to = stations[i + 1].cx - size / 2 - 18, cy = top + size / 2;
      let dots = '';
      for (let dx = from; dx < to; dx += 14) dots += `<rect x="${dx}" y="${cy - 2}" width="5" height="5" rx="1" fill="${C.primary}" fill-opacity=".45"/>`;
      const arrow = pixText('>', (from + to) / 2 - pixWidth('>', 3) / 2, cy - 10, 3, C.primaryD);
      body += dots + arrow.path;
    }
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="开源才是最大的 UGC，一个人就是一个团队。一条完整的 AI Native 游戏研发生产管线，技术 / 策划 / 美术一个人带着 Agent 就能跑完">
${defs(id, W, H)}
<g clip-path="url(#${id}-round)">
  <rect width="${W}" height="${H}" fill="url(#${id}-banner)"/>
  <rect width="${W}" height="${H}" fill="url(#${id}-grid)"/>
  <rect width="${W}" height="${H}" fill="url(#${id}-dots)" mask="url(#${id}-mR)"/>
  ${eyebrow.path}
  <text x="72" y="112" font-family="${FONT_ZH}" font-size="42" font-weight="700" fill="${C.ink}">开源才是最大的 UGC，一个人就是一个团队。</text>
  <text x="72" y="148" font-family="${FONT_ZH}" font-size="20" fill="${C.muted}">一条完整的 AI Native 游戏研发生产管线。技术、美术、策划三个职能，一个人带着 Agent 就能跑完。</text>
  ${body}
  ${idle(isoCube(1110, 150, 20, C.primary), 7, 4.6, 0.8)}
  ${idle(gtSprite(SPRITES.gem, 1056, 262, 8, C.rose), 6, 3.8, 1.9)}
  ${brandMark(W - 36 - 48 - 100, 30, 48, .9)}
  <rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="26" fill="none" stroke="${C.line}"/>
</g>
</svg>`;
}

// ═══════════════════════ 宣言横幅（等式版式：框架 + AI + 商业引擎 = 完整的游戏）═══════════════════════
function manifesto() {
  const W = 1200, H = 420, id = 'm';
  const eyebrow = pixText('AI NATIVE / VOXEL GAMEPLAY FRAMEWORK', 72, 44, 2.4, C.primaryD);
  // 四个站点 + 三个运算符，居中排成一行等式
  const terms = [
    { key: 'idea', sprite: 'bulb', tone: C.amber, en: 'IDEA', zh: '你的想法' },
    { key: 'fw', sprite: 'cube', tone: C.primary, en: 'LUMIO', zh: 'Lumio 框架' },
    { key: 'ai', sprite: 'robot', tone: C.mint, en: 'AGENT', zh: '你的 AI Agent' },
    { key: 'eng', sprite: 'gear', tone: C.rose, en: 'ANY ENGINE', zh: '商业引擎 / Godot' },
    { key: 'game', sprite: 'castle', tone: C.amber, en: 'SHIP IT', zh: '一个完整的商业化游戏', hot: true },
  ];
  const ops = ['+', '+', '+', '='];
  const size = 84, top = 244, px = 4, off = (size - 16 * px) / 2, gapOp = 92;
  const rowW = terms.length * size + ops.length * gapOp;
  let x = (W - rowW) / 2;
  let body = '';
  terms.forEach((t, i) => {
    const cx = x + size / 2;
    let block = iconBlock(x, top, size, t.tone, sprite(ICONS[t.sprite], x + off, top + off, px), 'm-' + t.key);
    if (t.hot) {
      // 结果项：外圈描一层 amber 光环，像素星星点两颗
      block = `<rect x="${x - 8}" y="${top - 8}" width="${size + 16}" height="${size + 16}" rx="${size * 0.25 + 8}" fill="none" stroke="${C.amber}" stroke-width="3" stroke-dasharray="10 8"><animate attributeName="stroke-dashoffset" values="0;-36" dur="1.6s" repeatCount="indefinite"/></rect>` + block
        + gtSprite(SPRITES.star, x + size + 6, top - 18, 5, C.amber, 1) + gtSprite(SPRITES.star, x - 26, top + size - 4, 4, C.rose, 1);
    }
    const en = pixText(t.en, cx - pixWidth(t.en, 2.2) / 2, top + size + 22, 2.2, t.hot ? mix(C.amber, 70, '#000000') : C.title);
    const zh = `<text x="${cx}" y="${top + size + 66}" text-anchor="middle" font-family="${FONT_ZH}" font-size="17" font-weight="700" fill="${t.hot ? C.ink : C.muted}">${t.zh}</text>`;
    body += idle(block, 6, 4.2 + i * 0.35, i * 0.9) + en.path + zh;
    x += size;
    if (i < ops.length) {
      const op = pixText(ops[i], x + gapOp / 2 - pixWidth(ops[i], 5) / 2, top + size / 2 - 17, 5, ops[i] === '=' ? mix(C.amber, 70, '#000000') : C.primaryD);
      body += op.path;
      x += gapOp;
    }
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="一套框架，加上你的 AI，加上你手里的商业引擎，做出一个完整的游戏。Lumio 不是引擎，是一套 AI Native 的通用体素 Gameplay 框架，也是一套架构。">
${defs(id, W, H)}
<g clip-path="url(#${id}-round)">
  <rect width="${W}" height="${H}" fill="url(#${id}-panel)"/>
  <rect width="${W}" height="${H}" fill="url(#${id}-grid)"/>
  <rect width="${W}" height="${H}" fill="url(#${id}-dots)" mask="url(#${id}-mL)"/>
  <rect width="${W}" height="${H}" fill="url(#${id}-dots)" mask="url(#${id}-mR)"/>
  ${eyebrow.path}
  <text x="72" y="116" font-family="${FONT_ZH}" font-size="46" font-weight="700" fill="${C.ink}">Idea + Lumio + Agent + 游戏引擎</text>
  <text x="72" y="170" font-family="${FONT_ZH}" font-size="46" font-weight="700" fill="${C.ink}">= 一个<tspan fill="${mix(C.amber, 70, '#000000')}">完整的商业化游戏</tspan></text>
  <text x="72" y="212" font-family="${FONT_ZH}" font-size="20" fill="${C.muted}">Lumio 不是引擎，是一套 AI Native 的通用体素 Gameplay 框架，也是一套架构。渲染和物理交给你手里的引擎。</text>
  ${body}
  ${idle(isoCube(1116, 330, 18, C.mint), 7, 4.6, 0.8)}
  ${idle(gtSprite(SPRITES.bolt, 1130, 190, 8, C.amber), 6, 3.8, 1.9)}
  ${brandMark(W - 36 - 48 - 100, 30, 48, .9)}
  <rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="26" fill="none" stroke="${C.line}"/>
</g>
</svg>`;
}

// ═══════════════════════ 飞书群二维码卡（.gt-card 外壳 + qrencode 矩阵）═══════════════════════
// 邀请链接的唯一落点。飞书群邀请链接会过期 / 被重置，换链接只改这里再重建。
export const COMMUNITIES = {
  qq: { zh: 'QQ 交流群', en: 'QQ GROUP 972220164', tone: C.primaryD,
    url: 'https://qm.qq.com/q/PGkXh4tCyQ' },
  game: { zh: 'LumioGame 开发者社区', en: 'LUMIOGAME COMMUNITY', tone: C.amber,
    url: 'https://applink.feishu.cn/client/chat/chatter/add_by_link?link_token=b24vf257-5a2b-41ce-935e-bc4ce19dc396' },
  engine: { zh: 'LumioEngine 开发者社区', en: 'LUMIOENGINE COMMUNITY', tone: C.mint,
    url: 'https://applink.feishu.cn/client/chat/chatter/add_by_link?link_token=fffn1ae7-fd83-4315-96ac-6fa3aba3968e' },
  workflow: { zh: 'Workflow 开发者社区', en: 'WORKFLOW COMMUNITY', tone: C.primary,
    url: 'https://applink.feishu.cn/client/chat/chatter/add_by_link?link_token=7bbl451c-aa1d-4e6d-a21c-fd1f1ebeb6b5' },
};
function qrMatrix(url) {
  // 纠错 M、零留白、1 模块 = 1 单位；留白由卡片自己给
  const svg = execFileSync('qrencode', ['-t', 'SVG', '-l', 'M', '-m', '0', '-s', '1', '-o', '-', url], { encoding: 'utf8' });
  const size = +svg.match(/viewBox="0 0 (\d+) \d+"/)[1];
  const cells = [...svg.matchAll(/<rect x="(\d+)" y="(\d+)" width="1" height="1" fill="#[0-9a-f]{6}"\/>/g)].map((m) => [+m[1], +m[2]]);
  if (!cells.length) throw new Error('qrencode 没输出模块');
  return { size, cells };
}
function qrCard(key) {
  const { zh, en, tone, url } = COMMUNITIES[key];
  const { size, cells } = qrMatrix(url);
  const W = 260, H = 300, pad = 30, Q = W - pad * 2, m = Q / size;
  let d = '';
  for (const [x, y] of cells) d += `M${(pad + x * m).toFixed(3)} ${(pad + y * m).toFixed(3)}h${(m + 0.03).toFixed(3)}v${(m + 0.03).toFixed(3)}h-${(m + 0.03).toFixed(3)}z`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="扫码加入 ${zh} · ${en}">
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="26" fill="#fff" stroke="${C.line}"/>
<path d="${d}" fill="${C.ink}"/>
<rect x="${pad}" y="${pad + Q + 22}" width="4" height="26" rx="2" fill="${tone}"/>
<text x="${pad + 16}" y="${pad + Q + 42}" font-family="${FONT_ZH}" font-size="17" font-weight="700" fill="${C.ink}">${zh}</text>
</svg>`;
}

// ═══════════════════════ 分割线：发丝线 + 中间一小撮签名图形 ═══════════════════════
function divider(dark) {
  const W = 1200, H = 56, cy = 30;
  const line = dark ? '#3A4670' : C.line;
  const dot = dark ? '#4A567F' : C.faint;
  const mid = W / 2;
  let dots = '';
  for (let i = 1; i <= 4; i++) {
    dots += `<rect x="${mid - 150 - i * 14}" y="${cy - 2}" width="4" height="4" fill="${dot}" fill-opacity="${1 - i * 0.2}"/>`;
    dots += `<rect x="${mid + 150 + i * 14 - 4}" y="${cy - 2}" width="4" height="4" fill="${dot}" fill-opacity="${1 - i * 0.2}"/>`;
  }
  const label = pixText('STAGE 1 - 2', mid - pixWidth('STAGE 1 - 2', 2) / 2, cy + 12, 2, dot);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="divider">
<rect x="0" y="${cy - 0.5}" width="${mid - 210}" height="1" fill="${line}"/>
<rect x="${mid + 210}" y="${cy - 0.5}" width="${mid - 210}" height="1" fill="${line}"/>
${dots}
${idle(isoCube(mid - 60, cy - 22, 13, C.primary), 4, 4.2, 0)}
${idle(gtSprite(SPRITES.star, mid - 20, cy - 20, 6, C.amber), 5, 3.6, 1.1)}
${idle(isoCube(mid + 60, cy - 22, 13, C.mint), 4, 4.8, 2)}
${label.path}
</svg>`;
}

// ═══════════════════════ 写出 ═══════════════════════
const files = {
  'divider.svg': divider(false),
  'divider-dark.svg': divider(true),
  'qr-qq.svg': qrCard('qq'),
  'qr-game.svg': qrCard('game'),
  'qr-engine.svg': qrCard('engine'),
  'qr-workflow.svg': qrCard('workflow'),
  'sec-find-party.svg': section('找组织', 'FIND YOUR PARTY', C.rose, false),
  'sec-find-party-dark.svg': section('找组织', 'FIND YOUR PARTY', C.rose, true),
  'hero.svg': hero(),
  'footer.svg': footer(),
  'sec-why.svg': section('为什么做', 'WHY WE BUILD', C.amber, false),
  'sec-why-dark.svg': section('为什么做', 'WHY WE BUILD', C.amber, true),
  'sec-special-moves.svg': section('核心优势', 'SPECIAL MOVES', C.rose, false),
  'sec-special-moves-dark.svg': section('核心优势', 'SPECIAL MOVES', C.rose, true),
  'pipeline.svg': pipeline(),
  'manifesto.svg': manifesto(),
  'sec-out-of-bounds.svg': section('明确不做', 'OUT OF BOUNDS', C.amber, false),
  'sec-out-of-bounds-dark.svg': section('明确不做', 'OUT OF BOUNDS', C.amber, true),
  'sec-next.svg': section('下一步', 'NEXT STAGE', C.mint, false),
  'sec-next-dark.svg': section('下一步', 'NEXT STAGE', C.mint, true),
  'sec-join-us.svg': section('加入我们', 'JOIN US', C.primaryD, false),
  'sec-join-us-dark.svg': section('加入我们', 'JOIN US', C.primaryD, true),
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
  'icon-search.svg': icon('search', C.amber),
  'icon-levelup.svg': icon('levelup', C.mint),
  'icon-art.svg': icon('brush', C.rose),
};
for (const [name, svg] of Object.entries(files)) fs.writeFileSync(path.join(OUT, name), svg.trim() + '\n');
console.log(`wrote ${Object.keys(files).length} files → ${path.relative(ROOT, OUT)}`);
