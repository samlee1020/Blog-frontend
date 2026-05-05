import MDEditor from '@uiw/react-md-editor'
import { Button, Form, Input, Select, Space, message } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { articleApi, type ArticlePayload } from '../../api/articles'
import { showApiError } from '../../api/http'
import { siteApi } from '../../api/site'
import { ImageUploadField } from '../../components/admin/ImageUploadField'
import { markdownRehypePlugins, markdownRemarkPlugins } from '../../components/markdown/options'
import type { ArticleStatus, CategoryView, TagView } from '../../types/domain'

export function AdminArticleEditorPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const [form] = Form.useForm<ArticlePayload>()
  const [categories, setCategories] = useState<CategoryView[]>([])
  const [tags, setTags] = useState<TagView[]>([])
  const [markdown, setMarkdown] = useState('')

  useEffect(() => {
    async function load() {
      const [categoryList, tagList] = await Promise.all([siteApi.categories(), siteApi.tags()])
      setCategories(categoryList)
      setTags(tagList)
      if (id) {
        const detail = await articleApi.adminDetail(id)
        form.setFieldsValue({
          title: detail.title,
          slug: detail.slug,
          summary: detail.summary || '',
          coverImageUrl: detail.coverImageUrl || '',
          contentMarkdown: detail.contentMarkdown,
          categoryId: detail.category?.id,
          tagIds: detail.tags?.map((tag) => tag.id),
          status: detail.status || 'DRAFT',
        })
        setMarkdown(detail.contentMarkdown)
      } else {
        form.setFieldsValue({ status: 'DRAFT', contentMarkdown: '' })
      }
    }
    void load()
  }, [form, id])

  async function submit(values: ArticlePayload) {
    try {
      const payload = { ...values, contentMarkdown: markdown }
      if (isEdit && id) await articleApi.update(id, payload)
      else await articleApi.create(payload)
      message.success('文章已保存')
      navigate('/admin/articles')
    } catch (err) {
      showApiError(err)
    }
  }

  function insertImage(url?: string) {
    if (!url) return
    const next = `${markdown || ''}\n\n![image](${url})\n`
    setMarkdown(next)
    form.setFieldValue('contentMarkdown', next)
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">{isEdit ? '编辑文章' : '新建文章'}</h1>
      <Form form={form} layout="vertical" onFinish={submit}>
        <Form.Item name="title" label="标题" rules={[{ required: true }, { max: 200 }]}><Input /></Form.Item>
        <Form.Item name="slug" label="Slug" rules={[{ max: 200 }]}><Input placeholder="为空时由后端生成" /></Form.Item>
        <Form.Item name="summary" label="摘要" rules={[{ max: 500 }]}><Input.TextArea rows={3} /></Form.Item>
        <Form.Item name="coverImageUrl" label="封面图"><ImageUploadField usageType="ARTICLE" /></Form.Item>
        <Space className="grid grid-cols-1 md:grid-cols-3">
          <Form.Item name="categoryId" label="分类"><Select allowClear style={{ width: 220 }} options={categories.map((item) => ({ label: item.name, value: item.id }))} /></Form.Item>
          <Form.Item name="tagIds" label="标签"><Select mode="multiple" style={{ width: 320 }} options={tags.map((item) => ({ label: item.name, value: item.id }))} /></Form.Item>
          <Form.Item name="status" label="状态" rules={[{ required: true }]}><Select style={{ width: 160 }} options={[{ value: 'DRAFT', label: '草稿' }, { value: 'PUBLISHED', label: '发布' }, { value: 'HIDDEN', label: '隐藏' }] satisfies { value: ArticleStatus; label: string }[]} /></Form.Item>
        </Space>
        <Form.Item name="contentMarkdown" label="正文" rules={[{ required: true, message: '请输入正文' }]}>
          <div data-color-mode="light">
            <MDEditor
              value={markdown}
              onChange={(value) => {
                setMarkdown(value || '')
                form.setFieldValue('contentMarkdown', value || '')
              }}
              height={480}
              previewOptions={{
                className: 'markdown-body',
                remarkPlugins: markdownRemarkPlugins,
                rehypePlugins: markdownRehypePlugins,
              }}
            />
          </div>
        </Form.Item>
        <Form.Item label="文章图片">
          <ImageUploadField usageType="ARTICLE" onChange={insertImage} />
        </Form.Item>
        <Button type="primary" htmlType="submit">保存</Button>
      </Form>
    </div>
  )
}
