import type { ComponentProps, ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import { toAssetUrl } from '../../utils/asset'
import { markdownRehypePlugins, markdownRemarkPlugins } from './options'

export interface MarkdownHeading {
  id: string
  level: number
  text: string
}

function slugify(text: string) {
  const normalized = text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  return normalized || 'heading'
}

function stripMarkdown(text: string) {
  return text
    .replace(/\\([\\`*{}[\]()#+\-.!_>])/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[`*_~]/g, '')
    .replace(/<[^>]+>/g, '')
    .trim()
}

function textFromChildren(children: ReactNode): string {
  if (typeof children === 'string' || typeof children === 'number') return String(children)
  if (Array.isArray(children)) return children.map(textFromChildren).join('')
  if (children && typeof children === 'object' && 'props' in children) {
    return textFromChildren((children as { props?: { children?: ReactNode } }).props?.children)
  }
  return ''
}

function createHeadingId(text: string, counts: Map<string, number>) {
  const base = slugify(text)
  const count = counts.get(base) || 0
  counts.set(base, count + 1)
  return count ? `${base}-${count + 1}` : base
}

export function extractMarkdownHeadings(content?: string | null): MarkdownHeading[] {
  if (!content) return []

  const headings: MarkdownHeading[] = []
  const counts = new Map<string, number>()
  let inFence = false

  for (const line of content.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence
      continue
    }
    if (inFence) continue

    const match = /^(#{1,4})\s+(.+?)\s*#*\s*$/.exec(line)
    if (!match) continue

    const text = stripMarkdown(match[2])
    if (!text) continue

    headings.push({
      id: createHeadingId(text, counts),
      level: match[1].length,
      text,
    })
  }

  return headings
}

function Heading({
  level,
  children,
  ...props
}: ComponentProps<'h1'> & { level: 1 | 2 | 3 | 4 }) {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4'
  return (
    <Tag {...props}>
      {children}
    </Tag>
  )
}

export function MarkdownRenderer({ content }: { content?: string | null }) {
  if (!content) return null

  const headingCounts = new Map<string, number>()

  function renderHeading(level: 1 | 2 | 3 | 4, children: ReactNode, props: ComponentProps<'h1'>) {
    const text = textFromChildren(children)
    const id = createHeadingId(text, headingCounts)
    return (
      <Heading {...props} id={id} level={level}>
        {children}
      </Heading>
    )
  }

  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={markdownRemarkPlugins}
        rehypePlugins={markdownRehypePlugins}
        components={{
          h1: ({ children, ...props }) => renderHeading(1, children, props),
          h2: ({ children, ...props }) => renderHeading(2, children, props),
          h3: ({ children, ...props }) => renderHeading(3, children, props),
          h4: ({ children, ...props }) => renderHeading(4, children, props),
          img: ({ src = '', alt = '' }) => (
            <img src={toAssetUrl(src)} alt={alt} className="rounded-lg border border-slate-200" />
          ),
          a: ({ href = '', children }) => (
            <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
