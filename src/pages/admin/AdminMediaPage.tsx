import { Button, Image, Popconfirm, Select, Space, Table, message } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { mediaApi } from '../../api/media'
import { showApiError } from '../../api/http'
import { ImageUploadField } from '../../components/admin/ImageUploadField'
import type { MediaAssetView, MediaUsageType, PageResponse } from '../../types/domain'
import { toAssetUrl } from '../../utils/asset'
import { formatDateTime } from '../../utils/date'

async function copyText(text: string) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }

    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.left = '-9999px'
    textarea.style.top = '-9999px'
    document.body.appendChild(textarea)
    textarea.select()
    const copied = document.execCommand('copy')
    document.body.removeChild(textarea)
    return copied
  } catch {
    return false
  }
}

export function AdminMediaPage() {
  const [data, setData] = useState<PageResponse<MediaAssetView> | null>(null)
  const [page, setPage] = useState(1)
  const [usageType, setUsageType] = useState<MediaUsageType | undefined>()

  const load = useCallback(async () => {
    try {
      setData(await mediaApi.list({ page, size: 20, usageType }))
    } catch (err) {
      showApiError(err)
    }
  }, [page, usageType])

  useEffect(() => {
    void load()
  }, [load])

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">图片资源</h1>
      <div className="mb-4 grid gap-3 md:grid-cols-[200px_1fr]">
        <Select
          allowClear
          placeholder="用途"
          value={usageType}
          onChange={setUsageType}
          options={['ARTICLE', 'COVER', 'PROFILE', 'PROJECT', 'OTHER'].map((value) => ({ value, label: value }))}
        />
        <ImageUploadField usageType={usageType || 'OTHER'} onChange={() => void load()} />
      </div>
      <Table
        rowKey="id"
        dataSource={data?.items || []}
        pagination={{ current: page, pageSize: 20, total: data?.total || 0, onChange: setPage }}
        columns={[
          { title: '预览', render: (_, record) => <Image width={72} src={toAssetUrl(record.url)} /> },
          { title: '文件名', dataIndex: 'originalFilename' },
          { title: '用途', dataIndex: 'usageType' },
          { title: 'URL', dataIndex: 'url', ellipsis: true },
          { title: '时间', render: (_, record) => formatDateTime(record.createdAt) },
          {
            title: '操作',
            render: (_, record) => (
              <Space>
                <Button
                  onClick={async () => {
                    const copied = await copyText(toAssetUrl(record.url))
                    if (copied) {
                      message.success('URL 已复制')
                    } else {
                      message.error('复制失败，请手动选择 URL')
                    }
                  }}
                >
                  复制
                </Button>
                <Popconfirm title="确认删除图片记录？" onConfirm={async () => { await mediaApi.remove(record.id); await load() }}>
                  <Button danger>删除</Button>
                </Popconfirm>
              </Space>
            ),
          },
        ]}
      />
    </div>
  )
}
