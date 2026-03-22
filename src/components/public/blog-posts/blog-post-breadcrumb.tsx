import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Calendar } from "lucide-react";
import { formatDate } from "@/lib/string-util";
import Link from "next/link";

interface BlogPostBreadcrumbProps {
  slug: string;
  publishedAt: Date | null;
}

const BlogPostBreadcrumb = ({ slug, publishedAt }: BlogPostBreadcrumbProps) => {
  const truncatedSlug = slug?.length > 24 ? slug.slice(0, 24) + "…" : slug;

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="md:block">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link href="/">Home</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                <span className="hidden md:inline">{slug}</span>
                <span className="inline md:hidden">{truncatedSlug}</span>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex justify-end">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(publishedAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default BlogPostBreadcrumb;
