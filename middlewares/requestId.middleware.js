'use strict';

const crypto = require('crypto');

/**
 * Attach a unique request ID to each incoming request.
 * The ID is also sent back in the response header for client-side tracing.
 */
function requestId(req, res, next) {
  const id = req.headers['x-request-id'] || crypto.randomUUID();
  req.requestId = id;
  res.setHeader('X-Request-Id', id);
  return next();
}

module.exports = { requestId };
