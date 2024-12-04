// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify from 'vite-plugin-vuetify';
import { fa } from 'vuetify/locale';
import auth from './middleware/auth';
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
    css: {
      preprocessorOptions: {
        sass: {
          // silenceDeprecations: ["legacy-js-api"],
          api: "modern-compiler"
        },
      }
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
  typescript: {
    strict: false,
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
    'dayjs-nuxt'
  ],
  // router: { // configure based on your needs
  //   middleware: 'auth', // middleware/auth.ts
  //   auth: {
  //     localStorage: false,
  //     cookie: {
  //       options: {
  //         expires: 28800
  //       }
  //     },
  //     redirect: {
  //       login: '/login',
  //       logout: '/',
  //       home: '/'
  //     },
  //     strategies: {
  //       local: {
  //         endpoints: {
  //           login: { url: '/auth/login', method: 'post' },
  //           logout: { url: '/auth/logout', method: 'post' },
  //           user: { url: '/auth/user', method: 'get', propertyName: 'user' }
  //         },
  //         token: {
  //           property: 'access_token',
  //           maxAge: 28800
  //         },
  //         user: {
  //           property: false
  //         },
  //         autoFetchUser: true
  //       }
  //     }
  //   },
  //   env: {
  //     apiBase: process.env.NUXT_PUBLIC_API_BASE
  //   }
  // }
})