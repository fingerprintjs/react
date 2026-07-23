import { detectEnvironment } from '../src/detect-env'
import { Env } from '../src/env.types'
import { afterEach, describe, expect, it, vi } from 'vitest'

describe('Detect user env', () => {
  afterEach(() => {
    document.getElementById('__NEXT_DATA__')?.remove()
    Reflect.deleteProperty(window, 'next')
    vi.restoreAllMocks()
  })

  describe('Preact', () => {
    it('should detect preact if class components receive any arguments in render', () => {
      const env = detectEnvironment({
        context: {
          classRenderReceivesAnyArguments: true,
        },
      })

      expect(env).toEqual({
        name: Env.Preact,
      })
    })
  })

  describe('React', () => {
    it('should detect react if class component receives no args in render', () => {
      const env = detectEnvironment({
        context: {
          classRenderReceivesAnyArguments: false,
        },
      })

      expect(env).toEqual({
        name: Env.React,
      })
    })
  })

  describe('Next.js', () => {
    it('should detect env using next script', () => {
      const script = document.createElement('script')
      script.id = '__NEXT_DATA__'

      document.head.appendChild(script)

      const env = detectEnvironment({
        context: {
          classRenderReceivesAnyArguments: false,
        },
      })

      expect(env).toEqual({
        name: Env.Next,
      })
    })

    it('should detect next using global variable', () => {
      const version = '12.0.1'

      Object.assign(window, {
        next: {
          version,
        },
      })

      const env = detectEnvironment({
        context: { classRenderReceivesAnyArguments: false },
      })

      expect(env).toEqual({
        name: Env.Next,
        version,
      })
    })

    it('should skip Next detection when window is unavailable', () => {
      const originalWindowDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'window')
      Object.defineProperty(globalThis, 'window', {
        value: undefined,
        configurable: true,
      })

      try {
        const env = detectEnvironment({
          context: { classRenderReceivesAnyArguments: false },
        })

        expect(env).toEqual({
          name: Env.React,
        })
      } finally {
        if (originalWindowDescriptor) {
          Object.defineProperty(globalThis, 'window', originalWindowDescriptor)
        } else {
          Reflect.deleteProperty(globalThis, 'window')
        }
      }
    })
  })
})

describe('getEnvironment', () => {
  afterEach(() => {
    vi.resetModules()
    vi.doUnmock('../src/env')
  })

  it('returns parsed env details when the build-time env placeholder is valid JSON', async () => {
    vi.resetModules()
    vi.doMock('../src/env', () => ({
      env: JSON.stringify({ name: 'react', version: '18.0.0' }),
    }))

    const { getEnvironment: getEnvironmentFresh } = await import('../src/get-env')

    expect(
      getEnvironmentFresh({
        context: { classRenderReceivesAnyArguments: false },
      })
    ).toEqual({
      name: 'react',
      version: '18.0.0',
    })
  })

  it('falls back to detection when the build-time env JSON is not env details', async () => {
    vi.resetModules()
    vi.doMock('../src/env', () => ({
      env: JSON.stringify({ foo: 'bar' }),
    }))

    const { getEnvironment: getEnvironmentFresh } = await import('../src/get-env')

    expect(
      getEnvironmentFresh({
        // absence of classRenderReceivesAnyArguments is React signal
        context: { classRenderReceivesAnyArguments: false },
      })
    ).toEqual({
      name: Env.React,
    })
  })

  it('falls back to detection when the build-time env is invalid', async () => {
    vi.resetModules()
    vi.doMock('../src/env', () => ({
      env: '%DETECTED_ENV%',
    }))

    const { getEnvironment: getEnvironmentFresh } = await import('../src/get-env')

    expect(
      getEnvironmentFresh({
        context: { classRenderReceivesAnyArguments: false },
      })
    ).toEqual({
      name: Env.React,
    })
  })
})
