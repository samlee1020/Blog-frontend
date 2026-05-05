import { Button, Form, Input, InputNumber, Select, Space } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'

export function LinkListEditor({ name }: { name: string }) {
  return (
    <Form.List name={name}>
      {(fields, { add, remove }) => (
        <div className="space-y-3">
          {fields.map((field) => (
            <Space key={field.key} align="baseline" wrap>
              <Form.Item {...field} name={[field.name, 'label']} rules={[{ required: true, message: '请输入名称' }]}>
                <Input placeholder="名称" />
              </Form.Item>
              <Form.Item {...field} name={[field.name, 'url']} rules={[{ required: true, message: '请输入链接' }]}>
                <Input placeholder="链接" />
              </Form.Item>
              <Form.Item {...field} name={[field.name, 'type']} initialValue="internal">
                <Select
                  style={{ width: 112 }}
                  options={[
                    { label: '站内', value: 'internal' },
                    { label: '外链', value: 'external' },
                  ]}
                />
              </Form.Item>
              <Form.Item {...field} name={[field.name, 'sortOrder']} initialValue={field.name + 1}>
                <InputNumber placeholder="排序" />
              </Form.Item>
              <Button icon={<MinusCircleOutlined />} onClick={() => remove(field.name)} />
            </Space>
          ))}
          <Button type="dashed" icon={<PlusOutlined />} onClick={() => add({ type: 'internal', sortOrder: fields.length + 1 })}>
            添加链接
          </Button>
        </div>
      )}
    </Form.List>
  )
}
