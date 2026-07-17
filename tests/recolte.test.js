'use strict';

const request = require('supertest');
const { app, createTestUser, authHeader } = require('./setup');

describe('Recolte Endpoints', () => {
  let token;

  beforeAll(async () => {
    const testUser = await createTestUser();
    token = testUser.token;
  });

  describe('POST /api/recoltes', () => {
    it('should create a recolte', async () => {
      const res = await request(app)
        .post('/api/recoltes')
        .set(authHeader(token))
        .send({ quantiteKg: 100, produit: 'Tomate' })
        .expect(201);

      expect(res.body.recolte).toHaveProperty('id');
      expect(res.body.recolte).toHaveProperty('quantiteKg', 100);
    });

    it('should reject without quantiteKg', async () => {
      await request(app)
        .post('/api/recoltes')
        .set(authHeader(token))
        .send({ produit: 'Tomate' })
        .expect(400);
    });
  });

  describe('GET /api/recoltes', () => {
    it('should list user recoltes', async () => {
      const res = await request(app)
        .get('/api/recoltes')
        .set(authHeader(token))
        .expect(200);

      expect(Array.isArray(res.body.recoltes)).toBe(true);
    });

    it('should filter by statut', async () => {
      const res = await request(app)
        .get('/api/recoltes?statut=en_attente')
        .set(authHeader(token))
        .expect(200);

      if (res.body.recoltes.length > 0) {
        res.body.recoltes.forEach((r) => {
          expect(r.statut).toBe('en_attente');
        });
      }
    });
  });

  describe('GET /api/recoltes/:id', () => {
    it('should get a recolte by id', async () => {
      const createRes = await request(app)
        .post('/api/recoltes')
        .set(authHeader(token))
        .send({ quantiteKg: 50 })
        .expect(201);

      const res = await request(app)
        .get(`/api/recoltes/${createRes.body.recolte.id}`)
        .set(authHeader(token))
        .expect(200);

      expect(res.body.recolte).toHaveProperty('quantiteKg', 50);
    });

    it('should deny access to another user recolte', async () => {
      const other = await createTestUser();
      const createRes = await request(app)
        .post('/api/recoltes')
        .set(authHeader(other.token))
        .send({ quantiteKg: 75 })
        .expect(201);

      await request(app)
        .get(`/api/recoltes/${createRes.body.recolte.id}`)
        .set(authHeader(token))
        .expect(403);
    });
  });

  describe('PUT /api/recoltes/:id', () => {
    it('should update a recolte', async () => {
      const createRes = await request(app)
        .post('/api/recoltes')
        .set(authHeader(token))
        .send({ quantiteKg: 200 })
        .expect(201);

      const res = await request(app)
        .put(`/api/recoltes/${createRes.body.recolte.id}`)
        .set(authHeader(token))
        .send({ quantiteKg: 250, statut: 'disponible' })
        .expect(200);

      expect(res.body.recolte).toHaveProperty('statut', 'disponible');
    });
  });

  describe('DELETE /api/recoltes/:id', () => {
    it('should delete a recolte', async () => {
      const createRes = await request(app)
        .post('/api/recoltes')
        .set(authHeader(token))
        .send({ quantiteKg: 10 })
        .expect(201);

      await request(app)
        .delete(`/api/recoltes/${createRes.body.recolte.id}`)
        .set(authHeader(token))
        .expect(200);
    });
  });
});
