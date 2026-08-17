import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { articleService } from '../services/api';
import ArticleCard from '../components/ArticleCard';
import './Home.css';

function Home() {
  const [articles, setArticles] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedTag = searchParams.get('tag') || '';

  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      const res = await articleService.getAllArticles(page, 10, search, selectedTag);
      setArticles(res.data.articles);
      setTotalPages(res.data.pagination.pages);
      setError('');
    } catch (err) {
      setError('Failed to fetch articles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search, selectedTag]);

  const fetchTags = useCallback(async () => {
    try {
      const res = await articleService.getAllTags();
      setTags(res.data);
    } catch (err) {
      console.error('Failed to fetch tags:', err);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
    fetchTags();
  }, [fetchArticles, fetchTags]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const handleTagClick = (tag) => {
    setSearchParams(tag ? { tag } : {});
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearch('');
    setSearchParams({});
    setPage(1);
  };

  return (
    <div className="home">
      <header className="home-header">
        <h1>Chronicle</h1>
        <p>A minimal, modern publishing platform</p>
      </header>

      <div className="home-container">
        <div className="search-section">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              Search
            </button>
          </form>
        </div>

        {(search || selectedTag) && (
          <div className="filter-info">
            {search && <span>Search: &quot;{search}&quot;</span>}
            {selectedTag && <span>Tag: #{selectedTag}</span>}
            <button onClick={handleClearFilters} className="clear-btn">
              Clear filters
            </button>
          </div>
        )}

        <div className="tags-section">
          <h3>Filter by tag:</h3>
          <div className="tags-list">
            {tags.map((item) => (
              <button
                key={item._id}
                className={`tag-btn ${selectedTag === item._id ? 'active' : ''}`}
                onClick={() => handleTagClick(item._id)}
              >
                #{item._id} ({item.count})
              </button>
            ))}
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading articles...</div>
        ) : articles.length === 0 ? (
          <div className="no-articles">
            <p>No articles found. Check back soon!</p>
          </div>
        ) : (
          <>
            <div className="articles-list">
              {articles.map((article) => (
                <ArticleCard key={article._id} article={article} />
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
    </div>
  );
}

export default Home;
