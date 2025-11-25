"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";

import { cn } from "@/lib/utils";
import FormGroup from "@/components/form/form-group";
import { Input } from "@/components/ui/input";
import { Select, Textarea } from "@/components/ui";
import { SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

const statusOptions = [
  { label: "Draft", value: "DRAFT" },
  { label: "Published", value: "PUBLISHED" },
];

interface PostSummaryProps {
  className?: string;
}

export default function PostSummary({ className }: PostSummaryProps) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <FormGroup
      title="Post Summary"
      description="Edit your post title, excerpt, and basic information"
      className={cn(className)}
    >
      <Input
        label="Title"
        placeholder="Enter post title"
        {...register("title")}
        error={errors["title"]?.message as string}
        className="col-span-full"
      />

      <Input
        label="Slug"
        placeholder="post-slug-url"
        {...register("slug")}
        error={errors["slug"]?.message as string}
        className="col-span-full"
      />

      <Controller
        name="status"
        control={control}
        render={({ field: { onChange, value } }) => (
          // <Select
          //   label="Status"
          //   options={statusOptions}
          //   value={value}
          //   onValueChange={onChange}
          //   error={errors?.status?.message as string}
          //   placeholder="Select status"
          // />
              <>
              <Select onValueChange={onChange} value={value}>
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

              </>

        )}
      />

      <div className="col-span-full">
        <Controller
          control={control}
          name="excerpt"
          render={({ field: { onChange, value } }) => (
            <Textarea
              label="Excerpt"
              placeholder="Enter a brief description of your post..."
              value={value}
              onChange={onChange}
              rows={4}
              className="resize-none"
            />
          )}
        />
        {errors["excerpt"]?.message && (
          <p className="mt-1 text-sm text-red-600">
            {errors["excerpt"].message as string}
          </p>
        )}
      </div>
    </FormGroup>
  );
}
