import { writeBinaryFile, BaseDirectory } from '@tauri-apps/api/fs';
import { fetch } from '@tauri-apps/api/http';

const downloadAndSaveFile = async (url: string, filename: string) => {
  try {
    console.log('다운시작');

    // 파일 다운로드
    const response: any = await fetch(url, {
      method: 'GET',
      responseType: 3, // 이진 데이터로 응답을 받습니다.
    });

    console.log('다운 중..');

    if (!response.ok) {
      console.log('다운 실패');
      throw new Error('파일 다운로드 실패: ' + response.status);
    }

    // 파일 시스템에 저장
    await writeBinaryFile(
      {
        path: 'extensions/' + filename,
        contents: new Uint8Array(response.data),
      },
      {
        dir: BaseDirectory.AppData, // 폴더에 파일을 저장합니다.
      }
    );

    console.log('파일 다운로드 완료');

    return { message: '파일이 성공적으로 다운로드 되었습니다.' };
  } catch (error) {
    return { error: error };
  }
};

export default downloadAndSaveFile;
