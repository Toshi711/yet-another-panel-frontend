import { Navigate } from "react-router-dom";
import { UserRoles } from "../types";
import useProfile from "../store/useProfile";
import ErrorBoundary from "./ErrorBoundary";

interface ComponentProps {
  roles: UserRoles[] | null;
  children: React.ReactNode;
}

export const GuardedRoute = ({ roles, children }: ComponentProps) => {
  const user = useProfile((state) => state.user);
  const role = useProfile((state) => state.role);

  if (!user && (!roles || (role && roles.includes(role)))) {
    return <Navigate to="/" replace />;
  }

  return <ErrorBoundary>{children}</ErrorBoundary>;
};
