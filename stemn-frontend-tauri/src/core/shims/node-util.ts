/** `node:util` for the core window: only `promisify` is used (app/main/json-storage.js) */
export const promisify =
  (fn: (...args: any[]) => void) =>
  (...args: any[]) =>
    new Promise((resolve, reject) =>
      fn(...args, (error: unknown, data: unknown) => (error ? reject(error) : resolve(data))),
    )

export default { promisify }
