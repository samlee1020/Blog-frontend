import { Button, Input, Select, Table, message } from 'antd'
import { useEffect, useState } from 'react'
import { adminApi } from '../../api/admin'
import { showApiError } from '../../api/http'
import type { SystemConfigView } from '../../types/domain'

export function AdminSettingsPage() {
  const [configs, setConfigs] = useState<SystemConfigView[]>([])

  async function load() {
    setConfigs(await adminApi.systemConfigs())
  }

  useEffect(() => {
    void load()
  }, [])

  async function save(record: SystemConfigView) {
    try {
      await adminApi.updateSystemConfig(record.configKey, {
        configValue: record.configValue,
        valueType: record.valueType,
        description: record.description,
      })
      message.success('配置已保存')
    } catch (err) {
      showApiError(err)
    }
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">系统配置</h1>
      <Table
        rowKey="configKey"
        dataSource={configs}
        pagination={false}
        columns={[
          { title: 'Key', dataIndex: 'configKey' },
          {
            title: '值',
            render: (_, record, index) => (
              <Input value={record.configValue || ''} onChange={(event) => {
                const next = [...configs]
                next[index] = { ...record, configValue: event.target.value }
                setConfigs(next)
              }} />
            ),
          },
          {
            title: '类型',
            render: (_, record, index) => (
              <Select
                value={record.valueType}
                style={{ width: 120 }}
                onChange={(value) => {
                  const next = [...configs]
                  next[index] = { ...record, valueType: value }
                  setConfigs(next)
                }}
                options={['STRING', 'NUMBER', 'BOOLEAN', 'JSON'].map((value) => ({ value, label: value }))}
              />
            ),
          },
          { title: '说明', dataIndex: 'description' },
          { title: '操作', render: (_, record) => <Button type="primary" onClick={() => save(record)}>保存</Button> },
        ]}
      />
    </div>
  )
}
