#!/usr/bin/env node
// Usage: node createCredential.js <username> <password> [role]
const connectDB = require('../config/db');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Credential = require('../models/Credential');

async function run() {
  const [,, username, password, role = 'admin'] = process.argv;

  if (!username || !password) {
    console.error('Usage: node createCredential.js <username> <password> [role]');
    process.exit(1);
  }

  try {
    await connectDB();

    const existing = await Credential.findOne({ username: username.toLowerCase() });
    if (existing) {
      console.error('A credential with that username already exists');
      process.exit(1);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const cred = new Credential({ username: username.toLowerCase(), passwordHash, role });
    await cred.save();

    console.log('Credential created:', cred.username);
    process.exit(0);
  } catch (err) {
    console.error('Error creating credential:', err.message);
    process.exit(1);
  }
}

run();
