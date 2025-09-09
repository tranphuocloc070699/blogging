import React from 'react';
import StickyHeader from "@/components/layout/sticky-header";
import Logo from "@/components/layout/logo";
import Navbar from "@/components/layout/navbar";
import HeaderMenuRight from "@/components/layout/header-menu-right";
import HeaderMenuLeft from "@/components/layout/header-menu-left";

const Header = () => {
  return <StickyHeader className={"z-[990] flex items-center justify-between"}>
    <HeaderMenuLeft/>
    <HeaderMenuRight/>
  </StickyHeader>;
};

export default Header;