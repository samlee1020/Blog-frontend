import { Result, Button } from 'antd'
import { Link } from 'react-router-dom'

export function NotFoundPage({ status = '404', title = '页面不存在' }: { status?: '403' | '404'; title?: string }) {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16">
      <Result status={status} title={title} extra={<Link to="/"><Button type="primary">回到首页</Button></Link>} />
    </main>
  )
}
