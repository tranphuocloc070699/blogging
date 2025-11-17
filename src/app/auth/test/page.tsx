"use client"

import React, { useState } from 'react';
import { Search, User, BookOpen, Calendar } from 'lucide-react';

export default function RaynoxBlog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');

  // Sample data
  const posts = [
    {
      id: 1,
      title: 'Getting Started with React Hooks',
      excerpt: 'Learn how to use React Hooks to manage state and side effects in your functional components...',
      date: '2025-09-15',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop',
      tags: ['React', 'JavaScript']
    },
    {
      id: 2,
      title: 'Building REST APIs with Node.js',
      excerpt: 'A comprehensive guide to creating scalable REST APIs using Node.js and Express framework...',
      date: '2025-09-10',
      thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop',
      tags: ['Node.js', 'API']
    },
    {
      id: 3,
      title: 'CSS Grid Layout Mastery',
      excerpt: 'Master CSS Grid and create complex responsive layouts with ease. Tips and tricks included...',
      date: '2025-09-05',
      thumbnail: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=400&h=250&fit=crop',
      tags: ['CSS', 'Design']
    }
  ];

  const series = [
    {
      id: 1,
      title: 'React Fundamentals',
      postCount: 8,
      description: 'Complete guide to React from basics to advanced'
    },
    {
      id: 2,
      title: 'Full-Stack Development',
      postCount: 12,
      description: 'Build modern web applications end-to-end'
    },
    {
      id: 3,
      title: 'Web Performance',
      postCount: 6,
      description: 'Optimize your websites for speed and efficiency'
    }
  ];

  const tags = ['All', 'React', 'JavaScript', 'Node.js', 'CSS', 'API', 'Design', 'TypeScript', 'Python', 'Vue.js', 'Angular', 'DevOps'];

  return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="border-b bg-white sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo and Navigation */}
              <div className="flex items-center space-x-8">
                <h1 className="text-2xl font-bold">Raynox</h1>
                <nav className="hidden md:flex space-x-6">
                  <a href="#posts" className="text-sm font-medium text-gray-700 hover:text-black transition-colors">
                    Posts
                  </a>
                  <a href="#about" className="text-sm font-medium text-gray-700 hover:text-black transition-colors">
                    About
                  </a>
                </nav>
              </div>

              {/* User Icon */}
              <button className="flex items-center space-x-2 text-gray-700 hover:text-black transition-colors">
                <User className="w-5 h-5" />
                <span className="hidden sm:inline text-sm font-medium">Login</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Posts Section - Left Side (8 columns) */}
            <div className="lg:col-span-8">
              {/* Search and Tags in One Line */}
              <div className="flex items-center gap-4 mb-6">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                      type="text"
                      placeholder="Search posts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-11 pr-4 py-2.5 bg-white rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>

                {/* Scrollable Tags */}
                <div className="hidden lg:block overflow-x-auto scrollbar-hide snap-x snap-mandatory max-w-md">
                  <div className="flex gap-2">
                    {tags.map((tag) => (
                        <button
                            key={tag}
                            onClick={() => setSelectedTag(tag)}
                            className={`snap-start px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                                selectedTag === tag
                                    ? 'bg-black text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                          {tag}
                        </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mobile Tags */}
              <div className="lg:hidden overflow-x-auto scrollbar-hide snap-x snap-mandatory mb-6">
                <div className="flex gap-2 pb-2">
                  {tags.map((tag) => (
                      <button
                          key={tag}
                          onClick={() => setSelectedTag(tag)}
                          className={`snap-start px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                              selectedTag === tag
                                  ? 'bg-black text-white'
                                  : 'bg-white text-gray-700 hover:bg-gray-100'
                          }`}
                      >
                        {tag}
                      </button>
                  ))}
                </div>
              </div>

              {/* Posts List */}
              <div className="space-y-6">
                {posts.map((post) => (
                    <article
                        key={post.id}
                        className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    >
                      <div className="md:flex">
                        {/* Thumbnail */}
                        <div className="md:w-64 md:flex-shrink-0">
                          <img
                              src={post.thumbnail}
                              alt={post.title}
                              className="w-full h-48 md:h-full object-cover"
                          />
                        </div>

                        {/* Content */}
                        <div className="p-6 flex-1">
                          <h2 className="text-xl font-bold mb-2 hover:underline">
                            {post.title}
                          </h2>
                          <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(post.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </div>
                            <div className="flex gap-2">
                              {post.tags.map((tag) => (
                                  <span
                                      key={tag}
                                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                                  >
                              {tag}
                            </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                ))}
              </div>
            </div>

            {/* Series Section - Right Side (4 columns) */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-xl p-6 sticky top-24">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Blog Series
                </h3>
                <div className="space-y-4">
                  {series.map((item) => (
                      <div
                          key={item.id}
                          className="border-l-2 border-black pl-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors rounded-r"
                      >
                        <h4 className="font-semibold mb-1">{item.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                        <span className="text-xs text-gray-500">{item.postCount} posts</span>
                      </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>

        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>
  );
}