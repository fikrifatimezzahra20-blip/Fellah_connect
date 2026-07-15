
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/auth.routes');
const agentRoutes = require('./routes/agent.routes');
const recolteRoutes = require('./routes/recolte.routes');
const { notFoundHandler, errorHandler } = require('./middlewares/error.middleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/recoltes', recolteRoutes);

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
