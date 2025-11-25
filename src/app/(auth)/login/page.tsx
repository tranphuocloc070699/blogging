import { getAuthSession } from '@/action/auth.action';
import AuthWrapper from './auth-wrapper';
import LoginForm from './login-form';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Sign In | Loffy',
  description: 'Sign in to your Loffy account',
};

export default async function LoginPage() {
  const session = await getAuthSession();
  if (session) redirect("/");


  return (
    <AuthWrapper
      title={
        <>
          Welcome Back <br />
        </>
      }
    >
      <LoginForm />
    </AuthWrapper>
  );
}