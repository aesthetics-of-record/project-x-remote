import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';
import { Link, useLocation } from 'react-router-dom';
import {
  Chat,
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

const LeftSidebarSm: React.FC<LeftSidebarProps> = ({ className }) => {
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
      <div className="flex flex-col gap-y-2 h-screen border-r bg-slate-200 dark:bg-slate-900 ">
        <div className="flex flex-col gap-y-2 py-2 text-medium text-sm">
          <section className="m-auto flex items-center group">
            <Robot className="dark:text-slate-400 transition duration-300 dark:group-hover:text-slate-200 group-hover:animate-spin text-2xl" />
          </section>
          <section className="flex items-center px-2">
            <div className="">
              <ModeToggle />
            </div>
          </section>
          <div className="px-2 my-1">
            <Separator className="bg-slate-300 dark:bg-slate-700" />
          </div>

          <section className="flex flex-col items-center gap-y-4">
            {routes.map((item: any) => {
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={cn(
                    'hover:text-slate-600 dark:hover:text-slate-300',
                    item.active
                      ? 'text-primary hover:text-primary dark:hover:text-primary'
                      : ''
                  )}
                >
                  <item.icon className="text-2xl" />
                </Link>
              );
            })}
          </section>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebarSm;
