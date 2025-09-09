import React from 'react';
import NotificationDropdown from "@/components/layout/notification-dropdown";
import ProfileDropdown from "@/components/layout/profile-dropdown";

const HeaderMenuRight = () => {
  return (
      <div component-name="HeaderMenuRight" className={"flex items-center gap-4"}>
        <NotificationDropdown/>
        <ProfileDropdown/>
      </div>
  );
};

export default HeaderMenuRight;