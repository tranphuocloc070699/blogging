"use client";

import FormGroup from "@/components/form/form-group";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { TaxonomyDto } from "@/types/posts";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

interface TermBasicInfoProps {
  className?: string;
  mode: 'create' | 'edit';
  taxonomies: TaxonomyDto[];
  taxonomiesLoading: boolean;
  onNameChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function TermBasicInfo({
  className,
  taxonomies,
  taxonomiesLoading,
  onNameChange,
}: TermBasicInfoProps) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  const taxonomyOptions = (taxonomies || []).map((taxonomy) => ({
    value: taxonomy.id.toString(),
    label: taxonomy.name,
  }));

  return (
    <FormGroup
      title="Basic Information"
      description="Enter the basic details for the term"
      className={cn(className)}
    >
      <div className="col-span-full">
        <Input
          label="Name"
          placeholder="Enter term name"
          {...register("name")}
          onChange={(e) => {
            register("name").onChange(e);
            if (onNameChange) onNameChange(e);
          }}
          error={errors["name"]?.message as string}
          required
        />
      </div>

      <div className="col-span-full">
        <Input
          label="Slug"
          placeholder="term-slug"
          {...register("slug")}
          error={errors["slug"]?.message as string}
        />
        <p className="mt-1 text-xs text-gray-500">
          URL-friendly version of the name. Leave empty to auto-generate.
        </p>
      </div>

      <div className="col-span-full">
        <label className="block text-sm font-medium mb-2">
          Taxonomy <span className="text-red-500">*</span>
        </label>
        {taxonomiesLoading ? (
          <div className="text-sm text-gray-500">Loading taxonomies...</div>
        ) : (
          <Controller
            name="taxonomyId"
            control={control}
            render={({ field: { onChange, value } }) => (

              <Select onValueChange={(value) => onChange(Number(value))} value={value.toString()}>
                <SelectTrigger>
                  <SelectValue placeholder="Select taxonomy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {
                      taxonomyOptions.map(taxonomyOption => <SelectItem key={taxonomyOption.value} value={taxonomyOption.value}>{taxonomyOption.label}</SelectItem>)
                    }
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        )}
        {errors["taxonomyId"] && (
          <p className="mt-1 text-sm text-red-600">
            {errors["taxonomyId"].message as string}
          </p>
        )}
      </div>

      <div className="col-span-full">
        <Textarea
          label="Description"
          placeholder="Enter term description (optional)"
          {...register("description")}
          error={errors["description"]?.message as string}
          rows={4}
        />
      </div>
    </FormGroup>
  );
}
