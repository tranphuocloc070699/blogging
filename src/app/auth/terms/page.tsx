'use client';

import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui';
import { TermDto } from '@/types/posts';
import { Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import termService from '@/services/modules/term-service';
import { useClientSession } from '@/hooks/use-client-session';
const pageHeader = {
  title: 'Terms',
  breadcrumb: [
    {
      href: '/',
      name: 'Home',
    },
    {
      name: 'Terms',
    },
  ],
};

export default function TermsPage() {
  const [terms, setTerms] = useState<TermDto[]>([]);
  const [loading, setLoading] = useState(true);
  const session = useClientSession();
  useEffect(() => {
    loadTerms();
  }, []);

  const loadTerms = async () => {
    try {
      const { body } = await termService.getAllTerms();
      setTerms(Array.isArray(body.data) ? body.data : []);
    } catch (error) {
      console.error('Failed to load terms:', error);
      toast.error('Failed to load terms');
      setTerms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this term?')) return;

    try {
      await termService.deleteTerm(session?.accessToken ?? "", id);
      setTerms(prev => prev.filter(t => t.id !== id));
      toast.success('Term deleted successfully');
    } catch (error) {
      toast.error('Failed to delete term');
    }
  };

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        {/*<Button asChild className="w-full @lg:w-auto">*/}
        {/*  <Link href="/terms/create">*/}
        {/*    <Plus className="w-4 h-4 mr-2"/>*/}
        {/*    Create Term*/}
        {/*  </Link>*/}
        {/*</Button>*/}
      </PageHeader>

      <div className="@container">
        <div className="grid grid-cols-1 gap-6 @4xl:grid-cols-2 @7xl:grid-cols-12 3xl:gap-8">
          <div className="col-span-full">
            <div className="rounded-lg border border-gray-200 bg-white">
              {loading ? (
                <div className="p-6 text-center">Loading terms...</div>
              ) : terms.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No terms found. Create your first term to get started.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Slug
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Taxonomy
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Posts Count
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {terms.map((term) => (
                        <tr key={term.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {term.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {term.slug}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {term.taxonomy.name}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                            {term.description || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {term.postCount || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                              >
                                <Link href={`/auth/terms/${term.id}/edit`}>
                                  <Edit className="w-4 h-4" />
                                </Link>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(term.id)}
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