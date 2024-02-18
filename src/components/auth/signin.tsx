import { SignInFormSchema } from '@/types/auth';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import * as z from 'zod';
import { supabase } from '@/lib/supabase/db';
import { ClipLoader } from 'react-spinners';
import useUserWithRefresh from '@/hooks/useUserWithRefresh';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../ui/use-toast';
import { BackgroundBeams } from '../ui/background-beams';
import ButtonShimmer from '../custom/button-shimmer';

const Signin = () => {
  const navigate = useNavigate();
  const { refreshUser } = useUserWithRefresh();
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

    navigate('/');
    refreshUser(); // 유저정보 새로고침
  };

  return (
    <Form {...form}>
      <div className="h-border-titlebar-screen w-full rounded-md bg-background relative flex flex-col items-center justify-center antialiased">
        <div className="max-w-2xl mx-auto p-4">
          <h1 className="relative z-10 text-7xl text-gradient text-center font-sans font-bold">
            Remote-X
          </h1>
          <div className="h-8" />

          <form
            className="relative z-10"
            onSubmit={form.handleSubmit(onSubmit)}
          >
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

            <ButtonShimmer
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {!isLoading ? (
                '로그인'
              ) : (
                <ClipLoader
                  color="hsla(168, 67%, 53%, 1)"
                  size={20}
                />
              )}
            </ButtonShimmer>
            <div className="h-4" />

            <span className="flex text-sm">
              <span className="mr-2 text-slate-400">
                처음 방문하셨나요 ?
              </span>
              <span
                className="text-gradient hover:underline underline-offset-4 cursor-pointer font-black"
                onClick={() => {
                  // setLoginComponent('signup');
                }}
              >
                회원가입 하러가기
              </span>
            </span>
          </form>
        </div>
        <BackgroundBeams />
      </div>
    </Form>
  );
};

export default Signin;
