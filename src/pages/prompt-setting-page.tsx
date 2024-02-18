import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Table, TableHead, TableHeader } from '@/components/ui/table';
import { commandServerUrl } from '@/config/urls';
import { axiosClient } from '@/lib/axios-tauri-client';
import { useEffect, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Close } from '@/icons/titlebar';

const PromptSettingPage = () => {
  const [json, setJson] = useState<any | null>(null);
  const [type, setType] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const getJson = () => {
    axiosClient.get(commandServerUrl + '/api/prompt_json').then((res) => {
      setJson(res.data);
    });
  };

  useEffect(() => {
    getJson();
  }, []);

  return (
    <div>
      <Card className="m-4">
        <CardHeader>
          <CardTitle>프롬프트 세팅</CardTitle>
          <CardDescription>프롬프트를 세팅할 수 있습니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableHead>Command</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Output</TableHead>
            </TableHeader>
          </Table>
          {json?.command_list?.map((command: any, index: number) => {
            return (
              <div
                key={command}
                className="py-1"
              >
                {command.type === 'exe' ? (
                  <div className="flex gap-4">
                    <Input
                      readOnly
                      value={command.command}
                    />
                    <Input
                      readOnly
                      value={command.description}
                    />
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={command.output}
                        onClick={() => {
                          const new_list = [...json.command_list];
                          new_list[index].output = !new_list[index].output;

                          setJson({
                            command_list: [...new_list],
                          });
                        }}
                      />
                    </div>
                    <div>
                      <Button
                        size={'icon'}
                        variant={'ghost'}
                        onClick={() => {
                          const new_list = [...json.command_list];

                          new_list.splice(index, 1);
                          setJson({
                            command_list: [...new_list],
                          });
                        }}
                      >
                        <Close />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-4">
                    <Input
                      value={command.command}
                      onChange={(e) => {
                        const new_list = [...json.command_list];
                        new_list[index].command = e.target.value;

                        setJson({
                          command_list: [...new_list],
                        });
                      }}
                    />
                    <Input
                      value={command.description}
                      onChange={(e) => {
                        const new_list = [...json.command_list];
                        new_list[index].description = e.target.value;

                        setJson({
                          command_list: [...new_list],
                        });
                      }}
                    />
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={command.output}
                        onClick={() => {
                          const new_list = [...json.command_list];
                          new_list[index].output = !new_list[index].output;

                          setJson({
                            command_list: [...new_list],
                          });
                        }}
                      />
                    </div>
                    <div>
                      <Button
                        size={'icon'}
                        variant={'ghost'}
                        onClick={() => {
                          const new_list = [...json.command_list];

                          new_list.splice(index, 1);
                          setJson({
                            command_list: [...new_list],
                          });
                        }}
                      >
                        <Close />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
        <CardFooter className="flex gap-4 justify-end">
          {/* <Button
            className='flex-1 active:scale-95 transition'
            onClick={() => {
              const json_null = {
                type: 'command',
                output: false,
                command: '',
                description: '',
              };

              setJson({
                command_list: [...json.command_list, json_null],
              });
            }}
          >
            커맨드 추가
          </Button> */}
          <Sheet
            open={open}
            onOpenChange={(open) => {
              console.log(open);
              setOpen(open);
            }}
          >
            <SheetTrigger>
              <Button
                className="active:scale-95 transition hover:scale-105"
                onClick={() => {
                  setType(null);
                }}
              >
                커맨드 추가
              </Button>
            </SheetTrigger>
            <SheetContent>
              <form
                onSubmit={async (e: any) => {
                  e.preventDefault();

                  if (e.target.type.value === 'command') {
                    const new_command = {
                      type: e.target.type.value,
                      output: e.target.output.value,
                      command: e.target.command.value,
                      description: e.target.description.value,
                    };

                    const new_json = {
                      command_list: [...json.command_list, new_command],
                    };

                    await axiosClient
                      .put(commandServerUrl + '/api/prompt_json', new_json)
                      .then((_res) => {
                        getJson();
                      })
                      .catch((err: any) => {
                        // 에러처리
                        console.log(err);
                      });

                    setOpen(false);
                    return;
                  }

                  if (e.target.type.value === 'extensions') {
                  }
                }}
              >
                <SheetHeader>
                  <SheetTitle>새로운 커맨드 설정</SheetTitle>
                  <SheetDescription>
                    추가할 프롬프트 커맨드를 설정 해 주세요.
                  </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="name"
                      className="text-right"
                    >
                      Type
                    </Label>
                    <Select
                      required
                      name="type"
                      onValueChange={(value: string) => {
                        // console.log(value);
                        setType(value);
                      }}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="타입 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Type</SelectLabel>
                          <SelectItem value="exe">exe</SelectItem>
                          <SelectItem value="command">command</SelectItem>
                          <SelectItem value="exetensions">
                            exetensions
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  {type === null ? null : type === 'command' ? (
                    <>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="output"
                          className="text-right"
                        >
                          Output
                        </Label>
                        <Select
                          required
                          name="output"
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="출력 여부 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Output</SelectLabel>
                              <SelectItem value="true">True</SelectItem>
                              <SelectItem value="false">False</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="command"
                          className="text-right"
                        >
                          Command
                        </Label>
                        <Input
                          id="command"
                          required
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="description"
                          className="text-right"
                        >
                          Description
                        </Label>
                        <Input
                          id="description"
                          required
                          className="col-span-3"
                        />
                      </div>
                    </>
                  ) : null}
                  {type === null ? null : type === 'exetensions' ? (
                    <>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="output"
                          className="text-right"
                        >
                          Output
                        </Label>
                        <Select
                          required
                          name="output"
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="출력 여부 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Output</SelectLabel>
                              <SelectItem value="true">True</SelectItem>
                              <SelectItem value="false">False</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  ) : null}
                </div>
                <SheetFooter>
                  <Button
                    type="submit"
                    disabled={type === 'exe'}
                  >
                    저장하기
                  </Button>
                </SheetFooter>
              </form>
            </SheetContent>
          </Sheet>

          <Button
            className="active:scale-95 transition hover:scale-105"
            onClick={() => {
              axiosClient
                .put(commandServerUrl + '/api/prompt_json', json)
                .then((_res) => {
                  getJson();
                })
                .catch((err: any) => {
                  // 에러처리
                  console.log(err);
                });
            }}
          >
            저장
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PromptSettingPage;
