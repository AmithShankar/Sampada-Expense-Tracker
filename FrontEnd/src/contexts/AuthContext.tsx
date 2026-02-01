import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  api,
  loginApi,
  registerApi,
  resetApi,
  updateUserApi,
} from "@/components/api/api";
import { useMutation } from "@tanstack/react-query";
import { AuthContextType, AuthState, userProfile } from "@/types/auth";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      role: null,
      userId: null,
      fullName: null,
      email: null,
      currency: null,
      profile: null,

      setAuth: (data) =>
        set({
          token: data.authorization,
          role: data.role,
          fullName: data.userName,
          email: data.email,
          userId: data.userId,
          currency: data.defaultCurrency,
        }),

      setProfile: (profile) => set({ profile }),

      logout: () =>
        set({
          token: null,
          role: null,
          userId: null,
          fullName: null,
          currency: null,
          profile: null,
        }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

export function tokenExpired(token: string) {
  if (token === "mock-offline-token") return false;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp < Date.now() / 1000;
  } catch {
    return true;
  }
}

//For Offline flow
const OFFLINE_USERS_DB = "offline_users_db";

const isNetworkError = (error: any) => {
  return (
    error.code === "ERR_NETWORK" ||
    error.code === "ECONNREFUSED" ||
    error.message?.toLowerCase().includes("network error") ||
    !error.response
  );
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const profile = useAuthStore((state) => state);

  useEffect(() => {
    if (profile.token) {
      if (!tokenExpired(profile.token)) {
        setUser({ role: profile.role, userid: profile.userId });
      }
    }
    setLoading(false);
  }, [profile.token]);

  const { mutateAsync: loginMutation } = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      profile.setAuth(data);
      api.defaults.headers.common["Authorization"] =
        `Bearer ${data.authorization}`;
      setUser({ userid: data.userid });
    },
  });

  const signIn = async (userid: string, password: string) => {
    try {
      await loginMutation({ userid, password });
      return { error: null };
    } catch (error: any) {
      //Offline Flow
      if (isNetworkError(error)) {
        console.warn("API Unreachable. Switching to SessionStorage Fallback.");

        const dbStr = sessionStorage.getItem(OFFLINE_USERS_DB);
        const usersDb = dbStr ? JSON.parse(dbStr) : {};
        const localUser = usersDb[userid];

        if (!localUser) {
          return { error: "No offline account found with this User ID" };
        }

        if (localUser.password !== password) {
          return { error: "Invalid Credentials (Offline Mode)" };
        }

        const mockAuthData = {
          authorization: "mock-offline-token",
          role: localUser.role || "PREMIUM",
          userName: localUser.username,
          email: localUser.email,
          userId: localUser.userid,
          defaultCurrency: "INR",
        };

        profile.setAuth(mockAuthData);
        setUser({ userid: localUser.userid });
        return { error: null };
      }

      return { error: error.response?.data?.errors || "Invalid Credentials" };
    }
  };

  // 2. REGISTER
  const { mutateAsync: registerMutation } = useMutation({
    mutationFn: registerApi,
    onSuccess: (data, variables) => {
      loginMutation({ userid: variables.userid, password: variables.password });
    },
  });

  const signUp = async (data: any) => {
    const [email, password, username, userid] = data;

    try {
      const request = {
        email,
        password,
        username,
        userid,
        role: "PREMIUM",
      };
      await registerMutation(request);
      return { error: null };
    } catch (error: any) {
      //Offline Flow
      if (isNetworkError(error)) {
        console.warn("API Unreachable. Registering in SessionStorage.");

        const dbStr = sessionStorage.getItem(OFFLINE_USERS_DB);
        const usersDb = dbStr ? JSON.parse(dbStr) : {};

        if (usersDb[userid]) {
          return { error: "User ID already exists (Offline Mode)" };
        }

        usersDb[userid] = {
          userid,
          username,
          email,
          password,
          role: "PREMIUM",
        };
        sessionStorage.setItem(OFFLINE_USERS_DB, JSON.stringify(usersDb));

        const mockAuthData = {
          authorization: "mock-offline-token",
          role: "PREMIUM",
          userName: username,
          email: email,
          userId: userid,
          defaultCurrency: "USD",
        };

        profile.setAuth(mockAuthData);
        setUser({ userid: userid });
        return { error: null };
      }

      const message =
        error.response?.data?.errors || error.message || "Registration Failed";
      return { error: message };
    }
  };

  const signOut = () => {
    profile.logout();
    setUser(null);
  };

  // 3. RESET PASSWORD
  const { mutateAsync: resetMutation } = useMutation({
    mutationFn: resetApi,
  });

  const resetPassword = async (
    userid: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<{ error: string | null }> => {
    try {
      await resetMutation({
        userid,
        newPassword,
        confirmPassword,
      });

      return { error: null };
    } catch (error: any) {
      //Offline Flow
      if (isNetworkError(error)) {
        if (newPassword !== confirmPassword) {
          return { error: "Passwords do not match" };
        }

        const dbStr = sessionStorage.getItem(OFFLINE_USERS_DB);
        const usersDb = dbStr ? JSON.parse(dbStr) : {};

        if (!usersDb[userid]) {
          return { error: "User not found (Offline Mode)" };
        }

        usersDb[userid].password = newPassword;
        sessionStorage.setItem(OFFLINE_USERS_DB, JSON.stringify(usersDb));
        return { error: null };
      }

      return {
        error:
          error.response?.data?.errors ||
          error.message ||
          "Password reset failed",
      };
    }
  };

  // 4. UPDATE PROFILE
  const { mutateAsync: updateUserMutation } = useMutation({
    mutationFn: updateUserApi,
  });

  const updateProfile = async (
    data: Partial<userProfile>,
  ): Promise<{ error: string | null }> => {
    const { id, fullName, email, password } = data;

    try {
      await updateUserMutation({
        userid: id,
        fullName,
        email,
        password,
      });
      return { error: null };
    } catch (error: any) {
      if (isNetworkError(error)) {
        // Current logged in user ID
        const currentUserId = profile.userId || id;

        if (!currentUserId) return { error: "No User ID found" };

        const dbStr = sessionStorage.getItem(OFFLINE_USERS_DB);
        const usersDb = dbStr ? JSON.parse(dbStr) : {};

        if (usersDb[currentUserId]) {
          if (fullName) usersDb[currentUserId].username = fullName;
          if (email) usersDb[currentUserId].email = email;
          if (password) usersDb[currentUserId].password = password;

          sessionStorage.setItem(OFFLINE_USERS_DB, JSON.stringify(usersDb));

          const currentData = {
            authorization: profile.token,
            role: profile.role,
            userName: fullName || profile.fullName,
            email: email || profile.email,
            userId: currentUserId,
            defaultCurrency: profile.currency,
          };
          profile.setAuth(currentData as any);

          return { error: null };
        }
      }

      return { error: error.message || "Update failed" };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const useAuth = () => useContext(AuthContext)!;
