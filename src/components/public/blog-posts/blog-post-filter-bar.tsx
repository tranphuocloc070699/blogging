'use client';

import { Input } from '@/components/ui/input';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
// import { Select } from '@/components/ui/select';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useTermStore } from '@/store/term.store';
import { TermDto } from '@/types/posts';
import { Search } from 'lucide-react';


const BlogPostFilterBar = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [tags, setTags] = useState<TermDto[]>([]);
	const [selectedTag, setSelectedTag] = useState<string>(searchParams.get('tag') || '');
	const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('search') || '');
	const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
	const termStore = useTermStore();

	useEffect(() => {
		if (termStore.terms.length === 0) {
			termStore.initialTerms();
		}
	}, [])


	useEffect(() => {
		if (termStore.terms.length > 0) {
			const tagsFiltered = termStore.tagTerms
			const tagAll: TermDto = {
				id: 0,
				name: 'All',
				slug: 'all',
				taxonomy: {
					id: 999,
					name: "Tag",
					slug: "tag"
				},
				createdAt: '',
				updatedAt: ''
			}
			setTags([tagAll, ...tagsFiltered])
		}
	}, [termStore.terms]);

	const handleTagClick = (tagSlug: string) => {
		setSelectedTag(tagSlug);
		updateURL(tagSlug, searchQuery);
	};

	const handleSearch = useDebouncedCallback((value: string) => {
		updateURL(selectedTag, value);
	}, 300);

	const updateURL = (tag: string, search: string) => {
		const params = new URLSearchParams();
		if (tag && tag !== 'all') params.set('tag', tag);
		if (search) params.set('search', search);
		router.push(`/?${params.toString()}`);
	};

	const toggleMobileSearch = () => {
		setIsMobileSearchOpen(!isMobileSearchOpen);
	};

	return (
		<div className="mb-10">
			{/* Desktop View */}
			<div className="hidden md:flex items-center gap-4 justify-between">
				{/* Tags - Horizontal Scroll */}
				<div className={`transition-all duration-300 ${isMobileSearchOpen ? 'w-0 opacity-0' : 'flex-1 max-w-[220px]'}`}>
					<Select value={selectedTag} onValueChange={handleTagClick}>
						<SelectTrigger className="w-full rounded-full">
							<SelectValue placeholder="Select tag" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								{
									tags.map(tag => <SelectItem key={tag.id} value={tag.slug}>{tag.name}</SelectItem>)
								}
							</SelectGroup>
						</SelectContent>
					</Select>

				</div>

				{/* Search Input */}
				<div className="relative md:w-64">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
					<Input
						type="text"
						placeholder="Search posts..."
						value={searchQuery}
						onChange={(e) => {
							setSearchQuery(e.target.value);
							handleSearch(e.target.value);
						}}
						className="pl-9 rounded-3xl border-gray-300 shadow-none"
					/>
				</div>
			</div>

			{/* Mobile View */}
			<div className="md:hidden h-[40px]">
				<div className="flex items-center gap-2 justify-between">
					{/* Tags Select */}
					<div className={`transition-all duration-300 ${isMobileSearchOpen ? 'w-0 opacity-0 overflow-hidden' : 'flex-1  max-w-[220px]'}`}>
						<Select value={selectedTag} onValueChange={handleTagClick}>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select tag" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectLabel>Tags</SelectLabel>
									{
										tags.map(tag => <SelectItem key={tag.id} value={tag.slug}>{tag.name}</SelectItem>)
									}

								</SelectGroup>
							</SelectContent>
						</Select>
					</div>

					{/* Search - Animated */}
					<div className={`transition-all duration-300 ${isMobileSearchOpen ? 'flex-1' : 'w-auto'}`}>
						{isMobileSearchOpen ? (
							<div className="relative">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
								<Input
									type="text"
									placeholder="Search..."
									value={searchQuery}
									onChange={(e) => {
										setSearchQuery(e.target.value);
										handleSearch(e.target.value);
									}}
									onBlur={() => !searchQuery && setIsMobileSearchOpen(false)}
									autoFocus
									className="pl-9 rounded-3xl border-gray-300"
								/>
							</div>
						) : (
							<button
								onClick={toggleMobileSearch}
								className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50"
							>
								<Search className="h-5 w-5 text-gray-600" />
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default BlogPostFilterBar;
