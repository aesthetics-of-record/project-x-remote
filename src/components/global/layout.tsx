import WindowTitlebar from '@/components/titlebar/window-titlebar';
import { Outlet } from 'react-router-dom';
import LeftSidebarSm from '../side/left-sidebar-sm';
import LoginProvider from '@/providers/login-provider';
import { Toaster } from '../ui/toaster';

const Layout = () => {
  return (
    <>
      <Toaster />
      <LoginProvider>
        <div className="flex">
          <LeftSidebarSm className="block" />
          <div className="flex-1">
            <WindowTitlebar />
            <Outlet />
          </div>
        </div>
      </LoginProvider>
    </>
  );
};

export default Layout;
