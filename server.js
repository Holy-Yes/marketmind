import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createProxyMiddleware } from 'http-proxy-middleware';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const BACKEND_URL = 'http://localhost:8000';

// Proxy AI and Auth requests to the Python backend
const apiProxy = createProxyMiddleware({
    target: BACKEND_URL,
    changeOrigin: true,
    logLevel: 'debug',
    onProxyRes: (proxyRes, req, res) => {
        // Ensure CORS headers if needed for development
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    },
});

// Register all backend routes to the proxy
app.use('/auth', apiProxy);
app.use('/campaigns', apiProxy);
app.use('/instagram', apiProxy);
app.use('/pitch', apiProxy);
app.use('/competitor', apiProxy);
app.use('/leads', apiProxy);
app.use('/simulator', apiProxy);
app.use('/intelligence', apiProxy);
app.use('/memory', apiProxy);
app.use('/images', apiProxy);
app.use('/health', apiProxy);

// Serve static assets from the Vite build directory
const buildPath = path.join(__dirname, 'dist');
app.use(express.static(buildPath));

// Fallback to index.html for React Router (SPA support)
app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`
  🚀 MarketMind Production Server Running
  --------------------------------------
  Frontend: http://localhost:${PORT}
  Proxying to Backend: ${BACKEND_URL}
  --------------------------------------
  `);
});
