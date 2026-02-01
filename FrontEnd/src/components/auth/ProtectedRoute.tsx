import { useEffect, useMemo } from "react";
import { Navigate } from "react-router-dom";
import { tokenExpired, useAuth, useAuthStore } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { loading } = useAuth();
  const token = useAuthStore((state) => state.token);
  const userId = useAuthStore((state) => state.userId);
  const logout = useAuthStore((state) => state.logout);

  //Calculate logic inside the render
  const isInvalid = useMemo(() => {
    return tokenExpired(token) || !userId;
  }, [token, userId]);

  useEffect(() => {
    // Only trigger if loading is finished AND it's actually invalid
    if (!loading && isInvalid) {
      logout();
    }
  }, [loading, isInvalid, logout]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If invalid, redirect to auth.
  // The logout logic is now safely handled by the useEffect above.
  if (isInvalid) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}
