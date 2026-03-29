"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui";
import Link from "next/link";
import { toast } from "sonner";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { AlertCircle, Eye, EyeOff, Mail } from "lucide-react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

type SignupFormData = {
  username: string;
  email: string;
  password: string;
};

const schema = yup.object({
  username: yup
    .string()
    .required("Please enter your username")
    .min(3, "Username must contain at least 3 characters")
    .max(30, "Username must be less than 20 characters"),
  email: yup
    .string()
    .required("Please enter your email")
    .email("Please enter a valid email"),
  password: yup
    .string()
    .required("Please enter your password")
    .min(3, "Password must contain at least 3 characters"),
});

export default function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [signupError, setSignupError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showMagicLinkInput, setShowMagicLinkInput] = useState(false);
  const [magicLinkEmail, setMagicLinkEmail] = useState("");
  const [magicLinkLoading, setMagicLinkLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignupFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  // Watch for input changes to reset signup error
  const usernameValue = watch("username");
  const emailValue = watch("email");
  const passwordValue = watch("password");

  useEffect(() => {
    if (signupError) {
      setSignupError("");
    }
  }, [usernameValue, emailValue, passwordValue]);

  async function handleMagicLink() {
    if (!magicLinkEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(magicLinkEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }
    try {
      setMagicLinkLoading(true);
      const response = await signIn("nodemailer", {
        email: magicLinkEmail,
        callbackUrl: searchParams.get("callbackUrl") || "/",
        redirect: false,
      });
      if (response?.error) {
        toast.error("Failed to send magic link. Please try again.");
      } else {
        toast.success("Magic link sent! Check your email inbox.");
        setShowMagicLinkInput(false);
        setMagicLinkEmail("");
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setMagicLinkLoading(false);
    }
  }

  async function onSubmit(data: SignupFormData) {
    try {
      setIsLoading(true);
      setSignupError(""); // Clear any previous errors

      // Call the signup API
      const response = await fetch("/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setSignupError(
          result.message || "Failed to create account. Please try again.",
        );
        return;
      }

      // Account created successfully, now sign in
      toast.success("Account created successfully!");

      // Automatically sign in the user
      const signInResponse = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInResponse?.ok) {
        // Use window.location for reliable navigation after auth
        window.location.href = "/";
      } else {
        // If auto sign-in fails, redirect to login page
        router.push("/login");
      }
    } catch (error) {
      console.log({ error });
      setSignupError("An error occurred during signup. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Social Login Buttons */}
      <button
        type="button"
        onClick={() => signIn("google", { callbackUrl: "/" })}
        className="flex items-center justify-center gap-3 w-full h-11 rounded-full border border-stone-200 bg-white hover:bg-stone-50 text-sm font-medium text-stone-700 transition-colors cursor-pointer"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Continue with Google
      </button>

      <button
        type="button"
        onClick={() => setShowMagicLinkInput((prev) => !prev)}
        className="flex items-center justify-center gap-3 w-full h-11 rounded-full border border-stone-200 bg-white hover:bg-stone-50 text-sm font-medium text-stone-700 transition-colors cursor-pointer"
      >
        <Mail className="h-5 w-5 text-stone-500" />
        Continue with Email Magic Link
      </button>

      {showMagicLinkInput && (
        <div className="space-y-2">
          <input
            type="email"
            placeholder="Enter your email"
            value={magicLinkEmail}
            onChange={(e) => setMagicLinkEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleMagicLink()}
            className="w-full h-10 px-3 text-sm bg-stone-50 border border-stone-300 focus:border-stone-500 focus:outline-none rounded-md"
            autoFocus
          />
          <Button
            type="button"
            loading={magicLinkLoading}
            onClick={handleMagicLink}
            className="h-10 w-full text-sm bg-stone-800 hover:bg-stone-900 text-white font-medium rounded-md transition-colors"
          >
            Send Magic Link
          </Button>
          <button
            type="button"
            onClick={() => { setShowMagicLinkInput(false); setMagicLinkEmail(""); }}
            className="w-full text-xs text-stone-500 hover:text-stone-700 transition-colors pt-1"
          >
            ← Back to create account with password
          </button>
        </div>
      )}

      {!showMagicLinkInput && (
        <>
          {/* Separator */}
          <div className="relative flex items-center gap-3 py-1">
            <div className="flex-1 h-px bg-stone-200" />
            <span className="text-xs text-stone-400 shrink-0">or create account with password</span>
            <div className="flex-1 h-px bg-stone-200" />
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {signupError && (
              <div className="flex items-center gap-2 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{signupError}</span>
              </div>
            )}

            <div>
              <Input
                type="text"
                placeholder="Username"
                className="h-10 text-sm bg-stone-50 border-stone-300 focus:border-stone-500 focus:ring-stone-500 rounded-md"
                error={errors.username?.message}
                {...register("username")}
              />
            </div>

            <div>
              <Input
                type="email"
                placeholder="Email Address"
                className="h-10 text-sm bg-stone-50 border-stone-300 focus:border-stone-500 focus:ring-stone-500 rounded-md"
                error={errors.email?.message}
                {...register("email")}
              />
            </div>

            <div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="h-10 text-sm bg-stone-50 border-stone-300 focus:border-stone-500 focus:ring-stone-500 rounded-md pr-10"
                  error={errors.password?.message}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-[20px] -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              loading={isLoading}
              className="h-10 w-full text-sm bg-stone-800 hover:bg-stone-900 text-white font-medium rounded-md transition-colors"
            >
              Create Account
            </Button>

            <div className="text-center text-xs text-stone-500 pt-1">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-stone-700 hover:text-stone-900 font-medium transition-colors"
              >
                Sign in
              </Link>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
