import { Suspense } from 'react';
import AuthWrapper from '../login/auth-wrapper';
import SignupForm from './signup-form';

export const metadata = {
  title: 'Sign Up | Loffy',
  description: 'Create your Loffy account',
};

export default function SignupPage() {
  return (
    <Suspense fallback="Loading...">
      <AuthWrapper
        title={
          <>
            Let's Join <br />
          </>
        }
      >
        <SignupForm />
      </AuthWrapper>
    </Suspense>
  );
}
