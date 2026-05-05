import { Card, Col, Row, Statistic } from 'antd'
import { useEffect, useState } from 'react'
import { articleApi } from '../../api/articles'
import { commentApi } from '../../api/comments'
import { mediaApi } from '../../api/media'
import { adminApi } from '../../api/admin'
import { projectApi } from '../../api/projects'

export function AdminDashboardPage() {
  const [stats, setStats] = useState({ articles: 0, projects: 0, comments: 0, media: 0, guests: 0 })

  useEffect(() => {
    async function load() {
      const [articles, projects, comments, media, guests] = await Promise.all([
        articleApi.adminList({ page: 1, size: 1 }),
        projectApi.adminList({ page: 1, size: 1 }),
        commentApi.adminList({ page: 1, size: 1 }),
        mediaApi.list({ page: 1, size: 1 }),
        adminApi.guests({ page: 1, size: 1 }),
      ])
      setStats({ articles: articles.total, projects: projects.total, comments: comments.total, media: media.total, guests: guests.total })
    }
    void load()
  }, [])

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">后台概览</h1>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}><Card><Statistic title="文章" value={stats.articles} /></Card></Col>
        <Col xs={24} md={6}><Card><Statistic title="项目" value={stats.projects} /></Card></Col>
        <Col xs={24} md={6}><Card><Statistic title="评论" value={stats.comments} /></Card></Col>
        <Col xs={24} md={6}><Card><Statistic title="图片" value={stats.media} /></Card></Col>
        <Col xs={24} md={6}><Card><Statistic title="游客" value={stats.guests} /></Card></Col>
      </Row>
    </div>
  )
}
