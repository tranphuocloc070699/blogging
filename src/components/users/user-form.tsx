'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui/input';
import { User, CreateUserDto, UpdateUserDto } from '@/types/users';
import userService from '@/services/modules/user-service';
import FormGroup from '@/components/form/form-group';
import { useClientSession } from '@/hooks/use-client-session';

const userSchema = z.object({
  username: z.string().min(1, 'Username is required').max(50, 'Username must be less than 50 characters'),
  email: z.string().email('Invalid email address').max(100, 'Email must be less than 100 characters').optional().or(z.literal('')),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
  role: z.string().optional(),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  user?: User & { postCount?: number };
  mode: 'create' | 'edit';
}

export default function UserForm({ user, mode }: UserFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const session = useClientSession();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: user ? {
      username: user.username,
      email: user.email || '',
      password: '',
      role: user.role || 'USER',
    } : {
      username: '',
      email: '',
      password: '',
      role: 'USER',
    },
  });

  const onSubmit = async (data: UserFormData) => {
    setLoading(true);
    try {
      // Remove empty optional fields
      const submitData: any = { ...data };
      if (!submitData.email) delete submitData.email;
      if (!submitData.password) delete submitData.password;
      if (!submitData.role) submitData.role = 'USER';

      if (mode === 'create') {
        // Password is required for create
        if (!data.password) {
          toast.error('Password is required');
          setLoading(false);
          return;
        }
        await userService.createUser(session?.accessToken ?? "", submitData as CreateUserDto);
        toast.success('User created successfully');
      } else if (user) {
        await userService.updateUser(session?.accessToken ?? "", parseInt(user.id), submitData as UpdateUserDto);
        toast.success('User updated successfully');
      }
      router.push('/auth/users');
    } catch (error) {
      toast.error(`Failed to ${mode} user`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("@container")}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative z-[19] [&_label.block>span]:font-medium"
      >
        <div className="pt-10 pb-10 mb-10 grid gap-7 divide-y divide-dashed divide-gray-200 @2xl:gap-9 @3xl:gap-11">
          <FormGroup
            title="User Information"
            description="Enter the user details"
          >
            <div className="col-span-full">
              <Input
                label="Username"
                placeholder="Enter username"
                {...register('username')}
                error={errors.username?.message as string}
                required
              />
            </div>

            <div className="col-span-full">
              <Input
                label="Email"
                type="email"
                placeholder="user@example.com"
                {...register('email')}
                error={errors.email?.message as string}
              />
            </div>

            <div className="col-span-full">
              <Input
                label="Password"
                type="password"
                placeholder={mode === 'edit' ? 'Leave empty to keep current password' : 'Enter password'}
                {...register('password')}
                error={errors.password?.message as string}
                required={mode === 'create'}
              />
              {mode === 'edit' && (
                <p className="mt-1 text-xs text-gray-500">
                  Leave empty to keep the current password
                </p>
              )}
            </div>

            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                {...register('role')}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-xs text-red-600">{errors.role.message as string}</p>
              )}
            </div>
          </FormGroup>
        </div>

        {/* Form Footer */}
        <div className="sticky bottom-0 z-10 border-t border-gray-200 bg-white px-4 py-4 dark:bg-gray-950 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {errors && Object.keys(errors).length > 0 && (
                <p className="text-sm text-red-600">
                  Please fix the errors above before submitting
                </p>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/auth/users')}
                disabled={loading}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={loading}
                loading={loading}
              >
                {mode === 'create' ? 'Create User' : 'Update User'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
