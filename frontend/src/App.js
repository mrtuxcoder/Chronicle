import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from './services/api';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Article from './pages/Article';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import CreateEditArticle from './pages/CreateEditArticle';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          await authService.verifyToken();
          setIsAuthenticated(true);
        } catch {
          authService.logout();
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div className="loader">Loading...</div>;
  }

  return (
    <Router>
      <div className="app">
        <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/article/:slug" element={<Article />} />
            <Route
              path="/login"
              element={isAuthenticated ? <Navigate to="/admin" /> : <Login setIsAuthenticated={setIsAuthenticated} />}
            />
            <Route
              path="/admin"
              element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" />}
            />
            <Route
              path="/admin/create"
              element={isAuthenticated ? <CreateEditArticle /> : <Navigate to="/login" />}
            />
            <Route
              path="/admin/edit/:id"
              element={isAuthenticated ? <CreateEditArticle /> : <Navigate to="/login" />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
