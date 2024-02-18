import { z } from 'zod';

export const SignInFormSchema = z.object({
  email: z
    .string()
    .describe('이메일')
    .email({ message: '유효하지 않은 이메일 형식입니다.' }),
  password: z
    .string()
    .describe('비밀번호')
    .min(1, '패스워드가 필요합니다.'),
});

export const SignUpFormSchema = z
  .object({
    email: z
      .string()
      .describe('이메일')
      .email({ message: '유효하지 않은 이메일 형식입니다.' }),
    password: z
      .string()
      .describe('비밀번호')
      .min(6, '암호는 최소한 6글자 이상이어야 합니다.'),
    confirmPassword: z
      .string()
      .describe('비밀번호 확인')
      .min(6, '암호는 최소한 6글자 이상이어야 합니다.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호와 비밀번호확인이 일치하지 않습니다.',
    path: ['confirmPassword'],
  });
