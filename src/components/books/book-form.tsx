'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Element } from 'react-scroll';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui/input';
import { BookDto, CreateBookDto, UpdateBookDto } from '@/types/books';
import bookService from '@/services/modules/book-service';
import FormGroup from '@/components/form/form-group';
import NovelEditorWrapper from '@/components/posts/novel-editor-wrapper';
import BookFormNav, { bookFormParts } from './book-form-nav';
import BookThumbnail from './book-thumbnail';
import { Plus, X } from 'lucide-react';

const bookSchema = z.object({
  name: z.string().min(1, 'Book name is required').max(255, 'Book name must be less than 255 characters'),
  author: z.string().min(1, 'Author is required').max(200, 'Author must be less than 200 characters'),
  publishDate: z.string().optional().or(z.literal('')),
  review: z.string().min(1, 'Review is required'),
  thumbnail: z.string().optional().or(z.literal('')),
  quotes: z.array(z.string()).optional(),
});

type BookFormData = z.infer<typeof bookSchema>;

interface BookFormProps {
  book?: BookDto;
  mode: 'create' | 'edit';
}

export default function BookForm({ book, mode }: BookFormProps) {
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState(book?.review || '');
  const [quotes, setQuotes] = useState<string[]>(book?.quotes || []);
  const [newQuote, setNewQuote] = useState('');
  const router = useRouter();
  const methods = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: book ? {
      name: book.name,
      author: book.author,
      publishDate: book.publishDate ? new Date(book.publishDate).toISOString().split('T')[0] : '',
      review: book.review,
      thumbnail: book.thumbnail || '',
      quotes: book.quotes || [],
    } : {
      name: '',
      author: '',
      publishDate: '',
      review: '',
      thumbnail: '',
      quotes: [],
    },
  });

  const addQuote = () => {
    if (newQuote.trim()) {
      setQuotes([...quotes, newQuote.trim()]);
      setNewQuote('');
    }
  };

  const removeQuote = (index: number) => {
    setQuotes(quotes.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: BookFormData) => {
    setLoading(true);
    try {
      const submitData: any = {
        ...data,
        review,
        quotes: quotes.length > 0 ? quotes : undefined,
      };

      // Remove empty optional fields
      if (!submitData.thumbnail) delete submitData.thumbnail;
      if (!submitData.publishDate) delete submitData.publishDate;

      if (mode === 'create') {
        await bookService.createBook(submitData as CreateBookDto);
        toast.success('Book created successfully');
      } else if (book) {
        await bookService.updateBook(book.id, submitData as UpdateBookDto);
        toast.success('Book updated successfully');
      }
      router.push('/auth/books');
    } catch (error) {
      toast.error(`Failed to ${mode} book`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("@container")}>
      <BookFormNav className="bg-white dark:bg-gray-950" />
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="relative z-[19] [&_label.block>span]:font-medium"
        >
          <div className="pt-10 pb-10 mb-10 grid gap-7 divide-y divide-dashed divide-gray-200 @2xl:gap-9 @3xl:gap-11 @2xl:[&>*:not(:first-child)]:pt-9 @2xl:[&>*:not(:last-child)]:pb-9 @3xl:[&>*:not(:first-child)]:pt-11 @3xl:[&>*:not(:last-child)]:pb-11">
            <Element key={bookFormParts.basicInfo} name={bookFormParts.basicInfo}>
              <FormGroup
                title="Book Information"
                description="Enter the book details"
              >
                <div className="col-span-full">
                  <Input
                    label="Book Name"
                    placeholder="Enter book name"
                    {...methods.register('name')}
                    error={methods.formState.errors.name?.message as string}
                    required
                  />
                </div>

                <div className="col-span-full">
                  <Input
                    label="Author"
                    placeholder="Enter author name"
                    {...methods.register('author')}
                    error={methods.formState.errors.author?.message as string}
                    required
                  />
                </div>

                <div className="col-span-full">
                  <Input
                    label="Publish Date"
                    type="date"
                    {...methods.register('publishDate')}
                    error={methods.formState.errors.publishDate?.message as string}
                  />
                </div>
              </FormGroup>
            </Element>

            <Element key={bookFormParts.review} name={bookFormParts.review}>
              <FormGroup
                title="Review"
                description="Write your book review"
                className="pt-7"
              >
                <div className="col-span-full p-6 border border-gray-200">
                  <NovelEditorWrapper
                    value={review}
                    onChange={setReview}
                    className="min-h-[400px] rounded-lg"
                  />
                  {methods.formState.errors.review && (
                    <p className="mt-1 text-xs text-red-600">{methods.formState.errors.review.message as string}</p>
                  )}
                </div>
              </FormGroup>
            </Element>

            <Element key={bookFormParts.quotes} name={bookFormParts.quotes}>
              <FormGroup
                title="Quotes"
                description="Add memorable quotes from the book"
                className="pt-7"
              >
                <div className="col-span-full space-y-4">
                  {quotes.map((quote, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="flex-1 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-700 italic">"{quote}"</p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeQuote(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}

                  <div className="flex items-start space-x-2">
                    <textarea
                      value={newQuote}
                      onChange={(e) => setNewQuote(e.target.value)}
                      placeholder="Enter a quote from the book..."
                      className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      rows={3}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addQuote}
                      disabled={!newQuote.trim()}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              </FormGroup>
            </Element>

            <Element key={bookFormParts.thumbnail} name={bookFormParts.thumbnail}>
              <BookThumbnail className="pt-7" />
            </Element>
          </div>

          {/* Form Footer */}
          <div className="sticky bottom-0 z-10 border-t border-gray-200 bg-white px-4 py-4 dark:bg-gray-950 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {methods.formState.errors && Object.keys(methods.formState.errors).length > 0 && (
                  <p className="text-sm text-red-600">
                    Please fix the errors above before submitting
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/auth/books')}
                  disabled={loading}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={loading}
                  loading={loading}
                >
                  {mode === 'create' ? 'Create Book' : 'Update Book'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
