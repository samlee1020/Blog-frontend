import { ArrowRight, Code2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'antd'
import { articleApi } from '../../api/articles'
import { projectApi } from '../../api/projects'
import { siteApi } from '../../api/site'
import { PageState } from '../../components/common/PageState'
import { ArticleCard } from '../../components/public/ArticleCard'
import { ProjectCard } from '../../components/public/ProjectCard'
import type { ArticleSummaryView, CoverView, ProjectView, TagView } from '../../types/domain'
import { toAssetUrl } from '../../utils/asset'

export function HomePage() {
  const [cover, setCover] = useState<CoverView | null>(null)
  const [articles, setArticles] = useState<ArticleSummaryView[]>([])
  const [projects, setProjects] = useState<ProjectView[]>([])
  const [tags, setTags] = useState<TagView[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const [coverData, articleData, projectData, tagData] = await Promise.all([
        siteApi.cover(),
        articleApi.list({ page: 1, size: 3 }),
        projectApi.list({ page: 1, size: 3 }),
        siteApi.tags(),
      ])
      setCover(coverData)
      setArticles(articleData.items)
      setProjects(projectData.items)
      setTags(tagData)
    } catch (err) {
      setError(err instanceof Error ? err.message : '首页加载失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const links = cover?.links?.length
    ? cover.links
    : [
        { label: '阅读文章', url: '/articles', type: 'internal' },
        { label: '查看项目', url: '/projects', type: 'internal' },
      ]

  return (
    <main>
      <PageState loading={loading} error={error} onRetry={load}>
        <section
          className="relative min-h-[430px] overflow-hidden bg-slate-950"
          style={
            cover?.backgroundImageUrl
              ? { backgroundImage: `linear-gradient(90deg, rgba(2,6,23,.82), rgba(15,23,42,.38)), url(${toAssetUrl(cover.backgroundImageUrl)})`, backgroundSize: 'cover', backgroundPosition: 'center' }
              : undefined
          }
        >
          {!cover?.backgroundImageUrl ? (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,#334155,transparent_32%),linear-gradient(135deg,#020617,#1e293b_55%,#0f172a)]" />
          ) : null}
          <div className="relative mx-auto flex min-h-[430px] max-w-6xl flex-col justify-center px-4 py-16 text-white">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-lg border border-white/20 bg-white/10">
              {cover?.avatarImageUrl ? <img src={toAssetUrl(cover.avatarImageUrl)} alt="" className="h-full w-full rounded-lg object-cover" /> : <Code2 />}
            </div>
            <h1 className="max-w-3xl text-4xl font-bold tracking-normal md:text-6xl">{cover?.title || 'Sam Lee 的技术笔记'}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">
              {cover?.subtitle || '记录编译器、后端、网络与项目实践，用清晰的文章沉淀长期知识。'}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {links
                .slice()
                .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
                .map((link, index) =>
                  link.type === 'external' || link.url.startsWith('http') ? (
                    <a key={`${link.label}-${link.url}`} href={link.url} target="_blank" rel="noreferrer">
                      <Button type={index === 0 ? 'primary' : 'default'} size="large">
                        {link.label}
                      </Button>
                    </a>
                  ) : (
                    <Link key={`${link.label}-${link.url}`} to={link.url}>
                      <Button type={index === 0 ? 'primary' : 'default'} size="large">
                        {link.label}
                      </Button>
                    </Link>
                  ),
                )}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-950">精选项目</h2>
            <Link className="inline-flex items-center gap-1 text-sm font-medium text-blue-600" to="/projects">
              查看全部 <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {projects.length ? (
              projects.map((project) => <ProjectCard key={project.id} project={project} />)
            ) : (
              <div className="rounded-lg border border-slate-200 bg-white p-8 text-slate-500 md:col-span-3">
                暂无已发布项目
              </div>
            )}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-950">最新文章</h2>
            <Link className="inline-flex items-center gap-1 text-sm font-medium text-blue-600" to="/articles">
              查看全部 <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid gap-4">
            {articles.length ? articles.map((article) => <ArticleCard key={article.id} article={article} />) : <div className="rounded-lg border border-slate-200 bg-white p-8 text-slate-500">暂无已发布文章</div>}
          </div>
          {tags.length ? (
            <div className="mt-8 flex flex-wrap gap-2">
              {tags.slice(0, 12).map((tag) => (
                <Link key={tag.id} to={`/articles?tagSlug=${tag.slug}`} className="rounded bg-blue-50 px-3 py-1 text-sm text-blue-700">
                  {tag.name}
                </Link>
              ))}
            </div>
          ) : null}
        </section>
      </PageState>
    </main>
  )
}
