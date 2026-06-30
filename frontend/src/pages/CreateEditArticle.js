import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { articleService } from '../services/api';
import { formatDate } from '../utils/helpers';
import './CreateEditArticle.css';

function CreateEditArticle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    tags: '',
    coverImage: '',
    status: 'draft',
  });

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);

  const fetchArticle = useCallback(async () => {
    try {
      setLoading(true);
      const res = await articleService.getArticleForEdit(id);
      setFormData({
        title: res.data.title,
        content: res.data.content,
        excerpt: res.data.excerpt,
        tags: res.data.tags.join(', '),
        coverImage: res.data.coverImage || '',
        status: res.data.status,
      });
      setError('');
    } catch (err) {
      setError('Failed to load article');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (isEdit) {
      fetchArticle();
    }
  }, [fetchArticle, isEdit]);

  useEffect(() => {
    const words = formData.content.trim().split(/\s+/).filter(Boolean).length;
    setWordCount(words);
    setReadingTime(words === 0 ? 0 : Math.ceil(words / 200));
  }, [formData.content]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Title and content are required');
      return;
    }

    try {
      setSaving(true);
      setError('');

      const data = {
        ...formData,
        tags: formData.tags
          .split(',')
          .map((t) => t.trim().toLowerCase())
          .filter((t) => t),
        excerpt: formData.excerpt || formData.content.substring(0, 500),
      };

      if (isEdit) {
        await articleService.updateArticle(id, data);
      } else {
        await articleService.createArticle(data);
      }

      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save article');
    } finally {
      setSaving(false);
    }
  };

  // Format content for preview - simple markdown to HTML conversion
  const formatPreviewContent = (content) => {
    if (!content) return '';
    
    // Split by new lines
    const lines = content.split('\n');
    let html = '';
    let inList = false;
    
    lines.forEach((line) => {
      const trimmedLine = line.trim();
      
      // Headers
      if (trimmedLine.startsWith('# ')) {
        html += `<h1>${trimmedLine.substring(2)}</h1>`;
      } else if (trimmedLine.startsWith('## ')) {
        html += `<h2>${trimmedLine.substring(3)}</h2>`;
      } else if (trimmedLine.startsWith('### ')) {
        html += `<h3>${trimmedLine.substring(4)}</h3>`;
      }
      // Bold
      else if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
        html += `<p><strong>${trimmedLine.substring(2, trimmedLine.length - 2)}</strong></p>`;
      }
      // Italic
      else if (trimmedLine.startsWith('*') && trimmedLine.endsWith('*') && !trimmedLine.startsWith('**')) {
        html += `<p><em>${trimmedLine.substring(1, trimmedLine.length - 1)}</em></p>`;
      }
      // List items
      else if (trimmedLine.startsWith('- ')) {
        if (!inList) {
          html += '<ul>';
          inList = true;
        }
        html += `<li>${trimmedLine.substring(2)}</li>`;
      }
      // Empty line
      else if (trimmedLine === '') {
        if (inList) {
          html += '</ul>';
          inList = false;
        }
        html += '<br/>';
      }
      // Regular paragraph
      else {
        if (inList) {
          html += '</ul>';
          inList = false;
        }
        html += `<p>${trimmedLine}</p>`;
      }
    });
    
    if (inList) {
      html += '</ul>';
    }
    
    return html;
  };

  if (loading) {
    return <div className="loading">Loading article...</div>;
  }

  return (
    <div className="create-edit-article">
      <header className="editor-header">
        <h1>{isEdit ? 'Edit Article' : 'Create New Article'}</h1>
        <button
          type="button"
          className="preview-toggle"
          onClick={() => setPreview(!preview)}
        >
          {preview ? '✏️ Edit' : '👁️ Preview'}
        </button>
      </header>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className={preview ? 'preview-mode' : ''}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Article title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="coverImage">Cover Image URL</label>
            <input
              type="url"
              id="coverImage"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags (comma-separated)</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g., javascript, web, tutorial"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="excerpt">Excerpt (optional)</label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            placeholder="Brief description of the article"
            rows="3"
          />
        </div>

        <div className="form-group">
          <div className="content-header">
            <label htmlFor="content">Content * (Markdown supported)</label>
            <div className="content-stats">
              <span>📊 {wordCount} words</span>
              <span>⏱️ {readingTime} min read</span>
            </div>
          </div>
          <div className="editor-container">
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your article in Markdown..."
              required
              className={preview ? 'hidden' : ''}
            />
            {preview && (
              <div className="preview-content">
                {formData.coverImage && (
                  <div className="preview-image">
                    <img src={formData.coverImage} alt={formData.title || 'Cover image'} />
                  </div>
                )}
                <h2>{formData.title || 'Untitled Article'}</h2>
                <div className="preview-meta">
                  <span>📅 {formatDate(new Date())}</span>
                  <span>⏱️ {readingTime} min read</span>
                  <span className={`preview-status ${formData.status}`}>
                    {formData.status}
                  </span>
                </div>
                {formData.excerpt && (
                  <div className="preview-excerpt">
                    {formData.excerpt}
                  </div>
                )}
                <div 
                  className="markdown-preview"
                  dangerouslySetInnerHTML={{ 
                    __html: formatPreviewContent(formData.content) 
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="editor-footer">
          <button type="submit" className="save-btn" disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Update Article' : 'Create Article'}
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate('/admin')}
            disabled={saving}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateEditArticle;
