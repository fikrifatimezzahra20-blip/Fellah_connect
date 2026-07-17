'use strict';

const request = require('supertest');
const { app, createTestUser, createAdminUser, authHeader } = require('./setup');

/**
 * End-to-End Flow Test
 *
 * This test validates the complete user journey:
 * 1. Register → Login → Create Parcelle → Create Recolte → Create Offre → Status transitions
 * 2. Error flows: 404, 403, 401
 */
describe('E2E Full Flow', () => {
  let userToken;
  let adminToken;
  let parcelleId;
  let recolteId;
  let marcheId;
  let produitId;
  let offreId;

  it('Step 1: Register a new farmer', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        nom: 'Farmer E2E',
        telephone: `06${Date.now()}`,
        motDePasse: 'e2ePassword',
        region: 'Souss-Massa',
      })
      .expect(201);

    userToken = res.body.token;
    expect(res.body.user.role).toBe('agriculteur');
  });

  it('Step 2: Create an admin user', async () => {
    const admin = await createAdminUser();
    adminToken = admin.token;
  });

  it('Step 3: Admin creates a produit', async () => {
    const res = await request(app)
      .post('/api/produits')
      .set(authHeader(adminToken))
      .send({ nom: `E2E_Tomate_${Date.now()}`, categorie: 'Legume', unite: 'kg' })
      .expect(201);

    produitId = res.body.produit.id;
  });

  it('Step 4: Admin creates a marche', async () => {
    const res = await request(app)
      .post('/api/marches')
      .set(authHeader(adminToken))
      .send({ nom: 'Souk E2E', ville: 'Agadir', region: 'Souss-Massa' })
      .expect(201);

    marcheId = res.body.marche.id;
  });

  it('Step 5: Admin creates a market price', async () => {
    await request(app)
      .post('/api/prix-marches')
      .set(authHeader(adminToken))
      .send({
        produit: 'Tomate',
        marche: 'Souk E2E',
        prix: 9.5,
        dateReleve: '2026-07-17',
        produitId,
        marcheId,
      })
      .expect(201);
  });

  it('Step 6: Farmer creates a parcelle', async () => {
    const res = await request(app)
      .post('/api/parcelles')
      .set(authHeader(userToken))
      .send({ nom: 'Parcelle E2E', superficie: 3.0, commune: 'Ait Melloul' })
      .expect(201);

    parcelleId = res.body.parcelle.id;
  });

  it('Step 7: Farmer creates a recolte', async () => {
    const res = await request(app)
      .post('/api/recoltes')
      .set(authHeader(userToken))
      .send({
        quantiteKg: 500,
        produit: 'Tomate',
        parcelleId,
        produitId,
        prixSouhaite: 8.5,
      })
      .expect(201);

    recolteId = res.body.recolte.id;
    expect(res.body.recolte.statut).toBe('en_attente');
  });

  it('Step 8: Farmer publishes an offre de vente', async () => {
    const res = await request(app)
      .post('/api/offres-vente')
      .set(authHeader(userToken))
      .send({
        quantite: 200,
        prixDemande: 9.0,
        recolteId,
        marcheId,
      })
      .expect(201);

    offreId = res.body.offre.id;
    expect(res.body.offre.statut).toBe('ouverte');
  });

  it('Step 9: Recolte status should transition to disponible', async () => {
    const res = await request(app)
      .get(`/api/recoltes/${recolteId}`)
      .set(authHeader(userToken))
      .expect(200);

    expect(res.body.recolte.statut).toBe('disponible');
  });

  it('Step 10: Accept the offre → recolte becomes vendue', async () => {
    await request(app)
      .put(`/api/offres-vente/${offreId}`)
      .set(authHeader(userToken))
      .send({ statut: 'acceptee' })
      .expect(200);

    const recolteRes = await request(app)
      .get(`/api/recoltes/${recolteId}`)
      .set(authHeader(userToken))
      .expect(200);

    expect(recolteRes.body.recolte.statut).toBe('vendue');
  });

  it('Step 11: Verify 401 — unauthenticated access', async () => {
    await request(app).get('/api/parcelles').expect(401);
    await request(app).get('/api/recoltes').expect(401);
  });

  it('Step 12: Verify 403 — farmer cannot create produit', async () => {
    await request(app)
      .post('/api/produits')
      .set(authHeader(userToken))
      .send({ nom: 'Forbidden', categorie: 'X' })
      .expect(403);
  });

  it('Step 13: Verify 404 — non-existent resource', async () => {
    await request(app)
      .get('/api/parcelles/99999')
      .set(authHeader(userToken))
      .expect(404);
  });

  it('Step 14: Agent chat — requires auth and message', async () => {
    await request(app)
      .post('/api/agent/chat')
      .expect(401);

    const res = await request(app)
      .post('/api/agent/chat')
      .set(authHeader(userToken))
      .send({})
      .expect(400);

    expect(res.body.message).toBeTruthy();
  });

  it('Step 15: Agent memory reset', async () => {
    const res = await request(app)
      .delete('/api/agent/memory')
      .set(authHeader(userToken))
      .expect(200);

    expect(res.body.message).toMatch(/reinitialisee/i);
  });

  it('Step 16: Health check', async () => {
    const res = await request(app)
      .get('/api/health')
      .expect(200);

    expect(res.body.status).toBe('ok');
  });
});
