import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/global/layout';
import { ThemeProvider } from './providers/theme-provider';
import Home from './pages/home';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <ThemeProvider
        defaultTheme="dark"
        storageKey="project-x-remote-theme"
      >
        <RouterProvider router={router} />
      </ThemeProvider>
    </>
  );
}

export default App;
