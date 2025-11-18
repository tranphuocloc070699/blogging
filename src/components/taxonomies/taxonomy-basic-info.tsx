"use client";

import FormGroup from "@/components/form/form-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import React from "react";
import { useFormContext } from "react-hook-form";

interface TaxonomyBasicInfoProps {
  className?: string;
  mode: 'create' | 'edit';
  onNameChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function TaxonomyBasicInfo({
  className,
  onNameChange
}: TaxonomyBasicInfoProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <FormGroup
      title="Basic Information"
      description="Enter the basic details for the taxonomy"
      className={cn(className)}
    >
      <div className="col-span-full">
        <Input
          label="Name"
          placeholder="Enter taxonomy name"
          {...register('name')}
          onChange={(e) => {
            register('name').onChange(e);
            if (onNameChange) onNameChange(e);
          }}
          error={errors["name"]?.message as string}
          required
        />
      </div>

      <div className="col-span-full">
        <Input
          label="Slug"
          placeholder="taxonomy-slug"
          {...register('slug')}
          error={errors["slug"]?.message as string}
        />
        <p className="mt-1 text-xs text-gray-500">
          URL-friendly version of the name. Leave empty to auto-generate.
        </p>
      </div>

      <div className="col-span-full">
        <Textarea
          label="Description"
          placeholder="Enter taxonomy description (optional)"
          {...register('description')}
          error={errors["description"]?.message as string}
          rows={4}
        />
      </div>
    </FormGroup>
  );
}
