import { useRef } from 'react'

export function useConst<T>(initialValue: T | (() => T)): T {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- T could itself be a function type, so narrowing via typeof doesn't disambiguate `T | (() => T)`
  const ref = useRef<T>(typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue)

  // eslint-disable-next-line react-hooks/refs -- useConst is intentionally a ref-backed stable value, reading ref.current in render is the purpose of this hook
  return ref.current
}
