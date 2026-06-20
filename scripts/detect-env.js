/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs')
const pkg = require('../package.json')
const path = require('path')
const cwd = process.env.INIT_CWD || path.resolve('../../', __dirname)

const token = '%DETECTED_ENV%'

const Env = {
  React: 'react',
  Preact: 'preact',
  Next: 'next',
  Unknown: 'unknown',
}

const distPaths = [pkg.main, pkg.module]

const envDetectOrder = [Env.Next, Env.Preact, Env.React]

function detectEnv(env) {
  try {
    const pkgPath = path.join(cwd, `node_modules/${env}/package.json`)
    const pkg = require(pkgPath)

    return pkg.version
  } catch {
    return null
  }
}

function writeDetectedEnv(env, version) {
  distPaths.forEach((distPath) => {
    const fullDistPath = path.resolve(__dirname, '../', distPath)

    const contents = fs.readFileSync(fullDistPath).toString()
    const newContents = contents.replace(token, JSON.stringify({ name: env, version }).replace(/"/g, '\\"'))

    fs.writeFileSync(fullDistPath, newContents)
  })
}

function main() {
  for (const env of envDetectOrder) {
    const version = detectEnv(env)

    if (version) {
      writeDetectedEnv(env, version)

      return
    }
  }
}

try {
  main()
} catch {
  // Nothing here...
}
