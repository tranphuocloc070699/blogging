"use client"

import React, {useState} from 'react';
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  MoreHorizontal,
  Clock,
  User,
  Calendar
} from 'lucide-react';


import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from "next/link";

const PostDetail = () => {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likes, setLikes] = useState(247);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  return (
      <div>
        <div className="px-6">
          {/* Header */}
          <div className={"flex items-center justify-between mb-10"}>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator/>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/components">Components</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator/>
                <BreadcrumbItem>
                  <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4"/>
              <span>Jul 4</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="mb-4 text-center">
            The Future of Web Development: Why React Server Components are Game Changers
          </h1>

          {/* Action Bar */}
          <div className="flex items-center justify-between py-4 border-y border-gray-200 my-8">
            <div className="flex items-center space-x-6">
              <button
                  onClick={handleLike}
                  className={`flex items-center space-x-2 ${liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'} transition-colors`}
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`}/>
                <span className="text-sm">{likes}</span>
              </button>

              <button
                  className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors">
                <MessageCircle className="w-4 h-4"/>
                <span className="text-sm">23</span>
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <button
                  onClick={handleBookmark}
                  className={`${bookmarked ? 'text-amber-600' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
              >
                <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`}/>
              </button>

              <button className="text-gray-500 hover:text-gray-700 transition-colors">
                <Share2 className="w-4 h-4"/>
              </button>
            </div>
          </div>
          {/* Featured Image */}
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            Exploring how React Server Components are revolutionizing the way we think about
            client-server architecture and performance optimization in modern web applications.
          </p>
          <div className="">
            <img
                src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                alt="React Development"
                className="w-full h-64 md:h-80 object-cover rounded-lg"
            />
          </div>
        </div>

        {/* Content */}
        <div className="px-6">
          <div className="prose prose-lg max-w-none">


            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What are React Server
              Components?</h2>

            <p className="text-gray-800 leading-relaxed mb-6">
              Server Components are a new type of component that runs on the server and sends
              rendered output to the client. Unlike traditional Server-Side Rendering (SSR), Server
              Components don't hydrate on the client. They remain on the server, which means they
              can directly access databases, file systems, and other server-only resources without
              exposing sensitive data to the client.
            </p>

            <blockquote className="border-l-4 border-gray-300 pl-6 italic text-gray-700 my-8">
              "Server Components allow us to move computation back to the server while maintaining
              the interactivity that makes React applications so powerful."
            </blockquote>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Key Benefits</h2>

            <p className="text-gray-800 leading-relaxed mb-4">
              The advantages of Server Components extend far beyond simple performance improvements:
            </p>

            <p className="text-gray-800 leading-relaxed mb-6">
              <strong>Zero Client-Side JavaScript:</strong> Server Components don't add to your
              JavaScript bundle size. They're rendered on the server and send HTML to the client,
              which means faster initial page loads and better performance on low-powered devices.
            </p>

            <p className="text-gray-800 leading-relaxed mb-6">
              <strong>Direct Backend Access:</strong> You can fetch data directly in your components
              without creating API endpoints. This eliminates waterfalls and reduces the complexity
              of your data-fetching logic.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Real-World
              Implementation</h2>

            <p className="text-gray-800 leading-relaxed mb-6">
              Let's look at a practical example. Traditional client-side data fetching often
              involves multiple round trips and complex state management. With Server Components,
              you can simplify this dramatically while improving performance.
            </p>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 my-8">
              <code className="text-sm text-gray-800">
                {`// Server Component - runs on server
async function BlogPost({ id }) {
  const post = await db.posts.findById(id);
  const comments = await db.comments.findByPostId(id);
  
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <CommentList comments={comments} />
    </article>
  );
}`}
              </code>
            </div>

            <p className="text-gray-800 leading-relaxed mb-8">
              The implications for the React ecosystem are profound. We're seeing frameworks like
              Next.js 13+ and Remix evolve to take advantage of these capabilities, and the
              developer experience is becoming more streamlined as a result.
            </p>
          </div>


          {/* Tags */}
          <div className="flex flex-wrap gap-2 pb-8">
            {['React', 'Web Development', 'JavaScript', 'Performance', 'Frontend'].map((tag) => (
                <span
                    key={tag}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 cursor-pointer transition-colors"
                >
              {tag}
            </span>
            ))}
          </div>
        </div>
      </div>
  );
};

export default PostDetail;