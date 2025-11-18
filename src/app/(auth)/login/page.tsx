import { Suspense } from 'react';
import AuthWrapper from './auth-wrapper';
import LoginForm from './login-form';

export const metadata = {
  title: 'Sign In | Rainy & Coffee',
  description: 'Sign in to your Rainy & Coffee account',
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