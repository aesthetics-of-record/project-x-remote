import { Close, Maximize, Minimize } from '@/icons/titlebar';
import { useEffect, useState } from 'react';

const WindowTitlebar = () => {
  const [appWindow, setAppWindow] = useState<any>();

  async function setupAppWindow() {
    const appWindow = (await import('@tauri-apps/api/window')).appWindow;
    setAppWindow(appWindow);
  }

  useEffect(() => {
    setupAppWindow();
  }, []);

  return (
    <div
      data-tauri-drag-region
      className="flex p-2 justify-between h-[32px]"
    >
      <div className="font-bold"></div>

      <div className="flex gap-x-2">
        <div
          className="rounded flex justify-center cursor-pointer hover:text-slate-400"
          onClick={() => {
            appWindow.minimize();
          }}
        >
          <Minimize />
        </div>
        <div
          className="rounded flex items-center justify-center cursor-pointer hover:text-slate-400"
          onClick={() => {
            appWindow.toggleMaximize();
          }}
        >
          <Maximize />
        </div>
        <div
          className="rounded flex items-center justify-center cursor-pointer hover:text-slate-400"
          onClick={() => {
            appWindow.hide();
          }}
        >
          <Close />
        </div>
      </div>
    </div>
  );
};

export default WindowTitlebar;
