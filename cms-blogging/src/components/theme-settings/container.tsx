import React from 'react';
import SimpleBar from "@/components/simple-bar";
import ThemeSwitcher from "@/components/theme-settings/theme-switcher";
import LayoutSwitcher from "@/components/theme-settings/layout-switcher";


const DrawerSettings = () => {
  return (
      <SimpleBar className="h-[calc(100%-138px)]">
        <div className="px-5 py-6">
          <ThemeSwitcher/>
          {/*<AppDirection />*/}
          <LayoutSwitcher/>
          {/*<ColorOptions />*/}
        </div>
      </SimpleBar>
  );
};

export default DrawerSettings;