'use strict';

const request = require('supertest');
const { app, createTestUser, createAdminUser, authHeader } = require('./setup');

describe('OffreVente Endpoints', () => {
  let token;
  let adminToken;
  let recolteId;
  let marcheId;

  beforeAll(async () => {
    const testUser = await createTestUser();
    token = testUser.token;

    const admin = await createAdminUser();
    adminToken = admin.token;

    // Create a recolte for the test user
    const recolteRes = await request(app)
      .post('/api/recoltes')
      .set(authHeader(token))
      .send({ quantiteKg: 500, produit: 'Pomme' })
      .expect(201);
    recolteId = recolteRes.body.recolte.id;

    // Create a marche (admin)
    const marcheRes = await request(app)
      .post('/api/marches')
      .set(authHeader(adminToken))
      .send({ nom: 'OffreTestMarche', ville: 'Meknes', region: 'Fes-Meknes' })
      .expect(201);
    marcheId = marcheRes.body.marche.id;
  });

  describe('POST /api/offres-vente', () => {
    it('should create an offre de vente', async () => {
      const res = await request(app)
        .post('/api/offres-vente')
        .set(authHeader(token))
        .send({
          quantite: 200,
          prixDemande: 9.0,
          recolteId,
          marcheId,
        })
        .expect(201);

      expect(res.body.offre).toHaveProperty('id');
      expect(res.body.offre).toHaveProperty('statut', 'ouverte');
    });

    it('should reject missing fields', async () => {
      await request(app)
        .post('/api/offres-vente')
        .set(authHeader(token))
        .send({ quantite: 100 })
        .expect(400);
    });
  });

  describe('GET /api/offres-vente', () => {
    it('should list offres for the user', async () => {
      const res = await request(app)
        .get('/api/offres-vente')
        .set(authHeader(token))
        .expect(200);

      expect(Array.isArray(res.body.offres)).toBe(true);
    });
  });

  describe('PUT /api/offres-vente/:id', () => {
    it('should update an offre status', async () => {
      const createRes = await request(app)
        .post('/api/offres-vente')
        .set(authHeader(token))
        .send({ quantite: 100, prixDemande: 7, recolteId, marcheId })
        .expect(201);

      const res = await request(app)
        .put(`/api/offres-vente/${createRes.body.offre.id}`)
        .set(authHeader(token))
        .send({ statut: 'fermee' })
        .expect(200);

      expect(res.body.offre).toHaveProperty('statut', 'fermee');
    });
  });

  describe('DELETE /api/offres-vente/:id', () => {
    it('should delete an offre', async () => {
      const createRes = await request(app)
        .post('/api/offres-vente')
        .set(authHeader(token))
        .send({ quantite: 50, prixDemande: 6, recolteId, marcheId })
        .expect(201);

      await request(app)
        .delete(`/api/offres-vente/${createRes.body.offre.id}`)
        .set(authHeader(token))
        .expect(200);
    });
  });
});
