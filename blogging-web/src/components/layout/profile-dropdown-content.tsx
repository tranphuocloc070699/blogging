import React from 'react';
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {useTranslations} from "next-intl";
import ProfileItem from "@/components/layout/profile-item";
import ProfileList from "@/components/layout/profile-list";

const ProfileDropdownContent = () => {
  const t = useTranslations("ProfileDropdownContent");
  const navItems = [
    {href: "/user", label: t("myProfile")},
  ];
  const signOutItems = [
    {href: "/sign-out", label: t("signOut")},
  ];

  return (
      <div component-name="ProfileDropdownContent">
        <section className={"px-6 py-4 flex items-start gap-2 border-b border-gray-200"}>
          <Avatar>
            <AvatarFallback className={"text-muted bg-black"}>LT</AvatarFallback>
          </Avatar>
          <div>
            <h4 className={"typo-small"}>Albert Flores</h4>
            <span className={"typo-muted"}>flored@doe.io</span>
          </div>
        </section>
        <ProfileList data={navItems}/>
        <ProfileList data={signOutItems}/>
      </div>
  );
};

export default ProfileDropdownContent;