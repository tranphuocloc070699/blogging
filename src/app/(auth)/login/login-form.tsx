"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui";
import { useAuth } from "@/contexts/auth-context";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

const initialValues: LoginFormData = {
  email: "",
  password: "",
  rememberMe: true,
};
export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: initialValues,
  });

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setIsSubmitting(true);
    try {
      const { success, user: loggedInUser } = await login(data.email, data.password);
      if (success && loggedInUser) {
        // Get callback URL from query params
        const callbackUrl = searchParams.get('callbackUrl');

        // Determine redirect based on role and callbackUrl
        if (callbackUrl) {
          // If there's a callback URL, use it
          router.push(callbackUrl);
        } else {
          // Otherwise, redirect based on role
          if (loggedInUser.role === 'ADMIN') {
            router.push('/auth');
          } else {
            router.push('/');
          }
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input
          type="email"
          placeholder="Email Address"
          className="h-10 text-sm bg-stone-50 border-stone-300 focus:border-stone-500 focus:ring-stone-500 rounded-md"
          {...register("email")}
          error={errors.email?.message}
        />
      </div>

      <div>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="h-10 text-sm bg-stone-50 border-stone-300 focus:border-stone-500 focus:ring-stone-500 pr-10 rounded-md"
            {...register("password")}
            error={errors.password?.message}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        loading={isSubmitting}
        className="h-10 w-full text-sm bg-stone-800 hover:bg-stone-900 text-white font-medium rounded-md transition-colors"
      >
        Sign in
      </Button>

      <div className="text-center text-xs text-stone-500 pt-2">
        New here?{" "}
        <Link href="/signup" className="text-stone-700 hover:text-stone-900 font-medium transition-colors">
          Create Account
        </Link>
      </div>
    </form>
  );
}
