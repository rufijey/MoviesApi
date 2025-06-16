import { z } from 'zod';

export const RegisterSchema = z.object({
    email: z.string().email(),
    name: z.string().trim().min(1, 'Name is required'),
    password: z.string().trim().min(1, 'Password is required'),
    confirmPassword: z.string().trim().min(1, 'Confirm Password is required'),
}).refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

export type RegisterDto = z.infer<typeof RegisterSchema>;