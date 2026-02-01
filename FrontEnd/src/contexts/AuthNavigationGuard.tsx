import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { tokenExpired, useAuthStore } from "./AuthContext";
import { api } from "@/components/api/api";

export function AuthNavigationGuard() {
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      if (!tokenExpired(token)) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } else {
        navigate("/auth", { replace: true });
      }
    }
  }, [token]);

  return null;
}
