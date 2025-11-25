import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { messagesData } from '@/config/data';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import { CircleCheckBig } from 'lucide-react';
import SimpleBar from '../simple-bar';


const MessagesList = () => {
  return (
    <div className="w-[320px] text-left sm:w-[360px] 2xl:w-[420px] py-6">
      <div className="mb-3 flex items-center justify-between px-6">
        <h4>
          Messages
        </h4>
        <div className="flex items-center space-x-2">
          <Checkbox id="checkAll" />
          <Label htmlFor="terms" className={"text-gray-600 font-normal"}>View all</Label>
        </div>

      </div>
      <SimpleBar className="max-h-[406px]">
        <div className="grid cursor-pointer grid-cols-1 gap-1 px-4">
          {messagesData.map((item) => (
            <div
              key={item.name + item.id}
              className="group grid cursor-pointer grid-cols-[auto_minmax(0,1fr)] gap-2.5 rounded-md px-2 py-2.5 pe-3 transition-colors hover:bg-gray-100 dark:hover:bg-gray-50"
            >
              <div className={cn('relative', item.avatar.length > 1 && 'me-1')}>
                <Avatar
                  className={cn(
                    item.avatar.length > 1 &&
                    'relative -right-1 -top-0.5 !h-9 !w-9'
                  )}
                >
                  <AvatarImage src={item.avatar[0]} />
                </Avatar>

              </div>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center">
                <div className="w-full">
                  <h6 className="mb-0.5 w-11/12 truncate text-sm font-semibold text-gray-900 dark:text-gray-700">
                    {item.name}
                  </h6>
                  <div className="flex">
                    <h6 className="w-10/12 truncate pe-7 text-xs text-muted-foreground dark:text-gray-500">
                      {item.message}
                    </h6>
                    <span
                      className="mx-auto inline-block whitespace-nowrap pe-8 text-xs text-gray-500">
                      {dayjs(item.sendTime).fromNow(true)}
                    </span>
                  </div>
                </div>
                <div className="ms-auto flex-shrink-0">
                  {item.unRead ? (
                    <Badge
                      renderAsDot
                      className="scale-90 bg-blue-600"
                    />
                  ) : (
                    <span
                      className="inline-block rounded-full bg-gray-100 p-0.5 dark:bg-gray-50">
                      <CircleCheckBig className="h-auto w-[9px]" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </SimpleBar>

    </div>
  );
};

export default MessagesList;