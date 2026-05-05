import { Button, Form, Input } from 'antd'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { showApiError } from '../../api/http'
import { useAuth } from '../../contexts/AuthContext'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  async function submit(values: { username: string; password: string }) {
    try {
      const result = await login(values.username, values.password)
      const redirect = searchParams.get('redirect')
      if (redirect) {
        navigate(redirect, { replace: true })
      } else {
        navigate(result.user.role === 'ADMIN' ? '/admin' : '/', { replace: true })
      }
    } catch (err) {
      showApiError(err)
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-129px)] items-center justify-center px-4 py-12">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-950">登录</h1>
        <p className="mt-2 text-sm text-slate-500">管理员和游客共用入口。</p>
        <Form layout="vertical" className="mt-6" onFinish={submit}>
          <Form.Item name="username" label="用户名" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input autoComplete="username" />
          </Form.Item>
          <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password autoComplete="current-password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            登录
          </Button>
        </Form>
        <p className="mt-4 text-center text-sm text-slate-500">
          没有游客账号？ <Link className="text-blue-600" to="/register">注册游客</Link>
        </p>
      </section>
    </main>
  )
}
