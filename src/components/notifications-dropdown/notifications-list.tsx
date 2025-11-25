import React from 'react';
import {Checkbox} from "@/components/ui/checkbox";

import {notificationsData} from '@/config/data';
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import {Badge} from '../ui/badge';
import Link from "next/link";
import {CircleCheckBig} from 'lucide-react';
import SimpleBar from "@/components/simple-bar";
import {Label} from "@/components/ui/label";
import {cn} from "@/lib/utils";

dayjs.extend(relativeTime);

const NotificationsList = () => {
  return (
      <div className="w-[320px] text-left sm:w-[360px] 2xl:w-[420px] py-6">
        <div className="mb-3 flex items-center justify-between px-6">
          <h4>
            Notifications
          </h4>
          <div className="flex items-center space-x-2">
            <Checkbox id="checkAll"/>
            <Label htmlFor="terms" className={"text-gray-600 font-normal"}>Mark all as read</Label>
          </div>

        </div>
        <SimpleBar className="max-h-[420px]">
          <div className="grid cursor-pointer grid-cols-1 gap-1 px-4">
            {notificationsData.map((item) => (
                <div
                    key={item.name + item.id}
                    className="group grid grid-cols-[auto_minmax(0,1fr)] gap-3 rounded-md px-2 py-2 pe-3 transition-colors hover:bg-gray-100 dark:hover:bg-gray-50"
                >
                  <div
                      className="flex h-10 w-10 items-center justify-center rounded bg-gray-100/70 dark:text-muted p-1 dark:bg-gray-50/50 [&>svg]:h-auto [&>svg]:w-5">
                    <item.icon/>
                  </div>
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center h-10">
                    <div className="w-full">
                      <h6
                          className={cn("w-11/12 truncate text-sm font-semibold text-gray-900 dark:text-gray-700/90 mb-0 normal-case", item.unRead ? "" : "font-normal")}>
                        {item.name}
                      </h6>
                      <span className="mx-auto whitespace-nowrap pr-8 text-xs text-gray-500">
                        {dayjs(item.sendTime).fromNow(true)}
                      </span>
                    </div>
                    <div className="ms-auto flex-shrink-0">
                      {item.unRead ? (
                          <Badge
                              renderAsDot
                              className="scale-90 size-3 bg-blue-600"
                          />
                      ) : (
                          <span
                              className="inline-block rounded-full bg-gray-100 p-0.5 dark:bg-gray-50">
              <CircleCheckBig className="!h-auto !w-[12px] text-gray-400"/>
                    </span>
                      )}
                    </div>
                  </div>
                </div>
            ))}
          </div>
        </SimpleBar>
        <Link
            href={'#'}
            className="-mr-6 block px-6 pb-0.5 pt-3 text-center hover:underline text-sm text-gray-600"
        >
          View All Activity
        </Link>
      </div>
  );
};

export default NotificationsList;