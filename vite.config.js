import {
  fileURLToPath,
  URL
} from 'node:url'

import {
  defineConfig,
  loadEnv
} from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {
  ElementPlusResolver
} from 'unplugin-vue-components/resolvers'


export default defineConfig(({
  mode
}) => {
  const config = loadEnv(mode, './')
  return {
    plugins: [
      vue(),
      vueJsx(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      })
    ],
    base: '/h5-editor/dist/',
    minify: true,
    sourceMap: true,
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      port: '8000',
      open: false,
      proxy: {
        '^/api/': {
          target: config.VITE_BASE_API,
          changeOrigin: true,
          followRedirects: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      }
    }
  }
})
