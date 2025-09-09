import React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {Bell} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge"
import NotificationDropdownContent from "@/components/layout/notification-dropdown-content";

const NotificationDropdown = () => {
  return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="secondary" size="icon"
                  className="rounded-full cursor-pointer relative hover:bg-gray-200">
            <Bell/>
            <Badge
                className="h-5 w-5 text-[10px] rounded-full tabular-nums absolute -top-2 -right-2"
                variant="destructive"
            >
              9
            </Badge>
          </Button>
        </PopoverTrigger>
        <PopoverContent align={"end"}
                        className={"z-[999] md:w-[400px] w-screen left-0  md:rounded-lg rounded-none"}
                        sideOffset={10}>
          <NotificationDropdownContent/>
        </PopoverContent>
      </Popover>
  );
};

export default NotificationDropdown;