import { z } from 'zod'

const slideSchema = z.object({
  titulo: z.string(),
  texto: z.string(),
  cor_fundo: z.string().optional(),
  image_url: z.string().url().optional(),
  layout: z.object({
    titulo: z.object({
      x: z.number().min(0).max(100).default(50),
      y: z.number().min(0).max(100).default(40),
      fontSize: z.number().min(10).max(100).default(32),
      color: z.string().default('#ffffff'),
      textAlign: z.enum(['left', 'center', 'right']).default('center'),
      fontFamily: z.string().default('Inter'),
    }).optional(),
    texto: z.object({
      x: z.number().min(0).max(100).default(50),
      y: z.number().min(0).max(100).default(60),
      fontSize: z.number().min(10).max(100).default(18),
      color: z.string().default('#f3f4f6'),
      textAlign: z.enum(['left', 'center', 'right']).default('center'),
      fontFamily: z.string().default('Inter'),
    }).optional(),
  }).optional(),
})

export const postSchema = z.object({
  id: z.number(),
  tema: z.string(),
  estilo: z.enum(['dor', 'educativo', 'venda']),
  conteudo: z.object({
    slides: z.array(slideSchema),
  }),
  legenda: z.string(),
  status: z.enum(['gerado', 'aprovado', 'rejeitado']),
  favorito: z.boolean(),
  qualidade: z.number().nullable(),
  created_at: z.date(),
})

export const listPostsSchema = {
  querystring: z.object({
    status: z.enum(['gerado', 'aprovado', 'rejeitado']).optional(),
    favorito: z.coerce.boolean().optional(),
  }),
  response: {
    200: z.array(postSchema),
  },
}

export const updatePostSchema = {
  params: z.object({
    id: z.coerce.number(),
  }),
  body: z.object({
    status: z.enum(['gerado', 'aprovado', 'rejeitado']).optional(),
    favorito: z.boolean().optional(),
    qualidade: z.number().min(0).max(5).optional(),
  }),
  response: {
    200: postSchema,
  },
}

export const generatePostSchema = {
  body: z.object({
    tema: z.string().min(3),
    estilo: z.enum(['dor', 'educativo', 'venda']),
    styleExamples: z.array(z.any()).optional(),
  }),
  response: {
    201: postSchema,
  },
}
