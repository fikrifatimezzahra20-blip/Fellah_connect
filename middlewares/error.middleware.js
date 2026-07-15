'use strict';

function notFoundHandler(req, res, next) {
  res.status(404).json({ message: `Route non trouvee: ${req.method} ${req.originalUrl}` });
}

function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      message: 'Donnees invalides.',
      details: err.errors ? err.errors.map((e) => e.message) : err.message,
    });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Erreur interne du serveur.',
  });
}

module.exports = { notFoundHandler, errorHandler };
