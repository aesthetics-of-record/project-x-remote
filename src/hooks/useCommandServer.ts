import { commandServerUrl } from '@/config/urls';
import { axiosClient } from '@/lib/axios-tauri-client';
import { useEffect, useState } from 'react';

const useCommandServer = () => {
  const [commandServerStatus, setCommandServerStatus] =
    useState<boolean>(false);

  const checkCommandServerStatus = async () => {
    const res = await axiosClient.get(commandServerUrl + '/api/status');
    if (res.data) {
      setCommandServerStatus(true);
    } else {
      setCommandServerStatus(false);
    }
  };

  useEffect(() => {
    checkCommandServerStatus();
  }, []);

  return { commandServerStatus, checkCommandServerStatus };
};

export default useCommandServer;
