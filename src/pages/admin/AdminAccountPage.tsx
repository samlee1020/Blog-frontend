import { Button, Form, Input, message } from 'antd'
import { useEffect, useState } from 'react'
import { adminApi } from '../../api/admin'
import { showApiError } from '../../api/http'
import { useAuth } from '../../contexts/AuthContext'

export function AdminAccountPage() {
  const { user, logout, updateUser } = useAuth()
  const [profileForm] = Form.useForm<{ nickname: string }>()
  const [passwordForm] = Form.useForm<{ oldPassword: string; newPassword: string }>()
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  useEffect(() => {
    profileForm.setFieldsValue({ nickname: user?.nickname || '' })
  }, [profileForm, user?.nickname])

  async function submitProfile(values: { nickname: string }) {
    const nickname = values.nickname.trim()
    if (!nickname || nickname.length > 64) return

    setSavingProfile(true)
    try {
      const nextUser = await adminApi.updateAdminProfile({ nickname })
      updateUser(nextUser)
      profileForm.setFieldsValue({ nickname: nextUser.nickname })
      message.success('昵称已更新')
    } catch (err) {
      showApiError(err)
    } finally {
      setSavingProfile(false)
    }
  }

  async function submitPassword(values: { oldPassword: string; newPassword: string }) {
    setSavingPassword(true)
    try {
      await adminApi.changePassword(values)
      message.success('密码已修改，请重新登录')
      await logout()
    } catch (err) {
      showApiError(err)
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <div className="max-w-xl space-y-8">
      <section>
        <h1 className="mb-2 text-2xl font-semibold">管理员信息</h1>
        <p className="mb-6 text-sm text-slate-500">登录用户名：{user?.username}</p>
        <Form form={profileForm} layout="vertical" onFinish={submitProfile}>
          <Form.Item
            name="nickname"
            label="管理员昵称"
            rules={[
              {
                validator: (_, value: string | undefined) => {
                  const nickname = value?.trim() || ''
                  if (!nickname) return Promise.reject(new Error('请输入管理员昵称'))
                  if (nickname.length > 64) return Promise.reject(new Error('昵称不能超过 64 个字符'))
                  return Promise.resolve()
                },
              },
            ]}
          >
            <Input maxLength={64} showCount />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={savingProfile}>
            保存昵称
          </Button>
        </Form>
      </section>

      <section className="border-t border-slate-100 pt-8">
        <h2 className="mb-6 text-xl font-semibold">修改密码</h2>
        <Form form={passwordForm} layout="vertical" onFinish={submitPassword}>
          <Form.Item name="oldPassword" label="旧密码" rules={[{ required: true, message: '请输入旧密码' }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="新密码"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, message: '新密码至少 6 位' },
              { max: 64, message: '新密码不能超过 64 位' },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={savingPassword}>
            修改密码
          </Button>
        </Form>
      </section>
    </div>
  )
}
