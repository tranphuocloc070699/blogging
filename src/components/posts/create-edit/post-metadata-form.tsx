'use client';

import { Input } from '@/components/ui/input';
import { useMemo, useState } from 'react';
import PostTaxonomies from './post-taxonomies';
// import { Select, SelectOption } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { generateTOC } from "@/lib/post-util";
import { useTaxonomyStore } from "@/store/taxonomy.store";
import { useTermStore } from "@/store/term.store";
import { ChevronDown } from 'lucide-react';
import { Select } from '@/components/ui';
import { SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PostFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail?: string;
  termIds?: number[];
  keywords: string;
  status: 'DRAFT' | 'PUBLISHED';
}



interface PostMetadataFormProps {
  status: string;
  slug: string;
  content: string;
  onFormDataChange: (data: Partial<Pick<PostFormData, "status" | "slug" | "termIds" | "keywords">>) => void;
  termIds: number[];
  keywords: string;
}

interface SelectOption {
  label: string;
  value: string;
}


const statusOptions: SelectOption[] = [
  { label: 'Published', value: 'PUBLISHED' },
  { label: 'Draft', value: 'DRAFT' },
];

export default function PostMetadataForm({
  slug, termIds, keywords,
  onFormDataChange,
  content,
  status,
}: PostMetadataFormProps) {
  const taxonomies = useTaxonomyStore.getState().taxonomies;
  const terms = useTermStore.getState().terms;

  const [isTocOpen, setIsTocOpen] = useState(false);

  const tocItems = useMemo(() => {
    return generateTOC(content || "")
  }, [content])

  // useEffect(() => {
  //   console.log({ slug })
  // }, [slug])

  return (
    <div className="space-y-6 p-6 pb-32 overflow-y-auto max-h-[calc(100vh-80px)] metadata-scrollbar">
      {/* Status */}
      {/* <Select
        label="Status"
        options={statusOptions}
        value={status}
        onValueChange={(value) => onFormDataChange({ status: value as 'DRAFT' | 'PUBLISHED' })}
      /> */}

      <div>
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Status
        </label>
        <Select onValueChange={(value) => onFormDataChange({ status: value as 'DRAFT' | 'PUBLISHED' })} value={status}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Status</SelectLabel>
              {
                statusOptions.map(statusOption => <SelectItem key={statusOption.value} value={statusOption.value}>{statusOption.label}</SelectItem>)
              }
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Input
          label="Slug"
          type="text"
          name="slug"
          value={slug}
          onChange={(e) => {
            onFormDataChange({ [e.target.name]: e.target.value });
          }}
          placeholder="post-slug"
        />
      </div>

      {/* SEO Section */}
      <div className="border-t pt-6">
        <h3 className="text-sm font-semibold mb-4">SEO</h3>
        <div>
          <Input
            label="Keywords"
            type="text"
            name="keywords"
            value={keywords}
            onChange={(e) => onFormDataChange({ [e.target.name]: e.target.value })}
            placeholder="main keyword"
          />
        </div>
      </div>

      {/* Taxonomies & Terms */}
      <div className="border-t pt-6">
        <PostTaxonomies
          termIds={termIds}
          onTermIdsChange={(ids) => onFormDataChange({ termIds: ids })}
          terms={terms}
          taxonomies={taxonomies}
        />
      </div>

      {/* Table of Contents - Last Element */}
      {tocItems.length > 0 && (
        <div className="border-t pt-6">
          <Collapsible open={isTocOpen} onOpenChange={setIsTocOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full hover:opacity-70 transition-opacity">
              <h3 className="text-sm font-semibold text-gray-900">Table of Contents</h3>
              <ChevronDown
                className={`h-4 w-4 text-gray-500 transition-transform ${isTocOpen ? 'rotate-180' : ''}`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3">
              <div className="space-y-2.5 py-2">
                {tocItems.map((item, index) => (
                  <div
                    key={index}
                    className={`text-sm text-gray-600 hover:text-gray-900 transition-colors border-l-2 border-transparent hover:border-gray-300 ${item.level === 2 ? 'pl-3' :
                      item.level === 3 ? 'pl-6' :
                        'pl-9'
                      }`}
                  >
                    {item.title}
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      )}
    </div>
  );
}
