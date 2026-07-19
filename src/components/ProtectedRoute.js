import {
  Navigate,
  useLocation
} from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

function ProtectedRoute({
  children,
  role
}) {

  const {
    isAuthenticated,
    currentUser
  } = useAuth();

  const location =
    useLocation();

  // Chưa đăng nhập
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location
        }}
      />
    );
  }

  // Có yêu cầu role
  if (
    role &&
    currentUser.role !== role
  ) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;