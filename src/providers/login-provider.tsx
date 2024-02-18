import Signin from '@/components/auth/signin';
import WindowTitlebar from '@/components/titlebar/window-titlebar';
import useUserWithRefresh from '@/hooks/useUserWithRefresh';

const LoginProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUserWithRefresh();

  if (!user) {

      return (
        <>
          <WindowTitlebar />
          <Signin />
        </>
      );
    
  }

  return <>{children}</>;
};

export default LoginProvider;
