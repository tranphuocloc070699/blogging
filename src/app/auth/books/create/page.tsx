import PageHeader from '@/components/page-header';
import BookForm from '@/components/books/book-form';

const pageHeader = {
  title: 'Create Book',
  breadcrumb: [
    {
      href: '/',
      name: 'Home',
    },
    {
      href: '/auth/books',
      name: 'Books',
    },
    {
      name: 'Create',
    },
  ],
};

export default function CreateBookPage() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <BookForm mode="create" />
    </>
  );
}
