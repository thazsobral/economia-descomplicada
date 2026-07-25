import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import translateNewsHandler from './api/translate-news';

dotenv.config({ path: '.env.local' });
dotenv.config(); // fallback .env

const app = express();
const PORT = 3000;

app.use(express.json());

// Delega a rota /api/translate-news para a função handler oficial
app.post('/api/translate-news', (req, res) => {
  translateNewsHandler(req, res);
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
  });
}

startServer();