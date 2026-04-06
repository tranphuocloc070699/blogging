"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { Heart, Send, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { trackGa4Event } from "@/lib/ga4";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDistanceToNow } from "date-fns";

interface CommentUser {
  id: number;
  username: string;
  email: string | null;
  isAdmin?: boolean;
}

interface CommentData {
  id: number;
  content: string;
  createdAt: string;
  user: CommentUser;
  likesCount: number;
  isLiked: boolean;
  replies: CommentData[];
}

interface BlogPostDiscussionProps {
  postId: number;
  initialCommentCount?: number;
}

const COMMENT_MAX_CHARS = 500;

function getInitials(username: string) {
  return username.slice(0, 2).toUpperCase();
}

function CommentContent({ content }: { content: string }) {
  const [expanded, setExpanded] = useState(false);
  // line-clamp-3 clips at 3 lines; we only show the toggle if content is long enough
  // We use a ref to detect overflow after render
  const pRef = useRef<HTMLParagraphElement>(null);
  const [clamped, setClamped] = useState(false);

  useEffect(() => {
    const el = pRef.current;
    if (el) {
      setClamped(el.scrollHeight > el.clientHeight);
    }
  }, [content]);

  return (
    <div className="px-4 py-3 bg-white">
      <p
        ref={pRef}
        className={`text-sm text-stone-700 whitespace-pre-wrap break-words ${!expanded ? "line-clamp-3" : ""}`}
      >
        {content}
      </p>
      {(clamped || expanded) && (
        <button
          onClick={() => setExpanded((p) => !p)}
          className="mt-1 text-xs text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}

function CommentItem({
  comment,
  postId,
  accessToken,
  currentUserId,
  isAdmin,
  onReplyPosted,
  onDeleted,
  showLoginModal,
}: {
  comment: CommentData;
  postId: number;
  accessToken: string | undefined;
  currentUserId: number | undefined;
  isAdmin: boolean;
  onReplyPosted: (parentId: number, newReply: CommentData) => void;
  onDeleted: (commentId: number, parentId?: number) => void;
  showLoginModal: () => void;
}) {
  const [liked, setLiked] = useState(comment.isLiked);
  const [likesCount, setLikesCount] = useState(comment.likesCount);
  const [showReply, setShowReply] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleLike = async () => {
    if (!accessToken) {
      showLoginModal();
      return;
    }
    const res = await fetch(
      `/api/posts/${postId}/comments/${comment.id}/like`,
      { method: "PUT", headers: { Authorization: `Bearer ${accessToken}` } },
    );
    if (res.ok) {
      const data = await res.json();
      setLiked(data.data.isLiked);
      setLikesCount(data.data.likesCount);
    }
  };

  const handleDelete = async () => {
    if (!accessToken || deleting) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments/${comment.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        onDeleted(comment.id);
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex gap-3">
      <Avatar className="w-8 h-8 shrink-0">
        <AvatarFallback className="text-xs bg-stone-200 text-stone-700">
          {getInitials(comment.user.username)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0 relative">
        {/* Pointer toward avatar — rotated square */}

        <div className="rounded-lg border border-stone-200 overflow-hidden">
          {/* Username header — gray background */}
          <div className="flex items-center gap-2 px-4 py-2 bg-stone-100 border-b border-stone-200">
            <span className="text-sm font-semibold text-stone-800">
              {comment.user.username}
            </span>
            {comment.user.isAdmin && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-700 text-white">
                Admin
              </span>
            )}
            <span className="text-xs text-stone-400 ml-auto">
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
          {/* Content — no background */}
          <CommentContent content={comment.content} />
        </div>

        <div className="flex items-center gap-4 mt-1 ml-2">
          <button
            onClick={handleLike}
            className="flex items-center gap-1 text-xs text-stone-500 hover:text-red-500 transition-colors cursor-pointer"
          >
            <Heart
              className={`w-3.5 h-3.5 ${liked ? "fill-red-500 text-red-500" : ""}`}
            />
            <span>{likesCount > 0 ? likesCount : ""}</span>
          </button>
          <button
            onClick={() => setShowReply((p) => !p)}
            className="text-xs text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
          >
            Reply
          </button>
          {(comment.replies?.length ?? 0) > 0 && (
            <button
              onClick={() => setShowReplies((p) => !p)}
              className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
            >
              {showReplies ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
              {comment.replies.length}{" "}
              {comment.replies.length === 1 ? "reply" : "replies"}
            </button>
          )}
          {isAdmin && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition-colors cursor-pointer disabled:opacity-50"
              aria-label="Delete comment"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {showReply && (
          <ReplyBox
            parentId={comment.id}
            postId={postId}
            accessToken={accessToken}
            onPosted={(reply) => {
              onReplyPosted(comment.id, reply);
              setShowReply(false);
              setShowReplies(true);
            }}
            onCancel={() => setShowReply(false)}
            showLoginModal={showLoginModal}
          />
        )}

        {showReplies && (comment.replies?.length ?? 0) > 0 && (
          <div className="mt-3 space-y-3 pl-2 border-l-2 border-stone-100">
            {(comment.replies ?? []).map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                postId={postId}
                accessToken={accessToken}
                currentUserId={currentUserId}
                isAdmin={isAdmin}
                onReplyPosted={onReplyPosted}
                onDeleted={(id) => onDeleted(id, comment.id)}
                showLoginModal={showLoginModal}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ReplyBox({
  parentId,
  postId,
  accessToken,
  onPosted,
  onCancel,
  showLoginModal,
}: {
  parentId: number;
  postId: number;
  accessToken: string | undefined;
  onPosted: (reply: CommentData) => void;
  onCancel: () => void;
  showLoginModal: () => void;
}) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    if (!accessToken) {
      showLoginModal();
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ content, parentId }),
      });
      if (res.ok) {
        const data = await res.json();
        onPosted(data.data);
        setContent("");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2 space-y-2">
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value.slice(0, COMMENT_MAX_CHARS))}
          placeholder="Write a reply..."
          className="text-sm resize-none min-h-[70px] bg-stone-50 border-stone-200 focus:border-stone-400"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
          }}
        />
        <span className={`absolute bottom-2 right-2 text-xs ${content.length >= COMMENT_MAX_CHARS ? "text-red-400" : "text-stone-300"}`}>
          {content.length}/{COMMENT_MAX_CHARS}
        </span>
      </div>
      <div className="flex gap-2 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="h-7 px-3 text-xs"
        >
          Cancel
        </Button>
        <Button
          type="button"
          loading={loading}
          onClick={handleSubmit}
          className="h-7 px-3 text-xs bg-stone-800 hover:bg-stone-900 text-white"
        >
          Reply
        </Button>
      </div>
    </div>
  );
}

export default function BlogPostDiscussion({
  postId,
  initialCommentCount = 0,
}: BlogPostDiscussionProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const accessToken = (session as any)?.accessToken as string | undefined;
  const currentUserId = session?.user?.id
    ? parseInt(session.user.id)
    : undefined;
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  const [comments, setComments] = useState<CommentData[]>([]);
  const [totalComments, setTotalComments] = useState(initialCommentCount);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const dispatchCommentCount = (count: number) => {
    window.dispatchEvent(
      new CustomEvent("comment-count-changed", { detail: { count } }),
    );
  };

  const fetchComments = async () => {
    setLoading(true);
    try {
      const headers: HeadersInit = {};
      if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;
      const res = await fetch(`/api/posts/${postId}/comments`, { headers });
      if (res.ok) {
        const data = await res.json();
        setComments(data.data.comments);
        setTotalComments(data.data.totalComments);
        dispatchCommentCount(data.data.totalComments);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    if (!accessToken) {
      setShowLoginModal(true);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ content: newComment }),
      });
      if (res.ok) {
        const data = await res.json();
        setComments((prev) => [data.data, ...prev]);
        setTotalComments((prev) => {
          const next = prev + 1;
          dispatchCommentCount(next);
          return next;
        });
        setNewComment("");
        trackGa4Event("post_comment_added", { post_id: postId });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleReplyPosted = (parentId: number, newReply: CommentData) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === parentId ? { ...c, replies: [...c.replies, newReply] } : c,
      ),
    );
    setTotalComments((prev) => {
      const next = prev + 1;
      dispatchCommentCount(next);
      return next;
    });
  };

  const handleCommentDeleted = (commentId: number, parentId?: number) => {
    if (parentId) {
      // It's a reply — remove from parent's replies array
      setComments((prev) =>
        prev.map((c) =>
          c.id === parentId
            ? {
                ...c,
                replies: (c.replies ?? []).filter((r) => r.id !== commentId),
              }
            : c,
        ),
      );
    } else {
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    }
    setTotalComments((prev) => {
      const next = Math.max(0, prev - 1);
      dispatchCommentCount(next);
      return next;
    });
  };

  return (
    <section
      id="discussion-section"
      className="mt-12 pt-8 border-t border-stone-200"
    >
      <h2 className="text-xl font-bold text-stone-900 mb-6 flex items-center gap-2">
        Discussion
        {totalComments > 0 && (
          <span className="text-sm font-normal text-stone-500">
            ({totalComments})
          </span>
        )}
      </h2>

      {/* New comment input */}
      <div className="flex gap-3 mb-8">
        <Avatar className="w-8 h-8 shrink-0 mt-1">
          <AvatarFallback className="text-xs bg-stone-200 text-stone-700">
            {session?.user?.name ? getInitials(session.user.name) : "?"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 relative">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value.slice(0, COMMENT_MAX_CHARS))}
            placeholder={
              session ? "Write a comment..." : "Sign in to join the discussion"
            }
            className="text-sm resize-none min-h-[80px] bg-stone-50 border-stone-200 focus:border-stone-400 pr-12 pb-6"
            onClick={() => {
              if (!session) setShowLoginModal(true);
            }}
            readOnly={!session}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
            }}
          />
          {session && (
            <span className={`absolute bottom-2 left-3 text-xs ${newComment.length >= COMMENT_MAX_CHARS ? "text-red-400" : "text-stone-300"}`}>
              {newComment.length}/{COMMENT_MAX_CHARS}
            </span>
          )}
          <Button
            type="button"
            loading={submitting}
            onClick={handleSubmit}
            className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full bg-stone-800 hover:bg-stone-900 text-white flex items-center justify-center"
            aria-label="Post comment"
          >
            {!submitting && <Send className="w-3.5 h-3.5" />}
          </Button>
        </div>
      </div>

      {/* Comments list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-stone-200 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-stone-200 rounded w-1/4" />
                <div className="h-16 bg-stone-100 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-sm text-stone-400 text-center py-8">
          No comments yet. Be the first to share your thoughts!
        </p>
      ) : (
        <div className="space-y-5">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              accessToken={accessToken}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
              onReplyPosted={handleReplyPosted}
              onDeleted={(id) => handleCommentDeleted(id)}
              showLoginModal={() => setShowLoginModal(true)}
            />
          ))}
        </div>
      )}

      {/* Login modal */}
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription>
              You need to be logged in to participate in the discussion.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-4">
            <Button variant="outline" onClick={() => setShowLoginModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={() =>
                router.push(
                  `/login?callbackUrl=${encodeURIComponent(pathname)}`,
                )
              }
            >
              Go to Login
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
