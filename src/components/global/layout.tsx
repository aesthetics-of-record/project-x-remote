import LeftSidebar from '@/components/side/left-sidebar';
import WindowTitlebar from '@/components/titlebar/window-titlebar';
import { Outlet } from 'react-router-dom';
import LeftSidebarSm from '../side/left-sidebar-sm';
import LoginProvider from '@/providers/login-provider';
import { Toaster } from '../ui/toaster';
import InitSettingProvider from '@/providers/init-setting-provider';
import ChatLeftSidebar from '../chat/left-sidebar';
import { useEffect } from 'react';
import { supabaseDeskai } from '@/lib/supabase/db';
import { getUserRoomsId } from '@/services/chats';
import useSupabase from '@/hooks/useSupabase';
import { notification } from '@/lib/notification';
import { useRecoilState } from 'recoil';
import { refreshState } from '@/recoil/store';

const Layout = () => {
  const { data, getData } = useSupabase(getUserRoomsId);
  const [refresh] = useRecoilState(refreshState);

  let array = [];
  for (let i = 0; i < data.length; i++) {
    array.push(data[i].chat_room_id);
  }

  function convertArrayToString(array: any) {
    return `(${array.join(', ')})`;
  }

  const result = convertArrayToString(array);

  // 채팅방에 변경사항이 있으면 구독 refresh
  useEffect(() => {
    getData();
  }, [refresh]);

  useEffect(() => {
    const subscribedChannel = supabaseDeskai
      .channel('chat-notification')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'deskai',
          table: 'chat_messages',
          filter: `chat_room_id=in.${result}`,
        },
        (payload: any) => {
          // console.log(payload);
          notification(payload.new.title, payload.new.message);
        }
      )
      .subscribe();

    return () => {
      // 항상 구독을 하면 소켓을 해제해줘야한다.
      supabaseDeskai.removeChannel(subscribedChannel);
    };
  }, [data]);

  return (
    <>
      <Toaster />
      <LoginProvider>
        <InitSettingProvider>
          <div className="flex">
            <LeftSidebar className="hidden md:block" />
            <LeftSidebarSm className="block md:hidden" />
            <ChatLeftSidebar />
            <div className="flex-1">
              <WindowTitlebar />
              <Outlet />
            </div>
          </div>
        </InitSettingProvider>
      </LoginProvider>
    </>
  );
};

export default Layout;
