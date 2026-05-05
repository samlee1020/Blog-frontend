import { Button, Form, Input, InputNumber, Modal, Popconfirm, Space, Table, message } from 'antd'
import { useEffect, useState } from 'react'
import { adminApi } from '../../api/admin'
import { showApiError } from '../../api/http'
import { siteApi } from '../../api/site'
import type { CategoryView, TagView } from '../../types/domain'

export function AdminCategoriesTagsPage() {
  const [categories, setCategories] = useState<CategoryView[]>([])
  const [tags, setTags] = useState<TagView[]>([])
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [tagOpen, setTagOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CategoryView | null>(null)
  const [editingTag, setEditingTag] = useState<TagView | null>(null)
  const [categoryForm] = Form.useForm<CategoryView>()
  const [tagForm] = Form.useForm<TagView>()

  async function load() {
    const [categoryList, tagList] = await Promise.all([siteApi.categories(), siteApi.tags()])
    setCategories(categoryList)
    setTags(tagList)
  }

  useEffect(() => {
    void load()
  }, [])

  async function saveCategory() {
    try {
      const values = await categoryForm.validateFields()
      if (editingCategory) await adminApi.updateCategory(editingCategory.id, values)
      else await adminApi.createCategory(values)
      message.success('分类已保存')
      setCategoryOpen(false)
      setEditingCategory(null)
      await load()
    } catch (err) {
      if (err instanceof Error) showApiError(err)
    }
  }

  async function saveTag() {
    try {
      const values = await tagForm.validateFields()
      if (editingTag) await adminApi.updateTag(editingTag.id, values)
      else await adminApi.createTag(values)
      message.success('标签已保存')
      setTagOpen(false)
      setEditingTag(null)
      await load()
    } catch (err) {
      if (err instanceof Error) showApiError(err)
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">分类</h1>
          <Button type="primary" onClick={() => { categoryForm.resetFields(); setEditingCategory(null); setCategoryOpen(true) }}>新建分类</Button>
        </div>
        <Table
          rowKey="id"
          dataSource={categories}
          pagination={false}
          columns={[
            { title: '名称', dataIndex: 'name' },
            { title: 'Slug', dataIndex: 'slug' },
            { title: '排序', dataIndex: 'sortOrder' },
            {
              title: '操作',
              render: (_, record) => (
                <Space>
                  <Button type="link" onClick={() => { setEditingCategory(record); categoryForm.setFieldsValue(record); setCategoryOpen(true) }}>编辑</Button>
                  <Popconfirm title="确认删除分类？" onConfirm={async () => { await adminApi.removeCategory(record.id); await load() }}>
                    <Button type="link" danger>删除</Button>
                  </Popconfirm>
                </Space>
              ),
            },
          ]}
        />
      </section>
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">标签</h1>
          <Button type="primary" onClick={() => { tagForm.resetFields(); setEditingTag(null); setTagOpen(true) }}>新建标签</Button>
        </div>
        <Table
          rowKey="id"
          dataSource={tags}
          pagination={false}
          columns={[
            { title: '名称', dataIndex: 'name' },
            { title: 'Slug', dataIndex: 'slug' },
            {
              title: '操作',
              render: (_, record) => (
                <Space>
                  <Button type="link" onClick={() => { setEditingTag(record); tagForm.setFieldsValue(record); setTagOpen(true) }}>编辑</Button>
                  <Popconfirm title="确认删除标签？" onConfirm={async () => { await adminApi.removeTag(record.id); await load() }}>
                    <Button type="link" danger>删除</Button>
                  </Popconfirm>
                </Space>
              ),
            },
          ]}
        />
      </section>
      <Modal title="分类" open={categoryOpen} onOk={saveCategory} onCancel={() => setCategoryOpen(false)}>
        <Form form={categoryForm} layout="vertical">
          <Form.Item name="name" label="名称" rules={[{ required: true }, { max: 64 }]}><Input /></Form.Item>
          <Form.Item name="slug" label="Slug" rules={[{ max: 100 }]}><Input /></Form.Item>
          <Form.Item name="description" label="描述" rules={[{ max: 255 }]}><Input /></Form.Item>
          <Form.Item name="sortOrder" label="排序"><InputNumber /></Form.Item>
        </Form>
      </Modal>
      <Modal title="标签" open={tagOpen} onOk={saveTag} onCancel={() => setTagOpen(false)}>
        <Form form={tagForm} layout="vertical">
          <Form.Item name="name" label="名称" rules={[{ required: true }, { max: 64 }]}><Input /></Form.Item>
          <Form.Item name="slug" label="Slug" rules={[{ max: 100 }]}><Input /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
