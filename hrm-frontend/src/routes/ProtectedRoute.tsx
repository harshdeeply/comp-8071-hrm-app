import { JSX } from "react";
import { useAuth } from "../auth/AuthProvider";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
  roles: string[];
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(user.role)) {
    return <div>Unauthorized</div>;
  }

  return children;
}
