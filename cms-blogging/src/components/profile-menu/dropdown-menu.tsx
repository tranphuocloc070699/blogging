import React from 'react';
import {routes} from "@/config/routes";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import Link from "next/link";
import {Button} from "@/components/ui/button";

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
  return (
      <div className="text-left rtl:text-right">
        <div className="flex items-center border-b border-gray-300 px-6 pb-5 pt-6">
          <Avatar
          >
            <AvatarImage
                src="https://isomorphic-furyroad.s3.amazonaws.com/public/avatars/avatar-11.webp"/>
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="ms-3">
            <h5 className="font-semibold">
              Albert Flores
            </h5>
            <h6>flores@doe.io</h6>
          </div>
        </div>
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
          <span

              className="text-sm cursor-pointer text-destructive  my-0.5 flex items-center rounded-md px-2.5 py-2 hover:bg-gray-100 focus:outline-none hover:dark:bg-gray-50/50"
          >
            Sign Out
          </span>
        </div>
      </div>
  );
};

export default DropdownMenu;