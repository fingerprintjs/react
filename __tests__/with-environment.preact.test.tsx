import { render as preactRender } from '@testing-library/preact'
import { h } from 'preact'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import * as compat from 'preact/compat'

describe('WithEnvironment', () => {
  describe('when running within Preact', () => {
    beforeEach(() => {
      vi.doMock('react', () => compat)
      vi.doMock('react-dom', () => compat)
    })

    afterEach(() => {
      vi.resetModules()
    })
    it('should detect env as "preact"', async () => {
      const { WithEnvironment } = await import('../src/components/with-environment')
      const PrintEnv = (props: { env: { name: string } }) => h('div', null, props.env.name)

      // @ts-expect-error -- preact's render signature does not match React's @testing-library/react types
      const { container } = preactRender(h(WithEnvironment, { children: (env) => h(PrintEnv, { env }) }))

      expect(container.innerHTML).toContain('preact')
    })
  })
})
