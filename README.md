# Blog Frontend

Sam Lee的小站前端项目，基于 React、TypeScript、Vite、Tailwind CSS 和 Ant Design 构建。

## 功能范围

- 公开端：首页、文章列表、文章详情、项目列表、项目详情、关于页。
- 管理端：文章、分类、标签、项目、媒体资源和站点资料管理。
- Markdown：支持 GFM 列表、表格、代码块，以及 KaTeX 数学公式渲染。
- 资源访问：图片和上传资源使用 `/uploads/xxx` 同源路径。
- API 访问：生产环境默认使用 `/api/xxx` 同源路径，适合配合 Nginx 反向代理部署。

## 技术栈

- React 19
- TypeScript
- Vite
- React Router
- Axios
- Tailwind CSS
- Ant Design
- React Markdown / MDEditor / KaTeX
- Vitest

## 本地开发

安装依赖：

```bash
npm install
```

启动开发服务：

```bash
npm run dev
```

本地开发时，`vite.config.ts` 会把 `/api` 和 `/uploads` 代理到本机后端。默认后端地址为：

```text
http://localhost:8080
```

## 环境变量

环境变量示例见 [.env.example](./.env.example)。

生产环境同源部署时保持为空：

```env
VITE_API_BASE_URL=
```

这样构建后的浏览器请求会走：

```text
/api/xxx
/uploads/xxx
```

不要在生产构建中写入后端内网端口、公网 IP 或 localhost 地址。

## 常用命令

```bash
npm run dev
npm run build
npm run lint
npm run test
npm run preview
```

## 生产构建

```bash
npm run build
```

构建产物位于：

```text
dist/
```

`dist` 可以直接交给 Nginx 托管。

## Nginx 同源部署

当前部署目标：

```text
http://39.106.15.85:8080
```

推荐 Nginx 路由：

```text
/          -> 前端 dist
/api/      -> http://127.0.0.1:18080/api/
/uploads/  -> http://127.0.0.1:18080/uploads/
```

仓库内的 [nginx.conf](./nginx.conf) 已包含上述同源部署配置。

## Docker 部署

构建镜像：

```bash
docker build -t blog-frontend .
```

如果后端运行在宿主机 `127.0.0.1:18080`，Linux 服务器上可以使用 host 网络：

```bash
docker run -d --name blog-frontend --network host blog-frontend
```

也可以选择不使用 Docker，直接把 `dist` 复制到宿主机 Nginx 的站点目录。

## 后端约定

前端期望后端提供：

- `/api/` 下的业务接口。
- `/uploads/` 下的静态上传资源。
- 登录后接口使用 `Authorization: Bearer <token>`。

更详细的接口说明见 [doc/前端API接口文档.md](./doc/前端API接口文档.md) 和 [doc/项目管理新增API文档.md](./doc/项目管理新增API文档.md)。
