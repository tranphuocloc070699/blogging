'use client';

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { routes } from "@/config/routes";
// import { useAuth } from '@/contexts/auth-context';
import Link from "next/link";

const menuItems = [
  {
    name: 'My Profile',
    href: routes.profiles.dashboard,
  },
  {
    name: 'Account Settings',
    href: routes.profiles.settings,
  },
  {
    name: 'Activity Log',
    href: '#',
  },
];

const DropdownMenu = () => {
  // const { user, logout } = useAuth();

  return (
    <div className="text-left rtl:text-right">
      {/* <div className="flex items-center border-b border-gray-300 px-6 pb-5 pt-6">
        <Avatar>
          <AvatarFallback className="bg-blue-600 text-white">
            {user?.username?.charAt(0)?.toUpperCase() || 'A'}
          </AvatarFallback>
        </Avatar>
        <div className="ms-3">
          <h5 className="font-semibold">
            {user?.username || 'Admin'}
          </h5>
          <h6 className={"mb-0 normal-case text-gray-600"}>
            {user?.role || 'Administrator'}
          </h6>
        </div>
      </div> */}
      <div className="grid px-3.5 py-3.5 font-medium text-gray-700">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="group my-0.5 flex items-center rounded-md px-2.5 py-2 hover:bg-gray-100 focus:outline-none hover:dark:bg-gray-50/50 text-sm"
          >
            {item.name}
          </Link>
        ))}
      </div>
      <div className="border-t border-gray-300 px-3.5 pb-4 pt-3">
        <button
          // onClick={logout}
          className="text-sm cursor-pointer text-destructive my-0.5 flex items-center rounded-md px-2.5 py-2 hover:bg-gray-100 focus:outline-none hover:dark:bg-gray-50/50 w-full text-left"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default DropdownMenu;