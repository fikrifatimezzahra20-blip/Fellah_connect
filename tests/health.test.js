'use strict';

const request = require('supertest');
const app = require('../server');

describe('GET /api/health', () => {
  it('should return status ok', async () => {
    const res = await request(app)
      .get('/api/health')
      .expect(200);

    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('service', 'fellahconnect-api');
  });
});

describe('404 handler', () => {
  it('should return 404 for unknown routes', async () => {
    const res = await request(app)
      .get('/api/nonexistent-route')
      .expect(404);

    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toMatch(/Route non trouvee/);
  });
});
