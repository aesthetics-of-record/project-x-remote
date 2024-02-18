import Signin from '@/components/auth/signin';
import Signup from '@/components/auth/signup';
import WindowTitlebar from '@/components/titlebar/window-titlebar';
import useUserWithRefresh from '@/hooks/useUserWithRefresh';
import { useRecoilState } from 'recoil';
import { loginComponentState } from '@/recoil/store';
import Confirm from '@/components/auth/confirm';

const LoginProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUserWithRefresh();
  const [loginComponent, _setLoginComponent] =
    useRecoilState(loginComponentState);

  if (!user) {
    if (loginComponent === 'signin') {
      return (
        <>
          <WindowTitlebar />
          <Signin />
        </>
      );
    }
    if (loginComponent === 'signup') {
      return (
        <>
          <WindowTitlebar />
          <Signup />
        </>
      );
    }
    if (loginComponent === 'confirm') {
      return (
        <>
          <WindowTitlebar />
          <Confirm />
        </>
      );
    }
  }

  return <>{children}</>;
};

export default LoginProvider;
