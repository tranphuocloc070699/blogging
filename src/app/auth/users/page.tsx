'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui';
import { User } from '@/types/users';
import userService from '@/services/modules/user-service';
import { useClientSession } from '@/hooks/use-client-session';
const pageHeader = {
  title: 'Users',
  breadcrumb: [
    {
      href: '/',
      name: 'Home',
    },
    {
      name: 'Users',
    },
  ],
};

export default function UsersPage() {
  const [users, setUsers] = useState<(User & { postCount?: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const hasLoaded = useRef(false);
  const session = useClientSession();
  useEffect(() => {
    // Prevent duplicate API calls in development (React Strict Mode)
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const { body } = await userService.getAllUsers(session?.accessToken ?? "");
      setUsers(Array.isArray(body.data) ? body.data : []);
    } catch (error) {
      toast.error('Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      await userService.deleteUser(session?.accessToken ?? "", parseInt(id));
      setUsers(prev => prev.filter(u => u.id !== id));
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <Button asChild className="w-full @lg:w-auto">
          <a href="/auth/users/create">
            <Plus className="w-4 h-4 mr-2" />
            Create User
          </a>
        </Button>
      </PageHeader>

      <div className="@container">
        <div className="grid grid-cols-1 gap-6 @4xl:grid-cols-2 @7xl:grid-cols-12 3xl:gap-8">
          <div className="col-span-full">
            <div className="rounded-lg border border-gray-200 bg-white">
              {loading ? (
                <div className="p-6 text-center">Loading users...</div>
              ) : users.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No users found. Create your first user to get started.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Username
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Posts Count
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created At
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {user.username}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.email || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                              {user.role || 'USER'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.postCount || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(user.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                              >
                                <a href={`/auth/users/${user.id}/edit`}>
                                  <Edit className="w-4 h-4" />
                                </a>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(user.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
