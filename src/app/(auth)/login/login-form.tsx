"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui";
import Link from "next/link";
import { toast } from "sonner";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { AlertCircle } from "lucide-react";

type LoginFormData = {
  email: string;
  password: string;
};

const schema = yup.object({
  email: yup
    .string()
    .required("Vui lòng nhập email")
    .email("Email không hợp lệ"),
  password: yup
    .string()
    .required("Mật khẩu là bắt buộc")
    .min(3, "Mật khẩu phải có ít nhất 3 ký tự")
});

export default function LoginForm() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  // Watch for input changes to reset login error
  const emailValue = watch("email");
  const passwordValue = watch("password");

  useEffect(() => {
    if (loginError) {
      setLoginError("");
    }
  }, [emailValue, passwordValue]);

  async function onSubmit(data: LoginFormData) {
    try {
      setIsLoading(true);
      setLoginError("");

      const response = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (response?.error) {
        setLoginError("Email or password incorrect. Please try again.");
        return;
      }

      if (response?.ok) {
        toast.success("Login successful");

        // Use window.location for reliable navigation after auth
        const callbackUrl = searchParams.get("callbackUrl") || "/";
        window.location.href = callbackUrl;
      }
    } catch (error) {
      console.log({ error });
      setLoginError("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {loginError && (
        <div className="flex items-center gap-2 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{loginError}</span>
        </div>
      )}

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
        className="h-10 w-full text-sm bg-stone-800 hover:bg-stone-900 text-white font-medium rounded-md transition-colors "
      >
        Sign in
      </Button>

      <div className="text-center text-xs text-stone-500 pt-2">
        New here?{" "}
        <Link
          href="/signup"
          className="text-stone-700 hover:text-stone-900 font-medium transition-colors"
        >
          Create Account
        </Link>
      </div>
    </form>
  );
}
