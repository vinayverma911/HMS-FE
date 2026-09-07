import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function ProtectedRoute({ allowedRoles }) {

  const token = localStorage.getItem("accessToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const decoded = jwtDecode(token);
  
  if (allowedRoles && !allowedRoles.includes(decoded.role)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;