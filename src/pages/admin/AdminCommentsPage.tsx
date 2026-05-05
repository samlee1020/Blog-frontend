import { Button, Popconfirm, Select, Space, Table, Tag, message } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { commentApi } from '../../api/comments'
import { showApiError } from '../../api/http'
import type { CommentStatus, CommentView, PageResponse } from '../../types/domain'
import { formatDateTime } from '../../utils/date'

export function AdminCommentsPage() {
  const [data, setData] = useState<PageResponse<CommentView> | null>(null)
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState<CommentStatus | undefined>()

  const load = useCallback(async () => {
    try {
      setData(await commentApi.adminList({ page, size: 20, status }))
    } catch (err) {
      showApiError(err)
    }
  }, [page, status])

  useEffect(() => {
    void load()
  }, [load])

  async function change(id: number, nextStatus: CommentStatus) {
    try {
      await commentApi.updateStatus(id, nextStatus)
      message.success('状态已更新')
      await load()
    } catch (err) {
      showApiError(err)
    }
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">评论管理</h1>
      <Select
        allowClear
        className="mb-4"
        placeholder="状态"
        style={{ width: 180 }}
        value={status}
        onChange={setStatus}
        options={[
          { value: 'VISIBLE', label: '可见' },
          { value: 'HIDDEN', label: '隐藏' },
          { value: 'PENDING', label: '待审核' },
        ]}
      />
      <Table
        rowKey="id"
        dataSource={data?.items || []}
        pagination={{ current: page, pageSize: 20, total: data?.total || 0, onChange: setPage }}
        columns={[
          { title: '文章', dataIndex: 'articleTitle' },
          { title: '内容', dataIndex: 'content', ellipsis: true },
          { title: '作者', render: (_, record) => record.author?.nickname || record.author?.username },
          { title: '状态', dataIndex: 'status', render: (value: CommentStatus) => <Tag>{value}</Tag> },
          { title: '时间', render: (_, record) => formatDateTime(record.createdAt) },
          {
            title: '操作',
            render: (_, record) => (
              <Space>
                <Button type="link" onClick={() => change(record.id, 'VISIBLE')}>可见</Button>
                <Button type="link" onClick={() => change(record.id, 'HIDDEN')}>隐藏</Button>
                <Popconfirm title="确认删除评论？" onConfirm={async () => { await commentApi.remove(record.id); await load() }}>
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
