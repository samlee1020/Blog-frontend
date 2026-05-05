import { Button, Form, Input, message } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../../api/auth'
import { showApiError } from '../../api/http'

export function RegisterPage() {
  const navigate = useNavigate()

  async function submit(values: { username: string; nickname?: string; password: string }) {
    try {
      await authApi.registerGuest(values)
      message.success('注册成功，请登录')
      navigate('/login')
    } catch (err) {
      showApiError(err)
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-129px)] items-center justify-center px-4 py-12">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-950">游客注册</h1>
        <Form layout="vertical" className="mt-6" onFinish={submit}>
          <Form.Item name="username" label="用户名" rules={[{ required: true }, { min: 3 }, { max: 64 }]}>
            <Input />
          </Form.Item>
          <Form.Item name="nickname" label="昵称" rules={[{ max: 64 }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="密码" rules={[{ required: true }, { min: 6 }, { max: 64 }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirm"
            label="确认密码"
            dependencies={['password']}
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) return Promise.resolve()
                  return Promise.reject(new Error('两次密码不一致'))
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            注册
          </Button>
        </Form>
        <p className="mt-4 text-center text-sm text-slate-500">
          已有账号？ <Link className="text-blue-600" to="/login">去登录</Link>
        </p>
      </section>
    </main>
  )
}
