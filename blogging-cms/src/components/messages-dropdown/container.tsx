import React, {PropsWithChildren} from 'react';
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import MessagesList from "@/components/messages-dropdown/messages-list";

const MessagesDropdown = ({children}: PropsWithChildren) => {


  return (
      <Popover>
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent align={"end"}
                        className={"p-0 w-[320px] sm:w-[360px] 2xl:w-[420px]"}>
          <MessagesList/>
        </PopoverContent>
      </Popover>
  );
};

export default MessagesDropdown;