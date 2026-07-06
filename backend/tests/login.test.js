const request = require('supertest');
const app = require('../app');
const connectDB = require('../config/db');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Credential = require('../models/Credential');

describe('Auth integration: create -> login -> delete', () => {
    const username = `testuser-${Date.now()}@example.com`;
    const password = 'TestPass123!';

    beforeAll(async () => {
        await connectDB();
    });
    afterEach(async () => {
        await Credential.deleteMany({ username: username.toLowerCase() });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    test('create credential, login, then ensure token returned', async () => {
        const passwordHash = await bcrypt.hash(password, 10);
        const cred = new Credential({ username: username.toLowerCase(), passwordHash, role: 'admin' });
        await cred.save();

        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: username, password })
            .expect(200);

        expect(res.body.token).toBeDefined();
        expect(res.body.user).toBeDefined();
    }, 20000);
});