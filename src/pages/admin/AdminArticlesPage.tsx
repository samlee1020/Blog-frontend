import { Button, Popconfirm, Select, Space, Table, Tag, message } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { articleApi } from '../../api/articles'
import { showApiError } from '../../api/http'
import type { ArticleStatus, ArticleSummaryView, PageResponse } from '../../types/domain'
import { formatDateTime } from '../../utils/date'

const statusText: Record<ArticleStatus, string> = { DRAFT: '草稿', PUBLISHED: '已发布', HIDDEN: '隐藏' }

export function AdminArticlesPage() {
  const [data, setData] = useState<PageResponse<ArticleSummaryView> | null>(null)
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState<ArticleStatus | undefined>()
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setData(await articleApi.adminList({ page, size: 10, status }))
    } catch (err) {
      showApiError(err)
    } finally {
      setLoading(false)
    }
  }, [page, status])

  useEffect(() => {
    void load()
  }, [load])

  async function remove(id: number) {
    try {
      await articleApi.remove(id)
      message.success('已删除')
      await load()
    } catch (err) {
      showApiError(err)
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">文章管理</h1>
        <Link to="/admin/articles/new"><Button type="primary">新建文章</Button></Link>
      </div>
      <Space className="mb-4">
        <Select
          allowClear
          placeholder="状态"
          style={{ width: 160 }}
          value={status}
          onChange={setStatus}
          options={Object.entries(statusText).map(([value, label]) => ({ value, label }))}
        />
      </Space>
      <Table
        rowKey="id"
        loading={loading}
        dataSource={data?.items || []}
        pagination={{ current: page, pageSize: 10, total: data?.total || 0, onChange: setPage }}
        columns={[
          { title: '标题', dataIndex: 'title' },
          { title: '状态', dataIndex: 'status', render: (value: ArticleStatus) => <Tag>{statusText[value]}</Tag> },
          { title: '分类', render: (_, record) => record.category?.name || '-' },
          { title: '发布时间', render: (_, record) => formatDateTime(record.publishedAt) },
          { title: '更新时间', render: (_, record) => formatDateTime(record.updatedAt) },
          {
            title: '操作',
            render: (_, record) => (
              <Space>
                <Link to={`/admin/articles/${record.id}/edit`}>编辑</Link>
                {record.status === 'PUBLISHED' ? <Link to={`/articles/${record.slug}`}>查看</Link> : null}
                <Popconfirm title="确认删除文章？" onConfirm={() => remove(record.id)}>
                  <Button type="link" danger>删除</Button>
                </Popconfirm>
              </Space>
            ),
          },
        ]}
      />
    </div>
  )
}
