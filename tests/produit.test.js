'use strict';

const request = require('supertest');
const { app, createTestUser, createAdminUser, authHeader } = require('./setup');

describe('Produit Endpoints', () => {
  let adminToken;
  let userToken;

  beforeAll(async () => {
    const admin = await createAdminUser();
    adminToken = admin.token;
    const user = await createTestUser();
    userToken = user.token;
  });

  describe('POST /api/produits (admin only)', () => {
    it('should allow admin to create a produit', async () => {
      const res = await request(app)
        .post('/api/produits')
        .set(authHeader(adminToken))
        .send({ nom: `Tomate_${Date.now()}`, categorie: 'Legume' })
        .expect(201);

      expect(res.body.produit).toHaveProperty('nom');
      expect(res.body.produit).toHaveProperty('categorie', 'Legume');
    });

    it('should deny non-admin users', async () => {
      await request(app)
        .post('/api/produits')
        .set(authHeader(userToken))
        .send({ nom: 'Carotte', categorie: 'Legume' })
        .expect(403);
    });
  });

  describe('GET /api/produits', () => {
    it('should list produits for any authenticated user', async () => {
      const res = await request(app)
        .get('/api/produits')
        .set(authHeader(userToken))
        .expect(200);

      expect(Array.isArray(res.body.produits)).toBe(true);
    });
  });

  describe('GET /api/produits/:id', () => {
    it('should get a produit by id', async () => {
      const createRes = await request(app)
        .post('/api/produits')
        .set(authHeader(adminToken))
        .send({ nom: `ProduitFind_${Date.now()}`, categorie: 'Fruit' })
        .expect(201);

      const res = await request(app)
        .get(`/api/produits/${createRes.body.produit.id}`)
        .set(authHeader(userToken))
        .expect(200);

      expect(res.body.produit).toHaveProperty('categorie', 'Fruit');
    });
  });

  describe('PUT /api/produits/:id (admin only)', () => {
    it('should allow admin to update', async () => {
      const createRes = await request(app)
        .post('/api/produits')
        .set(authHeader(adminToken))
        .send({ nom: `UpdateMe_${Date.now()}`, categorie: 'Legume' })
        .expect(201);

      const res = await request(app)
        .put(`/api/produits/${createRes.body.produit.id}`)
        .set(authHeader(adminToken))
        .send({ categorie: 'Cereal' })
        .expect(200);

      expect(res.body.produit).toHaveProperty('categorie', 'Cereal');
    });
  });

  describe('DELETE /api/produits/:id (admin only)', () => {
    it('should allow admin to delete', async () => {
      const createRes = await request(app)
        .post('/api/produits')
        .set(authHeader(adminToken))
        .send({ nom: `DeleteMe_${Date.now()}`, categorie: 'Legume' })
        .expect(201);

      await request(app)
        .delete(`/api/produits/${createRes.body.produit.id}`)
        .set(authHeader(adminToken))
        .expect(200);
    });

    it('should deny non-admin from deleting', async () => {
      const createRes = await request(app)
        .post('/api/produits')
        .set(authHeader(adminToken))
        .send({ nom: `NoDel_${Date.now()}`, categorie: 'Legume' })
        .expect(201);

      await request(app)
        .delete(`/api/produits/${createRes.body.produit.id}`)
        .set(authHeader(userToken))
        .expect(403);
    });
  });
});
