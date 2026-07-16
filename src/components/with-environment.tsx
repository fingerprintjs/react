import { Component, type JSX } from 'react'

import { getEnvironment } from '../get-env'
import { type DetectEnvParams } from '../detect-env'
import { type EnvDetails } from '../env.types'

export interface WithEnvironmentProps {
  children: (env: EnvDetails) => JSX.Element
}

/**
 * Utility component that synchronously detects the current environment (React/Preact etc.) and
 * passes it to the child render function.
 *
 * @example
 * ```jsx
 * <WithEnvironment>
 *   {(env) => <App env={env} />}
 * </WithEnvironment>
 * ```
 */
class WithEnvironment extends Component<WithEnvironmentProps> {
  detectedEnv: EnvDetails | undefined

  render(...args: unknown[]) {
    if (!this.detectedEnv) {
      // unlike React, class components in Preact always receive `props` and `state` in render()
      // this is true for both Preact 8.x and 10.x
      const hasAnyArguments = args.length > 0
      const detectParams: DetectEnvParams = {
        context: { classRenderReceivesAnyArguments: hasAnyArguments },
      }

      this.detectedEnv = getEnvironment(detectParams)
    }

    return this.props.children(this.detectedEnv)
  }
}

export { WithEnvironment }
