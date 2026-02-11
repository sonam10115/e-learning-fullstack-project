import { Navigate, useLocation } from "react-router-dom";
import { Fragment } from "react";

function RouteGuard({ authenticated, user, element }) {
  const location = useLocation();

  console.log(authenticated, user, "useruser");

  if (!authenticated && !location.pathname.includes("/auth")) {
    return <Navigate to="/auth" />;
  }

  if (authenticated) {
    // Role-based redirects
    if (user?.role === "instructor") {
      if (!location.pathname.includes("instructor")) {
        return <Navigate to="/instructor" />;
      }
    } else if (user?.role === "admin") {
      if (!location.pathname.includes("admin")) {
        return <Navigate to="/admin" />;
      }
    } else if (user?.role === "student" || user?.role === "user") {
      if (
        location.pathname.includes("instructor") ||
        location.pathname.includes("admin")
      ) {
        return <Navigate to="/home" />;
      }
    }

    // Prevent authenticated users from accessing auth pages
    if (location.pathname.includes("/auth")) {
      if (user?.role === "instructor") {
        return <Navigate to="/instructor" />;
      } else if (user?.role === "admin") {
        return <Navigate to="/admin" />;
      } else {
        return <Navigate to="/home" />;
      }
    }
  }

  return <Fragment>{element}</Fragment>;
}

export default RouteGuard;
