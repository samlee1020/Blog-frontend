import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { ProjectDetailPage } from './ProjectDetailPage'

vi.mock('../../api/projects', () => ({
  projectApi: {
    detail: vi.fn(async () => ({
      id: 1,
      title: 'Compiler WebUI',
      slug: 'compiler-webui',
      detailUrl: '/projects/compiler-webui',
      description: '短描述',
      contentMarkdown: '## 项目背景\n\n- 支持列表\n\n| A | B |\n| --- | --- |\n| 1 | 2 |\n\n$$\nE=mc^2\n$$',
      imageUrl: null,
      projectUrl: null,
      tags: ['TypeScript'],
      sortOrder: 1,
      status: 'PUBLISHED',
      createdAt: '2026-05-05T10:00:00',
      updatedAt: '2026-05-05T10:00:00',
    })),
  },
}))

describe('ProjectDetailPage', () => {
  it('renders project markdown content', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/projects/compiler-webui']}>
        <ProjectDetailPage />
      </MemoryRouter>,
    )

    expect(await screen.findByRole('heading', { name: 'Compiler WebUI' })).toBeInTheDocument()
    expect(await screen.findByRole('heading', { name: '项目背景' })).toBeInTheDocument()
    expect(screen.getByText('支持列表').closest('ul')).toBeInTheDocument()
    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(container.querySelector('.katex-display')).toBeInTheDocument()
  })
})
