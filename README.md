# Web Translate 宣传落地页

纯静态站点，与 `server/` 无代码依赖。内测邮箱通过 Google Apps Script 提交，不经过 API。

## 本地预览

```bash
npm install
npm run dev
```

浏览器访问 `http://localhost:5007`

## 生产运行

```bash
chmod +x run.sh
./run.sh
```

默认监听 `0.0.0.0:5007`，可通过环境变量改端口：

```bash
PORT=80 ./run.sh
```

配合 Nginx 反代到 `la-yee.com` 时，可让本进程监听 `127.0.0.1:5007`，由 Nginx 对外提供 443。

后台守护（可选）：

```bash
nohup ./run.sh > web.log 2>&1 &
# 或使用 pm2: pm2 start run.sh --name web-translate-web --interpreter bash
```

## 生产部署（推荐）

将本目录静态文件部署到 Nginx / Cloudflare Pages 时，**无需** Node 进程：

- Nginx 静态目录 → `la-yee.com`
- Cloudflare Pages
- 腾讯云 COS + CDN

`run.sh` 适用于快速上线或暂无 Nginx 的场景。

### Nginx 反向代理（HTTP）

`run.sh` 监听 `127.0.0.1:5007` 后，用 Nginx 对外暴露 80 端口：

```bash
sudo cp nginx/la-yee.com.conf /etc/nginx/conf.d/la-yee.com.conf
sudo nginx -t && sudo systemctl reload nginx
```

将 `la-yee.com`、`www.la-yee.com` 解析到服务器公网 IP 即可。

## 项目结构

```
web-translate/
├── server/     # API 后端（独立仓库）
├── web/        # 本目录 — 宣传落地页
└── extension/  # 浏览器插件
```
