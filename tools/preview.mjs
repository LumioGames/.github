// 本地预览：用 GitHub 自家的 Markdown 渲染 API 出 HTML（与线上同一套 sanitizer），
// 把 raw.githubusercontent 的素材链接换成本地相对路径，套一层近似 github 的外壳。
// 用法：node tools/preview.mjs  →  profile/preview.html（本文件是预览用，不进版本库）
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RAW = 'https://raw.githubusercontent.com/LumioGames/.github/main/profile/assets/';
const body = execFileSync('gh', ['api', '-X', 'POST', '/markdown', '-F', 'text=@profile/README.md', '-f', 'mode=gfm', '-f', 'context=LumioGames/.github'], { cwd: ROOT, encoding: 'utf8' })
  .replaceAll(RAW, 'assets/')
  // GitHub API 把 ```mermaid 渲成 <pre lang="mermaid">，本地交给 mermaid.js 画
  .replace(/<pre lang="mermaid"><code>([\s\S]*?)<\/code><\/pre>/g, (_, code) => `<pre class="mermaid">${code}</pre>`);

const html = `<!doctype html><html><head><meta charset="utf-8"><title>LumioGames · profile preview</title>
<style>
:root{color-scheme:light dark;--bg:#fff;--fg:#1f2328;--muted:#59636e;--line:#d1d9e0;--code:#f6f8fa;--link:#0969da}
@media (prefers-color-scheme:dark){:root{--bg:#0d1117;--fg:#f0f6fc;--muted:#9198a1;--line:#3d444d;--code:#151b23;--link:#4493f8}}
body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif}
.wrap{max-width:1012px;margin:0 auto;padding:32px 24px}
h1,h2,h3{margin:24px 0 16px;line-height:1.25} h3{font-size:1.25em}
a{color:var(--link);text-decoration:none} a:hover{text-decoration:underline}
img{max-width:100%} table{border-collapse:collapse;width:100%;margin:16px 0} td,th{border:1px solid var(--line);padding:6px 13px;vertical-align:top}
tr:nth-child(2n){background:var(--code)} pre{background:var(--code);padding:16px;border-radius:6px;overflow:auto} code{background:var(--code);padding:.2em .4em;border-radius:6px;font-size:85%;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
pre code{padding:0} blockquote{margin:0;padding:0 1em;color:var(--muted);border-left:.25em solid var(--line)}
.mermaid{background:transparent;text-align:center}
sub{font-size:.75em;color:var(--muted)}
</style></head><body><div class="wrap">${body}</div>
<script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"></script>
<script>if (window.mermaid) mermaid.initialize({startOnLoad:true,securityLevel:'loose'});</script>
</body></html>`;
fs.writeFileSync(path.join(ROOT, 'profile', 'preview.html'), html);
console.log('wrote profile/preview.html');
