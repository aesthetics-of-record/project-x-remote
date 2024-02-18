import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useScrollIntoView } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { supabaseDeskai } from '@/lib/supabase/db';
import useUserWithRefresh from '@/hooks/useUserWithRefresh';
import { useParams } from 'react-router-dom';

const ChattingPage = () => {
  const { user } = useUserWithRefresh();
  const [messages, setMessages] = useState<any>([]);
  let { id, title } = useParams();

  const { scrollIntoView, targetRef, scrollableRef } = useScrollIntoView<
    HTMLDivElement,
    HTMLDivElement
  >({ duration: 0 });

  const getMessages = async () => {
    const { data } = await supabaseDeskai
      .from('chat_messages')
      .select('*')
      .eq('chat_room_id', id)
      .order('id', { ascending: true });

    setMessages(data ? data : []);
    return data ? data : [];
  };

  useEffect(() => {
    getMessages();
  }, []);

  useEffect(() => {
    scrollIntoView();
  }, [messages]);

  useEffect(() => {
    const subscribedChannel = supabaseDeskai
      .channel('chat-follow-up')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'deskai',
          table: 'chat_messages',
          filter: 'chat_room_id=eq.' + id,
        },
        (payload: any) => {
          console.log(payload);
          getMessages();
        }
      )
      .subscribe();

    return () => {
      // 항상 구독을 하면 소켓을 해제해줘야한다.
      supabaseDeskai.removeChannel(subscribedChannel);
    };
  }, []);

  return (
    <div className="w-full p-4">
      <Card className="max-w-[400px] m-auto">
        <CardHeader>
          <CardTitle>Chat</CardTitle>
        </CardHeader>
        <CardContent>
          <section className="flex flex-col w-full">
            <header className="border-b dark:border-zinc-700 p-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <div className="flex gap-4 items-center">
                  {/* <MyAvatar /> */}
                  아바타
                  <span className="text-xs text-green-600 block">
                    Online
                  </span>
                </div>
              </h2>
            </header>
            <main
              className="flex-1 overflow-auto p-4 min-h-[400px] max-h-[400px] scrollbar"
              ref={scrollableRef}
            >
              {messages.map((chat: any) => {
                return (
                  <>
                    {chat.user_id === user.id ? (
                      <div className="mt-4 mb-4">
                        <div className="text-end text-xs opacity-60 mb-1">
                          {chat.display_name}
                        </div>

                        <div
                          key={chat.id}
                          className="flex items-end justify-end relative"
                        >
                          <div className="rounded-lg bg-primary p-2">
                            <p className="text-sm">{chat.message}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 mb-4">
                        <div className="text-start text-xs opacity-60 mb-1">
                          {chat.display_name}
                        </div>

                        <div
                          key={chat.id}
                          className="flex items-end gap-2 relative"
                        >
                          <div className="rounded-lg bg-zinc-700 p-2">
                            <p className="text-sm">{chat.message}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                );
              })}
              <div ref={targetRef} />
            </main>
            <footer className="border-t dark:border-zinc-700 p-4">
              <form
                className="flex items-center gap-2"
                onSubmit={async (e: any) => {
                  e.preventDefault();
                  const message = e.target.message.value;
                  //   console.log(message);

                  const { error } = await supabaseDeskai
                    .from('chat_messages')
                    .insert({
                      chat_room_id: id,
                      message: message,
                      display_name: user.display_name,
                      title: title,
                    });

                  if (error) {
                    console.log(error);
                  }

                  e.target.reset();
                }}
              >
                <Textarea
                  className="flex-1"
                  name="message"
                  placeholder="메시지를 입력하세요..."
                />
                <Button type="submit">보내기</Button>
              </form>
            </footer>
          </section>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChattingPage;
