import React, {PropsWithChildren} from 'react';
import {Settings} from "lucide-react";
import {useSheet} from "@/components/sheet-views/use-sheet";

const SettingsButton = ({children}: PropsWithChildren) => {
  const {openSheet} = useSheet();


  return (
      <div component-name="SettingsButton">
        {children ? (
            children
        ) : (
            <Settings strokeWidth={1.8}
                      className="!h-5 !w-auto animate-spin-slow" onClick={() => openSheet({})}/>
        )}
      </div>
  );
};

export default SettingsButton;