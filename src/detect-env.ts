import { Env, type EnvDetails } from './env.types'

export interface DetectEnvContext {
  classRenderReceivesAnyArguments: boolean
}

export interface DetectEnvParams {
  context: DetectEnvContext
}

type EnvCheckStrategy = () => boolean

function runEnvChecks(...strategies: EnvCheckStrategy[]) {
  if (typeof window === 'undefined') {
    return false
  }

  for (const strategy of strategies) {
    const result = strategy()

    if (result) {
      return true
    }
  }

  return false
}

/**
 * Runs checks that determine if user is using preact.
 * So far they are not ideal, as there is no consistent way to detect preact.
 * */
function isPreact(context: DetectEnvContext) {
  return context.classRenderReceivesAnyArguments
}

/**
 * Checks if user is using react.
 * */
function isReact(context: DetectEnvContext) {
  return !context.classRenderReceivesAnyArguments
}

/**
 * Runs checks that determine if user is using next.
 * Those checks should have almost 100% accuracy.
 * */
function isNext() {
  return runEnvChecks(
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    () => 'next' in window && Boolean((window as { next?: unknown }).next),
    () => document.querySelector('script[id=__NEXT_DATA__]') !== null
  )
}

/**
 * Returns next version currently used by user.
 * */
function getNextVersion() {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return (window as { next?: { version?: string } }).next?.version
}

/**
 * Attempts to determine user environment.
 * */
export function detectEnvironment({ context }: DetectEnvParams): EnvDetails {
  if (isNext()) {
    return {
      name: Env.Next,
      version: getNextVersion(),
    }
  }

  if (isPreact(context)) {
    return {
      name: Env.Preact,
    }
  }

  if (isReact(context)) {
    return {
      name: Env.React,
    }
  }

  return {
    name: Env.Unknown,
  }
}
