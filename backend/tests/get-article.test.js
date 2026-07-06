const request = require('supertest');
const app = require('../app');

const connectDB = require("../config/db");

beforeAll(async () => {
    await connectDB();
});

test('GET  /api/articles should return 200', async () =>
{

    const response = await request(app)
    .get('/api/articles')

    expect(response.statusCode).toBe(200);
expect(Array.isArray(response.body.articles)).toBe(true);
})