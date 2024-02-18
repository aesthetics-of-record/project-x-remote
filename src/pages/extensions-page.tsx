import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import useSupabase from "@/hooks/useSupabase";
import {
  getCommandExtensions,
  getExeExtensions,
  insertExtensions,
  uploadExtensions,
} from "@/services/extensions";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ExtensionsPage = () => {
  const [type, setType] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { data: commands } = useSupabase(getCommandExtensions);
  const { data: exes } = useSupabase(getExeExtensions);

  return (
    <div>
      <Card className="m-4">
        <CardHeader>
          <CardTitle>Extensions</CardTitle>
          <CardDescription>익스텐션들을 다운받을 수 있습니다.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-auto max-h-[500px] scrollbar">
          <div>
            <Tabs defaultValue="command" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="command">Command</TabsTrigger>
                <TabsTrigger value="exe">Exe</TabsTrigger>
              </TabsList>
              <TabsContent value="command">
                {commands?.map((extension) => {
                  return (
                    <Card className="">
                      <CardHeader>
                        <CardTitle className="">{extension.command}</CardTitle>
                        <CardDescription className="">
                          {extension.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  );
                })}
              </TabsContent>
              <TabsContent value="exe">
                {exes?.map((extension) => {
                  return (
                    <Card className="">
                      <CardHeader>
                        <CardTitle className="">{extension.command}</CardTitle>
                        <CardDescription className="">
                          {extension.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  );
                })}
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
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
                익스텐션 추가
              </Button>
            </SheetTrigger>
            <SheetContent>
              <form
                onSubmit={async (e: any) => {
                  e.preventDefault();
                  setLoading(true);

                  if (e.target.type.value === "command") {
                    const row = {
                      input: false,
                      type: e.target.type.value,
                      output: e.target.output.value,
                      command: e.target.command.value,
                      description: e.target.description.value,
                      detail: e.target.detail.value,
                    };

                    await insertExtensions(row);

                    setLoading(false);
                    setOpen(false);

                    return;
                  }

                  const file = e.target.file.files[0];

                  const { data, error } = await uploadExtensions(
                    file,
                    file.name
                  );

                  if (error) {
                    toast({
                      title: "에러 발생",
                      description: "파일 이름 중복 or exe파일 형식이 아닙니다.",
                    });
                    return;
                  }

                  const url =
                    "https://qjpzemdbvnmikrzvecmd.supabase.co/storage/v1/object/public/extensions/" +
                    data?.path;

                  const row = {
                    url: url,
                    input: e.target.input.value,
                    type: e.target.type.value,
                    output: e.target.output.value,
                    command: e.target.command.value,
                    description: e.target.description.value,
                    detail: e.target.detail.value,
                  };

                  await insertExtensions(row);

                  setLoading(false);
                  setOpen(false);
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
                    <Label htmlFor="name" className="text-right">
                      Type
                    </Label>
                    <Select
                      required
                      name="type"
                      onValueChange={(value: string) => {
                        // console.log(value);
                        setType(value);
                      }}
                      disabled={loading}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="타입 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Type</SelectLabel>
                          <SelectItem value="exe">Exe</SelectItem>
                          <SelectItem value="command">Command</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  {type === null ? null : type === "command" ? (
                    <>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="output" className="text-right">
                          Output
                        </Label>
                        <Select required name="output" disabled={loading}>
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
                        <Label htmlFor="command" className="text-right">
                          Command
                        </Label>
                        <Input
                          id="command"
                          required
                          className="col-span-3"
                          disabled={loading}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                          Description
                        </Label>
                        <Input
                          id="description"
                          required
                          className="col-span-3"
                          disabled={loading}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="detail" className="text-right">
                          Detail
                        </Label>
                        <Textarea
                          id="detail"
                          required
                          className="col-span-3"
                          disabled={loading}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="file" className="text-right">
                          File
                        </Label>
                        <Input type="file" id="file" className="w-[180px]" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="output" className="text-right">
                          Input
                        </Label>
                        <Select required name="input" disabled={loading}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="입력 여부 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Input</SelectLabel>
                              <SelectItem value="true">True</SelectItem>
                              <SelectItem value="false">False</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="output" className="text-right">
                          Output
                        </Label>
                        <Select required name="output" disabled={loading}>
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
                        <Label htmlFor="command" className="text-right">
                          Command
                        </Label>
                        <Input
                          id="command"
                          required
                          className="col-span-3"
                          disabled={loading}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                          Description
                        </Label>
                        <Input
                          id="description"
                          required
                          className="col-span-3"
                          disabled={loading}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="detail" className="text-right">
                          Detail
                        </Label>
                        <Textarea
                          id="detail"
                          required
                          className="col-span-3"
                          disabled={loading}
                        />
                      </div>
                    </>
                  )}
                </div>
                <SheetFooter>
                  <Button type="submit" disabled={loading}>
                    저장하기
                  </Button>
                </SheetFooter>
              </form>
            </SheetContent>
          </Sheet>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ExtensionsPage;
