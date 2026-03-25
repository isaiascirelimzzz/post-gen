import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { prisma } from '../../shared/db/prisma.js'
import { AppError } from '../../shared/http/errors.js'
import { analyzeDesignStyle } from '../ai/ai.client.js'
import { toggleFavoriteSchema, updateConfigSchema } from './examples.schema.js'
import fs from 'fs'
import path from 'path'
import { pipeline } from 'stream/promises'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export async function exampleRoutes(app: FastifyInstance) {
  const typedApp = app.withTypeProvider<ZodTypeProvider>()

  // Get all examples for the user
  typedApp.get('/', async (request) => {
    const userId = 1 // TODO: Get from JWT
    return (prisma as any).designExample.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' }
    })
  })

  // Upload a new example
  typedApp.post('/upload', async (request, reply) => {
    const userId = 1 // TODO: Get from JWT
    const data = await request.file()
    if (!data) {
      request.log.warn('Upload attempt without file')
      throw new AppError('Nenhum arquivo enviado', 400)
    }

    const uploadDir = path.join(__dirname, '../../../public/uploads')
    const fileName = `${Date.now()}-${data.filename}`
    const filePath = path.join(uploadDir, fileName)

    request.log.info({ filePath }, 'Saving uploaded file')

    try {
      await pipeline(data.file, fs.createWriteStream(filePath))
    } catch (err) {
      request.log.error(err, 'Failed to write file to disk')
      throw new AppError('Erro ao salvar arquivo no servidor', 500)
    }

    // Analyze with Vision API
    request.log.info('Analyzing with Vision API...')
    const patterns = await analyzeDesignStyle(filePath)
    if (!patterns) {
      request.log.warn('Vision API analysis failed')
    }

    const example = await (prisma as any).designExample.create({
      data: {
        image_url: `/public/uploads/${fileName}`,
        origem: 'UPLOAD',
        patterns,
        user_id: userId,
        favorito: true
      }
    })

    return example
  })

  // Create example from generated slide
  typedApp.post('/from-slide', async (request) => {
    const userId = 1 // TODO: Get from JWT
    const { image_url, patterns } = request.body as any

    return (prisma as any).designExample.create({
      data: {
        image_url,
        origem: 'GENERATED',
        patterns,
        user_id: userId,
        favorito: true
      }
    })
  })

  // Toggle favorite
  typedApp.patch('/:id/favorite', { schema: { body: toggleFavoriteSchema } }, async (request) => {
    const { id } = request.params as { id: string }
    const { favorito } = request.body
    
    return (prisma as any).designExample.update({
      where: { id: Number(id) },
      data: { favorito }
    })
  })

  // Get/Update training config
  typedApp.get('/config', async () => {
    const userId = 1
    let config = await (prisma as any).userConfig.findUnique({ where: { user_id: userId } })
    if (!config) {
      config = await (prisma as any).userConfig.create({ data: { user_id: userId } })
    }
    return config
  })

  typedApp.patch('/config', { schema: { body: updateConfigSchema } }, async (request) => {
    const userId = 1
    const { training_source } = request.body
    
    return (prisma as any).userConfig.upsert({
      where: { user_id: userId },
      update: { training_source },
      create: { user_id: userId, training_source }
    })
  })
}
