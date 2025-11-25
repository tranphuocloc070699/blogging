import React from 'react';
import NotificationsDropdown from "@/components/notifications-dropdown/container";
import RingBellSolidIcon from './icons/ring-bell-solid-icon';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MessagesDropdown from "@/components/messages-dropdown/container";
import ChatSolidIcon from "@/components/icons/chat-solid-icon";
import SettingsButton from "@/components/settings-button";
import ProfileMenu from "@/components/profile-menu/container";

const HeaderMenuRight = () => {

  return (
    <div
      className="ms-auto grid shrink-0 grid-cols-4 items-center gap-2 text-gray-700 xs:gap-3 xl:gap-4">
      <NotificationsDropdown>
        <Button
          aria-label="Notification"
          size={"icon"}
          variant={"ghost"}
          className="relative h-[34px] w-[34px] shadow backdrop-blur-md dark:bg-gray-100 md:h-9 md:w-9"
        >
          <RingBellSolidIcon className="!h-[18px] !w-auto" />
          <Badge
            renderAsDot
            className="absolute right-2.5 top-2.5 -translate-y-1/3 translate-x-1/2 size-2.5 bg-amber-600 border border-white dark:border-gray-100"
          />
        </Button>
      </NotificationsDropdown>
      <MessagesDropdown>
        <Button
          aria-label="Notification"
          size={"icon"}
          variant={"ghost"}
          className="relative h-[34px] w-[34px] shadow backdrop-blur-md dark:bg-gray-100 md:h-9 md:w-9"
        >
          <ChatSolidIcon className="!h-[18px] !w-auto" />
          <Badge
            renderAsDot
            className="absolute right-2.5 top-2.5 -translate-y-1/3 translate-x-1/2 bg-green-600 size-2.5 border border-white dark:border-gray-100"

          />
        </Button>
      </MessagesDropdown>

      <Button
        aria-label="Notification"
        size={"icon"}
        variant={"ghost"}
        className="relative h-[34px] w-[34px] shadow backdrop-blur-md dark:bg-gray-100 md:h-9 md:w-9"
      >
        <SettingsButton />
      </Button>
      <ProfileMenu />
    </div>
  );
};

export default HeaderMenuRight;