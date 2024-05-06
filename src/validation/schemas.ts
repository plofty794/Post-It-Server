import { z } from 'zod';

export const requestVerificationCodeSchema = z.object({
  email: z.string().email(),
});

export const userSignUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(20),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  verificationCode: z.string().length(6),
  username: z.string().min(1),
});

export const userSignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(20),
});

export const resetPasswordSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(20),
  verificationCode: z.string().length(8),
});

export const postSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  body: z.string().min(1, { message: 'Body is required' }),
});

export const editProfileSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  username: z.string().min(1),
});

export const editProfilePicUrl = z.object({
  profilePicUrl: z.string().url(),
});
