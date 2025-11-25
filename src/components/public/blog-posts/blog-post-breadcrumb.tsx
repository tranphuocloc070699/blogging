import React from 'react'
import {
        Breadcrumb,
        BreadcrumbItem,
        BreadcrumbLink,
        BreadcrumbList,
        BreadcrumbPage,
        BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Calendar } from 'lucide-react';
import { formatDate } from '@/lib/string-util';

interface BlogPostBreadcrumbProps {
        slug: string;
        publishedAt: Date | null;
}
const BlogPostBreadcrumb = ({ slug, publishedAt }: BlogPostBreadcrumbProps) => {
        return (
                <div className='flex items-center md:justify-between justify-end'>
                        <div className="hidden md:block mb-6">
                                <Breadcrumb>
                                        <BreadcrumbList>
                                                <BreadcrumbItem>
                                                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                                                </BreadcrumbItem>
                                                <BreadcrumbSeparator />
                                                <BreadcrumbItem>
                                                        <BreadcrumbPage>{slug}</BreadcrumbPage>
                                                </BreadcrumbItem>
                                        </BreadcrumbList>
                                </Breadcrumb>
                        </div>

                        <div className="flex justify-end mb-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Calendar className="w-4 h-4" />
                                        <span>{formatDate(publishedAt)}</span>
                                </div>
                        </div>
                </div>
        )
}

export default BlogPostBreadcrumb