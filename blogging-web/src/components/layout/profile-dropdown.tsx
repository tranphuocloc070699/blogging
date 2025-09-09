import React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {Button} from "@/components/ui/button";
import {Bell, ChevronDown} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Badge} from "@/components/ui/badge";
import ProfileDropdownContent from "@/components/layout/profile-dropdown-content";


const ProfileDropdown = () => {
  return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full cursor-pointer relative">
            <Avatar>
              <AvatarFallback className={"text-muted bg-black"}>LT</AvatarFallback>
            </Avatar>
            <Badge
                className="h-5 w-5 text-[10px] rounded-full tabular-nums absolute -bottom-2 -right-2 border border-white"
                variant="secondary"
            >
              <ChevronDown/>
            </Badge>
          </Button>
        </PopoverTrigger>
        <PopoverContent align={"end"} sideOffset={10} className={"z-[999] p-0"}>
          <ProfileDropdownContent/>
        </PopoverContent>
      </Popover>
  );
};

export default ProfileDropdown;