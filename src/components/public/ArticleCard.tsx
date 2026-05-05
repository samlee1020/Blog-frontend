import { CalendarDays } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { ArticleSummaryView } from '../../types/domain'
import { toAssetUrl } from '../../utils/asset'
import { formatDate } from '../../utils/date'

export function ArticleCard({ article }: { article: ArticleSummaryView }) {
  return (
    <Link
      to={`/articles/${article.slug}`}
      className="group grid min-h-44 overflow-hidden rounded-lg border border-slate-200 bg-white text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md md:grid-cols-[180px_1fr]"
    >
      <div className="h-40 bg-slate-100 md:h-full">
        {article.coverImageUrl ? (
          <img src={toAssetUrl(article.coverImageUrl)} alt={article.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#e0f2fe,#f8fafc_45%,#dbeafe)] text-sm font-semibold text-slate-500">
            Tech Notes
          </div>
        )}
      </div>
      <div className="flex min-w-0 flex-col gap-3 p-5">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <CalendarDays size={14} />
          <span>{formatDate(article.publishedAt || article.createdAt)}</span>
          {article.category ? <span className="rounded bg-slate-100 px-2 py-0.5">{article.category.name}</span> : null}
        </div>
        <h3 className="line-clamp-2 text-lg font-semibold tracking-normal text-slate-950 group-hover:text-blue-600">
          {article.title}
        </h3>
        <p className="line-clamp-2 text-sm leading-6 text-slate-600">{article.summary || '暂无摘要'}</p>
        <div className="mt-auto flex flex-wrap gap-2">
          {(article.tags || []).slice(0, 4).map((tag) => (
            <span key={tag.id} className="rounded bg-blue-50 px-2 py-1 text-xs text-blue-700">
              {tag.name}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}
