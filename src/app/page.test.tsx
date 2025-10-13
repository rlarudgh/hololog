import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import HomePage from './page'

describe('Home Page', () => {
  it('renders welcome message', () => {
    render(<HomePage />)
    expect(screen.getByText(/welcome to my blog/i)).toBeInTheDocument()
  })

  it('renders description text', () => {
    render(<HomePage />)
    expect(screen.getByText(/a modern blog built with next.js/i)).toBeInTheDocument()
  })

  it('has proper semantic structure', () => {
    render(<HomePage />)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })
})
