import { defineConfig } from 'vite';
import path from 'path';
import fs from 'fs';
import { apiRouter } from './lib/router.js';

function getHtmlInputs() {
  const inputs = {};
  function findHtml(dir, prefix = '') {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      if (['node_modules', 'dist', '.git', '.gemini', 'brain', 'scripts', 'api', 'lib', 'db'].includes(file)) continue;
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        findHtml(fullPath, prefix ? `${prefix}/${file}` : file);
      } else if (file.endsWith('.html')) {
        const nameKey = prefix ? `${prefix}/${file.replace('.html', '')}` : file.replace('.html', '');
        inputs[nameKey.replace(/[\/\\]/g, '_')] = fullPath;
      }
    }
  }
  findHtml(__dirname);
  return inputs;
}

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

          // Clean URLs in dev server: /about -> /about/index.html, /home-cleaning -> /home-cleaning/index.html
          const [urlPath, queryString] = (req.url || '').split('?');
          if (urlPath && !urlPath.includes('.')) {
            const cleanPath = urlPath.replace(/\/$/, '');
            if (cleanPath === '/admin') {
              req.url = '/admin.html' + (queryString ? `?${queryString}` : '');
            } else if (cleanPath) {
              const candidateIndex = path.join(__dirname, cleanPath, 'index.html');
              const candidateDirect = path.join(__dirname, `${cleanPath}.html`);
              if (fs.existsSync(candidateIndex)) {
                req.url = `${cleanPath}/index.html` + (queryString ? `?${queryString}` : '');
              } else if (fs.existsSync(candidateDirect)) {
                req.url = `${cleanPath}.html` + (queryString ? `?${queryString}` : '');
              }
            }
          }

          next();
        });
      },
    },
  ],
  build: {
    rollupOptions: {
      input: getHtmlInputs(),
    },
  },
});

