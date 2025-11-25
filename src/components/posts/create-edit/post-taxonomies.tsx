"use client";

import React, { useMemo, useEffect, useState } from "react";
import { MultiSelect, type MultiSelectGroup } from "@/components/ui/multi-select";

interface Term {
  id: number;
  name: string;
  taxonomy: {
    id: number;
    name: string;
  };
}

interface Taxonomy {
  id: number;
  name: string;
}

interface PostTaxonomiesProps {
  className?: string;
  termIds: number[];
  onTermIdsChange: (termIds: number[]) => void;
  terms: Term[];
  taxonomies: Taxonomy[];
}

export default function PostTaxonomies({
  termIds,
  onTermIdsChange,
  terms,
  taxonomies
}: PostTaxonomiesProps) {

  // Local state to control the component
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  // Initialize and sync with termIds
  useEffect(() => {
    const newValues = termIds.map(id => id.toString());
    setSelectedValues(newValues);
  }, [termIds]);

  // Convert to grouped options format for MultiSelect with taxonomy in label
  const groupedOptions: MultiSelectGroup[] = useMemo(() => {
    return taxonomies
      .map(taxonomy => {
        const taxonomyTerms = terms.filter(t => t.taxonomy.id === taxonomy.id);

        if (taxonomyTerms.length === 0) return null;

        return {
          heading: taxonomy.name,
          options: taxonomyTerms.map(term => ({
            label: `${term.name} (${taxonomy.name})`,
            value: term.id.toString(),
          }))
        };
      })
      .filter(Boolean) as MultiSelectGroup[];
  }, [taxonomies, terms]);

  // Handle value change from MultiSelect
  const handleValueChange = (values: string[]) => {
    console.log('MultiSelect values changed:', values);
    setSelectedValues(values);
    const newTermIds = values.map(v => parseInt(v, 10));
    console.log('Converted to term IDs:', newTermIds);
    onTermIdsChange(newTermIds);
  };

  if (taxonomies.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Taxonomies & Terms</h3>
        <p className="text-sm text-gray-500">
          No taxonomies available.{' '}
          <a href="/auth/taxonomies" className="text-blue-600 hover:underline">
            Create a taxonomy first
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">Taxonomies & Terms</h3>
      <MultiSelect
        options={groupedOptions}
        onValueChange={handleValueChange}
        defaultValue={selectedValues}
        placeholder="Select terms"
        maxCount={5}
        searchable={false}
        hideSelectAll={true}
        variant={"inverted"}
        className="w-full"
        resetOnDefaultValueChange={true}
      />
    </div>
  );
}
