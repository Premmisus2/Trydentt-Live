import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');

  const isProduction = mode === 'production';
  const shouldPrerender = isProduction;

  return {
    plugins: [
      react(),
      tailwindcss(),
      // Pre-render all routes at build time so crawlers see full HTML
      ...(shouldPrerender ? [
        (async () => {
          const { default: prerender } = await import('@prerenderer/rollup-plugin');
          const { default: PuppeteerRenderer } = await import('@prerenderer/renderer-puppeteer');

          const routes = [
            '/',
            '/residential',
            '/commercial',
            '/about',
            '/quote',
            '/contact',
            '/london-ontario-cleaning',
            '/london-ontario-cleaning-offer',
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

          return prerender({
            routes,
            renderer: new PuppeteerRenderer({
              renderAfterTime: 5000,
              headless: true,
              args: ['--no-sandbox', '--disable-setuid-sandbox'],
            }),
            postProcess(renderedRoute) {
              if (renderedRoute.route.endsWith('/') && renderedRoute.route !== '/') {
                renderedRoute.route = renderedRoute.route.slice(0, -1);
              }
              const titles = renderedRoute.html.match(/<title>.*?<\/title>/g);
              if (titles && titles.length > 1) {
                const helmetTitle = titles[0];
                const originalTitle = titles[1];
                const keepTitle = helmetTitle === '<title></title>' ? originalTitle : helmetTitle;
                renderedRoute.html = renderedRoute.html
                  .replace(/<title>.*?<\/title>\s*<title>.*?<\/title>/, keepTitle);
              }
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
