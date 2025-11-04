import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import mdx from '@astrojs/mdx'

export default defineConfig({
  integrations: [mdx(), tailwind({ applyBaseStyles: false })],
  markdown: {
    shikiConfig: {
      theme: 'github-dark-default',
      wrap: true
    }
  },
  server: { port: 4321 },
  typescript: { strict: true },
  vite: {
    resolve: {
      alias: {
        '@': new URL('./src', import.meta.url).pathname
      }
    }
  }
})
