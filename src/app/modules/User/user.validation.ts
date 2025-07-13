import { z } from 'zod';

const createUserValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required!' }),
    email: z
      .string({ required_error: 'Email is required!' })
      .email({ message:  "Invalid email format." }),
    password: z
      .string({ required_error: 'Password is required!' })
      .min(6, 'Password must be at least 6 characters long'),
    profileImage: z.string().url().optional(),
  }),
});

const createTrainerValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required!' }),
    email: z
      .string({ required_error: 'Email is required!' })
      .email({ message:  "Invalid email format." }),
    password: z
      .string({ required_error: 'Password is required!' })
      .min(6, 'Password must be at least 6 characters long'),
    profileImage: z.string().url().optional(),
  }),
});

const updateUserValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required!' }).optional(),
    email: z
      .string({ required_error: 'Email is required!' })
      .email({ message:  "Invalid email format." })
      .optional(),
    profileImage: z.string().url().optional(),
  }),
});

const loginValidationSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required!' })
      .email({ message:  "Invalid email format." }),
    password: z
      .string({ required_error: 'Password is required!' })
      .min(6, 'Password must be at least 6 characters long'),
  }),
});

export const userValidation = {
  createUserValidationSchema,
  createTrainerValidationSchema,
  loginValidationSchema,
  updateUserValidationSchema
};
