import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { commandServerUrl } from '@/config/urls';
import useCommandJson from '@/hooks/useCommandJson';
import useCommandServer from '@/hooks/useCommandServer';
import { RobotConfused, RobotDead, RobotExcited } from '@/icons/ai-chat';
import { axiosClient } from '@/lib/axios-tauri-client';
import { emit } from '@tauri-apps/api/event';
import { useState } from 'react';
import { ClipLoader } from 'react-spinners';

const AiChatPage = () => {
  const [commandServerLoading, setCommandServerLoading] =
    useState<boolean>(false);
  const { commandServerStatus, checkCommandServerStatus } =
    useCommandServer();
  const [gptLoading, setGptLoading] = useState<boolean>(false);
  const { getIOFromCommand } = useCommandJson();

  const [result, setResult] = useState<string | null>(null);
  const onStartServer = async () => {
    setCommandServerLoading(true);
    await emit('start-server');

    setTimeout(() => {
      checkCommandServerStatus();
      setCommandServerLoading(false);
    }, 5000);
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setGptLoading(true);

    let message = e.target.message?.value;

    // 엔터키로 텍스트아리아 에서 바로 폼 제출 한 경우
    if (!message) {
      message = e.target.value;
    }

    const res = await axiosClient.post(
      commandServerUrl + '/api/v1/gpt4',
      { message: message },
      { timeout: 30000 }
    );

    // console.log(res.data);

    // command 가 빈칸이면 chat모드
    if (res.data.command !== '') {
      setResult(res.data.command);

      // 아웃풋변수
      let output: string | null = null;

      if (!getIOFromCommand(res.data.command)) {
        // 커스텀 커맨드가 아니라면..
        await axiosClient.post(commandServerUrl + '/api/command', {
          command: `${res.data.command}`,
        });
        console.log('커스텀 커맨드 X');

        setGptLoading(false);
        return;
      }

      // command의 인풋 / 아웃풋 확인
      if (getIOFromCommand(res.data.command)?.input) {
        output = await axiosClient.post(commandServerUrl + '/api/command', {
          command: `${res.data.command} ${message}`,
        });
      } else {
        // console.log('인풋없음');
        output = await axiosClient.post(commandServerUrl + '/api/command', {
          command: `${res.data.command}`,
        });
      }

      // 아웃풋이 true라면
      if (getIOFromCommand(res.data.command)?.output) {
        setResult(output);
      }
    } else {
      setResult(res.data.chat);
    }

    setGptLoading(false);
  };

  function handleEnterKeyDown(event: any) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      // 폼 제출 함수 호출
      onSubmit(event);
    }
  }

  return (
    <div>
      <Card className="m-4">
        {/* <CardHeader></CardHeader> */}
        <CardContent>
          <section className="flex flex-col w-full">
            <header className="border-b dark:border-zinc-700 py-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <div className="flex gap-4 items-center">
                  {commandServerStatus ? (
                    <>
                      <Button
                        className="transition duration-200 hover:scale-125"
                        size={'icon'}
                        variant={'ghost'}
                      >
                        {gptLoading ? (
                          <RobotConfused
                            className="animate-spin"
                            width={24}
                            height={24}
                          />
                        ) : (
                          <RobotExcited
                            width={24}
                            height={24}
                          />
                        )}
                      </Button>
                      <span className="text-xs text-green-600 block">
                        Online
                      </span>
                    </>
                  ) : (
                    <>
                      <Button
                        className="transition duration-200 hover:scale-125"
                        onClick={onStartServer}
                        disabled={commandServerLoading}
                        size={'icon'}
                        variant={'ghost'}
                      >
                        {commandServerLoading ? (
                          <ClipLoader
                            color="hsla(168, 67%, 53%, 1)"
                            size={16}
                          />
                        ) : (
                          <RobotDead
                            width={24}
                            height={24}
                          />
                        )}
                      </Button>
                      <span className="text-xs text-red-600 block">
                        Offline
                      </span>
                    </>
                  )}
                </div>
              </h2>
            </header>
            <main className="h-[400px]">
              {result !== null ? (
                <Card className="mt-4 p-4 bg-primary">{result}</Card>
              ) : null}
            </main>
            <footer>
              <form onSubmit={onSubmit}>
                <div className="w-full border border-border rounded-lg bg-gray-50 dark:bg-slate-800 dark:border-border">
                  <div className="px-4 py-2 bg-white rounded-t-lg dark:bg-background">
                    <label
                      htmlFor="message"
                      className="sr-only"
                    >
                      Your comment
                    </label>
                    <Textarea
                      onKeyDown={handleEnterKeyDown}
                      id="message"
                      rows={4}
                      className="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-background focus:ring-0  dark:text-white dark:placeholder-gray-400 focus-visible:ring-0"
                      placeholder="메세지를 입력하세요..."
                      required
                    ></Textarea>
                  </div>
                  <div className="flex items-center justify-between px-3 py-2 border-t dark:border-gray-600">
                    <button
                      type="submit"
                      disabled={commandServerLoading}
                      className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-primary rounded-lg hover:bg-primary/70 active:scale-90 transition duration-200"
                    >
                      {gptLoading ? (
                        <ClipLoader
                          color="hsla(168, 67%, 53%, 1)"
                          size={16}
                        />
                      ) : (
                        '전송'
                      )}
                    </button>
                    <div className="flex ps-0 space-x-1 rtl:space-x-reverse sm:ps-2">
                      <button
                        type="button"
                        className="inline-flex justify-center items-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                      >
                        <svg
                          className="w-4 h-4"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 12 20"
                        >
                          <path
                            stroke="currentColor"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M1 6v8a5 5 0 1 0 10 0V4.5a3.5 3.5 0 1 0-7 0V13a2 2 0 0 0 4 0V6"
                          />
                        </svg>
                        <span className="sr-only">Attach file</span>
                      </button>
                      <button
                        type="button"
                        className="inline-flex justify-center items-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                      >
                        <svg
                          className="w-4 h-4"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 16 20"
                        >
                          <path d="M8 0a7.992 7.992 0 0 0-6.583 12.535 1 1 0 0 0 .12.183l.12.146c.112.145.227.285.326.4l5.245 6.374a1 1 0 0 0 1.545-.003l5.092-6.205c.206-.222.4-.455.578-.7l.127-.155a.934.934 0 0 0 .122-.192A8.001 8.001 0 0 0 8 0Zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
                        </svg>
                        <span className="sr-only">Set location</span>
                      </button>
                      <button
                        type="button"
                        className="inline-flex justify-center items-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                      >
                        <svg
                          className="w-4 h-4"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 20 18"
                        >
                          <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                        </svg>
                        <span className="sr-only">Upload image</span>
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </footer>
          </section>
        </CardContent>
      </Card>

      {/* <form
        onSubmit={async (event: any) => {
          event.preventDefault();

          const file = event.target.file.files[0];

          // 현재 시간을 이용한 타임스탬프 생성
          const timestamp = new Date().getTime();
          // 원본 파일명
          const originalName = file.name;
          // 파일 확장자
          const extension = originalName.split('.').pop();
          // 새로운 파일명 생성
          const newFileName = `private/${timestamp}-${originalName}.${extension}`;

          const { data, error } = await supabase.storage
            .from('files')
            .upload(newFileName, file, {
              cacheControl: '3600',
              upsert: false,
            });

          console.log(data);
          console.log(error);
        }}
      >
        <Input type='file' name='file'></Input>
        <Button className='active:scale-95 transition duration-200'>
          파일 업로드
        </Button>
      </form> */}
    </div>
  );
};

export default AiChatPage;
