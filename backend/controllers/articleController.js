const Article = require('../models/Article');
const MarkdownIt = require('markdown-it');

const md = new MarkdownIt();

// Get all published articles (public)
exports.getAllArticles = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', tag = '' } = req.query;
    const skip = (page - 1) * limit;

    const query = { status: 'published' };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    if (tag) {
      query.tags = { $in: [tag.toLowerCase()] };
    }

    const total = await Article.countDocuments(query);

    const articles = await Article.find(query)
      .select('title slug excerpt coverImage tags publishedAt readingTime viewCount')
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      articles,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single article by slug (public)
exports.getArticleBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const article = await Article.findOne({
      slug,
      status: 'published',
    });

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    article.viewCount += 1;
    await article.save();

    res.json({
      ...article.toObject(),
      contentHtml: md.render(article.content),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all tags (public)
exports.getAllTags = async (req, res) => {
  try {
    const tags = await Article.aggregate([
      { $match: { status: 'published' } },
      { $unwind: '$tags' },
      {
        $group: {
          _id: '$tags',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create article (admin only)
exports.createArticle = async (req, res) => {
  try {
    const {
      title,
      content,
      excerpt,
      tags,
      coverImage,
      status = 'draft',
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        error: 'Title and content are required',
      });
    }

    const article = new Article({
      title,
      content,
      excerpt: excerpt || content.substring(0, 500),
      tags: tags || [],
      coverImage,
      status,
      publishedAt: status === 'published' ? new Date() : undefined,
    });

    await article.save();

    res.status(201).json(article);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update article (admin only)
exports.updateArticle = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      content,
      excerpt,
      tags,
      coverImage,
      status,
    } = req.body;

    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({
        error: 'Article not found',
      });
    }

    article.title = title;
    article.content = content;
    article.excerpt = excerpt || content.substring(0, 500);
    article.tags = tags || [];
    article.coverImage = coverImage;
    article.status = status;

    // Set publish date only the first time it's published
    if (status === 'published' && !article.publishedAt) {
      article.publishedAt = new Date();
    }

    await article.save();

    res.json(article);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete article (admin only)
exports.deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await Article.findByIdAndDelete(id);

    if (!article) {
      return res.status(404).json({
        error: 'Article not found',
      });
    }

    res.json({
      message: 'Article deleted',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all articles including drafts (admin only)
exports.getAdminArticles = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const total = await Article.countDocuments();

    const articles = await Article.find()
      .select(
        'title slug status publishedAt readingTime viewCount updatedAt'
      )
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      articles,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single article for editing (admin only)
exports.getArticleForEdit = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({
        error: 'Article not found',
      });
    }

    res.json(article);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};