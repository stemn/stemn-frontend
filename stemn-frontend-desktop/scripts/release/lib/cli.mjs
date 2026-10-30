/** Tiny argv parser for the release scripts: positional args + --flag / --key value / --key=value */
export const parseArgs = (argv, { booleans = [] } = {}) => {
  const positional = []
  const options = {}
  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index]
    if (!arg.startsWith('--')) {
      positional.push(arg)
      continue
    }
    const [key, inline] = arg.slice(2).split(/=(.*)/s)
    if (inline !== undefined) options[key] = inline
    else if (booleans.includes(key) || index + 1 >= argv.length || argv[index + 1].startsWith('--')) options[key] = true
    else options[key] = argv[++index]
  }
  return { positional, options }
}

export const fail = (message) => {
  console.error(`error: ${message}`)
  process.exit(1)
}
