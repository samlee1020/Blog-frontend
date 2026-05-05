import { Button, Form, Input, message } from 'antd'
import { useEffect } from 'react'
import { adminApi } from '../../api/admin'
import { showApiError } from '../../api/http'
import { ImageUploadField } from '../../components/admin/ImageUploadField'
import { LinkListEditor } from '../../components/admin/LinkListEditor'
import type { CoverView } from '../../types/domain'

export function AdminCoverPage() {
  const [form] = Form.useForm<CoverView>()

  useEffect(() => {
    async function load() {
      form.setFieldsValue(await adminApi.adminCover())
    }
    void load()
  }, [form])

  async function submit(values: CoverView) {
    try {
      await adminApi.updateCover({ ...values, links: values.links || [] })
      message.success('封面已更新')
    } catch (err) {
      showApiError(err)
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">封面配置</h1>
      <Form form={form} layout="vertical" onFinish={submit}>
        <Form.Item name="title" label="标题" rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item name="subtitle" label="副标题"><Input.TextArea rows={3} /></Form.Item>
        <Form.Item name="backgroundImageUrl" label="背景图"><ImageUploadField usageType="COVER" /></Form.Item>
        <Form.Item name="avatarImageUrl" label="头像 / Logo"><ImageUploadField usageType="PROFILE" /></Form.Item>
        <Form.Item label="链接"><LinkListEditor name="links" /></Form.Item>
        <Button type="primary" htmlType="submit">保存</Button>
      </Form>
    </div>
  )
}
