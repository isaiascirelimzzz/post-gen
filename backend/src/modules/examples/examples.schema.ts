import { z } from 'zod'

export const uploadExampleSchema = z.object({
  // Multipart handling usually doesn't use zod for the file itself in fastify-type-provider-zod 
  // without special plugins, but we can validate other fields if any.
})

export const toggleFavoriteSchema = z.object({
  favorito: z.boolean()
})

export const updateConfigSchema = z.object({
  training_source: z.enum(['UPLOADED', 'FAVORITED', 'BOTH'])
})
