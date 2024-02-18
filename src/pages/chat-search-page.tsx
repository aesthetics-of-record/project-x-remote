import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useEffect, useState } from 'react';
import {
  getAllRooms,
  getUserRooms,
  insertRooms,
  insertUserToRooms,
} from '@/services/chats';
import useSupabase from '@/hooks/useSupabase';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ChatCheck, ChatPlus, ChatShare } from '@/icons/chat';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useRecoilState } from 'recoil';
import { refreshState } from '@/recoil/store';

const ChatMainPage = () => {
  const { data: rooms, getData: getData1 } = useSupabase(getAllRooms);
  const [open, setOpen] = useState(false);
  const { data: userRooms, getData: getData2 } = useSupabase(getUserRooms);
  const [loading, setLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useRecoilState(refreshState);

  useEffect(() => {}, []);

  return (
    <div className="w-full py-4 px-8">
      <Card className="">
        <CardHeader>
          <CardTitle className="flex justify-between">
            Chat Rooms
            <Dialog
              open={open}
              onOpenChange={(open) => {
                setOpen(open);
              }}
            >
              <DialogTrigger>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size={'icon'}
                      >
                        <ChatPlus
                          width={24}
                          height={24}
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-background">
                      <p>채팅방 만들기</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>채팅방 만들기</DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={async (e: any) => {
                    e.preventDefault();
                    await insertRooms(e.target.title.value);
                    setOpen(false);

                    await getData1();
                    await getData2();

                    setRefresh(refresh + 1);
                  }}
                >
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-1 items-center gap-4">
                      <Input
                        id="title"
                        placeholder="제목"
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">만들기</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardTitle>
          <CardDescription>
            채팅방을 찾아 가입 할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent>
          <section className="flex flex-col w-full">
            <main className="flex-1 overflow-auto p-4 max-h-full scrollbar">
              {rooms.map((room: any) => {
                for (let i = 0; i < userRooms.length; i++) {
                  if (room.id === userRooms[i].chat_room_id) {
                    return (
                      <>
                        <div className="flex items-center justify-between border-b p-2">
                          <div>{room.title}</div>
                          <Button
                            size={'icon'}
                            variant={'outline'}
                            disabled={true}
                          >
                            <ChatCheck
                              className="text-primary"
                              width={24}
                              height={24}
                            />
                          </Button>
                        </div>
                      </>
                    );
                  }
                }

                return (
                  <>
                    <div className="flex items-center justify-between border-b p-2">
                      <div>{room.title}</div>
                      <Button
                        size={'icon'}
                        variant={'outline'}
                        disabled={loading}
                        onClick={async () => {
                          setLoading(true);

                          await insertUserToRooms(room.id);
                          await getData1();
                          await getData2();

                          setLoading(false);
                          setRefresh(refresh + 1);
                        }}
                      >
                        <ChatShare
                          width={24}
                          height={24}
                        />
                      </Button>
                    </div>
                  </>
                );
              })}
            </main>
          </section>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatMainPage;
