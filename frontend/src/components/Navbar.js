import { Link, useNavigate } from 'react-router-dom';
import { FiHome, FiUser, FiLogOut, FiPlus, FiGrid } from 'react-icons/fi';
import { authService } from '../services/api';
import './Navbar.css';

function Navbar({ isAuthenticated, setIsAuthenticated }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Chronicle
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              <FiHome />
              <span className="nav-text">Home</span>
            </Link>
          </li>
          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <Link to="/admin" className="nav-link">
                  <FiGrid />
                  <span className="nav-text">Dashboard</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/create" className="nav-link">
                  <FiPlus />
                  <span className="nav-text">Create</span>
                </Link>
              </li>
              <li className="nav-item">
                <button onClick={handleLogout} className="nav-link logout-btn">
                  <FiLogOut />
                  <span className="nav-text">Logout</span>
                </button>
              </li>
            </>
          ) : (
            <li className="nav-item">
              <Link to="/login" className="nav-link">
                <FiUser />
                <span className="nav-text">Admin</span>
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
