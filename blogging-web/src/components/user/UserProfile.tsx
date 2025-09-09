"use client"

import React, {useState} from 'react';
import {
  User,
  FileText,
  LogOut,
  Upload,
  Camera,
  Clock,
  Heart,
  Bookmark,
  Eye,
  Calendar
} from 'lucide-react';
import {cn} from "@/lib/utils";

const PostsSection = () => {
  const [activePostTab, setActivePostTab] = useState('recent');

  const postTabs = [
    {id: 'recent', label: 'Recent View', icon: Eye},
    {id: 'liked', label: 'Liked', icon: Heart},
    {id: 'bookmarks', label: 'Bookmarks', icon: Bookmark}
  ];

  const samplePosts = [
    {
      id: 1,
      title: "The Future of Web Development: Why React Server Components are Game Changers",
      author: "Sarah Johnson",
      readTime: "5 min read",
      date: "Dec 15, 2023",
      likes: 247,
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 2,
      title: "Building Scalable Applications with Next.js 14",
      author: "Mike Chen",
      readTime: "8 min read",
      date: "Dec 12, 2023",
      likes: 189,
      image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 3,
      title: "Mastering TypeScript: Advanced Patterns and Best Practices",
      author: "Emma Davis",
      readTime: "12 min read",
      date: "Dec 10, 2023",
      likes: 324,
      image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    }
  ];

  const getEmptyStateContent = () => {
    switch (activePostTab) {
      case 'recent':
        return {
          icon: Eye,
          title: "No recent views",
          description: "Posts you've recently viewed will appear here."
        };
      case 'liked':
        return {
          icon: Heart,
          title: "No liked posts yet",
          description: "Posts you've liked will be saved here for easy access."
        };
      case 'bookmarks':
        return {
          icon: Bookmark,
          title: "No bookmarks yet",
          description: "Save interesting posts to read later by bookmarking them."
        };
      default:
        return {
          icon: Eye,
          title: "No posts found",
          description: "No posts to display."
        };
    }
  };

  const PostCard = ({post}: { post: any }) => (
      <div
          className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group">
        <div className="flex items-start">
          <div className="flex-1 p-6 flex gap-10 justify-between">
            <div>
              <h3>
                {post.title}
              </h3>
              <p className="text-gray-600 text-base leading-relaxed mt-4">
                Building a Front-end app is easy. Maintaining it as it grows? That's where the real
                game begins, as I've talked about in my other articles about scalable architecture
                patterns...
              </p>
            </div>


            <img
                src={post.image}
                alt={post.title}
                className="w-40 h-40 object-cover rounded-base"
            />
          </div>

        </div>
      </div>
  );

  const emptyState = getEmptyStateContent();
  const EmptyIcon = emptyState.icon;

  return (
      <div className="max-w-4xl">
        <h2 className="text-xl font-semibold text-gray-900 mb-8">Posts</h2>

        {/* Post Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {postTabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                  <button
                      key={tab.id}
                      onClick={() => setActivePostTab(tab.id)}
                      className={`
                  flex items-center pb-4 text-sm font-medium transition-colors duration-200
                  ${activePostTab === tab.id
                          ? 'text-gray-900 border-b-2 border-gray-900'
                          : 'text-gray-500 hover:text-gray-700'
                      }
                `}
                  >
                    <TabIcon className="w-4 h-4 mr-2"/>
                    {tab.label}
                  </button>
              );
            })}
          </nav>
        </div>

        {/* Content based on active tab */}
        {activePostTab === 'recent' && samplePosts.length > 0 ? (
            <div className="space-y-6">
              {samplePosts.map((post) => (
                  <PostCard key={post.id} post={post}/>
              ))}
            </div>
        ) : activePostTab === 'liked' && samplePosts.length > 0 ? (
            <div className="space-y-6">
              {samplePosts.slice(0, 2).map((post) => (
                  <PostCard key={post.id} post={post}/>
              ))}
            </div>
        ) : activePostTab === 'bookmarks' && samplePosts.length > 0 ? (
            <div className="space-y-6">
              {samplePosts.slice(0, 1).map((post) => (
                  <PostCard key={post.id} post={post}/>
              ))}
            </div>
        ) : (
            // Empty State
            <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
              <EmptyIcon className="w-12 h-12 text-gray-300 mx-auto mb-4"/>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{emptyState.title}</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">{emptyState.description}</p>
              <button
                  className="px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200">
                Explore Posts
              </button>
            </div>
        )}
      </div>
  );
};

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [displayName, setDisplayName] = useState('');
  const [characterCount, setCharacterCount] = useState(0);

  const handleDisplayNameChange = (e: any) => {
    const value = e.target.value;
    if (value.length <= 32) {
      setDisplayName(value);
      setCharacterCount(value.length);
    }
  };

  const sidebarItems = [
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      active: activeTab === 'profile'
    },
    {
      id: 'posts',
      label: 'Posts',
      icon: FileText,
      active: activeTab === 'posts'
    },
    {
      id: 'logout',
      label: 'Log out',
      icon: LogOut,
      active: false,
      highlighted: true
    }
  ];
  return (
      <div className="">
        <div className="max-w-7xl mx-auto px-8 ">
          <div className="flex gap-12">
            {/* Sidebar */}
            <div className="w-64 flex-shrink-0">
              <nav className="space-y-2">
                {sidebarItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                      <button
                          key={item.id}
                          onClick={() => item.id !== 'logout' ? setActiveTab(item.id) : null}
                          className={`
                      w-full flex items-center px-4 py-2 text-left cursor-pointer rounded-lg transition-all duration-200
                      text-gray-600 text-sm font-normal hover:bg-gray-100`}
                      >
                        <IconComponent className="w-5 h-5 mr-3"/>
                        <span className={cn(
                            "text-gray-600",
                            item.active && "font-semibold text-black-primary"
                        )}>
                          {item.label}
                        </span>
                      </button>
                  );
                })}
              </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {activeTab === 'profile' && (
                  <div className="max-w-2xl">
                    {/* Avatar Section */}
                    <div className="mb-16">
                      <h2 className="text-xl font-semibold text-gray-900 mb-3">Avatar</h2>
                      <div className="flex items-center gap-8">
                        <div className="relative group cursor-pointer">
                          <div
                              className="w-24 h-24 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                            <div
                                className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-full flex items-center justify-center transition-all duration-200">
                              <Camera
                                  className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"/>
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-2">An avatar is optional but
                            strongly recommended.</p>
                          <button
                              className="inline-flex items-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200">
                            <Upload className="w-4 h-4 mr-2"/>
                            Upload Avatar
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Display Name Section */}
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-3">Display Name</h2>
                      <p className="text-gray-600 mb-8 leading-relaxed">
                        Please enter your full name, or a display name you are comfortable with.
                      </p>

                      <div className="space-y-6">
                        <div>
                          <input
                              type="text"
                              value={displayName}
                              onChange={handleDisplayNameChange}
                              placeholder="Enter your display name"
                              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                          />
                          <div className="flex justify-between items-center mt-3">
                            <p className="text-sm text-gray-500">
                              Please use 32 characters at maximum.
                            </p>
                            <div className="flex items-center gap-4">
                              <span className="text-sm text-gray-400">{characterCount}/32</span>
                              <button
                                  className="px-6 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                                Save
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
              )}

              {activeTab === 'posts' && (
                  <PostsSection/>
              )}
            </div>
          </div>
        </div>
      </div>
  );
};

export default UserProfile;