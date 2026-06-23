import rehypeKatex from 'rehype-katex'
import rehypePrism from 'rehype-prism-plus'
import rehypeSanitize from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import type { PluggableList } from 'unified'

export const markdownRemarkPlugins: PluggableList = [remarkGfm, remarkMath]
export const markdownEditorRehypePlugins: PluggableList = [rehypeSanitize, rehypeKatex]
export const markdownRehypePlugins: PluggableList = [
  ...markdownEditorRehypePlugins,
  [rehypePrism, { ignoreMissing: true }],
]
