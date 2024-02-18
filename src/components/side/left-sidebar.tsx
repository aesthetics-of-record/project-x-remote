import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';
import SidebarItem from './SidebarItem';
import { useLocation } from 'react-router-dom';
import {
  Chat,
  ColorPalette,
  Dashboard,
  Extensions,
  Robot,
  Settings,
} from '@/icons/global';
import { ModeToggle } from '../global/mode-toggle';
import { RobotConfused } from '@/icons/ai-chat';

interface LeftSidebarProps {
  className?: string;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ className }) => {
  let location = useLocation();

  // chat 하위페이지 들에서는 기존 사이드바 제거
  if (location.pathname.startsWith('/chat')) {
    return;
  }

  const routes = useMemo(
    () => [
      {
        icon: Settings,
        label: 'Setting',
        active: location.pathname === '/setting',
        href: '/setting',
      },
      {
        icon: Dashboard,
        label: 'Dashboard',
        active: location.pathname === '/dashboard',
        href: '/dashboard',
      },
      {
        icon: RobotConfused,
        label: 'AI',
        active: location.pathname === '/ai',
        href: '/ai',
      },
      {
        icon: Extensions,
        label: 'Extensions',
        active: location.pathname === '/extensions',
        href: '/extensions',
      },
      {
        icon: Chat,
        label: 'Chat',
        active: location.pathname === '/chat',
        href: '/chat',
      },
    ],
    [location]
  );

  return (
    <div className={cn('flex', className)}>
      <div className="flex flex-col gap-y-2 h-screen w-[240px] border-r bg-slate-200 dark:bg-slate-900 ">
        <div className="flex flex-col gap-y-2 p-4 text-medium text-sm">
          <section className="px-4 flex items-center gap-x-4 group">
            <Robot className="text-5xl" />
            <div className="text-lg">
              <p className="font-bold">Desk-AI</p>
            </div>
          </section>
          <div className="h-6" />
          <section className="flex items-center gap-x-2 px-4">
            <div className="flex-1 flex items-center gap-x-2">
              <ColorPalette />
              <p className="truncate">Theme</p>
            </div>

            <div className="">
              <ModeToggle />
            </div>
          </section>
          <div className="px-4 my-2">
            <Separator className="bg-slate-300 dark:bg-slate-700" />
          </div>

          <section>
            {routes.map((item: any) => {
              return (
                <SidebarItem
                  key={item.label}
                  {...item}
                />
              );
            })}
          </section>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
