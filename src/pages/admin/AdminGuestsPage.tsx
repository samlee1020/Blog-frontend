import { Button, Form, Input, Modal, Popconfirm, Space, Table, Tag, message } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { adminApi } from '../../api/admin'
import { showApiError } from '../../api/http'
import type { GuestView, PageResponse } from '../../types/domain'
import { formatDateTime } from '../../utils/date'

export function AdminGuestsPage() {
  const [data, setData] = useState<PageResponse<GuestView> | null>(null)
  const [page, setPage] = useState(1)
  const [guest, setGuest] = useState<GuestView | null>(null)
  const [form] = Form.useForm<{ newPassword: string }>()

  const load = useCallback(async () => {
    try {
      setData(await adminApi.guests({ page, size: 20 }))
    } catch (err) {
      showApiError(err)
    }
  }, [page])

  useEffect(() => {
    void load()
  }, [load])

  async function resetPassword() {
    if (!guest) return
    const values = await form.validateFields()
    await adminApi.resetGuestPassword(guest.id, values.newPassword)
    message.success('密码已重置')
    setGuest(null)
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">游客管理</h1>
      <Table
        rowKey="id"
        dataSource={data?.items || []}
        pagination={{ current: page, pageSize: 20, total: data?.total || 0, onChange: setPage }}
        columns={[
          { title: '用户名', dataIndex: 'username' },
          { title: '昵称', dataIndex: 'nickname' },
          { title: '状态', dataIndex: 'status', render: (value) => <Tag color={value === 'ACTIVE' ? 'green' : 'red'}>{value}</Tag> },
          { title: '最近登录', render: (_, record) => formatDateTime(record.lastLoginAt) },
          {
            title: '操作',
            render: (_, record) => (
              <Space>
                <Button type="link" onClick={() => { form.resetFields(); setGuest(record) }}>重置密码</Button>
                <Popconfirm title="确认修改游客状态？" onConfirm={async () => { await adminApi.updateGuestStatus(record.id, record.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE'); await load() }}>
                  <Button type="link">{record.status === 'ACTIVE' ? '禁用' : '启用'}</Button>
                </Popconfirm>
              </Space>
            ),
          },
        ]}
      />
      <Modal title={`重置 ${guest?.username || ''} 的密码`} open={Boolean(guest)} onOk={resetPassword} onCancel={() => setGuest(null)}>
        <Form form={form} layout="vertical">
          <Form.Item name="newPassword" label="新密码" rules={[{ required: true }, { min: 6 }, { max: 64 }]}>
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
