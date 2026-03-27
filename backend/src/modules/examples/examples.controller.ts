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
  typedApp.addHook('onRequest', async (request) => {
    await request.jwtVerify()
  })

  // GET de todos os exemplos do usuário
  typedApp.get('/', async (request) => {
    const userId = Number(request.user.sub)
    return (prisma as any).designExample.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' }
    })
  })

  // upload de um novo exemplo
  typedApp.post('/upload', async (request, reply) => {
    const userId = Number(request.user.sub)
    const data = await request.file()
    if (!data) {
      request.log.warn('Upload attempt without file')
      throw new AppError('Nenhum arquivo enviado', 400)
    }
    //aceita apenas imagens
    if (data.mimetype !== 'image/jpeg' && data.mimetype !== 'image/png' && data.mimetype !== 'image/webp' && data.mimetype !== 'image/jpg') {
      request.log.warn('Invalid file type')
      throw new AppError('Tipo de arquivo inválido', 415)
    }

    const uploadDir = path.join(__dirname, '../../../public/uploads')
    const fileName = `${Date.now()}-${data.filename}`
    const filePath = path.join(uploadDir, fileName)
    const docType = data.mimetype.split('/')[1].toLowerCase()

    request.log.info({ filePath }, 'Saving uploaded file')

    try {
      await pipeline(data.file, fs.createWriteStream(filePath))
    } catch (err) {
      request.log.error(err, 'Failed to write file to disk')
      throw new AppError('Erro ao salvar arquivo no servidor', 500)
    }

    // analise com a Vision API
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
        favorito: true,
        doc_type: docType,
      }
    })

    return example
  })

  // CREATE de um exemplo a partir de um slide gerado
  typedApp.post('/from-slide', async (request) => {
    const userId = Number(request.user.sub)
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

  // toggle de favorito
  typedApp.patch('/:id/favorite', { schema: { body: toggleFavoriteSchema } }, async (request) => {
    const userId = Number(request.user.sub)
    const { id } = request.params as { id: string }
    const { favorito } = request.body

    return (prisma as any).designExample.update({
      where: { id: Number(id), user_id: userId },
      data: { favorito }
    })
  })

  // GET e UPDATE da configuração de treinamento
  typedApp.get('/config', async (request) => {
    const userId = Number(request.user.sub)
    let config = await (prisma as any).userConfig.findUnique({ where: { user_id: userId } })
    if (!config) {
      config = await (prisma as any).userConfig.create({ data: { user_id: userId } })
    }
    return config
  })

  // UPDATE da configuração de treinamento
  typedApp.patch('/config', { schema: { body: updateConfigSchema } }, async (request) => {
    const userId = Number(request.user.sub)
    const { training_source } = request.body

    return (prisma as any).userConfig.upsert({
      where: { user_id: userId },
      update: { training_source },
      create: { user_id: userId, training_source }
    })
  })
}