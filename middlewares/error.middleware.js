'use strict';

const logger = require('../utils/logger');

/**
 * 404 — Route not found handler.
 */
function notFoundHandler(req, res, next) {
  res.status(404).json({
    message: `Route non trouvee: ${req.method} ${req.originalUrl}`,
    requestId: req.requestId || null,
  });
}

/**
 * Centralized error handler.
 * Logs the error with full context and returns a structured JSON response.
 */
function errorHandler(err, req, res, next) {
  // ── Determine status code ────────────────────────────────────
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || 'Erreur interne du serveur.';
  let details = null;

  // ── Sequelize validation / unique constraint errors ──────────
  if (
    err.name === 'SequelizeValidationError' ||
    err.name === 'SequelizeUniqueConstraintError'
  ) {
    statusCode = 400;
    message = 'Donnees invalides.';
    details = err.errors ? err.errors.map((e) => e.message) : [err.message];
  }

  // ── Zod validation errors ────────────────────────────────────
  if (err.name === 'ZodError') {
    statusCode = 400;
    message = 'Donnees invalides.';
    details = err.issues
      ? err.issues.map((i) => `${i.path.join('.')}: ${i.message}`)
      : [err.message];
  }

  // ── JWT errors ───────────────────────────────────────────────
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token invalide ou expire.';
  }

  // ── Log the error ────────────────────────────────────────────
  const logPayload = {
    requestId: req.requestId,
    method: req.method,
    url: req.originalUrl,
    statusCode,
    userId: req.user?.id || null,
  };

  if (statusCode >= 500) {
    logger.error(message, { ...logPayload, stack: err.stack });
  } else {
    logger.warn(message, logPayload);
  }

  // ── Send response ───────────────────────────────────────────
  const body = {
    message,
    ...(details && { details }),
    requestId: req.requestId || null,
  };

  res.status(statusCode).json(body);
}

module.exports = { notFoundHandler, errorHandler };
