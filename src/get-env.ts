import { env } from './env'
import { EnvDetails, isEnvDetails } from './env.types'
import { detectEnvironment, type DetectEnvParams } from './detect-env'

export function getEnvironment(params: DetectEnvParams): EnvDetails {
  try {
    const jsonEnv: unknown = JSON.parse(env)
    if (isEnvDetails(jsonEnv)) {
      return jsonEnv
    }
  } catch {
    // Nothing here...
  }

  return detectEnvironment(params)
}
