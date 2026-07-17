'use strict';

const request = require('supertest');
const { app, createAdminUser, createTestUser, authHeader } = require('./setup');

describe('PrixMarche Endpoints', () => {
  let adminToken;
  let userToken;

  beforeAll(async () => {
    const admin = await createAdminUser();
    adminToken = admin.token;
    const user = await createTestUser();
    userToken = user.token;
  });

  describe('POST /api/prix-marches (admin only)', () => {
    it('should allow admin to create a prix marche', async () => {
      const res = await request(app)
        .post('/api/prix-marches')
        .set(authHeader(adminToken))
        .send({
          produit: 'Tomate',
          marche: 'Souk Central',
          prix: 8.5,
          dateReleve: '2026-07-17',
        })
        .expect(201);

      expect(res.body.prixMarche).toHaveProperty('prix', 8.5);
    });

    it('should deny non-admin', async () => {
      await request(app)
        .post('/api/prix-marches')
        .set(authHeader(userToken))
        .send({ produit: 'X', marche: 'Y', prix: 1, dateReleve: '2026-01-01' })
        .expect(403);
    });
  });

  describe('GET /api/prix-marches', () => {
    it('should list prix marches', async () => {
      const res = await request(app)
        .get('/api/prix-marches')
        .set(authHeader(userToken))
        .expect(200);

      expect(Array.isArray(res.body.prixMarches)).toBe(true);
    });
  });

  describe('GET /api/prix-marches/meilleur/:nomProduit', () => {
    it('should find the best price for a product', async () => {
      // Seed two prices
      const uniqueProduct = `BestPriceTest_${Date.now()}`;
      await request(app)
        .post('/api/prix-marches')
        .set(authHeader(adminToken))
        .send({ produit: uniqueProduct, marche: 'Marche A', prix: 5, dateReleve: '2026-07-01' })
        .expect(201);

      await request(app)
        .post('/api/prix-marches')
        .set(authHeader(adminToken))
        .send({ produit: uniqueProduct, marche: 'Marche B', prix: 12, dateReleve: '2026-07-01' })
        .expect(201);

      const res = await request(app)
        .get(`/api/prix-marches/meilleur/${uniqueProduct}`)
        .set(authHeader(userToken))
        .expect(200);

      expect(res.body.trouve).toBe(true);
      expect(res.body.meilleurPrix.prix).toBe(12);
    });

    it('should return 404 for unknown product', async () => {
      await request(app)
        .get('/api/prix-marches/meilleur/ProduitInexistant999')
        .set(authHeader(userToken))
        .expect(404);
    });
  });

  describe('DELETE /api/prix-marches/:id (admin only)', () => {
    it('should allow admin to delete', async () => {
      const createRes = await request(app)
        .post('/api/prix-marches')
        .set(authHeader(adminToken))
        .send({ produit: 'DelTest', marche: 'DelMarche', prix: 1, dateReleve: '2026-01-01' })
        .expect(201);

      await request(app)
        .delete(`/api/prix-marches/${createRes.body.prixMarche.id}`)
        .set(authHeader(adminToken))
        .expect(200);
    });
  });
});
