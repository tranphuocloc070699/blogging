import React from 'react';
import DrawerBlock from "@/components/theme-settings/drawer-block";
import {siteConfig} from "@/config/site.config";
import LightMode from "@/components/icons/light-mode";
import DarkMode from "@/components/icons/dark-mode";

const ThemeSwitcher = () => {
  return (
      <DrawerBlock title="Appearance">
        <RadioGroup
            value={theme ?? siteConfig.mode}
            setValue={(selectedTheme: any) => {
              setTheme(selectedTheme);
            }}
            className="grid grid-cols-2 gap-4"
        >
          {themeOptions.map((item) => (
              <RadioBox
                  key={item}
                  value={item}
                  className="className h-auto"
                  contentClassName="p-0 [&_.radio-active]:ring-primary/0 peer-checked:ring-0 border-0 ring-0 peer-checked:border-0 peer-checked:[&_.radio-active]:ring-primary/100 [&_.radio-active]:ring-2 peer-checked:text-primary"
              >
            <span
                className="radio-active mb-3 inline-flex rounded-lg ring-offset-4 ring-offset-background dark:ring-offset-gray-100">
              {item === 'light' ? (
                  <LightMode aria-label="Light Mode" className="h-full w-full"/>
              ) : (
                  <DarkMode aria-label="Dark Mode" className="h-full w-full"/>
              )}
            </span>
                <span className="inline-block w-full text-center">{item}</span>
              </RadioBox>
          ))}
        </RadioGroup>
      </DrawerBlock>
  );
};

export default ThemeSwitcher;