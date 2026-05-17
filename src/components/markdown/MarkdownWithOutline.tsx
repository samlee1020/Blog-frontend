import { useMemo, useState } from 'react'
import { ChevronRight, ListTree } from 'lucide-react'
import { extractMarkdownHeadings, MarkdownRenderer } from './MarkdownRenderer'
import type { MarkdownHeading } from './MarkdownRenderer'

interface OutlineNode extends MarkdownHeading {
  children: OutlineNode[]
}

function buildOutlineTree(headings: MarkdownHeading[]) {
  const roots: OutlineNode[] = []
  const stack: OutlineNode[] = []

  for (const heading of headings) {
    const node: OutlineNode = { ...heading, children: [] }

    while (stack.length && stack[stack.length - 1].level >= node.level) {
      stack.pop()
    }

    const parent = stack[stack.length - 1]
    if (parent) {
      parent.children.push(node)
    } else {
      roots.push(node)
    }

    stack.push(node)
  }

  return roots
}

function OutlineItem({
  node,
  expandedIds,
  onToggle,
}: {
  node: OutlineNode
  expandedIds: Set<string>
  onToggle: (id: string) => void
}) {
  const hasChildren = node.children.length > 0
  const expanded = expandedIds.has(node.id)

  return (
    <li>
      <div className="flex min-w-0 items-center gap-1">
        {hasChildren ? (
          <button
            type="button"
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label={`${expanded ? '收起' : '展开'} ${node.text} 的子目录`}
            aria-expanded={expanded}
            onClick={() => onToggle(node.id)}
          >
            <ChevronRight size={14} className={`transition ${expanded ? 'rotate-90' : ''}`} />
          </button>
        ) : (
          <span className="h-5 w-5 shrink-0" />
        )}
        <a className="block min-w-0 flex-1 truncate text-slate-500 hover:text-blue-700" href={`#${node.id}`} title={node.text}>
          {node.text}
        </a>
      </div>
      {hasChildren && expanded ? (
        <ol className="mt-1 space-y-1 pl-5">
          {node.children.map((child) => (
            <OutlineItem key={child.id} node={child} expandedIds={expandedIds} onToggle={onToggle} />
          ))}
        </ol>
      ) : null}
    </li>
  )
}

export function MarkdownWithOutline({ content }: { content?: string | null }) {
  const headings = useMemo(() => extractMarkdownHeadings(content), [content])
  const outlineTree = useMemo(() => buildOutlineTree(headings), [headings])
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set())

  function toggleHeading(id: string) {
    setExpandedIds((current) => {
      const next = new Set(current)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  if (!content) return null

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_240px]">
      <div className="min-w-0">
        <MarkdownRenderer content={content} />
      </div>
      {headings.length ? (
        <aside className="order-first border-b border-slate-100 pb-5 lg:order-none lg:border-b-0 lg:border-l lg:pb-0 lg:pl-5">
          <nav className="lg:sticky lg:top-24" aria-label="文章目录">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
              <ListTree size={16} />
              目录
            </div>
            <ol className="space-y-2 text-sm leading-6">
              {outlineTree.map((node) => (
                <OutlineItem key={node.id} node={node} expandedIds={expandedIds} onToggle={toggleHeading} />
              ))}
            </ol>
          </nav>
        </aside>
      ) : null}
    </div>
  )
}
