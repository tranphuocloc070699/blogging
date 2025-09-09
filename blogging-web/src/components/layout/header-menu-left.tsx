import React from 'react';
import Logo from "@/components/layout/logo";
import Navbar from "@/components/layout/navbar";
import DeviceViews from "@/app/shared/device-views";
import HamburgerButton from "@/components/layout/hamburger-button";

const HeaderMenuLeft = () => {
  return (
      <div component-name="HeaderMenuLeft">
        <DeviceViews appearOn={"desktop"} className={"flex items-center gap-8"}>
          <Logo/>
          <Navbar/>
        </DeviceViews>
        <DeviceViews appearOn={"mobile"}>
          <HamburgerButton/>
        </DeviceViews>
      </div>
  );
};

export default HeaderMenuLeft;