import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { prisma } from '../../shared/db/prisma.js'
import { listPostsSchema, updatePostSchema, generatePostSchema } from './posts.schema.js'
import { generateAIContent } from '../ai/ai.client.js'

export async function postRoutes(app: FastifyInstance) {
  const typedApp = app.withTypeProvider<ZodTypeProvider>()

  // Auth requirement for all routes in this module
  typedApp.addHook('onRequest', async (request) => {
    await request.jwtVerify()
  })

  // GET /posts
  typedApp.get('/', {
    schema: {
      querystring: listPostsSchema.querystring,
      response: {
        200: listPostsSchema.response[200],
      },
    },
  }, async (request) => {
    const userId = Number(request.user.sub)
    const { status, favorito } = request.query

    const posts = await prisma.post.findMany({
      where: {
        user_id: userId,
        ...(status && { status }),
        ...(favorito !== undefined && { favorito }),
      },
      orderBy: { created_at: 'desc' },
    })

    return posts as any
  })

  // PATCH /posts/:id
  typedApp.patch('/:id', {
    schema: {
      params: updatePostSchema.params,
      body: updatePostSchema.body,
      response: {
        200: updatePostSchema.response[200],
      },
    },
  }, async (request) => {
    const userId = Number(request.user.sub)
    const { id } = request.params
    const { status, favorito, qualidade } = request.body

    const post = await prisma.post.update({
      where: { id, user_id: userId },
      data: {
        ...(status && { status }),
        ...(favorito !== undefined && { favorito }),
        ...(qualidade !== undefined && { qualidade }),
      },
    })

    return post as any
  })

  // POST /posts/generate
  typedApp.post('/generate', {
    schema: {
      body: generatePostSchema.body,
      response: {
        201: generatePostSchema.response[201],
      },
    },
  }, async (request, reply) => {
    const userId = Number(request.user.sub)
    const { tema, estilo, styleExamples } = request.body as any

    // Phase 8: Practical Learning Engine (Content)
    const contentExamples = await prisma.post.findMany({
      where: {
        user_id: userId,
        OR: [
          { favorito: true },
          { qualidade: { gte: 4 } }
        ]
      },
      take: 3,
      orderBy: { created_at: 'desc' },
      select: {
        tema: true,
        estilo: true,
        conteudo: true,
        legenda: true
      }
    })

    // Phase 9: Visual Learning Engine (Design)
    let finalStyleExamples = request.body.styleExamples || []
    
    if (finalStyleExamples.length === 0) {
      const config = await (prisma as any).userConfig.findUnique({ where: { user_id: userId } })
      const source = config?.training_source || 'BOTH'
      
      const designExamples = await (prisma as any).designExample.findMany({
        where: {
          user_id: userId,
          ...(source === 'UPLOADED' && { origem: 'UPLOAD' }),
          ...(source === 'FAVORITED' && { origem: 'GENERATED' }),
          // BOTH doesn't need filter
          favorito: true // Only use the best ones
        },
        take: 5,
        orderBy: { created_at: 'desc' },
        select: { patterns: true }
      })
      finalStyleExamples = designExamples.map((d: any) => d.patterns).filter(Boolean)
    }

    const aiContent = await generateAIContent(tema, estilo, contentExamples, finalStyleExamples)

    const post = await prisma.post.create({
      data: {
        tema,
        estilo,
        conteudo: { slides: aiContent.slides } as any,
        legenda: aiContent.legenda,
        status: 'gerado',
        user_id: userId,
      },
    })

    return reply.status(201).send(post as any)
  })
}
