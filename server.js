
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

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

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

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

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`FellahConnect API demarree sur http://localhost:${PORT}`);
});

module.exports = app;
