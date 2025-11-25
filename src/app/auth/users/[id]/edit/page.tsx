'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import PageHeader from '@/components/page-header';
import UserForm from '@/components/users/user-form';
import { User } from '@/types/users';
import userService from '@/services/modules/user-service';
import { useClientSession } from '@/hooks/use-client-session';
const pageHeader = {
  title: 'Edit User',
  breadcrumb: [
    {
      href: '/',
      name: 'Home',
    },
    {
      href: '/auth/users',
      name: 'Users',
    },
    {
      name: 'Edit',
    },
  ],
};

export default function EditUserPage() {
  const params = useParams();
  const [user, setUser] = useState<(User & { postCount?: number }) | null>(null);
  const [loading, setLoading] = useState(true);
  const session = useClientSession()

  useEffect(() => {
    const loadUser = async () => {

      try {
        const id = parseInt(params["id"] as string);
        const { body } = await userService.getUserById(session?.accessToken ?? "", id);
        setUser(body.data);
      } catch (error) {
        toast.error('Failed to load user');
      } finally {
        setLoading(false);
      }
    };

    if (params["id"] && session?.accessToken) {
      loadUser();
    }
  }, [params["id"], session]);

  if (loading) {
    return (
      <>
        <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
        <div className="@container">
          <div className="p-6 text-center">Loading user...</div>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
        <div className="@container">
          <div className="p-6 text-center text-red-600">User not found</div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <UserForm mode="edit" user={user} />
    </>
  );
}
