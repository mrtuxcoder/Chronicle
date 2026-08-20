# Chronicle Blogging Platform

A full-stack blogging platform with **public reading and admin-only publishing**.

Chronicle allows anyone to read published articles, while only an authenticated administrator can create, edit, publish, and delete content.

## Features

### Public
- Read published articles
- Search articles
- Filter by tags
- View reading time and view count
- Responsive design
- Markdown-rendered content

### Admin
- JWT authentication
- Create, edit, and delete articles
- Save drafts or publish articles
- Markdown editor
- Optional cover images
- Manage published and draft articles

## Tech Stack

**Frontend**
- React
- React Router
- Axios
- React Markdown

**Backend**
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt

## Authentication & Admin Setup

Chronicle uses a single-administrator publishing model.

Create an administrator credential using the provided script:

```bash
node scripts/createCredential.js <username> <password> [role]
```

Example:

```bash
node scripts/createCredential.js admin admin123 admin
```

The script:

1. Connects to MongoDB.
2. Checks whether the username already exists.
3. Hashes the password using bcrypt.
4. Stores the username, password hash, and role in MongoDB.

The password is never stored as plaintext.

The role defaults to `admin` if omitted:

```bash
node scripts/createCredential.js admin admin123
```

There is **no public user registration or public article posting**. Visitors can only read published content.

## Installation

### Backend

```bash
cd backend
npm install
```

Configure the backend `.env` with your database and application settings:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/chronicle
JWT_SECRET=your-secret-key
```

Create an admin credential:

```bash
node scripts/createCredential.js <username> <password>
```

Start the backend:

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
```

Configure:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start:

```bash
npm start
```

## API

### Public

```text
GET /api/articles
GET /api/articles/:slug
GET /api/articles/tags
```

### Protected Admin

```text
POST   /api/auth/login
GET    /api/auth/verify
POST   /api/articles
PUT    /api/articles/:id
DELETE /api/articles/:id
GET    /api/articles/admin/all
GET    /api/articles/admin/:id
```

Protected article-management endpoints require administrator authentication.

## Project Structure

```text
Chronicle/
├── backend/
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── scripts/
│   │   └── createCredential.js
│   ├── server.js
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   └── .env
└── README.md
```

## Usage

### Create an Article

1. Create an administrator credential.
2. Log in through `/login`.
3. Open the Admin Dashboard.
4. Create an article using Markdown.
5. Save it as a draft or publish it.

### Read Articles

Visitors can browse, search, filter, and read published articles without an account.

## Markdown Support

Chronicle supports:

- Headings
- Bold and italic text
- Links
- Lists
- Code blocks
- Blockquotes
- Images

## License

MIT
```