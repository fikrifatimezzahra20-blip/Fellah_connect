'use strict';

const morgan = require('morgan');
const logger = require('../utils/logger');

const morganStream = {
  write: (msg) => logger.http(msg.trim()),
};

const loggerMiddleware = morgan('short', { stream: morganStream });

module.exports = loggerMiddleware;
