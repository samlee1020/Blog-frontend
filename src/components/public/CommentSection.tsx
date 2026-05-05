import { Button, Form, Input, Pagination, message } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { commentApi } from '../../api/comments'
import { showApiError } from '../../api/http'
import { useAuth } from '../../contexts/AuthContext'
import type { CommentView, PageResponse } from '../../types/domain'
import { formatDateTime } from '../../utils/date'
import { PageState } from '../common/PageState'

export function CommentSection({ slug }: { slug: string }) {
  const { user } = useAuth()
  const [page, setPage] = useState(1)
  const [comments, setComments] = useState<PageResponse<CommentView> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form] = Form.useForm<{ content: string }>()

  const loadComments = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setComments(await commentApi.list(slug, { page, size: 20 }))
    } catch (err) {
      setError(err instanceof Error ? err.message : '评论加载失败')
    } finally {
      setLoading(false)
    }
  }, [page, slug])

  useEffect(() => {
    void loadComments()
  }, [loadComments])

  async function submit(values: { content: string }) {
    try {
      await commentApi.create(slug, values.content)
      form.resetFields()
      message.success('评论已发布')
      setPage(1)
      await loadComments()
    } catch (err) {
      showApiError(err)
    }
  }

  return (
    <section className="mt-12 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">评论</h2>
          <p className="mt-1 text-sm text-slate-500">登录后可以参与留言，内容会按文本安全展示。</p>
        </div>
        {!user ? (
          <Link to={`/login?redirect=${encodeURIComponent(`/articles/${slug}`)}`}>
            <Button type="primary">登录评论</Button>
          </Link>
        ) : null}
      </div>

      {user ? (
        <Form form={form} layout="vertical" onFinish={submit} className="mb-8">
          <Form.Item name="content" rules={[{ required: true, message: '请输入评论内容' }, { max: 2000 }]}>
            <Input.TextArea rows={4} placeholder="写下你的想法" />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            发布评论
          </Button>
        </Form>
      ) : null}

      <PageState
        loading={loading}
        error={error}
        empty={!comments?.items.length}
        emptyText="还没有评论"
        onRetry={loadComments}
      >
        <div className="space-y-4">
          {comments?.items.map((comment) => (
            <article key={comment.id} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
              <div className="mb-2 flex items-center justify-between gap-3">
                <strong className="text-sm text-slate-900">{comment.author.nickname || comment.author.username}</strong>
                <span className="text-xs text-slate-500">{formatDateTime(comment.createdAt)}</span>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{comment.content}</p>
            </article>
          ))}
        </div>
        {(comments?.total || 0) > 20 ? (
          <Pagination className="mt-6" current={page} pageSize={20} total={comments?.total} onChange={setPage} />
        ) : null}
      </PageState>
    </section>
  )
}
