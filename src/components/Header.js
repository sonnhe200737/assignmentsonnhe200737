import {
  Link,
  NavLink,
  useNavigate
} from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

function Header() {
  const {
    currentUser,
    logout,
    isAuthenticated
  } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();

    navigate("/", {
      replace: true
    });
  };

  return (
    <header className="main-header">
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container">
          <Link
            className="navbar-brand fw-bold text-primary"
            to="/"
          >
            SkillUp
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNavbar"
            aria-controls="mainNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className="collapse navbar-collapse"
            id="mainNavbar"
          >
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/"
                >
                  Home
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/courses"
                >
                  Courses
                </NavLink>
              </li>
            </ul>

            {!isAuthenticated ? (
              <div className="d-flex gap-2">
                <Link
                  className="btn btn-outline-primary"
                  to="/login"
                >
                  Sign In
                </Link>

                <Link
                  className="btn btn-primary"
                  to="/register"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="dropdown">
                <button
                  className="btn user-menu-button dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <span className="user-avatar">
                    {currentUser.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.fullName}
                      />
                    ) : (
                      currentUser.fullName
                        ?.charAt(0)
                        .toUpperCase()
                    )}
                  </span>

                  <span className="user-menu-info">
                    <strong>
                      {currentUser.fullName}
                    </strong>

                    <small>\
                      {currentUser.role}
                    </small>
                  </span>
                </button>

                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link
                      className="dropdown-item"
                      to="/profile"
                    >
                      <i className="bi bi-person me-2"></i>
                      Profile
                    </Link>
                  </li>

                  {currentUser.role === "student" && (
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/my-learning"
                      >
                        <i className="bi bi-book me-2"></i>
                        My Learning
                      </Link>
                    </li>
                  )}

                  {currentUser.role === "admin" && (
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/admin"
                      >
                        <i className="bi bi-speedometer2 me-2"></i>
                        Admin Dashboard
                      </Link>
                    </li>
                  )}

                  <li>
                    <hr className="dropdown-divider" />
                  </li>

                  <li>
                    <button
                      type="button"
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;