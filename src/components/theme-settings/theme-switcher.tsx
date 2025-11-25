import React from 'react';
import DrawerBlock from "@/components/theme-settings/drawer-block";
import {siteConfig} from "@/config/site.config";
import LightMode from "@/components/icons/light-mode";
import DarkMode from "@/components/icons/dark-mode";
import {RadioGroup, RadioGroupItem} from '../ui/radio-group';
import {useTheme} from 'next-themes';


const themeOptions = ['light', 'dark'];

const ThemeSwitcher = () => {
  const {theme, setTheme} = useTheme();


  return (
      <DrawerBlock title="Appearance">
        <RadioGroup
            value={theme ?? siteConfig.mode.toString()}
            onValueChange={value => {
              console.log(value);
              setTheme(value);
            }}
            className="grid grid-cols-2 gap-4"
        >

          {themeOptions.map((item) => (
              <div
                  className={"relative"} key={item}>
                <RadioGroupItem
                    value={item}
                    id={"theme-switcher-" + item}
                    className="peer h-full w-full absolute inset-0 opacity-0"
                />
                <label htmlFor={"theme-switcher-" + item}
                       className={"peer-data-[state=checked]:[&>span]:ring-2 peer-data-[state=checked]:[&>small]:text-primary"}>
                   <span
                       className="cursor-pointer mb-3 inline-flex rounded-lg ring-primary ring-offset-4 ring-offset-background dark:ring-offset-gray-100 ">
              {item === 'light' ? (
                  <LightMode aria-label="Light Mode" className="h-full w-full"/>
              ) : (
                  <DarkMode aria-label="Dark Mode" className="h-full w-full"/>
              )}
            </span>
                  <small className="inline-block w-full text-center capitalize">{item}</small>
                </label>
              </div>

          ))}
        </RadioGroup>
      </DrawerBlock>
  );
};

export default ThemeSwitcher;