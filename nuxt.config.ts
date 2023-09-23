// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  app: {
    head: {
      titleTemplate: 'DiJust notes app',
      meta: [
        { name: 'description', content: 'DiJust notes app test task.' },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, maximum-scale=1',
        },
      ],
    },
  },
  css: ['~/assets/scss/main.scss'],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @import "@/assets/scss/common/_variables.scss"; 
            @import "@/assets/scss/common/_mixins.scss";`,
        },
      },
    },
  },
  modules: ['@pinia/nuxt'],
  pinia: {
    autoImports: [
      'defineStore',
      'storeToRefs', // import { defineStore } from 'pinia'
      ['defineStore', 'definePiniaStore'], // import { defineStore as definePiniaStore } from 'pinia'
    ],
  },
  imports: {
    dirs: ['store'],
  },
  nitro: {
    preset: 'vercel-edge',
  },
});
