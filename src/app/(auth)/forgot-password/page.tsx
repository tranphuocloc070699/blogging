import AuthWrapper from "@/app/(auth)/login/auth-wrapper";
import ForgotPasswordForm from "./forgot-password-form";

export const metadata = {
  title: "Forgot Password | Loffy",
  description: "Reset your Loffy account password",
};

export default function ForgotPasswordPage() {
  return (
    <AuthWrapper title="Forgot Password">
      <ForgotPasswordForm />
    </AuthWrapper>
  );
}
