import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { getAllRooms, getUserRooms, insertRooms } from '@/services/chats';
import useSupabase from '@/hooks/useSupabase';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ChatHeart, ChatPlus } from '@/icons/chat';
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
import { Link } from 'react-router-dom';

const ChatHeartPage = () => {
  const { data: rooms } = useSupabase(getAllRooms);
  const [open, setOpen] = useState(false);
  const { data: userRooms } = useSupabase(getUserRooms);

  useEffect(() => {}, []);

  return (
    <div className="w-full py-4 px-8">
      <Card className="">
        <CardHeader>
          <CardTitle className="flex justify-between">
            내 채팅방
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
                        <Link
                          className="flex items-center justify-between border-b p-2 hover:bg-border"
                          to={`/chat/room/${room.id}/${room.title}`}
                        >
                          <div>{room.title}</div>
                          <Button
                            size={'icon'}
                            variant={'outline'}
                          >
                            <ChatHeart
                              className="text-primary"
                              width={24}
                              height={24}
                            />
                          </Button>
                        </Link>
                      </>
                    );
                  }
                }

                return null;
              })}
            </main>
          </section>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatHeartPage;
