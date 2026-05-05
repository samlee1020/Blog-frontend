import { Button, Empty, Result, Skeleton } from 'antd'

interface PageStateProps {
  loading?: boolean
  error?: string | null
  empty?: boolean
  emptyText?: string
  onRetry?: () => void
  children: React.ReactNode
}

export function PageState({ loading, error, empty, emptyText = '暂无数据', onRetry, children }: PageStateProps) {
  if (loading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    )
  }

  if (error) {
    return (
      <Result
        status="warning"
        title={error}
        extra={onRetry ? <Button onClick={onRetry}>重试</Button> : null}
      />
    )
  }

  if (empty) {
    return <Empty description={emptyText} />
  }

  return <>{children}</>
}
