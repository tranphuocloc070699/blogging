import React from 'react';
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {cn} from "@/lib/utils";
import DropdownMenu from "@/components/profile-menu/dropdown-menu";


interface ProfileMenuProps {
  username?: string;
}

const ProfileMenu = ({username}: ProfileMenuProps) => {
  return (
      <Popover>
        <PopoverTrigger>
          <span
              className={cn(
                  'w-9 shrink-0 rounded-full outline-none focus-visible:ring-[1.5px] focus-visible:ring-gray-400 focus-visible:ring-offset-2 active:translate-y-px sm:w-10'
              )}
          >
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png"/>
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            {!!username && (
                <span className="username hidden text-gray-200 dark:text-gray-700 md:inline-flex">
              Hi, Andry
            </span>
            )}
          </span>
        </PopoverTrigger>
        <PopoverContent align={"end"} className={"p-0"}>
          <DropdownMenu/>
        </PopoverContent>
      </Popover>
  );
};

export default ProfileMenu;