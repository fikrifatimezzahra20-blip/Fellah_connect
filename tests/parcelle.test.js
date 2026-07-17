'use strict';

const request = require('supertest');
const { app, createTestUser, authHeader } = require('./setup');

describe('Parcelle Endpoints', () => {
  let token;

  beforeAll(async () => {
    const testUser = await createTestUser();
    token = testUser.token;
  });

  describe('POST /api/parcelles', () => {
    it('should create a parcelle', async () => {
      const res = await request(app)
        .post('/api/parcelles')
        .set(authHeader(token))
        .send({ nom: 'Parcelle A', superficie: 2.5, commune: 'Ait Melloul' })
        .expect(201);

      expect(res.body.parcelle).toHaveProperty('id');
      expect(res.body.parcelle).toHaveProperty('nom', 'Parcelle A');
    });

    it('should reject missing fields', async () => {
      await request(app)
        .post('/api/parcelles')
        .set(authHeader(token))
        .send({ nom: 'Incomplete' })
        .expect(400);
    });

    it('should reject without auth', async () => {
      await request(app)
        .post('/api/parcelles')
        .send({ nom: 'No Auth', superficie: 1, commune: 'Test' })
        .expect(401);
    });
  });

  describe('GET /api/parcelles', () => {
    it('should list user parcelles', async () => {
      const res = await request(app)
        .get('/api/parcelles')
        .set(authHeader(token))
        .expect(200);

      expect(res.body).toHaveProperty('parcelles');
      expect(Array.isArray(res.body.parcelles)).toBe(true);
    });
  });

  describe('GET /api/parcelles/:id', () => {
    it('should get a specific parcelle', async () => {
      const createRes = await request(app)
        .post('/api/parcelles')
        .set(authHeader(token))
        .send({ nom: 'FindMe', superficie: 1.0, commune: 'Tiznit' })
        .expect(201);

      const id = createRes.body.parcelle.id;

      const res = await request(app)
        .get(`/api/parcelles/${id}`)
        .set(authHeader(token))
        .expect(200);

      expect(res.body.parcelle).toHaveProperty('nom', 'FindMe');
    });

    it('should return 404 for non-existent parcelle', async () => {
      await request(app)
        .get('/api/parcelles/99999')
        .set(authHeader(token))
        .expect(404);
    });

    it('should deny access to another user parcelle', async () => {
      const otherUser = await createTestUser();
      const createRes = await request(app)
        .post('/api/parcelles')
        .set(authHeader(otherUser.token))
        .send({ nom: 'Other', superficie: 1, commune: 'Other' })
        .expect(201);

      await request(app)
        .get(`/api/parcelles/${createRes.body.parcelle.id}`)
        .set(authHeader(token))
        .expect(403);
    });
  });

  describe('PUT /api/parcelles/:id', () => {
    it('should update a parcelle', async () => {
      const createRes = await request(app)
        .post('/api/parcelles')
        .set(authHeader(token))
        .send({ nom: 'ToUpdate', superficie: 1, commune: 'OldCommune' })
        .expect(201);

      const res = await request(app)
        .put(`/api/parcelles/${createRes.body.parcelle.id}`)
        .set(authHeader(token))
        .send({ commune: 'NewCommune' })
        .expect(200);

      expect(res.body.parcelle).toHaveProperty('commune', 'NewCommune');
    });
  });

  describe('DELETE /api/parcelles/:id', () => {
    it('should delete a parcelle', async () => {
      const createRes = await request(app)
        .post('/api/parcelles')
        .set(authHeader(token))
        .send({ nom: 'ToDelete', superficie: 1, commune: 'Temp' })
        .expect(201);

      await request(app)
        .delete(`/api/parcelles/${createRes.body.parcelle.id}`)
        .set(authHeader(token))
        .expect(200);
    });
  });
});
