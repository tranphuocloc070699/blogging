'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import PageHeader from '@/components/page-header';
import TaxonomyForm from '@/components/taxonomies/taxonomy-form';
import { TaxonomyDto } from '@/types/posts';
import taxonomyService from '@/services/modules/taxonomy-service';
const pageHeader = {
  title: 'Edit Taxonomy',
  breadcrumb: [
    {
      href: '/',
      name: 'Home',
    },
    {
      href: '/taxonomies',
      name: 'Taxonomies',
    },
    {
      name: 'Edit',
    },
  ],
};

export default function EditTaxonomyPage() {
  const params = useParams();
  const [taxonomy, setTaxonomy] = useState<TaxonomyDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTaxonomy = async () => {
      try {
        const id = parseInt(params["id"] as string);
        const { body } = await taxonomyService.getTaxonomyById(id);
        setTaxonomy(body.data);
      } catch (error) {
        toast.error('Failed to load taxonomy');
      } finally {
        setLoading(false);
      }
    };

    if (params["id"]) {
      loadTaxonomy();
    }
  }, [params["id"]]);

  if (loading) {
    return (
      <>
        <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
        <div className="@container">
          <div className="p-6 text-center">Loading taxonomy...</div>
        </div>
      </>
    );
  }

  if (!taxonomy) {
    return (
      <>
        <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
        <div className="@container">
          <div className="p-6 text-center text-red-600">Taxonomy not found</div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <TaxonomyForm mode="edit" taxonomy={taxonomy} />
    </>
  );
}