import { getAuthSession } from '@/action/auth.action';
import AuthWrapper from '../login/auth-wrapper';
import SignupForm from './signup-form';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Sign Up | Loffy',
  description: 'Create your Loffy account',
};

export default async function SignupPage() {
  const session = await getAuthSession();
  if (session) redirect("/");


  return (
    <AuthWrapper
      title={
        <>
          Let's Join <br />
        </>
      }
    >
      <SignupForm />
    </AuthWrapper>
  );
}
