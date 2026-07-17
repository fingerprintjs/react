/// <reference types="react-scripts" />

// react-scripts' bundled types don't declare a plain (side-effect) CSS import
// under this repo's TypeScript version, so declare it explicitly.
declare module '*.css'
