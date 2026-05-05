import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { ProjectCard } from './ProjectCard'
import type { ProjectView } from '../../types/domain'

const project: ProjectView = {
  id: 1,
  title: 'Compiler WebUI',
  slug: 'compiler-webui',
  detailUrl: '/projects/compiler-webui',
  description: '在线编译器界面',
  contentMarkdown: '## 项目背景',
  imageUrl: null,
  projectUrl: 'https://github.com/example/compiler-webui',
  tags: ['TypeScript'],
  sortOrder: 1,
  status: 'PUBLISHED',
}

describe('ProjectCard', () => {
  it('uses the internal detail URL as the card target even when projectUrl exists', () => {
    render(
      <MemoryRouter>
        <ProjectCard project={project} />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: /Compiler WebUI/ })).toHaveAttribute('href', '/projects/compiler-webui')
  })
})
