import { SignInFormSchema, SignUpFormSchema } from '@/types/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import * as z from 'zod';
import ButtonPrimary from '../custom/button-primary';
import { supabase } from '@/lib/supabase/db';
import { ClipLoader } from 'react-spinners';
import { useRecoilState } from 'recoil';
import { loginComponentState } from '@/recoil/store';
import { useToast } from '../ui/use-toast';

const Signup = () => {
  const [_loginComponent, setLoginComponent] =
    useRecoilState(loginComponentState);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof SignUpFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  const isLoading = form.formState.isSubmitting;

  async function signUpNewUser({
    email,
    password,
  }: z.infer<typeof SignInFormSchema>) {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: 'https://deskai-web.vercel.app/welcome',
      },
    });
    return { data, error };
  }

  const onSubmit = async ({
    email,
    password,
  }: z.infer<typeof SignInFormSchema>) => {
    const { data: emails } = await supabase
      .from('users')
      .select('email')
      .eq('email', email);

    if (emails!.length !== 0) {
      toast({
        title: '이미 가입된 계정',
        description: '이미 가입된 계정입니다.',
      });
      return;
    }
    const { error } = await signUpNewUser({ email, password });

    if (error) {
      toast({
        title: '회원가입 중 오류 발생',
        description: '회원 가입 중 문제가 발생했습니다.',
      });
      form.reset();
      return;
    }

    if (!error) {
      setLoginComponent('confirm');
      return;
    }

    // TODO: 메일확인 컴포넌트를 보여주는 상태변경
    // 컴포넌트도 만들어야함
  };

  return (
    <Form {...form}>
      <form
        className="p-10"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div
          className="
          w-full
          flex
          justify-center
          items-center"
        >
          {/* <Image
            src={Logo}
            alt="cypress Logo"
            width={50}
            height={50}
          /> */}
          <span
            className="font-semibold
          text-4xl"
          >
            Desk-AI
          </span>
        </div>
        <FormDescription className="text-foreground/60 text-center">
          컴퓨터 사용을 도와주는 우리의 비서
        </FormDescription>
        <div className="h-4" />
        <FormField
          disabled={isLoading}
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="email"
                  placeholder="이메일"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>

        <div className="h-4" />

        <FormField
          disabled={isLoading}
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="password"
                  placeholder="비밀번호"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>

        <div className="h-4" />

        <FormField
          disabled={isLoading}
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="password"
                  placeholder="비밀번호 확인"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="h-4" />

        <ButtonPrimary
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {!isLoading ? (
            '회원가입'
          ) : (
            <ClipLoader
              color="hsla(168, 67%, 53%, 1)"
              size={20}
            />
          )}
        </ButtonPrimary>
        <div className="h-4" />

        <span className="flex text-sm">
          <span className="mr-2">이미 가입하셨나요 ?</span>
          <span
            className="text-primary hover:underline underline-offset-4 cursor-pointer"
            onClick={() => {
              setLoginComponent('signin');
            }}
          >
            로그인 하러가기
          </span>
        </span>
      </form>
    </Form>
  );
};

export default Signup;
