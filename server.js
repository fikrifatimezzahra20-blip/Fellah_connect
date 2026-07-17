
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const logger = require('./utils/logger');
const { requestId } = require('./middlewares/requestId.middleware');

const authRoutes = require('./routes/auth.routes');
const agentRoutes = require('./routes/agent.routes');
const recolteRoutes = require('./routes/recolte.routes');
const parcelleRoutes = require('./routes/parcelle.routes');
const produitRoutes = require('./routes/produit.routes');
const marcheRoutes = require('./routes/marche.routes');
const prixMarcheRoutes = require('./routes/prix-marche.routes');
const offreVenteRoutes = require('./routes/offre-vente.routes');
const userRoutes = require('./routes/user.routes');
const { notFoundHandler, errorHandler } = require('./middlewares/error.middleware');

const app = express();

// ── Security ───────────────────────────────────────────────────
app.use(helmet());

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

// Morgan → pipe through Winston
const morganStream = {
  write: (msg) => logger.http(msg.trim()),
};
app.use(morgan('short', { stream: morganStream }));

// ── Routes ─────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/recoltes', recolteRoutes);
app.use('/api/parcelles', parcelleRoutes);
app.use('/api/produits', produitRoutes);
app.use('/api/marches', marcheRoutes);
app.use('/api/prix-marches', prixMarcheRoutes);
app.use('/api/offres-vente', offreVenteRoutes);
app.use('/api/agriculteurs', userRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'fellahconnect-api' });
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
