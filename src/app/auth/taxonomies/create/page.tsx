import PageHeader from '@/components/page-header';
import TaxonomyForm from '@/components/taxonomies/taxonomy-form';

const pageHeader = {
  title: 'Create Taxonomy',
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
      name: 'Create',
    },
  ],
};

export default function CreateTaxonomyPage() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <TaxonomyForm mode="create" />
    </>
  );
}