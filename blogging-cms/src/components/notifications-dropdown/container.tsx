import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import React, {PropsWithChildren} from 'react';
import NotificationsList from "@/components/notifications-dropdown/notifications-list";

const NotificationsDropdown = ({children}: PropsWithChildren) => {
  return (
      <Popover>
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent className={"p-0 w-[320px] sm:w-[360px] 2xl:w-[420px]"} align={"end"}>
          <NotificationsList/>

        </PopoverContent>
      </Popover>
  );
};

export default NotificationsDropdown;