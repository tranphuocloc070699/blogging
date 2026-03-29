"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import Link from "next/link";
import { toast } from "sonner";
import { Mail, CheckCircle } from "lucide-react";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit() {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("/api/users/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSent(true);
      } else {
        toast.error("Failed to send reset email. Please try again.");
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="space-y-4 text-center">
        <div className="flex justify-center">
          <CheckCircle className="h-12 w-12 text-black" />
        </div>
        <p className="text-sm text-stone-600">
          If <span className="font-medium text-stone-800">{email}</span> is
          associated with an account, you'll receive a password reset link
          shortly.
        </p>
        <p className="text-xs text-stone-400">
          Check your spam folder if you don't see it.
        </p>
        <Link
          href="/login"
          className="block text-xs text-stone-500 hover:text-stone-700 transition-colors pt-2"
        >
          ← Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-stone-500 text-center">
        Enter your email and we'll send you a link to reset your password.
      </p>

      <div className="space-y-2">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="w-full h-10 pl-10 pr-3 text-sm bg-stone-50 border border-stone-300 focus:border-stone-500 focus:outline-none rounded-md"
            autoFocus
          />
        </div>

        <Button
          type="button"
          loading={loading}
          onClick={handleSubmit}
          className="h-10 w-full text-sm bg-stone-800 hover:bg-stone-900 text-white font-medium rounded-md transition-colors"
        >
          Send Reset Link
        </Button>
      </div>

      <div className="text-center">
        <Link
          href="/login"
          className="text-xs text-stone-500 hover:text-stone-700 transition-colors"
        >
          ← Back to sign in
        </Link>
      </div>
    </div>
  );
}
