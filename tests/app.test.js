const request = require('supertest');
const app = require('../src/app');

describe('lab app', () => {
  it('returns health status', async () => {
    const response = await request(app).get('/health');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  it('records admin audit events', async () => {
    const response = await request(app)
      .get('/admin/audit')
      .query({ username: 'guest', action: 'view' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: 'recorded', username: 'guest', action: 'view' });
  });

  it('issues an admin session cookie', async () => {
    const response = await request(app)
      .post('/admin/session')
      .send({ token: 'demo-token' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: 'issued' });
    expect(response.headers['set-cookie']).toEqual(
      expect.arrayContaining([expect.stringContaining('authToken=demo-token')])
    );
  });

  it('returns an admin profile when the caller claims the matching user id', async () => {
    const response = await request(app)
      .get('/admin/profile/alice')
      .set('x-lab-user', 'alice');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ userId: 'alice', access: 'granted' });
  });

  it('writes an admin export to a temp file', async () => {
    const response = await request(app)
      .post('/admin/export')
      .send({ name: 'demo-export', content: 'hello export' });

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('written');
    expect(response.body.exportPath).toContain('demo-export');
  });

  it('accepts a trusted admin host', async () => {
    const response = await request(app)
      .get('/admin/trusted-host')
      .query({ host: 'portal.example.com' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: 'trusted', host: 'portal.example.com' });
  });
});
