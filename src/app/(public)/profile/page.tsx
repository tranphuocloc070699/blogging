"use client"

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import React, { useState, useEffect } from 'react';
import {
        Tabs,
        TabsContent,
        TabsList,
        TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PostService from '@/services/modules/post-service';
import BlogPostList from '@/components/public/blog-posts/blog-post-list';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/store/user.store';

export default function ProfilePage() {
        const { user, isAuthenticated } = useUserStore();
        const [likedPosts, setLikedPosts] = useState<any[]>([]);
        const [viewedPosts, setViewedPosts] = useState<any[]>([]);
        const [likedLoading, setLikedLoading] = useState(true);
        const [viewedLoading, setViewedLoading] = useState(true);
        const [likedTotal, setLikedTotal] = useState(0);
        const [viewedTotal, setViewedTotal] = useState(0);

        useEffect(() => {
                if (!isAuthenticated) {
                        return;
                }

                const postService = new PostService();

                // Fetch liked posts
                const fetchLikedPosts = async () => {
                        try {
                                setLikedLoading(true);
                                const response = await postService.getMyLikedPosts({
                                        page: 1,
                                        size: 10,
                                });
                                if (response.body.data) {
                                        setLikedPosts(response.body.data.posts || []);
                                        setLikedTotal(response.body.data.total || 0);
                                }
                        } catch (error) {
                                console.error('Failed to fetch liked posts:', error);
                        } finally {
                                setLikedLoading(false);
                        }
                };

                // Fetch viewed posts
                const fetchViewedPosts = async () => {
                        try {
                                setViewedLoading(true);
                                const response = await postService.getMyViewedPosts({
                                        page: 1,
                                        size: 10,
                                });
                                if (response.body.data) {
                                        setViewedPosts(response.body.data.posts || []);
                                        setViewedTotal(response.body.data.total || 0);
                                }
                        } catch (error) {
                                console.error('Failed to fetch viewed posts:', error);
                        } finally {
                                setViewedLoading(false);
                        }
                };

                fetchLikedPosts();
                // fetchViewedPosts();
        }, [isAuthenticated]);

        return (
                <div className='max-w-3xl mx-auto px-4 md:px-0 pb-20'>
                        <Breadcrumb>
                                <BreadcrumbList>
                                        <BreadcrumbItem>
                                                <BreadcrumbLink href="/">Home</BreadcrumbLink>
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator />
                                        <BreadcrumbItem>
                                                <BreadcrumbPage>Profile</BreadcrumbPage>
                                        </BreadcrumbItem>
                                </BreadcrumbList>
                        </Breadcrumb>

                        <div className="flex items-center justify-between md:mt-6 mt-4">
                                <h1 className='m-0'>Your Profile</h1>
                                <form action="/api/users/log-out" method="POST">
                                        <Button variant="outline" size="sm" className="gap-2">
                                                <LogOut className="w-4 h-4" />
                                                Log out
                                        </Button>
                                </form>
                        </div>

                        <Tabs defaultValue="my-detail" className='md:mt-6 mt-4'>
                                <TabsList className='grid w-full grid-cols-2'>
                                        <TabsTrigger value="my-detail">My Detail</TabsTrigger>
                                        <TabsTrigger value="post-liked">Post Liked ({likedTotal})</TabsTrigger>
                                        {/* <TabsTrigger value="post-read">Post Read ({viewedTotal})</TabsTrigger> */}
                                </TabsList>

                                <TabsContent value="my-detail" className="mt-6">
                                        <Card>
                                                <CardHeader>
                                                        <CardTitle>Profile Information</CardTitle>
                                                        <CardDescription>Your account details and information</CardDescription>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div>
                                                                        <p className="text-sm font-medium text-gray-500">Username</p>
                                                                        <p className="text-base mt-1">{user.username || 'N/A'}</p>
                                                                </div>
                                                                <div>
                                                                        <p className="text-sm font-medium text-gray-500">Email</p>
                                                                        <p className="text-base mt-1">{user.email || 'N/A'}</p>
                                                                </div>
                                                                <div>
                                                                        <p className="text-sm font-medium text-gray-500">Role</p>
                                                                        <p className="text-base mt-1">{user.role || 'User'}</p>
                                                                </div>
                                                                <div>
                                                                        <p className="text-sm font-medium text-gray-500">Member Since</p>
                                                                        <p className="text-base mt-1">
                                                                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                                                                                        year: 'numeric',
                                                                                        month: 'long',
                                                                                        day: 'numeric'
                                                                                }) : 'N/A'}
                                                                        </p>
                                                                </div>
                                                        </div>
                                                </CardContent>
                                        </Card>
                                </TabsContent>

                                <TabsContent value="post-liked" className="mt-6">
                                        <Card>
                                                <CardHeader>
                                                        <CardTitle>Liked Posts</CardTitle>
                                                        <CardDescription>Posts you have liked</CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                        {likedLoading ? (
                                                                <p className="text-gray-500 text-center py-8">Loading...</p>
                                                        ) : likedPosts.length > 0 ? (
                                                                <BlogPostList
                                                                        posts={likedPosts}
                                                                        hasMore={false}
                                                                        currentPage={1}
                                                                        total={likedTotal}
                                                                />
                                                        ) : (
                                                                <p className="text-gray-500 text-center py-8">No liked posts yet</p>
                                                        )}
                                                </CardContent>
                                        </Card>
                                </TabsContent>
{/* 
                                <TabsContent value="post-read" className="mt-6">
                                        <Card>
                                                <CardHeader>
                                                        <CardTitle>Read Posts</CardTitle>
                                                        <CardDescription>Posts you have already read</CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                        {viewedLoading ? (
                                                                <p className="text-gray-500 text-center py-8">Loading...</p>
                                                        ) : viewedPosts.length > 0 ? (
                                                                <BlogPostList
                                                                        posts={viewedPosts}
                                                                        hasMore={false}
                                                                        currentPage={1}
                                                                        total={viewedTotal}
                                                                />
                                                        ) : (
                                                                <p className="text-gray-500 text-center py-8">No read posts yet</p>
                                                        )}
                                                </CardContent>
                                        </Card>
                                </TabsContent> */}
                        </Tabs>
                </div>
        );
}
