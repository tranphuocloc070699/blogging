import NavbarItem from '@/components/public/navbar-item';
import Navbar from './Navbar';
import UserProfile from './UserProfile';
import Logo from '@/components/shared/logo';


export default function PublicHeader() {
  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Logo variant='default' />
            <Navbar />
            <NavbarItem href='/' label='New' isActive />
            <NavbarItem href='/' label='Technology' isActive={false} />
            <NavbarItem href='/' label='Philosophy' isActive={false} />
          </div>
          <UserProfile />
        </div>
      </div>
    </header>
  );
}
