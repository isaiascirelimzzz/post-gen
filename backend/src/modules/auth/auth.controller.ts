import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { prisma } from '../../shared/db/prisma.js'
import { hash } from '../../shared/auth/hash.js'
import { AppError } from '../../shared/http/errors.js'
import { loginSchema, updateProfileSchema, loginResponseSchema, userResponseSchema } from './auth.schema.js'

export async function authRoutes(app: FastifyInstance) {
  const typedApp = app.withTypeProvider<ZodTypeProvider>()

  // POST /auth/login
  typedApp.post('/login', {
    schema: {
      body: loginSchema.body,
      response: {
        200: loginResponseSchema,
      },
    },
  }, async (request, reply) => {
    const { email, password } = request.body

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      throw new AppError('Credenciais inválidas', 401)
    }

    const isPasswordValid = await hash.compare(password, user.password_hash)

    if (!isPasswordValid) {
      throw new AppError('Credenciais inválidas', 401)
    }

    const token = await reply.jwtSign({ sub: user.id })

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    }
  })

  // PUT /auth/profile
  typedApp.put('/profile', {
    schema: {
      body: updateProfileSchema.body,
      response: {
        200: userResponseSchema,
      },
    },
    onRequest: [async (request) => { await request.jwtVerify() }],
  }, async (request) => {
    const userId = Number(request.user.sub)
    const { name, email } = request.body

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
      },
    })

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    }
  })
}
