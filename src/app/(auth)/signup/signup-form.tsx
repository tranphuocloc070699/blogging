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
import { AlertCircle } from "lucide-react";
import { signIn } from "next-auth/react";

type SignupFormData = {
  username: string;
  email: string;
  password: string;
};

const schema = yup.object({
  username: yup
    .string()
    .required("Vui lòng nhập tên người dùng")
    .min(3, "Tên người dùng phải có ít nhất 3 ký tự"),
  email: yup
    .string()
    .required("Vui lòng nhập email")
    .email("Email không hợp lệ"),
  password: yup
    .string()
    .required("Mật khẩu là bắt buộc")
    .min(3, "Mật khẩu phải có ít nhất 3 ký tự")
});

export default function SignupForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [signupError, setSignupError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<SignupFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      username: "",
      email: "",
      password: ""
    }
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
        setSignupError(result.message || "Failed to create account. Please try again.");
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
        <Input
          type="password"
          placeholder="Password"
          className="h-10 text-sm bg-stone-50 border-stone-300 focus:border-stone-500 focus:ring-stone-500 rounded-md"
          error={errors.password?.message}
          {...register("password")}
        />
      </div>

      <Button
        type="submit"
        loading={isLoading}
        className="h-10 w-full text-sm bg-stone-800 hover:bg-stone-900 text-white font-medium rounded-md transition-colors"
      >
        Create Account
      </Button>

      <div className="text-center text-xs text-stone-500 pt-2">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-stone-700 hover:text-stone-900 font-medium transition-colors"
        >
          Sign in
        </Link>
      </div>
    </form>
  );
}
