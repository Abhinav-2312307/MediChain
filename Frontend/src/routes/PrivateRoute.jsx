import { Navigate, Outlet, useLocation } from "react-router-dom";

function getStoredToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("token") || localStorage.getItem("medichain_token");
}

export default function PrivateRoute() {
  const location = useLocation();
  const token = getStoredToken();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
