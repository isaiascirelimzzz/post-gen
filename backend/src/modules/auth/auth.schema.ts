import { z } from 'zod'

export const loginSchema = {
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
}

export const updateProfileSchema = {
  body: z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
  }),
}

export const userResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
})

export const loginResponseSchema = z.object({
  token: z.string(),
  user: userResponseSchema,
})
