import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';
import { Link, useLocation } from 'react-router-dom';
import { Robot, Settings } from '@/icons/global';
import { ModeToggle } from '../global/mode-toggle';
import { Back, ChatHeart, ChatSearch } from '@/icons/chat';

interface ChatLeftSidebarProps {
  className?: string;
}

const ChatLeftSidebar: React.FC<ChatLeftSidebarProps> = ({ className }) => {
  let location = useLocation();

  // chat 하위페이지가 아니면 제거
  if (!location.pathname.startsWith('/chat')) {
    return;
  }

  const routes = useMemo(
    () => [
      {
        icon: Back,
        label: 'Back',
        active: false,
        href: '/',
      },
      {
        icon: Settings,
        label: 'Setting',
        active: location.pathname === '/setting',
        href: '/setting',
      },
      {
        icon: ChatSearch,
        label: 'Chat',
        active: location.pathname === '/chat',
        href: '/chat',
      },
      {
        icon: ChatHeart,
        label: 'Chat',
        active: location.pathname === '/chat/heart',
        href: '/chat/heart',
      },
    ],
    [location]
  );

  return (
    <div className={cn('flex', className)}>
      <div className="flex flex-col gap-y-2 h-screen border-r p-2">
        <div className="flex flex-col gap-y-2 py-2 text-medium text-sm">
          <section className="m-auto flex items-center group">
            <Robot className="dark:text-slate-400 transition duration-300 dark:group-hover:text-slate-200 group-hover:animate-spin text-3xl" />
          </section>
          <section className="flex items-center px-2">
            <div className="">
              <ModeToggle />
            </div>
          </section>
          <div className="my-3">
            <Separator className="bg-slate-300 dark:bg-slate-700" />
          </div>

          <section className="flex flex-col items-center gap-y-6">
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
                  <item.icon className="text-3xl" />
                </Link>
              );
            })}
          </section>
        </div>
      </div>
    </div>
  );
};

export default ChatLeftSidebar;
