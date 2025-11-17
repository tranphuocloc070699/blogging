import PageHeader from '@/components/page-header';
import UserForm from '@/components/users/user-form';

const pageHeader = {
  title: 'Create User',
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
      name: 'Create',
    },
  ],
};

export default function CreateUserPage() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <UserForm mode="create" />
    </>
  );
}
