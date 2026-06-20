import { cloneElement, Component } from 'react'

import { getEnvironment } from '../get-env'
import { type DetectEnvParams } from '../detect-env'
import { type EnvDetails } from '../env.types'

export interface WithEnvironmentProps {
  // exactly one element must be provided
  children: JSX.Element
}

/**
 * Utility component that synchronously detects the current environment (React/Preact etc.) and
 * provides it as a prop to the child element.
 *
 * @example
 * ```jsx
 * const App = ({ env }: { env: EnvDetails }) => `I'm running in ${env.name}!`
 *
 * <WithEnvironment>
 *  <App />
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

    // passes the `env` down as a prop
    return cloneElement(this.props.children, { env: this.detectedEnv })
  }
}

export { WithEnvironment }
