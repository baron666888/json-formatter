export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  app: {
    head: {
      // lang is set dynamically in app.vue based on locale
      titleTemplate: '%s - JSON Formatter',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'author', content: 'JSON Formatter Tool' },
        { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
        { name: 'googlebot', content: 'index, follow' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ]
    }
  },
  devtools: { enabled: false },
  css: ['~/assets/css/main.css']
})
