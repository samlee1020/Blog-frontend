import MDEditor from '@uiw/react-md-editor'
import { Button, Form, Input, message } from 'antd'
import { useEffect, useState } from 'react'
import { adminApi } from '../../api/admin'
import { showApiError } from '../../api/http'
import { ImageUploadField } from '../../components/admin/ImageUploadField'
import { LinkListEditor } from '../../components/admin/LinkListEditor'
import { markdownEditorRehypePlugins, markdownRemarkPlugins } from '../../components/markdown/options'
import type { ProfileView } from '../../types/domain'

export function AdminProfilePage() {
  const [form] = Form.useForm<ProfileView>()
  const [markdown, setMarkdown] = useState('')

  useEffect(() => {
    async function load() {
      const data = await adminApi.adminProfile()
      form.setFieldsValue(data)
      setMarkdown(data.contentMarkdown || '')
    }
    void load()
  }, [form])

  async function submit(values: ProfileView) {
    try {
      await adminApi.updateProfile({ ...values, socialLinks: values.socialLinks || [], contentMarkdown: markdown })
      message.success('信息页已更新')
    } catch (err) {
      showApiError(err)
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">信息页配置</h1>
      <Form form={form} layout="vertical" onFinish={submit}>
        <Form.Item name="displayName" label="展示名称" rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item name="bio" label="简介"><Input.TextArea rows={3} /></Form.Item>
        <Form.Item name="avatarImageUrl" label="头像"><ImageUploadField usageType="PROFILE" /></Form.Item>
        <Form.Item name="email" label="邮箱"><Input /></Form.Item>
        <Form.Item name="location" label="位置"><Input /></Form.Item>
        <Form.Item label="社交链接"><LinkListEditor name="socialLinks" /></Form.Item>
        <Form.Item name="contentMarkdown" label="内容">
          <div data-color-mode="light">
            <MDEditor
              value={markdown}
              onChange={(value) => setMarkdown(value || '')}
              height={360}
              previewOptions={{
                className: 'markdown-body',
                remarkPlugins: markdownRemarkPlugins,
                rehypePlugins: markdownEditorRehypePlugins,
              }}
            />
          </div>
        </Form.Item>
        <Button type="primary" htmlType="submit">保存</Button>
      </Form>
    </div>
  )
}
