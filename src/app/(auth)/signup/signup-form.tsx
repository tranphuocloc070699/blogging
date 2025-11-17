"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

const initialValues: SignupFormData = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: initialValues,
  });

  const onSubmit: SubmitHandler<SignupFormData> = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Signup failed');
      }

      toast.success('Account created successfully! Please sign in.');
      router.push('/login');
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to create account. Please try again.";
      toast.error(errorMessage);
      console.error("Signup error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input
          type="text"
          placeholder="Username"
          className="h-10 text-sm bg-stone-50 border-stone-300 focus:border-stone-500 focus:ring-stone-500 rounded-md"
          {...register("username")}
          error={errors.username?.message}
        />
      </div>

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

      <div>
        <div className="relative">
          <Input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            className="h-10 text-sm bg-stone-50 border-stone-300 focus:border-stone-500 focus:ring-stone-500 pr-10 rounded-md"
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
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
        Create Account
      </Button>

      <div className="text-center text-xs text-stone-500 pt-2">
        Already have an account?{" "}
        <Link href="/login" className="text-stone-700 hover:text-stone-900 font-medium transition-colors">
          Sign in
        </Link>
      </div>
    </form>
  );
}
