export default {
  // Server side rendering keeps the first paint fast and the pages crawlable
  ssr: true,
  target: 'server',

  head: {
    titleTemplate: (title) => (title ? `${title} | Gift Cards` : 'Gift Cards'),
    htmlAttrs: { lang: 'en' },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'Browse brands and issue gift cards.'
      }
    ],
    link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    // Applies the saved (or system) theme before the first paint to avoid a light flash
    script: [
      {
        hid: 'theme-init',
        innerHTML:
          "try{var t=localStorage.getItem('theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){}",
        type: 'text/javascript'
      }
    ],
    __dangerouslyDisableSanitizersByTagID: { 'theme-init': ['innerHTML'] }
  },

  css: ['~/assets/css/main.css'],

  // Auto register every component in ~/components without a folder prefix
  components: [{ path: '~/components', pathPrefix: false }],

  build: {
    // Bundle the server dependencies so the serverless function does not need node_modules
    standalone: true
  }
}
