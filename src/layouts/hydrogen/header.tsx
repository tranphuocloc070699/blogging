import HamburgerButton from '@/components/hamburger-button';
import HeaderMenuRight from "@/components/header-menu-right";
import SearchWidget from "@/components/search/container";
import Sidebar from "@/layouts/hydrogen/sidebar";
import StickyHeader from "@/layouts/sticky-header";


const Header = () => {
  return (
    <StickyHeader className="z-40 2xl:py-5 3xl:px-8 4xl:px-10">
      <div className="flex w-full max-w-2xl items-center">
        <HamburgerButton
          view={<Sidebar className="static w-full 2xl:w-full" />}
        />
        <SearchWidget />
      </div>

      <HeaderMenuRight />
    </StickyHeader>
  );
};

export default Header;