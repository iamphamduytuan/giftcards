// Copies the client build and the static folder into public/ so Vercel serves them as files.
// Pages themselves are rendered by api/index.js.
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const publicDir = path.join(root, 'public')

fs.rmSync(publicDir, { recursive: true, force: true })
fs.mkdirSync(path.join(publicDir, '_nuxt'), { recursive: true })
fs.cpSync(path.join(root, '.nuxt', 'dist', 'client'), path.join(publicDir, '_nuxt'), { recursive: true })
fs.cpSync(path.join(root, 'static'), publicDir, { recursive: true })
