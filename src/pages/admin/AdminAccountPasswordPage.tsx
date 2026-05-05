import { Button, Form, Input, message } from 'antd'
import { adminApi } from '../../api/admin'
import { showApiError } from '../../api/http'
import { useAuth } from '../../contexts/AuthContext'

export function AdminAccountPasswordPage() {
  const { logout } = useAuth()

  async function submit(values: { oldPassword: string; newPassword: string }) {
    try {
      await adminApi.changePassword(values)
      message.success('密码已修改，请重新登录')
      await logout()
    } catch (err) {
      showApiError(err)
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="mb-6 text-2xl font-semibold">修改密码</h1>
      <Form layout="vertical" onFinish={submit}>
        <Form.Item name="oldPassword" label="旧密码" rules={[{ required: true }]}><Input.Password /></Form.Item>
        <Form.Item name="newPassword" label="新密码" rules={[{ required: true }, { min: 6 }, { max: 64 }]}><Input.Password /></Form.Item>
        <Button type="primary" htmlType="submit">修改</Button>
      </Form>
    </div>
  )
}
