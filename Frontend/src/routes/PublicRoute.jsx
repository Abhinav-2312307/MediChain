import { Navigate, Outlet } from "react-router-dom";

import { selectIsAuthenticated } from "../features/auth/authSelectors";
import { useAppSelector } from "../hooks/reduxHooks";

export default function PublicRoute() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/patient" replace />;
  }

  return <Outlet />;
}
