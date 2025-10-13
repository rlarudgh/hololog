import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Button } from './button.ui'

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies custom className', () => {
    render(<Button className="custom-class">Button</Button>)
    expect(screen.getByRole('button')).toHaveClass('custom-class')
  })

  it('applies variant styles correctly', () => {
    render(<Button variant="secondary">Secondary Button</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-gray-200')
  })

  it('applies primary variant by default', () => {
    render(<Button>Primary Button</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-blue-600')
  })
})