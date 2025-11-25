'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import PageHeader from '@/components/page-header';
import TermForm from '@/components/terms/term-form';
import { TermDto } from '@/types/posts';
import termService from '@/services/modules/term-service';
const pageHeader = {
  title: 'Edit Term',
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
      name: 'Edit',
    },
  ],
};

export default function EditTermPage() {
  const params = useParams();
  const [term, setTerm] = useState<TermDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTerm = async () => {
      try {
        const id = parseInt(params["id"] as string);
        const { body } = await termService.getTermById(id);
        setTerm(body.data);
      } catch (error) {
        toast.error('Failed to load term');
      } finally {
        setLoading(false);
      }
    };

    if (params["id"]) {
      loadTerm();
    }
  }, [params["id"]]);

  if (loading) {
    return (
      <>
        <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
        <div className="@container">
          <div className="p-6 text-center">Loading term...</div>
        </div>
      </>
    );
  }

  if (!term) {
    return (
      <>
        <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
        <div className="@container">
          <div className="p-6 text-center text-red-600">Term not found</div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <TermForm mode="edit" term={term} />
    </>
  );
}