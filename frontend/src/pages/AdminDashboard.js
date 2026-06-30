import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { articleService } from '../services/api';
import { formatDate } from '../utils/helpers';
import './AdminDashboard.css';

function AdminDashboard() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedCard, setExpandedCard] = useState(null);

  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      const res = await articleService.getAdminArticles(page, 10);
      setArticles(res.data.articles);
      setTotalPages(res.data.pagination.pages);
      setError('');
    } catch (err) {
      setError('Failed to fetch articles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this article?')) return;

    try {
      await articleService.deleteArticle(id);
      setArticles(articles.filter((a) => a._id !== id));
    } catch (err) {
      setError('Failed to delete article');
      console.error(err);
    }
  };

  const toggleCard = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <Link to="/admin/create" className="create-btn">
          <FiPlus size={18} />
          Create Article
        </Link>
      </header>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading articles...</div>
      ) : articles.length === 0 ? (
        <div className="no-articles">
          <p>No articles yet. Create your first one!</p>
          <Link to="/admin/create" className="create-btn">
            <FiPlus size={18} />
            Create Article
          </Link>
        </div>
      ) : (
        <>
          <div className="articles-container">
            {articles.map((article) => (
              <div 
                key={article._id} 
                className={`article-card ${expandedCard === article._id ? 'expanded' : ''}`}
              >
                {/* Card Header - Always visible on mobile */}
                <div className="article-card-header" onClick={() => toggleCard(article._id)}>
                  <div className="article-title-row">
                    <div className="article-title-section">
                      <div className="article-title-wrapper">
                        <span className={`status-dot ${article.status}`}></span>
                        <span className="article-title">{article.title}</span>
                      </div>
                    </div>
                    
                    <span className="article-expand-icon">
                      {expandedCard === article._id ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                    </span>
                  </div>
                </div>

                {/* Mobile Actions - Second Row */}
                <div className="article-actions-mobile" onClick={(e) => e.stopPropagation()}>
                  <Link to={`/admin/edit/${article._id}`} className="action-btn-mobile edit">
                    <FiEdit2 size={16} />
                    <span>Edit</span>
                  </Link>
                  <button
                    onClick={(e) => handleDelete(article._id, e)}
                    className="action-btn-mobile delete"
                  >
                    <FiTrash2 size={16} />
                    <span>Delete</span>
                  </button>
                  {article.status === 'published' && (
                    <a href={`/?slug=${article.slug}`} className="action-btn-mobile view" target="_blank" rel="noopener noreferrer">
                      <FiEye size={16} />
                      <span>View</span>
                    </a>
                  )}
                </div>

                {/* Card Details - Expandable */}
                <div className="article-details">
                  <div className="detail-item">
                    <span className="detail-label">Status</span>
                    <span className="detail-value" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className={`status-dot ${article.status}`}></span>
                      {article.status}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Published</span>
                    <span className="detail-value">
                      {article.publishedAt ? formatDate(article.publishedAt) : '-'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Reading Time</span>
                    <span className="detail-value">{article.readingTime} min</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Views</span>
                    <span className="detail-value">{article.viewCount}</span>
                  </div>
                </div>

                {/* Desktop Actions - Right Corner */}
                <div className="article-actions">
                  <Link to={`/admin/edit/${article._id}`} className="action-btn edit">
                    <FiEdit2 size={14} />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(article._id)}
                    className="action-btn delete"
                  >
                    <FiTrash2 size={14} />
                    Delete
                  </button>
                  {article.status === 'published' && (
                    <a href={`/?slug=${article.slug}`} className="action-btn view" target="_blank" rel="noopener noreferrer">
                      <FiEye size={14} />
                      View
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="page-btn"
              >
                ← Previous
              </button>
              <span className="page-info">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="page-btn"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
