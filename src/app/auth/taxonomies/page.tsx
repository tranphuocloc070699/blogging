'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui';
import { TaxonomyDto } from '@/types/posts';
import taxonomyService from '@/services/modules/taxonomy-service';
import { useClientSession } from '@/hooks/use-client-session';
const pageHeader = {
  title: 'Taxonomies',
  breadcrumb: [
    {
      href: '/',
      name: 'Home',
    },
    {
      name: 'Taxonomies',
    },
  ],
};

export default function TaxonomiesPage() {
  const [taxonomies, setTaxonomies] = useState<TaxonomyDto[]>([]);
  const [loading, setLoading] = useState(true);
  const hasLoaded = useRef(false);

  const session = useClientSession();

  useEffect(() => {
    // Prevent duplicate API calls in development (React Strict Mode)
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    loadTaxonomies();
  }, []);

  const loadTaxonomies = async () => {
    try {
      const { body } = await taxonomyService.getAllTaxonomies();
      setTaxonomies(Array.isArray(body.data) ? body.data : []);
    } catch (error) {
      toast.error('Failed to load taxonomies');
      setTaxonomies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this taxonomy?')) return;

    try {
      await taxonomyService.deleteTaxonomy(session?.accessToken ?? "", id);
      setTaxonomies(prev => prev.filter(t => t.id !== id));
      toast.success('Taxonomy deleted successfully');
    } catch (error) {
      toast.error('Failed to delete taxonomy');
    }
  };

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <Button asChild className="w-full @lg:w-auto">
          <a href="/auth/taxonomies/create">
            <Plus className="w-4 h-4 mr-2" />
            Create Taxonomy
          </a>
        </Button>
      </PageHeader>

      <div className="@container">
        <div className="grid grid-cols-1 gap-6 @4xl:grid-cols-2 @7xl:grid-cols-12 3xl:gap-8">
          <div className="col-span-full">
            <div className="rounded-lg border border-gray-200 bg-white">
              {loading ? (
                <div className="p-6 text-center">Loading taxonomies...</div>
              ) : taxonomies.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No taxonomies found. Create your first taxonomy to get started.
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
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Terms Count
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {taxonomies.map((taxonomy) => (
                        <tr key={taxonomy.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {taxonomy.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {taxonomy.slug}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                            {taxonomy.description || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {taxonomy.termCount || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                              >
                                <a href={`/auth/taxonomies/${taxonomy.id}/edit`}>
                                  <Edit className="w-4 h-4" />
                                </a>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(taxonomy.id)}
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