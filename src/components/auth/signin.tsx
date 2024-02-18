import { SignInFormSchema } from '@/types/auth';
import { SubmitHandler, useForm } from 'react-hook-form';
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
import useUserWithRefresh from '@/hooks/useUserWithRefresh';
import { useRecoilState } from 'recoil';
import { loginComponentState } from '@/recoil/store';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../ui/use-toast';

const Signin = () => {
  const navigate = useNavigate();
  const { refreshUser } = useUserWithRefresh();
  const [_loginComponent, setLoginComponent] =
    useRecoilState(loginComponentState);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof SignInFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(SignInFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit: SubmitHandler<z.infer<typeof SignInFormSchema>> = async (
    formData
  ) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      console.log(error);
      form.reset();
      // setSubmitError(error.message);
      toast({
        title: '로그인 에러',
        description:
          '로그인 정보가 유효하지 않거나, 메일인증을 받지 않은 계정입니다.',
      });
      return;
    }

    navigate('/dashboard');
    refreshUser(); // 유저정보 새로고침
  };

  return (
    <Form {...form}>
      <form className='p-10' onSubmit={form.handleSubmit(onSubmit)}>
        <div
          className='
          w-full
          flex
          justify-center
          items-center'
        >
          {/* <Image
            src={Logo}
            alt="cypress Logo"
            width={50}
            height={50}
          /> */}
          <span
            className='font-semibold
          text-4xl'
          >
            Desk-AI
          </span>
        </div>
        <FormDescription className='text-foreground/60 text-center'>
          컴퓨터 사용을 도와주는 우리의 비서
        </FormDescription>
        <div className='h-4' />
        <FormField
          disabled={isLoading}
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type='email' placeholder='이메일' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>

        <div className='h-4' />

        <FormField
          disabled={isLoading}
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type='password' placeholder='비밀번호' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>
        <div className='h-4' />

        <ButtonPrimary type='submit' className='w-full' disabled={isLoading}>
          {!isLoading ? (
            '로그인'
          ) : (
            <ClipLoader color='hsla(168, 67%, 53%, 1)' size={20} />
          )}
        </ButtonPrimary>
        <div className='h-4' />

        <span className='flex text-sm'>
          <span className='mr-2'>처음 방문하셨나요 ?</span>
          <span
            className='text-primary hover:underline underline-offset-4 cursor-pointer'
            onClick={() => {
              setLoginComponent('signup');
            }}
          >
            회원가입 하러가기
          </span>
        </span>
      </form>
    </Form>
  );
};

export default Signin;
