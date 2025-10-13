import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Container } from './container'

describe('Container Component', () => {
  it('renders children correctly', () => {
    render(
      <Container>
        <div>Test content</div>
      </Container>
    )
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('applies default container styles', () => {
    render(
      <Container>
        <div>Content</div>
      </Container>
    )
    const container = screen.getByText('Content').parentElement
    expect(container).toHaveClass('max-w-4xl', 'mx-auto', 'px-4')
  })

  it('applies custom className', () => {
    render(
      <Container className="custom-container">
        <div>Content</div>
      </Container>
    )
    const container = screen.getByText('Content').parentElement
    expect(container).toHaveClass('custom-container')
    expect(container).toHaveClass('max-w-4xl') // Still has default classes
  })
})
