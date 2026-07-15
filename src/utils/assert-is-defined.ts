export function assertIsDefined<T>(value: T, name: string): asserts value is NonNullable<T> {
  if (value === null || value === undefined) {
    throw new TypeError(`${name} must not be null or undefined`)
  }
}
