/**
 * src/app.js — Re-exports the main Express app from the project root.
 * This file exists so that `npm run dev` (which targets src/server.js) works correctly.
 */
const app = require('../server');

module.exports = app;