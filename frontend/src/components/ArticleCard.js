import { Link } from 'react-router-dom';
import { formatDate } from '../utils/helpers';

function ArticleCard({ article }) {
  return (
    <div className="article-card">
      {article.coverImage && (
        <div className="article-card-image">
          <img src={article.coverImage} alt={article.title} />
        </div>
      )}
      
      <div className="article-card-content">
        <div className="article-card-header">
          <Link to={`/article/${article.slug}`} className="article-card-title">
            {article.title}
          </Link>
          {article.status && (
            <span className={`article-card-status ${article.status}`}>
              {article.status}
            </span>
          )}
        </div>
        
        <div className="article-card-meta">
          <span>📅 {formatDate(article.publishedAt || article.createdAt)}</span>
          <span>⏱️ {article.readingTime} min read</span>
          <span>👁️ {article.viewCount} views</span>
        </div>
        
        {article.excerpt && (
          <div className="article-card-excerpt">
            {article.excerpt}
          </div>
        )}
        
        <div className="article-card-footer">
          <div className="article-card-tags">
            {article.tags && article.tags.map((tag) => (
              <Link 
                key={tag} 
                to={`/?tag=${tag}`} 
                className="article-card-tag"
                onClick={(e) => e.stopPropagation()}
              >
                #{tag}
              </Link>
            ))}
          </div>
          <Link to={`/article/${article.slug}`} className="article-card-readmore">
            Read more
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ArticleCard;
