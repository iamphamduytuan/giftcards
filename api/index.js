// Vercel serverless entry: renders every page that is not a static file
const path = require('path')
const { loadNuxt } = require('nuxt-start')

// loadNuxt reads nuxt.config.js (ES module syntax) and the prebuilt .nuxt folder
const nuxtPromise = loadNuxt({ for: 'start', rootDir: path.resolve(__dirname, '..') })

module.exports = async (req, res) => {
  const nuxt = await nuxtPromise
  nuxt.render(req, res)
}
