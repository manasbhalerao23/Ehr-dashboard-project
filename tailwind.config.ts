import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        healthcare: {
          primary: '#0066CC',
          secondary: '#E8F4FD',
          accent: '#00A86B',
          warning: '#FF6B35',
          error: '#DC2626'
        }
      }
    },
  },
  plugins: [],
}
export default config