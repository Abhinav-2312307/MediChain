import { Navigate, Outlet, useLocation } from "react-router-dom";

import { selectIsAuthenticated } from "../features/auth/authSelectors";
import { useAppSelector } from "../hooks/reduxHooks";

export default function PrivateRoute() {
  const location = useLocation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
