import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/global/layout';
import { ThemeProvider } from './providers/theme-provider';
import { RecoilRoot } from 'recoil';
import AiChatPage from './pages/ai-command-page';
import PromptSettingPage from './pages/prompt-setting-page';
import ExtensionsPage from './pages/extensions-page';
import ChatMainPage from './pages/chat-search-page';
import ChatLayout from './components/chat/layout';
import ChatHeartPage from './pages/chat-heart-page';
import ChattingPage from './pages/chatting-page';
import { useEffect } from 'react';
import { initNotification } from './lib/notification';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    // loader: rootLoader,
    children: [
      {
        index: true,
        element: <div>Home Page Content</div>,
      },
      {
        path: 'ai',
        element: <AiChatPage />,
      },
      {
        path: 'setting',
        element: <PromptSettingPage />,
      },
      {
        path: 'dashboard',
        element: <div>dashboard</div>,
      },
      {
        path: 'extensions',
        element: <ExtensionsPage />,
      },
      {
        path: 'chat',
        element: <ChatLayout />,
        children: [
          {
            index: true,
            element: <ChatMainPage />,
          },
          {
            path: 'heart',
            element: <ChatHeartPage />,
          },
          {
            path: 'room/:id/:title',
            element: <ChattingPage />,
          },
        ],
      },
    ],
  },
]);

function App() {
  useEffect(() => {
    initNotification();
  }, []);

  return (
    <>
      <RecoilRoot>
        <ThemeProvider
          defaultTheme="dark"
          storageKey="deskai-ui-theme"
        >
          <RouterProvider router={router} />
        </ThemeProvider>
      </RecoilRoot>
    </>
  );
}

export default App;
