'use strict';

const request = require('supertest');
const { app, createTestUser, authHeader } = require('./setup');

describe('Agent Endpoints', () => {
  let token;

  beforeAll(async () => {
    const testUser = await createTestUser();
    token = testUser.token;
  });

  describe('POST /api/agent/chat', () => {
    it('should reject without auth', async () => {
      await request(app)
        .post('/api/agent/chat')
        .send({ message: 'Bonjour' })
        .expect(401);
    });

    it('should reject empty message', async () => {
      await request(app)
        .post('/api/agent/chat')
        .set(authHeader(token))
        .send({})
        .expect(400);
    });

    it('should reject blank message', async () => {
      await request(app)
        .post('/api/agent/chat')
        .set(authHeader(token))
        .send({ message: '   ' })
        .expect(400);
    });

    // Note: Full agent chat tests require a running DeepSeek API.
    // This test is skipped in CI environments without the API key.
    it.skip('should return a reply for valid message (requires DeepSeek API)', async () => {
      const res = await request(app)
        .post('/api/agent/chat')
        .set(authHeader(token))
        .send({ message: 'Quelles sont mes recoltes ?' })
        .expect(200);

      expect(res.body).toHaveProperty('reply');
      expect(typeof res.body.reply).toBe('string');
    });
  });

  describe('DELETE /api/agent/memory', () => {
    it('should reject without auth', async () => {
      await request(app)
        .delete('/api/agent/memory')
        .expect(401);
    });

    it('should reset memory successfully', async () => {
      const res = await request(app)
        .delete('/api/agent/memory')
        .set(authHeader(token))
        .expect(200);

      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toMatch(/reinitialisee/i);
    });
  });
});
