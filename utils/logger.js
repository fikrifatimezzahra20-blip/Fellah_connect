'use strict';

const { createLogger, format, transports } = require('winston');
const path = require('path');

const { combine, timestamp, printf, colorize, errors, json } = format;

// ── Human-readable format for console ──────────────────────────
const devFormat = printf(({ level, message, timestamp, requestId, ...meta }) => {
  const rid = requestId ? ` [${requestId}]` : '';
  const extra = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
  return `${timestamp} ${level}${rid}: ${message}${extra}`;
});

// ── Logger instance ────────────────────────────────────────────
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true })
  ),
  defaultMeta: { service: 'fellahconnect-api' },
  transports: [
    // Console — colorized, human-readable
    new transports.Console({
      format: combine(colorize(), devFormat),
    }),

    // File — errors only
    new transports.File({
      filename: path.join(__dirname, '..', 'logs', 'error.log'),
      level: 'error',
      format: combine(json()),
      maxsize: 5 * 1024 * 1024, // 5 MB
      maxFiles: 5,
    }),

    // File — all logs
    new transports.File({
      filename: path.join(__dirname, '..', 'logs', 'combined.log'),
      format: combine(json()),
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5,
    }),
  ],
});

// In test environment, silence console to keep test output clean
if (process.env.NODE_ENV === 'test') {
  logger.silent = true;
}

module.exports = logger;
