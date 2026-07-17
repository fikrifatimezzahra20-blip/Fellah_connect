require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const logger = require('./utils/logger');
const { requestId } = require('./middlewares/requestId.middleware');
const loggerMiddleware = require('./middlewares/logger.middleware');
const openApiSpec = require('./docs/openapi');

const authRoutes = require('./routes/auth.routes');
const agentRoutes = require('./routes/agent.routes');
const recolteRoutes = require('./routes/recolte.routes');
const parcelleRoutes = require('./routes/parcelle.routes');
const produitRoutes = require('./routes/produit.routes');
const marcheRoutes = require('./routes/marche.routes');
const prixMarcheRoutes = require('./routes/prix-marche.routes');
const offreRoutes = require('./routes/offre.routes');
const agriculteurRoutes = require('./routes/agriculteur.routes');
const { notFoundHandler, errorHandler } = require('./middlewares/error.middleware');

const app = express();

// ── Security ───────────────────────────────────────────────────
// Skip helmet entirely for Scalar docs (needs CDN scripts + inline scripts)
app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/api/docs')) {
    return next();
  }
  return helmet()(req, res, next);
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // 100 requests per windowMs per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Trop de requetes, veuillez reessayer plus tard.' },
});
app.use('/api/', limiter);

// ── Core middleware ────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(requestId);
app.use(loggerMiddleware);

// ── Routes ─────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/recoltes', recolteRoutes);
app.use('/api/parcelles', parcelleRoutes);
app.use('/api/produits', produitRoutes);
app.use('/api/marches', marcheRoutes);
app.use('/api/prix-marches', prixMarcheRoutes);
app.use('/api/offres-vente', offreRoutes); // Backwards compatibility for tests
app.use('/api/offres', offreRoutes);       // New standardized endpoint
app.use('/api/agriculteurs', agriculteurRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'fellahconnect-api' });
});

// ── API Documentation (Scalar UI) ──────────────────────────────
app.get('/api/docs.json', (req, res) => {
  res.status(200).json(openApiSpec);
});

// Lazy-load Scalar (ESM-only) to stay compatible with Jest / CommonJS tests
let _scalarMiddleware;
app.use('/api/docs', async (req, res, next) => {
  try {
    if (!_scalarMiddleware) {
      const { apiReference } = await import('@scalar/express-api-reference');
      _scalarMiddleware = apiReference({
        spec: { content: openApiSpec },
        theme: 'kepler',
        layout: 'modern',
        defaultHttpClient: { targetKey: 'javascript', clientKey: 'fetch' },
        metaData: { title: 'FellahConnect API Docs' },
      });
    }
    _scalarMiddleware(req, res, next);
  } catch (err) {
    next(err);
  }
});

// ── Error handling ─────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

// ── Start server ───────────────────────────────────────────────
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logger.info(`FellahConnect API demarree sur http://localhost:${PORT}`);
  });
}

module.exports = app;
