'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui';
import { BookDto } from '@/types/books';
import bookService from '@/services/modules/book-service';
const pageHeader = {
  title: 'Books',
  breadcrumb: [
    {
      href: '/',
      name: 'Home',
    },
    {
      name: 'Books',
    },
  ],
};

export default function BooksPage() {
  const [books, setBooks] = useState<BookDto[]>([]);
  const [loading, setLoading] = useState(true);
  const hasLoaded = useRef(false);

  useEffect(() => {
    // Prevent duplicate API calls in development (React Strict Mode)
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const { body } = await bookService.getAllBooks();
      setBooks(Array.isArray(body.data) ? body.data : []);
    } catch (error) {
      toast.error('Failed to load books');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this book?')) return;

    try {
      await bookService.deleteBook(id);
      setBooks(prev => prev.filter(b => b.id !== id));
      toast.success('Book deleted successfully');
    } catch (error) {
      toast.error('Failed to delete book');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <Button asChild className="w-full @lg:w-auto">
          <a href="/auth/books/create">
            <Plus className="w-4 h-4 mr-2" />
            Create Book
          </a>
        </Button>
      </PageHeader>

      <div className="@container">
        <div className="grid grid-cols-1 gap-6 @4xl:grid-cols-2 @7xl:grid-cols-12 3xl:gap-8">
          <div className="col-span-full">
            <div className="rounded-lg border border-gray-200 bg-white">
              {loading ? (
                <div className="p-6 text-center">Loading books...</div>
              ) : books.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No books found. Create your first book to get started.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Book Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Author
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Publish Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quotes
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {books.map((book) => (
                        <tr key={book.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            <div className="flex items-center space-x-3">
                              {book.thumbnail && (
                                <img
                                  src={book.thumbnail}
                                  alt={book.name}
                                  className="w-10 h-14 object-cover rounded"
                                />
                              )}
                              <span>{truncateText(book.name, 50)}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {book.author}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(book.publishDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {book.quotes?.length || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                              >
                                <a href={`/auth/books/${book.id}/edit`}>
                                  <Edit className="w-4 h-4" />
                                </a>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(book.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}