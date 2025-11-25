'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import PageHeader from '@/components/page-header';
import BookForm from '@/components/books/book-form';
import { BookDto } from '@/types/books';
import bookService from '@/services/modules/book-service';
const pageHeader = {
  title: 'Edit Book',
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
      name: 'Edit',
    },
  ],
};

export default function EditBookPage() {
  const params = useParams();
  const [book, setBook] = useState<BookDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBook = async () => {
      try {
        const id = parseInt(params["id"] as string);
        const { body } = await bookService.getBookById(id);
        setBook(body.data);
      } catch (error) {
        toast.error('Failed to load book');
      } finally {
        setLoading(false);
      }
    };

    if (params["id"]) {
      loadBook();
    }
  }, [params["id"]]);

  if (loading) {
    return (
      <>
        <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
        <div className="@container">
          <div className="p-6 text-center">Loading book...</div>
        </div>
      </>
    );
  }

  if (!book) {
    return (
      <>
        <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
        <div className="@container">
          <div className="p-6 text-center text-red-600">Book not found</div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <BookForm mode="edit" book={book} />
    </>
  );
}
