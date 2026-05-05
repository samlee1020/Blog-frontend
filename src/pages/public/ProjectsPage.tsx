import { Input, Pagination } from 'antd'
import { Search } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { projectApi } from '../../api/projects'
import { PageState } from '../../components/common/PageState'
import { ProjectCard } from '../../components/public/ProjectCard'
import type { PageResponse, ProjectView } from '../../types/domain'

export function ProjectsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [data, setData] = useState<PageResponse<ProjectView> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const page = Number(searchParams.get('page') || 1)
  const keyword = searchParams.get('keyword') || ''

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setData(await projectApi.list({ page, size: 9, keyword: keyword || undefined }))
    } catch (err) {
      setError(err instanceof Error ? err.message : '项目加载失败')
    } finally {
      setLoading(false)
    }
  }, [keyword, page])

  useEffect(() => {
    void load()
  }, [load])

  function patchQuery(next: Record<string, string | number | undefined>) {
    const current = Object.fromEntries(searchParams)
    Object.entries(next).forEach(([key, value]) => {
      if (value === undefined || value === '') delete current[key]
      else current[key] = String(value)
    })
    setSearchParams(current)
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-950">项目</h1>
        <p className="mt-2 max-w-2xl text-slate-600">精选项目、实验工具和实践记录。</p>
      </div>
      <div className="mb-8 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <Input
          prefix={<Search size={16} />}
          placeholder="搜索项目标题或描述"
          defaultValue={keyword}
          onPressEnter={(event) => patchQuery({ keyword: event.currentTarget.value, page: 1 })}
        />
      </div>
      <PageState loading={loading} error={error} empty={!data?.items.length} emptyText="暂无已发布项目" onRetry={load}>
        <div className="grid gap-5 md:grid-cols-3">
          {data?.items.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        <Pagination className="mt-8" current={page} pageSize={9} total={data?.total || 0} onChange={(next) => patchQuery({ page: next })} />
      </PageState>
    </main>
  )
}
