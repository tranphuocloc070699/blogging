"use client"

import { useTermStore } from "@/store/term.store";
import { TermDto } from "@/types/posts"
import Link from "next/link";
import { useMemo } from "react";
interface BlogPostTagsProps {
        terms?: TermDto[]
}

const BlogPostTags = ({ terms }: BlogPostTagsProps) => {
const {tagTerms} = useTermStore();
const tagSlugs = new Set(tagTerms.map((t) => t.slug));
const displayTerms = useMemo(() =>{
                return terms?.filter(term => tagSlugs.has(term.slug))

},[tagTerms,terms])


        return (
                                displayTerms && displayTerms.length > 0 ? (
                                        <div >
                                                <div className="flex flex-wrap gap-2">
                                                        {displayTerms.map((term) => (
                                                                <Link
                                                                href={`/?tag=${term.slug}`}
                                                                        key={term.id}
                                                                        className="px-3 py-1.5 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                                                                >
                                                                        {term.name}
                                                                </Link>
                                                        ))}
                                                </div>
                                        </div>
                                ) : <></>
        )
}

export default BlogPostTags