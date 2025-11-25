"use client"

import { Heart, Share2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import postService from '@/services/modules/post-service';
import { useRouter, usePathname } from 'next/navigation';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui";
import { useSession } from 'next-auth/react';
interface BlogPostActionProps {
	postId: number;
	initialLikesCount?: number;
	initialIsLiked?: boolean;
}

const BlogPostAction = ({ postId, initialLikesCount = 0, initialIsLiked = false }: BlogPostActionProps) => {
	const { data: session } = useSession();
	const [liked, setLiked] = useState(initialIsLiked);
	const [likesCount, setLikesCount] = useState(initialLikesCount);
	const [showActions, setShowActions] = useState(false);
	const [lastScrollY, setLastScrollY] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [showLoginModal, setShowLoginModal] = useState(false);
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY;

			// Show buttons when scrolling up (after scrolling past 200px)
			if (currentScrollY < lastScrollY && currentScrollY > 200) {
				setShowActions(true);
			} else if (currentScrollY > lastScrollY) {
				// Hide when scrolling down
				setShowActions(false);
			}

			setLastScrollY(currentScrollY);
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	}, [lastScrollY]);

	const handleLike = async () => {
		if (isLoading) return;

		// Check if user is authenticated
		if (!session) {
			setShowLoginModal(true);
			return;
		}

		setIsLoading(true);
		try {
			const response = await postService.toggleLike((session as any).accessToken, postId);

			if (response.body.data) {
				setLiked(response.body.data.isLiked);
				setLikesCount(response.body.data.likesCount);
			}
		} catch (error) {
			console.error('Error toggling like:', error);
			// Optionally show an error message to the user
		} finally {
			setIsLoading(false);
		}
	};

	const handleLoginRedirect = () => {
		// Navigate to login with callback URL
		router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
	};

	const handleShare = async () => {
		navigator.clipboard.writeText(window.location.href);
		alert('Link copied to clipboard!');
	};

	return (
		<>
			<div
				className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${showActions
					? 'opacity-100 translate-y-0'
					: 'opacity-0 translate-y-20 pointer-events-none'
					}`}
			>
				<div className="flex items-center gap-3 px-6 py-3 rounded-full bg-white shadow-lg border border-gray-200">
					<button
						onClick={handleLike}
						disabled={isLoading}
						className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
						aria-label="Like post"
					>
						<Heart className={`w-5 h-5 ${liked ? 'fill-black text-black' : ''}`} />
						<span className="text-sm">{likesCount}</span>
					</button>

					<button
						onClick={handleShare}
						className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
						aria-label="Share post"
					>
						<Share2 className="w-5 h-5" />
					</button>
				</div>
			</div>

			{/* Login confirmation modal */}
			<Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Login Required</DialogTitle>
						<DialogDescription>
							You need to be logged in to like this post. Would you like to go to the login page?
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className='gap-4'>
						<Button
							variant="outline"
							onClick={() => setShowLoginModal(false)}
						>
							Cancel
						</Button>
						<Button onClick={handleLoginRedirect}>
							Go to Login
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	)
}

export default BlogPostAction
