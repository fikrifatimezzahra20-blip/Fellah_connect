'use strict';

/**
 * Test helper — provides utility functions for integration tests.
 *
 * IMPORTANT: These tests require a running PostgreSQL database.
 * Use `docker-compose up -d` before running tests, or set NODE_ENV=test
 * with a test database configured in config/config.js.
 */

const request = require('supertest');
const app = require('../server');

let userCounter = 0;

/**
 * Register a unique test user and return { user, token }.
 */
async function createTestUser(overrides = {}) {
  userCounter++;
  const userData = {
    nom: `TestUser${userCounter}`,
    telephone: `06${String(Date.now()).slice(-8)}${userCounter}`,
    motDePasse: 'testpass123',
    ...overrides,
  };

  const res = await request(app)
    .post('/api/auth/register')
    .send(userData)
    .expect(201);

  return { user: res.body.user, token: res.body.token, password: userData.motDePasse };
}

/**
 * Register a test user with admin role.
 * Note: This directly sets the role, which the register endpoint defaults to 'agriculteur'.
 * For tests, we update the user role in the DB after creation.
 */
async function createAdminUser() {
  const { user, token } = await createTestUser();

  // Directly update the role in DB (bypass API since register always sets 'agriculteur')
  const { Utilisateur } = require('../models');
  await Utilisateur.update({ role: 'admin' }, { where: { id: user.id } });

  // Re-login to get token with admin role
  const jwt = require('jsonwebtoken');
  const adminToken = jwt.sign(
    { id: user.id, role: 'admin' },
    process.env.JWT_SECRET || 'test_secret',
    { expiresIn: '1d' }
  );

  return { user: { ...user, role: 'admin' }, token: adminToken };
}

/**
 * Get an authorization header object.
 */
function authHeader(token) {
  return { Authorization: `Bearer ${token}` };
}

module.exports = { app, createTestUser, createAdminUser, authHeader };
