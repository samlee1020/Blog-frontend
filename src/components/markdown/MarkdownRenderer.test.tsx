import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MarkdownRenderer } from './MarkdownRenderer'

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
})
