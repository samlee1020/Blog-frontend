import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { ProjectView } from '../../types/domain'
import { toAssetUrl } from '../../utils/asset'

export function ProjectCard({ project }: { project: ProjectView }) {
  const detailUrl = project.detailUrl || `/projects/${project.slug}`

  const content = (
    <article className="grid h-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
      <div className="aspect-[16/9] bg-slate-100">
        {project.imageUrl ? (
          <img src={toAssetUrl(project.imageUrl)} alt={project.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center bg-slate-950 px-4 text-center font-mono text-sm text-green-300">
            {'>'} open {project.slug || 'project'}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-base font-semibold text-slate-950">{project.title}</h3>
          <ArrowRight size={16} className="mt-1 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-blue-600" />
        </div>
        <p className="text-sm leading-6 text-slate-600">{project.description || '暂无项目简介'}</p>
        <div className="mt-auto flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span key={tag} className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  )

  return (
    <Link to={detailUrl} className="group block h-full text-slate-900">
      {content}
    </Link>
  )
}
