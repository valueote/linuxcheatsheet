/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './content/**/*.{md,mdx}'
  ],
  theme: {
    container: { center: true, padding: '1rem' },
    extend: {
      fontFamily: {
        sans: [
          '"HarmonyOS Sans"',
          '"HarmonyOS Sans SC"',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Noto Sans',
          'Helvetica Neue',
          'Arial',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol'
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'JetBrains Mono',
          'Consolas',
          'Liberation Mono',
          'monospace'
        ]
      },
      colors: {
        bg: {
          DEFAULT: 'rgb(var(--bg) / <alpha-value>)'
        },
        fg: {
          DEFAULT: 'rgb(var(--fg) / <alpha-value>)',
          muted: 'rgb(var(--fg-muted) / <alpha-value>)'
        },
        brand: {
          DEFAULT: 'rgb(var(--brand) / <alpha-value>)'
        }
      },
      boxShadow: {
        soft: '0 10px 30px -10px rgba(0,0,0,0.30)',
        elevated: '0 20px 40px -20px rgba(0,0,0,0.45)'
      },
      borderRadius: {
        xl: '14px'
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22,1,0.36,1)'
      }
    }
  },
  plugins: []
}
