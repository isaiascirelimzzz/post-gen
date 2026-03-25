import Fastify, { FastifyReply, FastifyRequest } from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import jwt from '@fastify/jwt'
import rateLimit from '@fastify/rate-limit'
import multipart from '@fastify/multipart'
import fastifyStatic from '@fastify/static'
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod'
import path from 'path'
import { fileURLToPath } from 'url'
import { env } from './config/env.js'
import { logger } from './config/logger.js'
import { AppError } from './shared/http/errors.js'

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: {
      sub: string
    }
  }
}

export const app = Fastify({
  loggerInstance: logger,
}).withTypeProvider<ZodTypeProvider>()

// Compilers for Zod
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

// Plugins
app.register(helmet, {
  crossOriginResourcePolicy: { policy: 'cross-origin' },
})
app.register(cors, {
  origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN,
})

app.register(jwt, {
  secret: env.JWT_SECRET,
})

app.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
})

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.register(multipart, {
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  }
})
app.register(fastifyStatic, {
  root: path.join(__dirname, '../public'),
  prefix: '/public/',
})

// Error Handler
app.setErrorHandler((error: any, request: FastifyRequest, reply: FastifyReply) => {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      error: {
        code: error.name,
        message: error.message,
      },
    })
  }

  if (error.validation) {
    return reply.status(400).send({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: error.validation,
      },
    })
  }

  logger.error(error)

  return reply.status(500).send({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    },
  })
})

import { authRoutes } from './modules/auth/auth.controller.js'
import { postRoutes } from './modules/posts/posts.controller.js'
import { exampleRoutes } from './modules/examples/examples.controller.js'

// Routes
app.register(authRoutes, { prefix: '/api/auth' })
app.register(postRoutes, { prefix: '/api/posts' })
app.register(exampleRoutes, { prefix: '/api/examples' })
