import { defineConfig } from 'vite';
import path from 'path';
import { apiRouter } from './lib/router.js';

export default defineConfig({
  plugins: [
    {
      name: 'api-middleware',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url && req.url.startsWith('/api/')) {
            try {
              await apiRouter(req, res);
            } catch (err) {
              console.error('[API Middleware Error]:', err);
              if (!res.headersSent) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, error: 'Internal server error' }));
              }
            }
            return;
          }

          // Rewrite /admin to /admin.html in dev server
          if (req.url === '/admin' || req.url === '/admin/') {
            req.url = '/admin.html';
          }

          next();
        });
      },
    },
  ],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        admin: path.resolve(__dirname, 'admin.html'),
      },
    },
  },
});
