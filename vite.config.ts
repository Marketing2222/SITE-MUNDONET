import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

const PROD_DATA_ORIGIN = 'https://mundonetbandalarga.com.br'

const previewReadonlyGate = (): Plugin => ({
  name: 'preview-readonly-gate',
  apply: 'serve',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const url = req.url || ''
      if (url.startsWith('/api') && req.method !== 'GET' && req.method !== 'HEAD') {
        res.statusCode = 405
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.end(JSON.stringify({ error: 'Modo preview: ambiente somente leitura' }))
        return
      }
      next()
    })
  },
})

export default defineConfig(({ mode }) => {
  const previewData = mode === 'preview'
  const apiTarget = previewData ? PROD_DATA_ORIGIN : 'http://localhost:3001'

  return {
    plugins: [react(), ...(previewData ? [previewReadonlyGate()] : [])],
    server: {
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
        },
        ...(previewData
          ? {
              '/uploads': {
                target: PROD_DATA_ORIGIN,
                changeOrigin: true,
              },
            }
          : {}),
      },
    },
  }
})
