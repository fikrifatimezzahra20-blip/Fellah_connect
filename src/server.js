/**
 * src/server.js — Entry point for `npm run dev` and `npm start`.
 * Imports the fully configured Express app from the root.
 * The root server.js handles starting the HTTP server when NODE_ENV !== 'test'.
 */
require('dotenv').config();

// Simply require the root server — it sets up Express and starts listening
require('../server');