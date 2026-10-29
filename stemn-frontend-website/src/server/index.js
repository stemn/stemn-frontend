const express = require('express')
const morgan = require('morgan')
const { resolve } = require('path')

const app = express()
const root = resolve(__dirname, '../client')
const port = Number(process.env.PORT) || 8081

app.use(morgan('dev'))
app.get('/api/ping', (req, res) => res.json({}))
app.use(express.static(root, { maxAge: '1y', index: false }))
// SPA fallback: every other GET renders index.html (Express 5 path syntax)
app.get('/{*splat}', (req, res) => res.sendFile('index.html', { root, maxAge: 0 }))

app.listen(port, () => console.log(`Stemn website served from ${root} on http://localhost:${port}`))
