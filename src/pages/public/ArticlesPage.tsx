import { Button, Input, Pagination, Select } from 'antd'
import { Search } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { articleApi } from '../../api/articles'
import { siteApi } from '../../api/site'
import { PageState } from '../../components/common/PageState'
import { ArticleCard } from '../../components/public/ArticleCard'
import type { ArticleSummaryView, CategoryView, PageResponse, TagView } from '../../types/domain'

export function ArticlesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [data, setData] = useState<PageResponse<ArticleSummaryView> | null>(null)
  const [categories, setCategories] = useState<CategoryView[]>([])
  const [tags, setTags] = useState<TagView[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const page = Number(searchParams.get('page') || 1)
  const keyword = searchParams.get('keyword') || ''
  const categorySlug = searchParams.get('categorySlug') || undefined
  const tagSlug = searchParams.get('tagSlug') || undefined

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [list, categoryList, tagList] = await Promise.all([
        articleApi.list({ page, size: 9, keyword: keyword || undefined, categorySlug, tagSlug }),
        siteApi.categories(),
        siteApi.tags(),
      ])
      setData(list)
      setCategories(categoryList)
      setTags(tagList)
    } catch (err) {
      setError(err instanceof Error ? err.message : '文章加载失败')
    } finally {
      setLoading(false)
    }
  }, [categorySlug, keyword, page, tagSlug])

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
        <h1 className="text-3xl font-bold text-slate-950">文章</h1>
        <p className="mt-2 text-slate-600">按分类、标签和关键词检索技术笔记。</p>
      </div>
      <div className="mb-8 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_180px_180px_auto]">
        <Input
          prefix={<Search size={16} />}
          placeholder="搜索标题或摘要"
          defaultValue={keyword}
          onPressEnter={(event) => patchQuery({ keyword: event.currentTarget.value, page: 1 })}
        />
        <Select
          allowClear
          placeholder="分类"
          value={categorySlug}
          onChange={(value) => patchQuery({ categorySlug: value, page: 1 })}
          options={categories.map((item) => ({ label: item.name, value: item.slug }))}
        />
        <Select
          allowClear
          placeholder="标签"
          value={tagSlug}
          onChange={(value) => patchQuery({ tagSlug: value, page: 1 })}
          options={tags.map((item) => ({ label: item.name, value: item.slug }))}
        />
        <Button onClick={() => setSearchParams({})}>清除</Button>
      </div>
      <PageState loading={loading} error={error} empty={!data?.items.length} onRetry={load} emptyText="没有找到文章">
        <div className="grid gap-5">{data?.items.map((article) => <ArticleCard key={article.id} article={article} />)}</div>
        <Pagination className="mt-8" current={page} pageSize={9} total={data?.total || 0} onChange={(next) => patchQuery({ page: next })} />
      </PageState>
    </main>
  )
}
