const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const auth = require('../middleware/auth');

// Public routes
router.get('/', articleController.getAllArticles);
router.get('/tags', articleController.getAllTags);

// Admin routes (protected) must come before the slug route
router.get('/admin/all', auth, articleController.getAdminArticles);
router.get('/admin/:id', auth, articleController.getArticleForEdit);
router.post('/', auth, articleController.createArticle);
router.put('/:id', auth, articleController.updateArticle);
router.delete('/:id', auth, articleController.deleteArticle);

// Public article route must be last so it doesn't swallow /admin/* routes
router.get('/:slug', articleController.getArticleBySlug);

module.exports = router;
