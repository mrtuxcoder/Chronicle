import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { articleService } from '../services/api';
import { formatDate } from '../utils/helpers';
import './Article.css';

function Article() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const res = await articleService.getArticleBySlug(slug);
        setArticle(res.data);
        setError('');
      } catch (err) {
        setError('Article not found');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  if (loading) {
    return <div className="loading">Loading article...</div>;
  }

  if (error || !article) {
    return <div className="error-page">{error}</div>;
  }

  return (
    <article className="article-page">
      <div className="article-crumbs">
        <Link to="/">Chronicle</Link>
        <span>/</span>
        <span>Article</span>
      </div>

      <div className="article-header">
        <div className="article-header-grid">
          <div className="article-title-block">
            <p className="article-kicker">Case study</p>
            <h1>{article.title}</h1>
            {article.excerpt && <p className="article-summary">{article.excerpt}</p>}
          </div>

          <aside className="article-meta-panel">
            <div>
              <span className="meta-label">Published</span>
              <span className="meta-value">{formatDate(article.publishedAt)}</span>
            </div>
            <div>
              <span className="meta-label">Reading time</span>
              <span className="meta-value">{article.readingTime} min</span>
            </div>
            <div>
              <span className="meta-label">Views</span>
              <span className="meta-value">{article.viewCount}</span>
            </div>
          </aside>
        </div>
      </div>

      {article.coverImage && (
        <div className="article-cover-full">
          <img src={article.coverImage} alt={article.title} />
        </div>
      )}

      <div className="article-body">
        <ReactMarkdown className="markdown-content">{article.content}</ReactMarkdown>
      </div>
        <div className="article-footer-grid">
          {article.tags.length > 0 && (
            <div className="article-tags">
              <h3>Tags</h3>
              <div className="tags">
                {article.tags.map((tag) => (
                  <Link key={tag} to={`/?tag=${tag}`} className="tag">
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="article-back">
            <Link to="/">Back to articles</Link>
          </div>
        </div>
    </article>
  );
}

export default Article;
