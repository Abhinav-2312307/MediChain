import { Navigate, Outlet } from "react-router-dom";

function getStoredToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("token") || localStorage.getItem("medichain_token");
}

export default function PublicRoute() {
  const token = getStoredToken();

  if (token) {
    return <Navigate to="/patient" replace />;
  }

  return <Outlet />;
}
