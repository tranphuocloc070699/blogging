// app/(protected)/profile/page.tsx   ← put in app directory!
import { requireAuth } from "@/action/auth.action";
import BlogPostList from '@/components/public/blog-posts/blog-post-list';
import { LogoutButton } from "@/components/public/logout-button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import postService from '@/services/modules/post-service';
import userService from "@/services/modules/user-service";
import Link from "next/link";
export default async function ProfilePage() {
        const session = await requireAuth();
        const user = session.user;
        const accessToken = session.accessToken;

        // Fetch liked posts directly on the server
        let likedPosts: any[] = [];
        let likedTotal = 0;
        let likedError = false;
        let userSince = null;

        try {
                const response = await userService.getInfo(accessToken ?? "");
                if (response.body.data.createdAt) userSince = response.body.data.createdAt
        } catch (error) {
                console.error({ getInfoError: error })
        }



        try {
                const response = await postService.getMyLikedPosts({
                        page: 1,
                        size: 10,
                        accessToken: accessToken ?? "",
                });

                if (response.body.status === 200 && response.body.data) {
                        likedPosts = response.body.data.posts || [];
                        likedTotal = response.body.data.total || 0;
                }
        } catch (error) {
                console.error("Failed to load liked posts:", error);
                likedError = true;
        }

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
                                <h1 className='m-0 text-2xl font-bold'>Your Profile</h1>
                                <LogoutButton />
                        </div>

                        <Tabs defaultValue="my-detail" className='md:mt-6 mt-4'>
                                <TabsList className='grid w-full grid-cols-2'>
                                        <TabsTrigger value="my-detail">My Detail</TabsTrigger>
                                        <TabsTrigger value="post-liked">
                                                Post Liked ({likedTotal})
                                        </TabsTrigger>
                                </TabsList>

                                <TabsContent value="my-detail" className="mt-6">
                                        <Card>
                                                <CardHeader>
                                                        <CardTitle>Profile Information</CardTitle>
                                                        <CardDescription>Your account details and information</CardDescription>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                <div>
                                                                        <p className="text-sm font-medium text-gray-500">Username</p>
                                                                        <p className="text-base mt-1">{user.username || 'N/A'}</p>
                                                                </div>
                                                                <div>
                                                                        <p className="text-sm font-medium text-gray-500">Email</p>
                                                                        <p className="text-base mt-1">{user.email}</p>
                                                                </div>
                                                                <div>
                                                                        <p className="text-sm font-medium text-gray-500">Role</p>
                                                                        <p className="text-base mt-1 capitalize">{user.role || 'user'}</p>
                                                                </div>
                                                                <div>
                                                                        <p className="text-sm font-medium text-gray-500">Member Since</p>
                                                                        <p className="text-base mt-1">
                                                                                {userSince ? new Date(userSince).toLocaleDateString('en-US', {
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
                                                        {likedError ? (
                                                                <p className="text-red-500 text-center py-8">Failed to load liked posts</p>
                                                        ) : likedPosts.length > 0 ? (
                                                                <BlogPostList
                                                                        posts={likedPosts}
                                                                        hasMore={likedPosts.length < likedTotal}
                                                                        currentPage={1}
                                                                        total={likedTotal}
                                                                />
                                                        ) : (
                                                                <p className="text-gray-500 text-center py-8">
                                                                        No liked posts yet. <Link href="/" className="text-blue-600 underline">Explore posts</Link>
                                                                </p>
                                                        )}
                                                </CardContent>
                                        </Card>
                                </TabsContent>
                        </Tabs>
                </div>
        );
}