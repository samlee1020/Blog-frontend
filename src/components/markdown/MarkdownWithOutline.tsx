import { ListTree } from 'lucide-react'
import { extractMarkdownHeadings, MarkdownRenderer } from './MarkdownRenderer'

export function MarkdownWithOutline({ content }: { content?: string | null }) {
  const headings = extractMarkdownHeadings(content)

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
              {headings.map((heading) => (
                <li key={heading.id} style={{ paddingLeft: `${Math.max(0, heading.level - 1) * 12}px` }}>
                  <a className="block truncate text-slate-500 hover:text-blue-700" href={`#${heading.id}`} title={heading.text}>
                    {heading.text}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>
      ) : null}
    </div>
  )
}
