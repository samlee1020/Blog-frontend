import { Button, Input, Upload, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import type { MediaUsageType } from '../../types/domain'
import { mediaApi } from '../../api/media'
import { showApiError } from '../../api/http'

interface ImageUploadFieldProps {
  value?: string
  usageType: MediaUsageType
  onChange?: (value: string) => void
}

export function ImageUploadField({ value, usageType, onChange }: ImageUploadFieldProps) {
  async function upload(option: Parameters<NonNullable<React.ComponentProps<typeof Upload>['customRequest']>>[0]) {
    try {
      const file = option.file as File
      const result = await mediaApi.upload(file, usageType)
      onChange?.(result.url)
      option.onSuccess?.(result)
      message.success('图片上传成功')
    } catch (error) {
      option.onError?.(error as Error)
      showApiError(error)
    }
  }

  return (
    <Input.Group compact>
      <Input value={value} onChange={(event) => onChange?.(event.target.value)} style={{ width: 'calc(100% - 112px)' }} />
      <Upload customRequest={upload} showUploadList={false} accept="image/*">
        <Button icon={<UploadOutlined />}>上传</Button>
      </Upload>
    </Input.Group>
  )
}
