# 我的视频参考库

一个无需安装依赖的静态网站，收录 2026-11-05 获取的 550 条 MiniMax H3 视频案例。

## 公开网页

网站入口：[我的视频参考库](https://liyichao0215-pixel.github.io/minimax-h3-prompts/)

[中文](https://liyichao0215-pixel.github.io/minimax-h3-prompts/?lang=zh) · [日本語](https://liyichao0215-pixel.github.io/minimax-h3-prompts/?lang=ja) · [English](https://liyichao0215-pixel.github.io/minimax-h3-prompts/?lang=en) · [한국어](https://liyichao0215-pixel.github.io/minimax-h3-prompts/?lang=ko)

公开网页无需登录，可将网页入口放入 Flova 供访客打开；仓库用于保存源码、参考数据和维护历史。

## 本地打开

在本目录运行 `python3 -m http.server 4317 --bind 127.0.0.1 --directory dist`，浏览器访问 http://127.0.0.1:4317 。请通过 HTTP 服务打开，直接双击 HTML 无法读取数据文件。

运行 `node --test tests/catalog.test.mjs` 检查案例数量、固定编号、分类、来源 URL、搜索和 URL 安全边界。

## 内容和编号

- 支持中文、日文、英文、韩文切换。界面、分类、视频标题和辅助提示均随语言切换；默认中文，会记住本机语言选择。
- 也可使用 `?lang=zh`、`?lang=ja`、`?lang=en`、`?lang=ko` 直接打开相应语言版本。
- 日文和韩文标题由公共英文标题机器翻译，并保存在 `dist/data/titles.json`。中英文标题沿用源目录，原始视频提示词在四个版本中始终保持原文。
- 17 个分类沿用源目录；分类对应 A–Q，切换语言不会改变分类归属或编号。
- 编号保存在 `dist/data/catalog.json` 每条记录的 `code` 中。筛选、搜索、翻页不会改变编号。
- 支持打开视频、查看及复制完整提示词、跳转 X 视频原帖及提示词所在帖子。
- `#A001` 一类片段可直接定位案例。
- 所有视频和封面沿用公开源站 URL。没有下载、重新托管视频，也没有调用生成服务。
- 数据为固定快照，不会自动更新。后续新增案例必须保留旧 `slug` 对应的编号，并从各类别现有最大序号后追加。

## 数据溯源

- 来源：[BeatAPI Prompt Gallery](https://github.com/BeatAPI/awesome-minimax-h3-prompts)
- 原站：https://beatapi.io/minimax-h3-prompts
- 原目录提交：`6041e8c7f541b925e45911084ff41e28e2bf9b5a`
- `scripts/capture.py` 是本次一次性快照工具；已有快照时会拒绝覆盖。
- `scripts/translate-titles.py` 通过 Google Translate 为公开英文标题生成日、韩静态译文。页面运行时不请求翻译服务。
- 原始 `source`、`promptVisibility`、`promptSourceUrls`、`outputStatus` 等字段保留原样。源站声称已验证不代表本站重新验证了其作者身份或生成结果。
- `sourceUpdatedAt` 保留上游字段；`capturedOn` 是实际获取日期，两者不混用。

原始整理说明及授权见 `SOURCE-LICENSE.md`。第三方视频、提示词、姓名和来源帖子仍归原权利人所有，仓库的说明文档许可不构成这些素材的重新授权。

## 当前交付范围

本仓库保存完整网站源码、550 条参考数据、四种语言界面及日/韩标题译文，可独立下载后使用。`dist/` 是完整静态网站目录，无需构建或安装依赖。

GitHub 仓库用于保存和版本管理，公开网页通过 GitHub Pages 托管。网站没有登录、支付、生成模型接口或后台数据库。视频与封面仍引用源站外链，仓库不包含原始视频文件；原站链接失效时应通过保存的 X 来源追溯。

## 后续维护

- 将更新推送到 `main` 后，GitHub Actions 会先运行验证，再将 `dist/` 自动发布到 GitHub Pages；也可在 Actions 中手动运行 `Deploy GitHub Pages`。
- 界面翻译：编辑 `dist/i18n.js`；四种语言的文案键应保持一致。
- 视频标题：中英文来自 `dist/data/catalog.json`，日/韩标题位于 `dist/data/titles.json`，使用原始 `slug` 关联。
- 新增案例：按相同记录结构补充到目录，使用所属分类当前最大编号的下一号；同步分类数量，并添加日/韩标题。不要对已有案例重新编号。
- 更新后运行 `node --test tests/catalog.test.mjs`。新增案例时同步调整测试中的预期收录数与受影响的分类计数。
- 不要直接运行快照抓取覆盖目录。旧编号和来源追溯关系需要长期保留。
