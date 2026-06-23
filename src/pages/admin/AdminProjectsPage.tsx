import MDEditor from '@uiw/react-md-editor'
import { Button, Form, Input, InputNumber, Modal, Popconfirm, Select, Space, Table, Tag, message } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { showApiError } from '../../api/http'
import { projectApi } from '../../api/projects'
import { ImageUploadField } from '../../components/admin/ImageUploadField'
import { markdownEditorRehypePlugins, markdownRemarkPlugins } from '../../components/markdown/options'
import type { PageResponse, ProjectPayload, ProjectStatus, ProjectView } from '../../types/domain'
import { formatDateTime } from '../../utils/date'

const statusText: Record<ProjectStatus, string> = {
  DRAFT: '草稿',
  PUBLISHED: '已发布',
  HIDDEN: '隐藏',
}

type ProjectFormValues = Omit<ProjectPayload, 'tags'> & { tagsText?: string }

export function AdminProjectsPage() {
  const [data, setData] = useState<PageResponse<ProjectView> | null>(null)
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState<ProjectStatus | undefined>()
  const [keyword, setKeyword] = useState('')
  const [editing, setEditing] = useState<ProjectView | null>(null)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [markdown, setMarkdown] = useState('')
  const [form] = Form.useForm<ProjectFormValues>()

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setData(await projectApi.adminList({ page, size: 10, status, keyword: keyword || undefined }))
    } catch (err) {
      showApiError(err)
    } finally {
      setLoading(false)
    }
  }, [keyword, page, status])

  useEffect(() => {
    void load()
  }, [load])

  async function startEdit(project?: ProjectView) {
    form.resetFields()
    if (project) {
      const detail = await projectApi.adminDetail(project.id)
      setEditing(detail)
      form.setFieldsValue({
        title: detail.title,
        slug: detail.slug,
        description: detail.description || '',
        contentMarkdown: detail.contentMarkdown || '',
        imageUrl: detail.imageUrl || '',
        projectUrl: detail.projectUrl || '',
        tagsText: detail.tags.join(', '),
        sortOrder: detail.sortOrder,
        status: detail.status,
      })
      setMarkdown(detail.contentMarkdown || '')
    } else {
      setEditing(null)
      setMarkdown('')
      form.setFieldsValue({ status: 'DRAFT', sortOrder: (data?.total || 0) + 1, contentMarkdown: '' })
    }
    setOpen(true)
  }

  async function save() {
    try {
      const values = await form.validateFields()
      const payload: ProjectPayload = {
        ...values,
        contentMarkdown: markdown,
        tags: (values.tagsText || '')
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
      }
      delete (payload as ProjectPayload & { tagsText?: string }).tagsText

      if (editing) await projectApi.update(editing.id, payload)
      else await projectApi.create(payload)

      message.success('项目已保存')
      setOpen(false)
      await load()
    } catch (err) {
      if (err instanceof Error) showApiError(err)
    }
  }

  async function remove(id: number) {
    try {
      await projectApi.remove(id)
      message.success('项目已删除')
      await load()
    } catch (err) {
      showApiError(err)
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">项目管理</h1>
        <Button type="primary" onClick={() => void startEdit()}>
          新建项目
        </Button>
      </div>
      <Space className="mb-4" wrap>
        <Input.Search
          allowClear
          placeholder="搜索标题或描述"
          onSearch={(value) => {
            setKeyword(value)
            setPage(1)
          }}
          style={{ width: 260 }}
        />
        <Select
          allowClear
          placeholder="状态"
          style={{ width: 160 }}
          value={status}
          onChange={(value) => {
            setStatus(value)
            setPage(1)
          }}
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
          { title: 'Slug', dataIndex: 'slug' },
          { title: '状态', dataIndex: 'status', render: (value: ProjectStatus) => <Tag>{statusText[value]}</Tag> },
          { title: '链接', dataIndex: 'projectUrl', ellipsis: true },
          { title: '标签', render: (_, record) => record.tags.join(', ') || '-' },
          { title: '排序', dataIndex: 'sortOrder' },
          { title: '更新时间', render: (_, record) => formatDateTime(record.updatedAt) },
          {
            title: '操作',
            render: (_, record) => (
              <Space>
                <Button type="link" onClick={() => void startEdit(record)}>
                  编辑
                </Button>
                {record.status === 'PUBLISHED' ? (
                  <a href={record.detailUrl || `/projects/${record.slug}`} target="_blank" rel="noreferrer">
                    查看
                  </a>
                ) : null}
                <Popconfirm title="确认删除项目？" onConfirm={() => remove(record.id)}>
                  <Button type="link" danger>
                    删除
                  </Button>
                </Popconfirm>
              </Space>
            ),
          },
        ]}
      />
      <Modal title={editing ? '编辑项目' : '新建项目'} open={open} onOk={save} onCancel={() => setOpen(false)} width={960}>
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="标题" rules={[{ required: true }, { max: 200 }]}>
            <Input />
          </Form.Item>
          <Form.Item name="slug" label="Slug" rules={[{ max: 200 }]}>
            <Input placeholder="为空时由后端生成" />
          </Form.Item>
          <Form.Item name="description" label="描述" rules={[{ max: 1000 }]}>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="contentMarkdown" label="详情正文 Markdown">
            <div data-color-mode="light">
              <MDEditor
                value={markdown}
                onChange={(value) => {
                  setMarkdown(value || '')
                  form.setFieldValue('contentMarkdown', value || '')
                }}
                height={420}
                previewOptions={{
                  className: 'markdown-body',
                  remarkPlugins: markdownRemarkPlugins,
                  rehypePlugins: markdownEditorRehypePlugins,
                }}
              />
            </div>
          </Form.Item>
          <Form.Item name="imageUrl" label="展示图片">
            <ImageUploadField usageType="PROJECT" />
          </Form.Item>
          <Form.Item name="projectUrl" label="项目链接" rules={[{ max: 500 }]}>
            <Input />
          </Form.Item>
          <Form.Item name="tagsText" label="标签" tooltip="用英文逗号分隔，最多 30 个">
            <Input />
          </Form.Item>
          <Space wrap>
            <Form.Item name="sortOrder" label="排序">
              <InputNumber />
            </Form.Item>
            <Form.Item name="status" label="状态" rules={[{ required: true }]}>
              <Select
                style={{ width: 160 }}
                options={Object.entries(statusText).map(([value, label]) => ({ value, label }))}
              />
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </div>
  )
}
