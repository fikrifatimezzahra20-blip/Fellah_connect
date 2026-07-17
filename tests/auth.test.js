'use strict';

const request = require('supertest');
const { app, createTestUser, authHeader } = require('./setup');

describe('Auth Endpoints', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          nom: 'Agriculteur Test',
          telephone: `07${Date.now()}`,
          motDePasse: 'password123',
          region: 'Fes-Meknes',
        })
        .expect(201);

      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('nom', 'Agriculteur Test');
      expect(res.body.user).toHaveProperty('role', 'agriculteur');
      expect(res.body.user).not.toHaveProperty('motDePasse');
    });

    it('should reject registration with missing required fields', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ nom: 'Incomplete' })
        .expect(400);

      expect(res.body).toHaveProperty('message');
    });

    it('should reject duplicate phone number', async () => {
      const phone = `07${Date.now()}`;

      await request(app)
        .post('/api/auth/register')
        .send({ nom: 'User1', telephone: phone, motDePasse: 'pass123456' })
        .expect(201);

      const res = await request(app)
        .post('/api/auth/register')
        .send({ nom: 'User2', telephone: phone, motDePasse: 'pass123456' })
        .expect(400);

      expect(res.body.message).toMatch(/telephone|deja/i);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with correct credentials', async () => {
      const phone = `07${Date.now()}`;
      await request(app)
        .post('/api/auth/register')
        .send({ nom: 'LoginUser', telephone: phone, motDePasse: 'mypassword' });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ telephone: phone, motDePasse: 'mypassword' })
        .expect(200);

      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('nom', 'LoginUser');
    });

    it('should reject wrong password', async () => {
      const phone = `07${Date.now()}`;
      await request(app)
        .post('/api/auth/register')
        .send({ nom: 'WrongPW', telephone: phone, motDePasse: 'correct123' });

      await request(app)
        .post('/api/auth/login')
        .send({ telephone: phone, motDePasse: 'wrong' })
        .expect(401);
    });

    it('should reject missing fields', async () => {
      await request(app)
        .post('/api/auth/login')
        .send({})
        .expect(400);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return current user with valid token', async () => {
      const { token } = await createTestUser();

      const res = await request(app)
        .get('/api/auth/me')
        .set(authHeader(token))
        .expect(200);

      expect(res.body.user).toHaveProperty('nom');
      expect(res.body.user).not.toHaveProperty('motDePasse');
    });

    it('should return 401 without token', async () => {
      await request(app)
        .get('/api/auth/me')
        .expect(401);
    });
  });
});
