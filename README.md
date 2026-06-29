# Chronicle Blogging Platform

A full-stack blogging website with admin-only posting capabilities and public reading.

## Features

### Public Features
- 📖 View all published blogs
- 🔍 Search articles
- 🏷️ Filter by tags
- 👁️ View article details with reading time and view count
- 📱 Responsive design

### Admin Features
- 🔐 JWT authentication
- ✍️ Create articles with markdown support
- ✏️ Edit existing articles
- 🗑️ Delete articles
- 📝 Save as draft or publish
- 🖼️ Upload cover image (optional)

### Technical Features
- ✅ Markdown editor
- ✅ Automatic reading time calculation
- ✅ Dynamic tags system
- ✅ Publish date tracking
- ✅ View count tracking

## Tech Stack

### Frontend
- **React** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Markdown** - Markdown rendering

### Backend
- **Express.js** - Web server
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing

## Installation

### Prerequisites
- Node.js (v14+)
- MongoDB (v4.4+)

### Backend Setup

```bash
cd backend
npm install
```

Configure `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/chronicle
JWT_SECRET=your-secret-key-here
ADMIN_EMAIL=admin@chronicle.com
ADMIN_PASSWORD_HASH=$2a$10$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5E8e6X8Xzc29q
```

Start the server:
```bash
npm run dev  # Development with nodemon
npm start   # Production
```

### Frontend Setup

```bash
cd frontend
npm install
```

Configure `.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm start
```

The app will open at http://localhost:3000

## Demo Credentials

- **Email:** admin@chronicle.com
- **Password:** admin123

## API Endpoints

### Public Endpoints
- `GET /api/articles` - Get all published articles
- `GET /api/articles/:slug` - Get single article by slug
- `GET /api/articles/tags` - Get all tags

### Admin Endpoints (Protected)
- `POST /api/articles` - Create article
- `PUT /api/articles/:id` - Update article
- `DELETE /api/articles/:id` - Delete article
- `GET /api/articles/admin/all` - Get all articles (published + draft)
- `GET /api/articles/admin/:id` - Get article for editing
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify token

## Project Structure

```
Chronicle/
├── backend/
│   ├── models/
│   │   └── Article.js
│   ├── controllers/
│   │   ├── articleController.js
│   │   └── authController.js
│   ├── routes/
│   │   ├── articles.js
│   │   └── auth.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   └── ArticleCard.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Article.js
│   │   │   ├── Login.js
│   │   │   ├── AdminDashboard.js
│   │   │   └── CreateEditArticle.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── utils/
│   │   │   └── helpers.js
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── .env
└── README.md
```

## Usage

### Creating an Article
1. Login at `/login` with demo credentials
2. Click "Create New Article"
3. Fill in title, content (markdown), and optional fields
4. Save as draft or publish immediately

### Publishing an Article
1. Go to Admin Dashboard
2. Find the article in draft status
3. Click Edit
4. Change status to "Published"
5. Save

### Reading Articles
1. Visit the home page
2. Browse all published articles
3. Use search to find articles by title or content
4. Filter by tags
5. Click to read full article

## Markdown Support

All standard Markdown features are supported:
- Headers (# ## ### etc.)
- Bold and italic (**bold**, *italic*)
- Links [text](url)
- Lists (- bullet points, 1. numbered lists)
- Code blocks (\`\`\`language ... \`\`\`)
- Blockquotes (> quote)
- Images ![alt](url)

## License

MIT
