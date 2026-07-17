<p align="center">
  <a href="https://fingerprint.com">
   <picture>
     <source media="(prefers-color-scheme: dark)" srcset="https://fingerprintjs.github.io/home/resources/logo_light.svg" />
     <source media="(prefers-color-scheme: light)" srcset="https://fingerprintjs.github.io/home/resources/logo_dark.svg" />
     <img src="https://fingerprintjs.github.io/home/resources/logo_dark.svg" alt="Fingerprint logo" width="312px" />
   </picture>
  </a>
</p>
<p align="center">
  <a href="https://github.com/fingerprintjs/react/actions/workflows/release.yml"><img src="https://github.com/fingerprintjs/react/actions/workflows/release.yml/badge.svg" alt="CI badge" /></a>
  <a href="https://fingerprintjs.github.io/react/coverage/"><img src="https://fingerprintjs.github.io/react/coverage/badges.svg" alt="coverage"></a>
  <a href="https://www.npmjs.com/package/@fingerprint/react"><img src="https://img.shields.io/npm/v/@fingerprint/react.svg" alt="Current NPM version"></a>
  <a href="https://www.npmjs.com/package/@fingerprint/react"><img src="https://img.shields.io/npm/dm/@fingerprint/react.svg" alt="Monthly downloads from NPM"></a>
  <a href="https://opensource.org/license/MIT"><img src="https://img.shields.io/:license-mit-blue.svg" alt="MIT license"></a>
  <a href="https://discord.com/invite/39EpE2neBg"><img src="https://img.shields.io/discord/852099967190433792?style=logo&label=Discord&logo=Discord&logoColor=white" alt="Discord server"></a>
  <a href="https://fingerprintjs.github.io/react/"><img src="https://img.shields.io/badge/-Documentation-green" alt="Documentation"></a>
</p>

# Fingerprint React

Fingerprint is a device intelligence platform offering industry-leading accuracy. Fingerprint React SDK is an easy way to integrate **[Fingerprint](https://fingerprint.com/)** into your React application. It's also compatible with Next.js and Preact. See application demos in the [examples](https://github.com/fingerprintjs/react/tree/main/examples) folder.

## Table of contents


- [Fingerprint React](#fingerprint-react)
  - [Table of contents](#table-of-contents)
  - [Requirements](#requirements)
  - [Installation](#installation)
  - [Getting started](#getting-started)
    - [1. Wrap your application (or component) in `<FingerprintProvider>`.](#1-wrap-your-application-or-component-in-fingerprintprovider)
    - [2. Use the `useVisitorData()` hook in your components to identify visitors](#2-use-the-usevisitordata-hook-in-your-components-to-identify-visitors)
  - [Linking and tagging information](#linking-and-tagging-information)
  - [Error handling](#error-handling)
  - [API Reference](#api-reference)
  - [Support and feedback](#support-and-feedback)
  - [License](#license)

## Requirements

- React 18 or 19
- For Preact users: Preact 10.3 or higher
- For Next.js users: Next.js 13.1 or higher
- For TypeScript users: TypeScript 4.8 or higher

> [!NOTE]
> This package assumes you have a Fingerprint subscription or trial, it is not compatible with the [open-source FingerprintJS](https://github.com/fingerprintjs/fingerprintjs). See our documentation to learn more about the [differences between Fingerprint and the open-source FingerprintJS](https://fingerprint.com/github/).

## Installation

Using [npm](https://npmjs.org):

```sh
npm install @fingerprint/react
```

Using [yarn](https://yarnpkg.com):

```sh
yarn add @fingerprint/react
```

Using [pnpm](https://pnpm.js.org):

```sh
pnpm add @fingerprint/react
```

## Getting started

In order to identify visitors, you'll need a Fingerprint account (you can [sign up for free](https://dashboard.fingerprint.com/signup)).
To get your API key and get started, see the [Fingerprint Quick Start Guide](https://docs.fingerprint.com/docs/quick-start-guide).

### 1. Wrap your application (or component) in `<FingerprintProvider>`.

- Set `apiKey` to your Fingerprint [Public API Key](https://dashboard.fingerprint.com/api-keys).
- Set `region` if you have chosen a non-global [region](https://docs.fingerprint.com/docs/regions) during registration.
- Set `endpoints` if you are using [one of our proxy integrations to increase accuracy](https://docs.fingerprint.com/docs/protecting-the-javascript-agent-from-adblockers) and effectiveness of visitor identification.
- You can use all the [start options](https://docs.fingerprint.com/reference/js-agent-start-function#start-options) available in the JavaScript agent `start()` function.
- Caching is disabled by default. To enable caching, pass the JavaScript agent [`cache` start option](https://docs.fingerprint.com/reference/js-agent-start-function#cache).

```jsx
// src/index.js
import React from 'react'
import ReactDOM from 'react-dom/client'
import { FingerprintProvider } from '@fingerprint/react'
import App from './App'

const root = ReactDOM.createRoot(document.getElementById('root'))

// <FingerprintProvider /> supports the same options as `start()` function.
root.render(
  <FingerprintProvider
    apiKey='PUBLIC_API_KEY'
    cache={{ storage: 'sessionStorage', duration: 3600 }}
  >
    <App />
  </FingerprintProvider>
)
```

### 2. Use the `useVisitorData()` hook in your components to identify visitors

```jsx
// src/App.js
import React from 'react'
import { useVisitorData } from '@fingerprint/react'

function App() {
  const { isLoading, error, isFetched, data } = useVisitorData()

  if (isLoading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div>An error occurred: {error.message}</div>
  }

  if (isFetched) {
    return <div>Welcome {data.visitor_id}!</div>
  }
  
  return null
}

export default App
```

The `useVisitorData` hook also returns a `getData` method you can use to make an API call on command.

- You can pass `{ immediate: false }` to `useVisitorData` to disable automatic visitor identification on render.

Both `useVisitorData` and `getData` accept all the [get options](https://docs.fingerprint.com/reference/js-agent-get-function#get-options) available in the JavaScript agent `get` function.

The returned v4 visitor data uses raw response field names in snake_case, for example `visitor_id` and `event_id`.

```jsx
// src/App.js
import React, { useState } from 'react'
import { useVisitorData } from '@fingerprint/react'

function App() {
  const { isLoading, error, getData } = useVisitorData(
    { immediate: false }
  )
  const [email, setEmail] = useState('')

  if (isLoading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div>An error occurred: {error.message}</div>
  }

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          getData()
            .then((data) => {
              // Do something with the visitor data, for example,
              // append visitor data to the form data to send to your server
              console.log(data.visitor_id)
            })
            .catch((error) => {
              // Handle error
            })
        }}
      >
        <label htmlFor='email'>Email:</label>
        <input
          type='email'
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
        />
        <button type='submit'>Subscribe</button>
      </form>
    </div>
  )
}

export default App
```

- See the full code example in the [examples folder](./examples/).
- See our [Use cases](https://demo.fingerprint.com) page for [open-source](https://github.com/fingerprintjs/fingerprintjs-pro-use-cases) real-world examples of using Fingerprint to detect fraud and streamline user experiences.

## Linking and tagging information

The visitor ID provided by Fingerprint Identification is especially useful when combined with information you already know about your users, for example, account IDs, order IDs, etc. To learn more about various applications of the `linkedId` and `tag`, see [Linking and tagging information](https://docs.fingerprint.com/docs/tagging-information).

Associate the visitor ID with your data using the `linkedId` or `tag` parameter of the options object passed into the `useVisitorData()` hook or the `getData` function:

```jsx
// ...
function App() {
  const { isLoading, error, getData } = useVisitorData({
    linkedId: 'user_1234',
    tag: {
      userAction: 'login',
      analyticsId: 'UA-5555-1111-1',
    },
  })
}
// ...
```

## Error handling

The `getData` function throws errors directly from the JS Agent without changing them. See [JS Agent error handling](https://docs.fingerprint.com/reference/js-agent-error-handling) for more details.

## API Reference

See the full [generated API reference](https://fingerprintjs.github.io/react/).

## Support and feedback

To ask questions or provide feedback, use [Issues](https://github.com/fingerprintjs/react/issues). If you need private support, please email us at `oss-support@fingerprint.com`.

## License

This project is licensed under the MIT license. See the [LICENSE](https://github.com/fingerprintjs/react/blob/main/LICENSE) file for more info.
