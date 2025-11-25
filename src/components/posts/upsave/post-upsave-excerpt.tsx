import { PostFormData } from "@/app/auth/posts/upsave/page";
import React from "react";


interface PostUpsaveExcerpt {
        excerpt: string;
        onFormDataChange: (formData: Partial<PostFormData>) => void;
}

function PostUpsaveExcerpt({ excerpt, onFormDataChange }: PostUpsaveExcerpt) {
        return <>
                <textarea
                        value={excerpt || ''}
                        name="excerpt"
                        onChange={(e) => onFormDataChange({ [e.target.name]: e.target.value })}
                        placeholder="Write an excerpt (optional)..."
                        onInput={(e) => {
                                const target = e.target as HTMLTextAreaElement;
                                target.style.height = 'auto';
                                target.style.height = target.scrollHeight + 'px';
                        }}
                        className="w-full text-xl text-gray-600 outline-none border-none focus:ring-0 placeholder-gray-300 bg-transparent overflow-hidden resize-none leading-relaxed"
                />
        </>
}

export default PostUpsaveExcerpt;