import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';
import { Link, useLocation } from 'react-router-dom';
import {
  Chat,
  Dashboard,
  Extensions,
  Home,
  Robot,
  Settings,
} from '@/icons/global';
import { ModeToggle } from '../global/mode-toggle';
interface LeftSidebarProps {
  className?: string;
}

const LeftSidebarSm: React.FC<LeftSidebarProps> = ({ className }) => {
  let location = useLocation();

  const routes = useMemo(
    () => [
      {
        icon: Home,
        label: 'Home',
        active: location.pathname === '/',
        href: '/',
      },
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
        icon: Extensions,
        label: 'Extensions',
        active: location.pathname === '/extensions',
        href: '/extensions',
      },
    ],
    [location]
  );

  return (
    <div className="h-border-screen flex flex-col gap-y-2 border-r bg-slate-200 dark:bg-slate-900 w-16 py-2">
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
  );
};

export default LeftSidebarSm;
