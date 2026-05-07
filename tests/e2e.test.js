const request = require('supertest');
const app = require('../index.js');

describe('API end-to-end flows', () => {
  test('registers a new user', async () => {
    const response = await request(app)
      .post('/api/user/register')
      .send({ username: 'alice', password: 'password123' });

    expect(response.body).toEqual(
      expect.objectContaining({ success: true, message: 'User registered successfully' })
    );
  });

  test('rejects duplicate registrations', async () => {
    await request(app)
      .post('/api/user/register')
      .send({ username: 'bob', password: 'password123' });

    const response = await request(app)
      .post('/api/user/register')
      .send({ username: 'bob', password: 'password123' });

    expect(response.body).toEqual(
      expect.objectContaining({ success: false, message: 'Username already exists' })
    );
  });

  test('rejects invalid login credentials', async () => {
    await request(app)
      .post('/api/user/register')
      .send({ username: 'charlie', password: 'password123' });

    const response = await request(app)
      .post('/api/user/login')
      .send({ username: 'charlie', password: 'wrong-password' });

    expect(response.body).toEqual(
      expect.objectContaining({ success: false, message: 'Invalid username or password' })
    );
  });

  test('logs in successfully and sets session cookies', async () => {
    await request(app)
      .post('/api/user/register')
      .send({ username: 'dana', password: 'password123' });

    const response = await request(app)
      .post('/api/user/login')
      .send({ username: 'dana', password: 'password123' });

    expect(response.body).toEqual(
      expect.objectContaining({ success: true, message: 'Login successful' })
    );
    expect(response.headers['set-cookie']).toEqual(
      expect.arrayContaining([
        expect.stringContaining('session_id='),
        expect.stringContaining('clientside_tier='),
        expect.stringContaining('clientside_username=')
      ])
    );
  });

  test('rejects order creation without a session', async () => {
    const response = await request(app)
      .post('/api/user/create_order')
      .send({ cart: [{ id: 1, quantity: 2 }] });

    expect(response.body).toEqual(
      expect.objectContaining({ success: false, message: 'Invalid session' })
    );
  });

  test('creates an order for an authenticated user', async () => {
    const agent = request.agent(app);

    await agent
      .post('/api/user/register')
      .send({ username: 'erin', password: 'password123' });

    await agent
      .post('/api/user/login')
      .send({ username: 'erin', password: 'password123' });

    const response = await agent
      .post('/api/user/create_order')
      .send({ cart: [{ id: 1, quantity: 2 }] });

    expect(response.body.success).toBe(true);
    expect(response.body.message).toMatch(/order saved/i);
  });
});
