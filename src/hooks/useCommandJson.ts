import { commandServerUrl } from '@/config/urls';
import { axiosClient } from '@/lib/axios-tauri-client';
import { useEffect, useState } from 'react';

const useCommandJson = () => {
  const [json, setJson] = useState<any>(null);

  const getJson = () => {
    axiosClient.get(commandServerUrl + '/api/prompt_json').then((res) => {
      setJson(res.data);
    });
  };

  const getIOFromCommand = (command: string) => {
    for (let i = 0; i < json.command_list.length; i++) {
      if (json.command_list[i] === command) {
        return json.command_list[i];
      }
    }
  };

  useEffect(() => {
    getJson();
  }, []);

  return { json, getIOFromCommand };
};

export default useCommandJson;
