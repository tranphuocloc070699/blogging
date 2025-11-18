import { Suspense } from 'react';
import AuthWrapper from './auth-wrapper';
import LoginForm from './login-form';

export const metadata = {
  title: 'Sign In | Loffy',
  description: 'Sign in to your Loffy account',
};

export default function LoginPage() {
  return (
    <Suspense fallback={"Loading..."}>
      <AuthWrapper
        title={
          <>
            Welcome Back <br />
          </>
        }
      >
        <LoginForm />
      </AuthWrapper>
    </Suspense>
  );
}