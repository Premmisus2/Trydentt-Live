import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

// All routes to pre-render at build time (SSG)
const routes = [
  '/',
  '/residential',
  '/commercial',
  '/about',
  '/quote',
  '/contact',
  '/london-ontario-cleaning',
  '/st-thomas-cleaning',
  '/woodstock-cleaning',
  '/strathroy-cleaning',
  '/ingersoll-cleaning',
  '/tillsonburg-cleaning',
  '/aylmer-cleaning',
  '/dorchester-cleaning',
  '/privacy-policy',
  '/terms',
];

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');

  // Only add prerenderer in production build
  const isProduction = mode === 'production';

  return {
    plugins: [
      react(),
      tailwindcss(),
      // Pre-render all routes at build time so crawlers see full HTML
      ...(isProduction ? [
        (async () => {
          const { default: prerender } = await import('@prerenderer/rollup-plugin');
          const { default: PuppeteerRenderer } = await import('@prerenderer/renderer-puppeteer');
          return prerender({
            routes,
            renderer: new PuppeteerRenderer({
              renderAfterTime: 5000, // Wait 5s for React + lazy routes to fully render
              headless: true,
            }),
            postProcess(renderedRoute) {
              // Fix trailing slashes
              if (renderedRoute.route.endsWith('/') && renderedRoute.route !== '/') {
                renderedRoute.route = renderedRoute.route.slice(0, -1);
              }
              // Remove duplicate titles/meta — Helmet injects page-specific ones,
              // but the original index.html tags remain.
              // If Helmet title is empty, keep the original; otherwise keep Helmet's.
              const titles = renderedRoute.html.match(/<title>.*?<\/title>/g);
              if (titles && titles.length > 1) {
                const helmetTitle = titles[0];
                const originalTitle = titles[1];
                // If Helmet title is empty, use the original
                const keepTitle = helmetTitle === '<title></title>' ? originalTitle : helmetTitle;
                renderedRoute.html = renderedRoute.html
                  .replace(/<title>.*?<\/title>\s*<title>.*?<\/title>/, keepTitle);
              }
              // Remove duplicate meta descriptions and canonicals (keep Helmet version)
              renderedRoute.html = renderedRoute.html
                .replace(/(<meta name="description"[^>]*>)(\s*<meta name="description"[^>]*>)/, '$1')
                .replace(/(<link rel="canonical"[^>]*>)(\s*<link rel="canonical"[^>]*>)/, '$1');
              return renderedRoute;
            },
          });
        })()
      ] : []),
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
