import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import {
  Wallet,
  Mail,
  Lock,
  User,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  userid: z.string().trim().min(1, { message: "User ID is required" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

const signupSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, { message: "Name must be at least 2 characters" }),
    userid: z
      .string()
      .trim()
      .min(2, { message: "User ID must be at least 2 characters" }),
    email: z
      .string()
      .trim()
      .email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const forgotPasswordSchema = z.object({
  userid: z
    .string()
    .trim()
    .min(2, { message: "User ID must be at least 2 characters" }),
});

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type AuthView = "login" | "signup" | "forgot-password" | "reset-password";

export default function Auth() {
  const navigate = useNavigate();
  const { signIn, signUp, resetPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [authView, setAuthView] = useState<AuthView>("login");
  const [resetUserid, setResetUserid] = useState("");

  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});
  const [signupErrors, setSignupErrors] = useState<Record<string, string>>({});
  const [forgotErrors, setForgotErrors] = useState<Record<string, string>>({});

  const [resetErrors, setResetErrors] = useState<Record<string, string>>({});

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] =
    useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const LoginForm = useForm({
    resolver: zodResolver(loginSchema),
  });

  const SignupForm = useForm({
    resolver: zodResolver(signupSchema),
  });

  const forgotForm = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const resetForm = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginErrors({});

    const result = loginSchema.safeParse({
      userid: LoginForm.getValues("userid"),
      password: LoginForm.getValues("password"),
    });

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) errors[err.path[0] as string] = err.message;
      });
      setLoginErrors(errors);
      return;
    }

    setIsLoading(true);
    const { error } = await signIn(
      LoginForm.getValues("userid"),
      LoginForm.getValues("password"),
    );
    setIsLoading(false);

    if (error) {
      toast.error(error);
      return;
    }

    toast.success("Welcome back!");
    navigate("/");
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupErrors({});

    const result = signupSchema.safeParse({
      fullName: SignupForm.getValues("fullName"),
      userid: SignupForm.getValues("userid"),
      email: SignupForm.getValues("email"),
      password: SignupForm.getValues("password"),
      confirmPassword: SignupForm.getValues("confirmPassword"),
    });

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) errors[err.path[0] as string] = err.message;
      });
      setSignupErrors(errors);
      return;
    }

    setIsLoading(true);
    const { error } = await signUp(
      SignupForm.getValues(["email", "password", "fullName", "userid"]),
    );
    setIsLoading(false);

    if (error) {
      toast.error(error);
      return;
    }

    toast.success("Account created successfully!");
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotErrors({});

    const result = forgotPasswordSchema.safeParse({
      userid: forgotForm.getValues("userid"),
    });

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) errors[err.path[0] as string] = err.message;
      });
      setForgotErrors(errors);
      return;
    }

    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);

    setResetUserid(forgotForm.getValues("userid"));
    setAuthView("reset-password");
    toast.success(
      "For demo purposes, you can now reset your password directly.",
    );
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetErrors({});

    const result = resetPasswordSchema.safeParse({
      password: resetForm.getValues("password"),
      confirmPassword: resetForm.getValues("confirmPassword"),
    });

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) errors[err.path[0] as string] = err.message;
      });
      setResetErrors(errors);
      return;
    }

    setIsLoading(true);
    const { error } = await resetPassword(
      resetUserid,
      resetForm.getValues("password"),
      resetForm.getValues("confirmPassword"),
    );
    setIsLoading(false);

    if (error) {
      toast.error(error);
      return;
    }

    toast.success("Password reset successfully! Please sign in.");
    setAuthView("login");
    setActiveTab("login");
    resetForm.reset();
    forgotForm.reset();
  };

  const getHeaderContent = () => {
    switch (authView) {
      case "forgot-password":
        return {
          title: "Forgot Password",
          description: "Enter your email to reset your password",
        };
      case "reset-password":
        return {
          title: "Reset Password",
          description: "Enter your new password",
        };
      default:
        return {
          title: activeTab === "login" ? "Welcome back" : "Create an account",
          description:
            activeTab === "login"
              ? "Enter your credentials to access your account"
              : "Fill in your details to get started",
        };
    }
  };

  const headerContent = getHeaderContent();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground mb-4">
            <Wallet className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Sampada</h1>
          <p className="text-muted-foreground text-sm">
            Smart Expense Tracking
          </p>
        </div>

        <Card className="border-border/50 shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center">
              {headerContent.title}
            </CardTitle>
            <CardDescription className="text-center">
              {headerContent.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {authView === "forgot-password" && (
              <div className="space-y-4">
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="forgot-email">User ID</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="forgot-userid"
                        type="text"
                        className="pl-10"
                        {...forgotForm.register("userid")}
                      />
                    </div>
                    {forgotErrors.userid && (
                      <p className="text-sm text-destructive">
                        {forgotErrors.userid}
                      </p>
                    )}
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <ArrowRight className="h-4 w-4 mr-2" />
                    )}
                    Send Request
                  </Button>
                </form>

                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => setAuthView("login")}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Button>
              </div>
            )}

            {authView === "reset-password" && (
              <div className="space-y-4">
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="new-password"
                        type={showNewPassword ? "text" : "password"}
                        className="pl-10 pr-10"
                        {...resetForm.register("password")}
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {resetErrors.password && (
                      <p className="text-sm text-destructive">
                        {resetErrors.password}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-new-password">
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirm-new-password"
                        type={showConfirmNewPassword ? "text" : "password"}
                        className="pl-10 pr-10"
                        {...resetForm.register("confirmPassword")}
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() =>
                          setShowConfirmNewPassword(!showConfirmNewPassword)
                        }
                      >
                        {showConfirmNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {resetErrors.confirmPassword && (
                      <p className="text-sm text-destructive">
                        {resetErrors.confirmPassword}
                      </p>
                    )}
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <ArrowRight className="h-4 w-4 mr-2" />
                    )}
                    Reset Password
                  </Button>
                </form>

                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    setAuthView("login");
                    forgotForm.reset();
                  }}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Button>
              </div>
            )}

            {(authView === "login" || authView === "signup") && (
              <Tabs
                value={activeTab}
                onValueChange={(val) => {
                  setActiveTab(val);
                  setAuthView(val as AuthView);
                }}
              >
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-4">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-userid">User ID</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-userid"
                          type="text"
                          className="pl-10"
                          {...LoginForm.register("userid")}
                        />
                      </div>
                      {loginErrors.userid && (
                        <p className="text-sm text-destructive">
                          {loginErrors.userid}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <div className="flex items-end justify-end">
                        <button
                          type="button"
                          tabIndex={-1}
                          className="text-sm text-primary hover:underline"
                          onClick={() => setAuthView("forgot-password")}
                        >
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-password"
                          type={showLoginPassword ? "text" : "password"}
                          className="pl-10 pr-10"
                          {...LoginForm.register("password")}
                        />
                        <button
                          type="button"
                          tabIndex={-1}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          onClick={() =>
                            setShowLoginPassword(!showLoginPassword)
                          }
                        >
                          {showLoginPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {loginErrors.password && (
                        <p className="text-sm text-destructive">
                          {loginErrors.password}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <ArrowRight className="h-4 w-4 mr-2" />
                      )}
                      Sign In
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="space-y-4">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-name"
                          type="text"
                          className="pl-10"
                          {...SignupForm.register("fullName")}
                        />
                      </div>
                      {signupErrors.fullName && (
                        <p className="text-sm text-destructive">
                          {signupErrors.fullName}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-userid">User ID</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-userid"
                          type="text"
                          className="pl-10"
                          {...SignupForm.register("userid")}
                        />
                      </div>
                      {signupErrors.userid && (
                        <p className="text-sm text-destructive">
                          {signupErrors.userid}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-email"
                          type="email"
                          className="pl-10"
                          {...SignupForm.register("email")}
                        />
                      </div>
                      {signupErrors.email && (
                        <p className="text-sm text-destructive">
                          {signupErrors.email}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-password"
                          type={showSignupPassword ? "text" : "password"}
                          className="pl-10 pr-10"
                          {...SignupForm.register("password")}
                        />
                        <button
                          type="button"
                          tabIndex={-1}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          onClick={() =>
                            setShowSignupPassword(!showSignupPassword)
                          }
                        >
                          {showSignupPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {signupErrors.password && (
                        <p className="text-sm text-destructive">
                          {signupErrors.password}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-confirm"
                          type={showSignupConfirmPassword ? "text" : "password"}
                          className="pl-10 pr-10"
                          {...SignupForm.register("confirmPassword")}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          onClick={() =>
                            setShowSignupConfirmPassword(
                              !showSignupConfirmPassword,
                            )
                          }
                        >
                          {showSignupConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {signupErrors.confirmPassword && (
                        <p className="text-sm text-destructive">
                          {signupErrors.confirmPassword}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <ArrowRight className="h-4 w-4 mr-2" />
                      )}
                      Create Account
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
