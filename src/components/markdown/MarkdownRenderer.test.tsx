import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

  it('adds heading anchors and renders a collapsible outline', async () => {
    const user = userEvent.setup()
    render(<MarkdownWithOutline content={'# Overview\n\n## Details\n\n### Details'} />)

    expect(screen.getByRole('heading', { name: 'Overview' })).toHaveAttribute('id', 'overview')
    expect(screen.getByRole('heading', { name: 'Details', level: 2 })).toHaveAttribute('id', 'details')
    expect(screen.getByRole('heading', { name: 'Details', level: 3 })).toHaveAttribute('id', 'details-2')

    const outline = screen.getByRole('navigation', { name: '文章目录' })
    expect(within(outline).getByRole('link', { name: 'Overview' })).toHaveAttribute('href', '#overview')
    expect(within(outline).queryByRole('link', { name: 'Details' })).not.toBeInTheDocument()

    await user.click(within(outline).getByRole('button', { name: '展开 Overview 的子目录' }))
    expect(within(outline).getByRole('link', { name: 'Details' })).toHaveAttribute('href', '#details')

    await user.click(within(outline).getByRole('button', { name: '展开 Details 的子目录' }))
    expect(within(outline).getAllByRole('link', { name: 'Details' })[1]).toHaveAttribute('href', '#details-2')
  })

  it('uses the shallowest article heading level as the visible outline root', () => {
    render(<MarkdownWithOutline content={'## Top\n\n### Child\n\n## Next'} />)

    const outline = screen.getByRole('navigation', { name: '文章目录' })
    expect(within(outline).getByRole('link', { name: 'Top' })).toHaveAttribute('href', '#top')
    expect(within(outline).getByRole('link', { name: 'Next' })).toHaveAttribute('href', '#next')
    expect(within(outline).queryByRole('link', { name: 'Child' })).not.toBeInTheDocument()
  })

  it('resets expanded outline state when markdown content changes', async () => {
    const user = userEvent.setup()
    const { rerender } = render(<MarkdownWithOutline content={'# First\n\n## Child'} />)

    await user.click(screen.getByRole('button', { name: '展开 First 的子目录' }))
    expect(screen.getByRole('link', { name: 'Child' })).toBeInTheDocument()

    rerender(<MarkdownWithOutline content={'# Second\n\n## Next'} />)

    const outline = screen.getByRole('navigation', { name: '文章目录' })
    expect(within(outline).getByRole('link', { name: 'Second' })).toHaveAttribute('href', '#second')
    expect(within(outline).queryByRole('link', { name: 'Next' })).not.toBeInTheDocument()
  })

  it('extracts headings while ignoring fenced code blocks', () => {
    expect(extractMarkdownHeadings('```ts\n# nope\n```\n\n## Real')).toEqual([
      { id: 'real', level: 2, text: 'Real' },
    ])
  })
})
