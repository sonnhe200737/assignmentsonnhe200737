import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function AdminRoute({ children }) {
  const { currentUser } = useAuth();

  // Chưa đăng nhập
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  // Không phải admin
  if (currentUser.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;