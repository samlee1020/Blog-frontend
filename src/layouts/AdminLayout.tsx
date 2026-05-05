import {
  AppstoreOutlined,
  CommentOutlined,
  FileTextOutlined,
  HomeOutlined,
  PictureOutlined,
  ProjectOutlined,
  SettingOutlined,
  TagsOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Button, Layout, Menu, theme } from 'antd'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const { Header, Sider, Content } = Layout

const menuItems = [
  { key: '/admin', icon: <AppstoreOutlined />, label: <Link to="/admin">概览</Link> },
  { key: '/admin/articles', icon: <FileTextOutlined />, label: <Link to="/admin/articles">文章</Link> },
  { key: '/admin/projects', icon: <ProjectOutlined />, label: <Link to="/admin/projects">项目</Link> },
  { key: '/admin/categories-tags', icon: <TagsOutlined />, label: <Link to="/admin/categories-tags">分类标签</Link> },
  { key: '/admin/comments', icon: <CommentOutlined />, label: <Link to="/admin/comments">评论</Link> },
  { key: '/admin/guests', icon: <TeamOutlined />, label: <Link to="/admin/guests">游客</Link> },
  { key: '/admin/cover', icon: <HomeOutlined />, label: <Link to="/admin/cover">封面</Link> },
  { key: '/admin/profile', icon: <UserOutlined />, label: <Link to="/admin/profile">信息页</Link> },
  { key: '/admin/media', icon: <PictureOutlined />, label: <Link to="/admin/media">图片</Link> },
  { key: '/admin/settings', icon: <SettingOutlined />, label: <Link to="/admin/settings">系统</Link> },
]

export function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  const selected = menuItems
    .map((item) => item.key)
    .filter((key) => location.pathname === key || (key !== '/admin' && location.pathname.startsWith(key)))
    .sort((a, b) => b.length - a.length)[0]

  return (
    <Layout className="min-h-screen">
      <Sider breakpoint="lg" collapsedWidth="0">
        <div className="flex h-16 items-center px-6 text-lg font-bold text-white">Blog Admin</div>
        <Menu theme="dark" mode="inline" selectedKeys={[selected || '/admin']} items={menuItems} />
      </Sider>
      <Layout>
        <Header style={{ background: colorBgContainer }} className="flex items-center justify-between border-b border-slate-100 px-6">
          <div className="text-sm text-slate-500">当前用户：{user?.nickname}</div>
          <div className="flex gap-2">
            <Button onClick={() => navigate('/')}>返回前台</Button>
            <Button onClick={() => navigate('/admin/account/password')}>修改密码</Button>
            <Button danger onClick={() => void logout()}>
              退出
            </Button>
          </div>
        </Header>
        <Content className="m-6">
          <div style={{ background: colorBgContainer, borderRadius: borderRadiusLG }} className="min-h-[calc(100vh-112px)] p-6">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}
