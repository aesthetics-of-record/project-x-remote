import WindowTitlebar from '@/components/titlebar/window-titlebar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import useCommandServer from '@/hooks/useCommandServer';
import useExists from '@/hooks/useExists';
import downloadAndSaveFile from '@/lib/download-and-save-file';
import { emit } from '@tauri-apps/api/event';
import { BaseDirectory, createDir } from '@tauri-apps/api/fs';
import { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { useClipboard } from '@mantine/hooks';
import { invoke } from '@tauri-apps/api/tauri';

const InitSettingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const os_name: string = 'ubuntu'; // ubuntu, window

  const serverName = os_name === 'ubuntu' ? 'server' : 'server.exe';

  const { bool: bool1, checkExists: check1 } = useExists(
    'extensions/' + serverName // 우분투에서는 server으로 변경
  );
  const { bool: bool2, checkExists: check2 } = useExists(
    'extensions/prompt.json'
  );
  const { bool: bool3, checkExists: check3 } = useExists(
    'extensions/prompt.txt'
  );
  const [progress, setProgress] = useState(0);

  const [initDownloadLoading, setInitDownloadLoading] =
    useState<boolean>(false);

  const { commandServerStatus, checkCommandServerStatus } =
    useCommandServer();

  const serverDownloadUrl =
    'https://qjpzemdbvnmikrzvecmd.supabase.co/storage/v1/object/public/init_files/' +
    serverName; // 우분투에서는 server으로 변경
  const jsonDownloadUrl =
    'https://qjpzemdbvnmikrzvecmd.supabase.co/storage/v1/object/public/init_files/prompt.json';
  const txtDownloadUrl =
    'https://qjpzemdbvnmikrzvecmd.supabase.co/storage/v1/object/public/init_files/prompt.txt';

  // 유저네임 가져오기 및 우분투 설정
  const clipboard = useClipboard({ timeout: 500 });

  const [userName, setUserName] = useState('');

  useEffect(() => {
    invoke('get_username')
      .then((name: any) => setUserName(name))
      .catch((error) => console.error('Error fetching username:', error));
  }, []);

  if (!bool1 || !bool2 || !bool3) {
    return (
      <div>
        <WindowTitlebar />

        <Card className="p-4">
          <CardHeader>
            <CardTitle>초기 설정 파일이 필요합니다.</CardTitle>
            <CardDescription>
              초기 설정 파일을 다운로드 해 주세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <Button
                disabled={initDownloadLoading}
                className="active:scale-95 transition duration-200"
                onClick={async () => {
                  setInitDownloadLoading(true);

                  // if (prevBool) {
                  //   // 그 전 파일 존재 시 전부 삭제
                  //   await removeDir('', {
                  //     dir: BaseDirectory.AppData,
                  //     recursive: true,
                  //   });
                  // }

                  setProgress(10);

                  try {
                    // 폴더 생성
                    await createDir('', {
                      dir: BaseDirectory.AppData,
                      recursive: true,
                    });
                  } catch {
                    console.log('이미 기본폴더가 존재합니다.');
                  }

                  try {
                    // 다시 폴더 생성
                    await createDir('extensions', {
                      dir: BaseDirectory.AppData,
                      recursive: true,
                    });
                  } catch {
                    console.log('이미 extensions폴더가 존재합니다.');
                  }

                  setProgress(15);

                  if (!bool1)
                    await downloadAndSaveFile(
                      serverDownloadUrl,
                      serverName // 우분투에서는 변경
                    );

                  setProgress(65);

                  if (!bool2)
                    await downloadAndSaveFile(
                      jsonDownloadUrl,
                      'prompt.json'
                    );

                  setProgress(80);

                  if (!bool3)
                    await downloadAndSaveFile(txtDownloadUrl, 'prompt.txt');

                  setProgress(100);

                  await check1();
                  await check2();
                  await check3();

                  setInitDownloadLoading(false);
                }}
              >
                {initDownloadLoading ? (
                  <ClipLoader
                    color="hsla(168, 67%, 53%, 1)"
                    size={16}
                  />
                ) : (
                  '다운로드 시작'
                )}
              </Button>
              {initDownloadLoading ? (
                <Progress
                  value={progress}
                  className="w-[80%] mt-4"
                />
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 기존세팅이 다 되었고 파일들을 가지고 있다면,
  const onStartServer = async () => {
    await emit('start-server');

    setTimeout(() => {
      checkCommandServerStatus();
    }, 5000);

    setTimeout(() => {
      checkCommandServerStatus();
    }, 10000);
  };

  if (!commandServerStatus) {
    onStartServer();

    return (
      <>
        <div>
          <WindowTitlebar />

          <Card className="m-4">
            <CardContent className="p-4">
              <p>🏃‍♂️커맨드서버 여는중입니다.🚴‍♂️</p>
              <p className="mt-4">😴잠시만 기다려 주세요.🧐</p>

              {os_name === 'ubuntu' ? (
                <>
                  <p className="mt-4">
                    10초 이상 화면이 지속 될 경우.. 아래의 명령어를 터미널에
                    입력 해 권한을 부여하고 재시작 해 주세요.
                  </p>
                  <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                    chmod +x /home/{userName}
                    /.local/share/DeskAi/extensions/*
                  </code>
                  <Button
                    className="ml-4"
                    onClick={() =>
                      clipboard.copy(
                        `chmod +x /home/${userName}/.local/share/DeskAi/extensions/*`
                      )
                    }
                  >
                    {clipboard.copied ? 'Copied' : 'Copy'}
                  </Button>
                </>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return <>{children}</>;
};

export default InitSettingProvider;
