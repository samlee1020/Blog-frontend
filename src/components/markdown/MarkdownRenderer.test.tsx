import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { extractMarkdownHeadings, MarkdownRenderer } from './MarkdownRenderer'
import { MarkdownWithOutline } from './MarkdownWithOutline'

describe('MarkdownRenderer', () => {
  it('renders lists and GFM tables', () => {
    render(
      <MarkdownRenderer
        content={`- first\n- second\n\n1. one\n2. two\n\n| Name | Value |\n| --- | --- |\n| A | 1 |`}
      />,
    )

    expect(screen.getByText('first').closest('ul')).toBeInTheDocument()
    expect(screen.getByText('one').closest('ol')).toBeInTheDocument()
    const table = screen.getByRole('table')
    expect(within(table).getByText('Name')).toBeInTheDocument()
    expect(within(table).getByText('A')).toBeInTheDocument()
  })

  it('renders LaTeX math with KaTeX', () => {
    const { container } = render(<MarkdownRenderer content={'Inline $a^2+b^2=c^2$ and block:\n\n$$\nE=mc^2\n$$'} />)
    expect(container.querySelector('.katex')).toBeInTheDocument()
    expect(container.querySelector('.katex-display')).toBeInTheDocument()
  })

  it('adds heading anchors and renders an outline', () => {
    render(<MarkdownWithOutline content={'# Overview\n\n## Details\n\n### Details'} />)

    expect(screen.getByRole('heading', { name: 'Overview' })).toHaveAttribute('id', 'overview')
    expect(screen.getByRole('heading', { name: 'Details', level: 2 })).toHaveAttribute('id', 'details')
    expect(screen.getByRole('heading', { name: 'Details', level: 3 })).toHaveAttribute('id', 'details-2')
    expect(screen.getByRole('navigation', { name: '文章目录' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Overview' })).toHaveAttribute('href', '#overview')
    expect(screen.getAllByRole('link', { name: 'Details' })[1]).toHaveAttribute('href', '#details-2')
  })

  it('extracts headings while ignoring fenced code blocks', () => {
    expect(extractMarkdownHeadings('```ts\n# nope\n```\n\n## Real')).toEqual([
      { id: 'real', level: 2, text: 'Real' },
    ])
  })
})
