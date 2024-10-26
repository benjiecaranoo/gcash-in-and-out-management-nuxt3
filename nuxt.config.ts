// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify from 'vite-plugin-vuetify';
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  ssr: false,
  css: [
    'vuetify/lib/styles/main.sass', 
    '@mdi/font/css/materialdesignicons.min.css',
    '~/assets/scss/main.scss'
  ],
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      title: 'Gcash In and Out Tracker',
      titleTemplate: '%s - Gcash In and Out Tracker',
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'Gcash In and Out Tracker' }
      ]
    },
  },
  build: {
    transpile: ['vuetify'],
  },
  vite: {
    define: {
      'process.env.DEBUG': false,
    },
    // ssr: {
    //   noExternal: ['vuetify'],
    // }
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE
    }
  },
  sanctum: {
    baseUrl: 'https://gcash-in-and-out-tracker-api.test/',
    // cookie: {
    //   options: {
    //     secure: false
    //   }
    // }
  },
  typescript: {
    strict: true
  },
  modules: [
    async (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        if (config.plugins) {
          config.plugins.push(vuetify());
        }
      })
    },
    '@pinia/nuxt',
    '@nuxt/eslint',
    'dayjs-nuxt',
    'nuxt-auth-sanctum'
  ]
})