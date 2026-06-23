# 2026-6-23 Markdown 渲染高亮与引用块换行修复

## 1. 修复目标

本次修复聚焦博客前端 Markdown 渲染体验：

- 为 fenced code block 增加语法高亮，提升代码可读性。
- 修复引用块中多行内容在预览和文章详情中被合并成单段显示的问题。

涉及前台文章详情页与后台 Markdown 编辑器预览，因为二者共用 `src/components/markdown/options.ts` 中的 Markdown 插件配置与 `markdown-body` 样式。

## 2. 问题原因

### 2.1 代码块没有语法高亮

原 Markdown 渲染链路只启用了：

- `remark-gfm`
- `remark-math`
- `rehype-sanitize`
- `rehype-katex`

代码块只会被渲染成普通 `pre > code`，全局样式只提供深色背景和基础文字颜色，没有生成语法 token，也没有 token 颜色规则。

### 2.2 引用块软换行被浏览器折叠

Markdown 中如下写法会被解析为一个引用块段落：

```md
> 第一行
> 第二行
> 第三行
```

解析后的文本仍包含换行，但 HTML 段落默认会折叠空白字符，所以视觉上会显示成连续的一段文字。

## 3. 实现内容

### 3.1 增加代码高亮插件

显式加入 `rehype-prism-plus` 依赖，并在 Markdown rehype 插件列表中追加 Prism 高亮：

```ts
export const markdownEditorRehypePlugins = [rehypeSanitize, rehypeKatex]
export const markdownRehypePlugins = [
  ...markdownEditorRehypePlugins,
  [rehypePrism, { ignoreMissing: true }],
]
```

`ignoreMissing: true` 用于避免遇到未知语言标识时代码块渲染失败。

后台编辑器预览使用 `markdownEditorRehypePlugins`，继续交给 `@uiw/react-md-editor` 内置的 Prism 插件完成高亮，避免同一个代码块被重复处理。

### 3.2 增加代码高亮样式

在 `src/index.css` 中为 `.markdown-body .token.*` 增加颜色规则，覆盖常见语法元素：

- 注释
- 标点
- 关键字
- 字符串
- 数字
- 函数
- 类名
- 运算符
- 正则和变量

代码块仍沿用现有深色背景，以保持当前博客视觉风格一致。

### 3.3 保留引用块内软换行

在 `src/index.css` 中增加：

```css
.markdown-body blockquote p {
  white-space: pre-line;
}
```

该规则只作用于引用块中的段落，不会改变普通正文段落的 Markdown 换行语义。

## 4. 回归测试

已补充 Markdown 渲染测试：

- fenced code block 会生成 Prism token，例如 `.token.keyword` 与 `.token.number`。
- 引用块解析后的段落文本保留行间换行符。

建议后续在后台文章编辑器和前台文章详情页各检查一次包含以下内容的文章：

````md
> 第一行
> 第二行
> 第三行

```ts
const answer = 42
```
````

预期效果：

- 引用块三行分行展示。
- TypeScript 代码块有关键字和数字高亮。

## 5. 注意事项

- 代码块建议继续使用语言标识，例如 ` ```ts `、` ```python `、` ```bash `，否则高亮效果会有限。
- 本次没有引入 `remark-breaks`，因此普通正文中的单换行仍遵循标准 Markdown 行为。
- 高亮插件放在 `rehype-sanitize` 之后执行，避免语法 token class 被 sanitize 阶段移除。
