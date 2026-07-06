const request = require('supertest');
const app = require('../app');
const connectDB = require('../config/db');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Credential = require('../models/Credential');
const Article = require('../models/Article');

describe('Article integration: create admin -> login -> post article -> delete article -> cleanup', () => {
  const adminUsername = `admin-${Date.now()}@test.com`;
  const adminPassword = 'AdminPass123!';
  let token;
  let articleId;

  beforeAll(async () => {
    await connectDB();
  });

  afterEach(async () => {
    // Clean up article if it exists
    if (articleId) {
      await Article.findByIdAndDelete(articleId);
    }
    // Clean up admin credential
    await Credential.deleteMany({ username: adminUsername.toLowerCase() });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('create admin, login, post article, verify creation, delete article', async () => {
    // 1. Create temporary admin credential
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    const admin = new Credential({
      username: adminUsername.toLowerCase(),
      passwordHash,
      role: 'admin',
    });
    await admin.save();

    // 2. Login with admin credentials
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: adminUsername, password: adminPassword })
      .expect(200);

    expect(loginRes.body.token).toBeDefined();
    token = loginRes.body.token;

    // 3. Post a new article using the token
    const articleData = {
      title: 'Test Article',
      content: 'This is a test article content with enough words to calculate reading time properly.',
      excerpt: 'Test excerpt',
      tags: ['test', 'integration'],
      status: 'draft',
    };

    const postRes = await request(app)
      .post('/api/articles')
      .set('Authorization', `Bearer ${token}`)
      .send(articleData)
      .expect(201);

    expect(postRes.body._id).toBeDefined();
    expect(postRes.body.title).toBe(articleData.title);
    expect(postRes.body.content).toBe(articleData.content);
    articleId = postRes.body._id;

    // 4. Verify article was created by fetching it
    const fetchRes = await request(app)
      .get(`/api/articles/admin/${articleId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(fetchRes.body._id).toBe(articleId);
    expect(fetchRes.body.title).toBe(articleData.title);

    // 5. Delete the article
    const deleteRes = await request(app)
      .delete(`/api/articles/${articleId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(deleteRes.body.message).toBe('Article deleted');

    // 6. Verify article was deleted
    const notFoundRes = await request(app)
      .get(`/api/articles/admin/${articleId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);

    expect(notFoundRes.body.error).toBe('Article not found');
    articleId = null; // Reset so afterEach doesn't try to clean up
  }, 20000);
});
