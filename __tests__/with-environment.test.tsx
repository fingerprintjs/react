import { render, screen } from '@testing-library/react'
import { WithEnvironment } from '../src/components/with-environment'
import { Link, MemoryRouter, Route, Routes } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'

describe('WithEnvironment', () => {
  it('enhances provided element with `env` prop', () => {
    const renderChild = vi.fn(() => <div>foo</div>)

    render(<WithEnvironment>{renderChild}</WithEnvironment>)

    expect(renderChild).toHaveBeenCalledWith(expect.objectContaining({ name: 'react' }))
  })

  it('keeps the original props of the element', () => {
    const Echo = ({ message }: { message: string }) => <span>{message}</span>

    const { container } = render(<WithEnvironment>{() => <Echo message='hello' />}</WithEnvironment>)

    expect(container.innerHTML).toContain('hello')
  })

  it('should not break navigation', async () => {
    const user = userEvent.setup()
    const Home = () => (
      <Link to='/test' id='test'>
        Go to test
      </Link>
    )

    const App = () => {
      return (
        <MemoryRouter>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/test' element={<div>Test page</div>} />
          </Routes>
        </MemoryRouter>
      )
    }

    render(<WithEnvironment>{() => <App />}</WithEnvironment>)

    await user.click(screen.getByRole('link', { name: 'Go to test' }))

    expect(screen.getByText('Test page')).toBeDefined()
  })
})
