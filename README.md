# Web Translate 宣传落地页

纯静态站点，与 `server/` 无代码依赖。内测邮箱通过 Google Apps Script 提交，不经过 API。

## 本地预览

```bash
cd web
npm install
npm run dev
```

浏览器访问 `http://localhost:5007`

## 生产部署

将本目录下所有文件（`index.html`、`css/`、`js/`、`assets/`）部署到静态托管即可：

- Nginx 静态目录 → `la-yee.com`
- Cloudflare Pages
- 腾讯云 COS + CDN

无需 Node 进程（`npm start` 仅用于临时预览）。

## 项目结构

```
web-translate/
├── server/     # API 后端（独立仓库可单独部署）
├── web/        # 本目录 — 宣传落地页
└── extension/  # 浏览器插件
```
