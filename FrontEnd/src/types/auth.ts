export interface userProfile {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatarURL?: string;
  createdAt: string;
  password?: string;
}

export interface AuthContextType {
  user: any | null;
  loading: boolean;
  signIn: (
    userid: string,
    password: string,
  ) => Promise<{ error: string | null }>;
  signUp: (data: any) => Promise<{ error: string | null }>;
  signOut: () => void;
  resetPassword: (
    userid: string,
    newPassword: string,
    confirmPassword: string,
  ) => Promise<{ error: string | null }>;
  updateProfile: (
    data: Partial<userProfile>,
  ) => Promise<{ error: string | null }>;
}

export interface AuthState {
  token: string | null;
  role: string | null;
  userId: string | null;
  fullName: string | null;
  email: string | null;
  currency: string | null;
  profile: userProfile | null;

  setAuth: (data: {
    authorization: string;
    role: string;
    userName: string;
    userId: string;
    email: string;
    defaultCurrency: string;
  }) => void;
  setProfile: (profile: userProfile) => void;
  logout: () => void;
}
