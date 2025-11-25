"use client";

import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import FormGroup from "@/components/form/form-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui";
import { TaxonomyDto, TermDto } from "@/types/posts";
import taxonomyService from "@/services/modules/taxonomy-service";
import termService from "@/services/modules/term-service";


interface PostTermsProps {
  className?: string;
}

export default function PostTerms({ className }: PostTermsProps) {
  const {
    setValue,
    watch,
    // formState: { errors },
  } = useFormContext();

  const [taxonomies, setTaxonomies] = useState<TaxonomyDto[]>([]);
  const [allTerms, setAllTerms] = useState<TermDto[]>([]);
  const [selectedTaxonomy, setSelectedTaxonomy] = useState<string>("");
  const [availableTerms, setAvailableTerms] = useState<TermDto[]>([]);
  const [loading, setLoading] = useState(true);

  const termIds = watch("termIds") || [];
  const selectedTerms = allTerms.filter((term) => termIds.includes(term.id));

  useEffect(() => {
    const loadData = async () => {
      try {
        const [{ body: taxonomiesResponse }, { body: termsResponse }] = await Promise.all([
          taxonomyService.getAllTaxonomies(),
          termService.getAllTerms(),
        ]);

        console.log({ taxonomiesResponse, termsResponse });
        setTaxonomies(taxonomiesResponse.data || []);
        setAllTerms(termsResponse.data || []);
      } catch (error) {
        console.error("Failed to load taxonomies and terms:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (selectedTaxonomy) {
      const taxonomyTerms = allTerms.filter(
        (term) => term.taxonomy.id.toString() === selectedTaxonomy,
      );
      setAvailableTerms(taxonomyTerms);
    } else {
      setAvailableTerms([]);
    }
  }, [selectedTaxonomy, allTerms]);

  const handleAddTerm = (termId: string) => {
    const term = allTerms.find((t) => t.id.toString() === termId);
    if (term && !termIds.includes(term.id)) {
      const newTermIds = [...termIds, term.id];
      setValue("termIds", newTermIds);
    }
  };

  const handleRemoveTerm = (termId: number) => {
    const newTermIds = termIds.filter((id: number) => id !== termId);
    setValue("termIds", newTermIds);
  };

  const taxonomyOptions = taxonomies.map((taxonomy) => ({
    value: taxonomy.id.toString(),
    label: taxonomy.name,
  }));

  const termOptions = availableTerms
    .filter((term) => !termIds.includes(term.id))
    .map((term) => ({
      value: term.id.toString(),
      label: term.name,
    }));

  return (
    <FormGroup
      title="Terms & Categories"
      description="Select terms and categories for your post"
      className={cn(className)}
    >
      {loading ? (
        <div className="col-span-full text-sm text-gray-500">
          Loading taxonomies and terms...
        </div>
      ) : (
        <>
          <div className="col-span-full">
            <label className="block text-sm font-medium mb-2">
              Select Taxonomy
            </label>
            <Select onValueChange={setSelectedTaxonomy} value={selectedTaxonomy}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a taxonomy first" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  {
                    taxonomyOptions.map(taxonomyOption => <SelectItem key={taxonomyOption.value} value={taxonomyOption.value}>{taxonomyOption.label}</SelectItem>)
                  }
                </SelectGroup>
              </SelectContent>
            </Select>
            {/* <Select
              placeholder="Choose a taxonomy first"
              options={taxonomyOptions}
              value={selectedTaxonomy}
              onValueChange={setSelectedTaxonomy}
            /> */}
          </div>

          {selectedTaxonomy && (
            <div className="col-span-full">
              <label className="block text-sm font-medium mb-2">
                Add Terms
              </label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Select onValueChange={handleAddTerm} value={""} disabled={termOptions.length === 0}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a term to add" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Status</SelectLabel>
                        {
                          termOptions.map(termOption => <SelectItem key={termOption.value} value={termOption.value}>{termOption.label}</SelectItem>)
                        }
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {/* <Select
                    placeholder="Select a term to add"
                    options={termOptions}
                    value=""
                    onValueChange={handleAddTerm}
                    disabled={termOptions.length === 0}
                  /> */}
                </div>
              </div>
              {termOptions.length === 0 && availableTerms.length > 0 && (
                <p className="mt-1 text-xs text-gray-500">
                  All terms from this taxonomy have been selected
                </p>
              )}
              {availableTerms.length === 0 && (
                <p className="mt-1 text-xs text-gray-500">
                  No terms available in this taxonomy.{" "}
                  <a
                    href="/terms/create"
                    className="text-blue-600 hover:underline"
                  >
                    Create a new term
                  </a>
                </p>
              )}
            </div>
          )}

          {selectedTerms.length > 0 && (
            <div className="col-span-full">
              <label className="block text-sm font-medium mb-2">
                Selected Terms ({selectedTerms.length})
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedTerms.map((term) => (
                  <span
                    key={term.id}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                  >
                    {term.name}
                    <span className="text-blue-600 text-xs">
                      ({term.taxonomy.name})
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveTerm(term.id)}
                      className="h-4 w-4 p-0 hover:bg-blue-200 rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {taxonomies.length === 0 && (
            <div className="col-span-full text-sm text-gray-500">
              No taxonomies available.{" "}
              <a
                href="/taxonomies/create"
                className="text-blue-600 hover:underline"
              >
                Create a taxonomy first
              </a>
            </div>
          )}
        </>
      )}

      <input
        type="hidden"
        name="termIds"
        value={JSON.stringify(termIds)}
        readOnly
      />
    </FormGroup>
  );
}
