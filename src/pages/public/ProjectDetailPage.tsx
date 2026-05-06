import { CalendarDays, ExternalLink } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from 'antd'
import { projectApi } from '../../api/projects'
import { PageState } from '../../components/common/PageState'
import { MarkdownWithOutline } from '../../components/markdown/MarkdownWithOutline'
import type { ProjectView } from '../../types/domain'
import { toAssetUrl } from '../../utils/asset'
import { formatDate } from '../../utils/date'

export function ProjectDetailPage() {
  const { slug = '' } = useParams()
  const [project, setProject] = useState<ProjectView | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setProject(await projectApi.detail(slug))
    } catch (err) {
      setError(err instanceof Error ? err.message : '项目不存在或尚未发布')
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
        {project ? (
          <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            {project.imageUrl ? (
              <img src={toAssetUrl(project.imageUrl)} alt={project.title} className="aspect-[16/7] w-full object-cover" />
            ) : (
              <div className="flex aspect-[16/7] items-center justify-center bg-slate-950 font-mono text-green-300">
                {'>'} open {project.slug}
              </div>
            )}
            <div className="p-6 md:p-8">
              <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                <CalendarDays size={16} />
                <span>{formatDate(project.updatedAt || project.createdAt)}</span>
              </div>
              <h1 className="text-3xl font-bold tracking-normal text-slate-950 md:text-5xl">{project.title}</h1>
              {project.description ? <p className="mt-5 text-lg leading-8 text-slate-600">{project.description}</p> : null}
              <div className="mt-5 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="rounded bg-blue-50 px-2 py-1 text-sm text-blue-700">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-8 flex gap-3">
                {project.projectUrl ? (
                  <a href={project.projectUrl} target="_blank" rel="noreferrer">
                    <Button type="primary" icon={<ExternalLink size={16} />}>
                      打开项目
                    </Button>
                  </a>
                ) : null}
                <Link to="/projects">
                  <Button>返回项目列表</Button>
                </Link>
              </div>
              {project.contentMarkdown ? (
                <div className="mt-10 border-t border-slate-100 pt-8">
                  <MarkdownWithOutline content={project.contentMarkdown} />
                </div>
              ) : null}
            </div>
          </article>
        ) : null}
      </PageState>
    </main>
  )
}
