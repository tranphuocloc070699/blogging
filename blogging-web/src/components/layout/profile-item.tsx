import React from 'react';
import Link from "next/link";


const ProfileItem = (props: any) => {
  return (
      <div component-name="ProfileItem">
        <Link href={props?.href}
              className={"typo-small text-neutral-600"}>{props?.label}</Link>
      </div>
  );
};

export default ProfileItem;