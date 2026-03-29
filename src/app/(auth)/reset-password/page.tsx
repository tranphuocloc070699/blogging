import AuthWrapper from "@/app/(auth)/login/auth-wrapper";
import ResetPasswordForm from "./reset-password-form";
import { Suspense } from "react";

export const metadata = {
  title: "Reset Password | Loffy",
  description: "Set a new password for your Loffy account",
};

export default function ResetPasswordPage() {
  return (
    <AuthWrapper title="Reset Password">
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </AuthWrapper>
  );
}
