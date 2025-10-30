import { z } from "zod";

export const emailSchema = z
  .email("invalid email")
  .min(1, "email is required")
  .max(255);
const passwordSchema = z
  .string()
  .min(6, "password must be at least 6 characters")
  .max(255);

export const loginShema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const registerSchema = loginShema
  .extend({
    name: z.string().min(1, "name is required").max(100),
    confirmPassword: z.string().min(6, "password do not match").max(255),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const verificationCodeShema = z.string().min(1).max(50);

export const passwordResetRequestSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(6, "password do not match").max(255),
    verificationCode: verificationCodeShema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
