import React from 'react';
import ProfileItem from "@/components/layout/profile-item";

const ProfileList = ({data}: any) => {
  return (
      <div component-name="ProfileList"
           className={"px-6 py-4 flex flex-col gap-4 border-b border-gray-200 last:border-b-0"}>
        {
          data?.map((item: any) => <ProfileItem key={item?.href} {...item}/>)
        }
      </div>
  );
};

export default ProfileList;