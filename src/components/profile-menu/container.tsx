import React from 'react';
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {cn} from "@/lib/utils";
import DropdownMenu from "@/components/profile-menu/dropdown-menu";
import UserProfile from "@/components/public/user-profile";



const ProfileMenu = () => {
  return (
      <Popover>
        <PopoverTrigger>
          <span
              className={cn(
                  'w-9 shrink-0 rounded-full outline-none focus-visible:ring-[1.5px] focus-visible:ring-gray-400 focus-visible:ring-offset-2 active:translate-y-px sm:w-10'
              )}
          >
            <UserProfile/>
          </span>
        </PopoverTrigger>
        <PopoverContent align={"end"} className={"p-0"}>
          <DropdownMenu/>
        </PopoverContent>
      </Popover>
  );
};

export default ProfileMenu;