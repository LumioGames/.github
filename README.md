# LumioGames/.github

组织主页（https://github.com/LumioGames）的内容源。GitHub 会把本仓库 `profile/README.md` 渲染到组织首页。

## 结构

```text
profile/README.md        组织主页正文（GitHub 渲染这一份）
profile/assets/*.svg     主页用的全部图：hero、章节标、仓库图标、页脚。全是生成物，不手改
tools/build-assets.mjs   生成器。像素字是 5×7 位图现画，不依赖外部字体
tools/preview.mjs        本地预览：走 GitHub 的 Markdown API 渲染，产出 profile/preview.html
```

## 改图

视觉语言是 GameTech（与 LumioVideoWorkFlow 的 `design-system/` 同一套色板与体素 / 图标块配方）。
改完生成器重新构建，把产物一起提交：

```bash
node tools/build-assets.mjs
node tools/preview.mjs   # 需要 gh 已登录；产物 preview.html 不入库
```

## 主页里没放的两件事

- **置顶仓库**在组织设置里手动选，GitHub 没有对应 API。当前建议：LumioGame、LumioGameEngine、LumioAgentSpec、workflow-plugin、LumioServer、LumioClient。
- **组织简介 / 网站**在组织 Settings → Profile 里改。
