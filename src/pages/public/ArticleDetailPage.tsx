import { CalendarDays } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { articleApi } from '../../api/articles'
import { PageState } from '../../components/common/PageState'
import { MarkdownWithOutline } from '../../components/markdown/MarkdownWithOutline'
import { CommentSection } from '../../components/public/CommentSection'
import type { ArticleDetailView } from '../../types/domain'
import { toAssetUrl } from '../../utils/asset'
import { formatDate } from '../../utils/date'

export function ArticleDetailPage() {
  const { slug = '' } = useParams()
  const [article, setArticle] = useState<ArticleDetailView | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setArticle(await articleApi.detail(slug))
    } catch (err) {
      setError(err instanceof Error ? err.message : '文章不存在或尚未发布')
    } finally {
      setLoading(false)
    }
  }, [slug])

  useEffect(() => {
    void load()
  }, [load])

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <PageState loading={loading} error={error} onRetry={load}>
        {article ? (
          <>
            <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              {article.coverImageUrl ? <img src={toAssetUrl(article.coverImageUrl)} alt={article.title} className="mb-8 aspect-[16/7] w-full rounded-lg object-cover" /> : null}
              <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                <CalendarDays size={16} />
                <span>{formatDate(article.publishedAt || article.createdAt)}</span>
                {article.category ? <Link to={`/articles?categorySlug=${article.category.slug}`} className="rounded bg-slate-100 px-2 py-1 text-slate-600">{article.category.name}</Link> : null}
              </div>
              <h1 className="text-3xl font-bold tracking-normal text-slate-950 md:text-5xl">{article.title}</h1>
              {article.summary ? <p className="mt-4 text-lg leading-8 text-slate-600">{article.summary}</p> : null}
              <div className="mt-4 flex flex-wrap gap-2">
                {(article.tags || []).map((tag) => (
                  <Link key={tag.id} to={`/articles?tagSlug=${tag.slug}`} className="rounded bg-blue-50 px-2 py-1 text-sm text-blue-700">{tag.name}</Link>
                ))}
              </div>
              <div className="mt-10 border-t border-slate-100 pt-8">
                <MarkdownWithOutline key={article.slug || article.id} content={article.contentMarkdown} />
              </div>
            </article>
            <CommentSection slug={slug} />
          </>
        ) : null}
      </PageState>
    </main>
  )
}
