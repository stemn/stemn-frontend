// Copies the express server (src/server) next to the built client (build/server)
const { cpSync } = require('fs')
const { join } = require('path')

cpSync(join(__dirname, '../src/server'), join(__dirname, '../build/server'), { recursive: true })
console.log('Copied src/server to build/server')
