"use client";

import { ArrowUp, Heart, MessageCircle, MessageSquare, Share2, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import postService from "@/services/modules/post-service";
import { useRouter, usePathname } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui";
import { useSession } from "next-auth/react";
import { trackGa4Event } from "@/lib/ga4";
import gsap from "gsap";
import { toast } from "sonner";
interface BlogPostActionProps {
  postId: number;
  initialLikesCount?: number;
  initialIsLiked?: boolean;
  initialCommentCount?: number;
}

const BlogPostAction = ({
  postId,
  initialLikesCount = 0,
  initialIsLiked = false,
  initialCommentCount = 0,
}: BlogPostActionProps) => {
  const { data: session } = useSession();
  const [liked, setLiked] = useState(initialIsLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [showActions, setShowActions] = useState(false);
  const lastScrollYRef = useRef(0);
  const showActionsRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [commentCount, setCommentCount] = useState(initialCommentCount);

  useEffect(() => {
    const handleCommentCountChange = (e: Event) => {
      const detail = (e as CustomEvent<{ count: number }>).detail;
      setCommentCount(detail.count);
    };
    window.addEventListener("comment-count-changed", handleCommentCountChange);
    return () => {
      window.removeEventListener("comment-count-changed", handleCommentCountChange);
    };
  }, []);
  const router = useRouter();
  const pathname = usePathname();
  const heartBtnRef = useRef<HTMLButtonElement>(null);
  const heartIconRef = useRef<HTMLDivElement>(null);
  const particlesContainerRef = useRef<HTMLDivElement>(null);
  const shareIconRef = useRef<HTMLDivElement>(null);
  const shareParticlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current != null) return;

      rafRef.current = window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const shouldShow =
          currentScrollY < lastScrollYRef.current && currentScrollY > 200;

        if (showActionsRef.current !== shouldShow) {
          showActionsRef.current = shouldShow;
          setShowActions(shouldShow);
        }

        lastScrollYRef.current = currentScrollY;
        rafRef.current = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current != null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const animateLike = (isLiked: boolean) => {
    // Pulse the heart icon
    if (heartIconRef.current) {
      gsap.fromTo(
        heartIconRef.current,
        { scale: 1 },
        {
          scale: 1.5,
          duration: 0.15,
          ease: "power2.out",
          yoyo: true,
          repeat: 1,
        },
      );
    }

    // Burst floating hearts only when liking (not unliking)
    if (isLiked && particlesContainerRef.current) {
      const container = particlesContainerRef.current;
      const count = 8;

      for (let i = 0; i < count; i++) {
        const particle = document.createElement("div");
        particle.innerHTML = "♥";
        particle.style.cssText = `
					position: absolute;
					font-size: ${10 + Math.random() * 10}px;
					color: ${["#ef4444", "#f97316", "#ec4899", "#e11d48"][Math.floor(Math.random() * 4)]};
					pointer-events: none;
					left: 50%;
					top: 50%;
					transform: translate(-50%, -50%);
					opacity: 1;
					user-select: none;
				`;
        container.appendChild(particle);

        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.8;
        const distance = 40 + Math.random() * 40;

        gsap.to(particle, {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance - 30,
          opacity: 0,
          scale: 0.3,
          duration: 0.7 + Math.random() * 0.3,
          ease: "power2.out",
          onComplete: () => particle.remove(),
        });
      }
    }
  };

  const handleLike = async () => {
    if (isLoading) return;

    // Check if user is authenticated
    if (!session) {
      setShowLoginModal(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await postService.toggleLike(
        (session as any).accessToken,
        postId,
      );

      if (response.body.data) {
        const nextIsLiked = response.body.data.isLiked;
        const nextLikesCount = response.body.data.likesCount;
        setLiked(nextIsLiked);
        setLikesCount(nextLikesCount);
        animateLike(nextIsLiked);
        // Invalidate router cache so home page shows fresh counts on next navigation
        router.refresh();

        trackGa4Event("post_like_toggled", {
          post_id: postId,
          is_liked: nextIsLiked,
          likes_count: nextLikesCount,
        });

        trackGa4Event(nextIsLiked ? "post_liked" : "post_unliked", {
          post_id: postId,
          likes_count: nextLikesCount,
        });
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    // Navigate to login with callback URL
    router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
  };

  const animateShare = () => {
    if (shareIconRef.current) {
      gsap.fromTo(
        shareIconRef.current,
        { scale: 1 },
        {
          scale: 1.5,
          duration: 0.15,
          ease: "power2.out",
          yoyo: true,
          repeat: 1,
        },
      );
    }

    if (shareParticlesRef.current) {
      const container = shareParticlesRef.current;
      const count = 8;

      for (let i = 0; i < count; i++) {
        const particle = document.createElement("div");
        particle.innerHTML = "♥";
        particle.style.cssText = `
					position: absolute;
					font-size: ${10 + Math.random() * 10}px;
					color: ${["#ef4444", "#f97316", "#ec4899", "#e11d48"][Math.floor(Math.random() * 4)]};
					pointer-events: none;
					left: 50%;
					top: 50%;
					transform: translate(-50%, -50%);
					opacity: 1;
					user-select: none;
				`;
        container.appendChild(particle);

        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.8;
        const distance = 40 + Math.random() * 40;

        gsap.to(particle, {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance - 30,
          opacity: 0,
          scale: 0.3,
          duration: 0.7 + Math.random() * 0.3,
          ease: "power2.out",
          onComplete: () => particle.remove(),
        });
      }
    }
  };

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    trackGa4Event("post_shared", {
      post_id: postId,
      share_method: "copy_link",
    });
    animateShare();

    toast.info("Link copied to clipboard");
  };

  return (
    <>
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${showActions
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-20 pointer-events-none"
          }`}
      >
        <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-white shadow-lg border border-gray-200">
          <button
            ref={heartBtnRef}
            onClick={handleLike}
            disabled={isLoading}
            className="relative flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed overflow-visible"
            aria-label="Like post"
          >
            <div
              ref={particlesContainerRef}
              className="absolute inset-0 pointer-events-none overflow-visible"
            />
            <div ref={heartIconRef} className="flex items-center">
              <Star
                className={`w-5 h-5 transition-colors duration-200 ${liked ? "fill-yellow-500 text-yellow-500" : ""}`}
              />
            </div>
            <span className="text-sm">{likesCount}</span>
          </button>

          <button
            onClick={() => {
              document
                .getElementById("discussion-section")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 cursor-pointer"
            aria-label="Go to comments"
          >
            <MessageSquare className="w-5 h-5" />
            {commentCount > 0 && (
              <span className="text-sm">{commentCount}</span>
            )}
          </button>

          <button
            onClick={handleShare}
            className="relative flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors overflow-visible"
            aria-label="Share post"
          >
            <div
              ref={shareParticlesRef}
              className="absolute inset-0 pointer-events-none overflow-visible"
            />
            <div ref={shareIconRef} className="flex items-center">
              <Share2 className="w-5 h-5" />
            </div>
          </button>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Login confirmation modal */}
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription>
              You need to be logged in to like this post. Would you like to go
              to the login page?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-4">
            <Button variant="outline" onClick={() => setShowLoginModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleLoginRedirect}>Go to Login</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BlogPostAction;
