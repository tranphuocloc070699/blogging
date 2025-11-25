import { PostFormData } from "@/app/auth/posts/upsave/page";
import React from "react";


interface PostUpsaveTitle {
        title: string;
        onFormDataChange: (formData: Partial<PostFormData>) => void;
}

function PostUpsaveTitle({ title, onFormDataChange }: PostUpsaveTitle) {
        return <>
                <textarea
                        value={title}
                        name="title"
                        onChange={(e) => onFormDataChange({ [e.target.name]: e.target.value })}
                        placeholder="Title"
                        // rows={3}
                        className="w-full text-4xl md:text-5xl font-bold outline-none border-none focus:ring-0 placeholder-gray-300 bg-transparent resize-none overflow-hidden leading-tight"
                        onInput={(e) => {
                                const target = e.target as HTMLTextAreaElement;
                                target.style.height = 'auto';
                                target.style.height = target.scrollHeight + 'px';
                        }}
                />
        </>
}

export default PostUpsaveTitle;