import { exists, BaseDirectory } from '@tauri-apps/api/fs';
import { useEffect, useState } from 'react';

const useExists = (path: string) => {
  const [bool, setBool] = useState<boolean>(false);

  const checkExists = async () => {
    const bool = await exists(path, { dir: BaseDirectory.AppData });
    setBool(bool);
  };

  useEffect(() => {
    checkExists();
  }, []);

  return { bool, checkExists };
};

export default useExists;
