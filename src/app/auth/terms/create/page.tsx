import PageHeader from '@/components/page-header';
import TermForm from '@/components/terms/term-form';

const pageHeader = {
  title: 'Create Term',
  breadcrumb: [
    {
      href: '/',
      name: 'Home',
    },
    {
      href: '/auth/terms',
      name: 'Terms',
    },
    {
      name: 'Create',
    },
  ],
};

export default function CreateTermPage() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <TermForm mode="create" />
    </>
  );
}