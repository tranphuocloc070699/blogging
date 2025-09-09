import React, {useMemo} from 'react';
import {Badge} from "@/components/ui/badge";
import {UserRoundCheck} from "lucide-react";

const NotificationItem = (props: any) => {
  const isSeen = useMemo(() => {
    return props?.status === "read";
  }, [props?.status]);


  return (
      <div component-name="NotificationItem"
           className={"flex items-start justify-between gap-4 cursor-pointer  mt-6  rounded-base"}>
          <span
              className={"rounded-base bg-gray-100 p-2  flex items-center justify-center"}>
            <UserRoundCheck strokeWidth={1}/>
          </span>
        <div>
          <p className={isSeen ? "typo-muted" : "typo-small"}>
            {props?.message}
          </p>
          <span className={"typo-muted"}>
              {props?.time}
            </span>
        </div>

      </div>
  );
};

export default NotificationItem;