'use strict';

const request = require('supertest');
const { app, createAdminUser, createTestUser, authHeader } = require('./setup');

describe('Marche Endpoints', () => {
  let adminToken;
  let userToken;

  beforeAll(async () => {
    const admin = await createAdminUser();
    adminToken = admin.token;
    const user = await createTestUser();
    userToken = user.token;
  });

  describe('POST /api/marches (admin only)', () => {
    it('should allow admin to create a marche', async () => {
      const res = await request(app)
        .post('/api/marches')
        .set(authHeader(adminToken))
        .send({ nom: 'Souk Test', ville: 'Agadir', region: 'Souss-Massa' })
        .expect(201);

      expect(res.body.marche).toHaveProperty('nom', 'Souk Test');
    });

    it('should deny non-admin', async () => {
      await request(app)
        .post('/api/marches')
        .set(authHeader(userToken))
        .send({ nom: 'Souk X', ville: 'Casa', region: 'GC' })
        .expect(403);
    });

    it('should reject missing fields', async () => {
      await request(app)
        .post('/api/marches')
        .set(authHeader(adminToken))
        .send({ nom: 'Incomplete' })
        .expect(400);
    });
  });

  describe('GET /api/marches', () => {
    it('should list all marches', async () => {
      const res = await request(app)
        .get('/api/marches')
        .set(authHeader(userToken))
        .expect(200);

      expect(Array.isArray(res.body.marches)).toBe(true);
    });
  });

  describe('GET /api/marches/:id', () => {
    it('should get a marche by id', async () => {
      const createRes = await request(app)
        .post('/api/marches')
        .set(authHeader(adminToken))
        .send({ nom: 'GetMe', ville: 'Rabat', region: 'Rabat-Sale' })
        .expect(201);

      const res = await request(app)
        .get(`/api/marches/${createRes.body.marche.id}`)
        .set(authHeader(userToken))
        .expect(200);

      expect(res.body.marche).toHaveProperty('nom', 'GetMe');
    });
  });

  describe('DELETE /api/marches/:id (admin only)', () => {
    it('should allow admin to delete', async () => {
      const createRes = await request(app)
        .post('/api/marches')
        .set(authHeader(adminToken))
        .send({ nom: 'DelMe', ville: 'Fes', region: 'Fes-Meknes' })
        .expect(201);

      await request(app)
        .delete(`/api/marches/${createRes.body.marche.id}`)
        .set(authHeader(adminToken))
        .expect(200);
    });
  });
});
