// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: [
  ],
  modules: [
    '@nuxtjs/color-mode',
    '@vueuse/nuxt',
    'nuxt-icons'
  ],
  nitro: {
    prerender: {
      crawlLinks: true
    }
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/assets/style/all.scss";'
        }
      }
    },
    optimizeDeps: {
      exclude: [
        '@maanex/spacelib-common'
      ]
    }
  },
  runtimeConfig: {
    public: {
      isDev: (process.env.IS_DEV === 'true')
    }
  },
  app: {
    head: {
      title: '::',
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: '' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'darkreader-lock', content: 'true' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg', href: '/favicon.svg' }
      ]
    }
  }
})
