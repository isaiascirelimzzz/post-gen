import { app } from './app.js'
import { env } from './config/env.js'
import { logger } from './config/logger.js'

async function bootstrap() {
  try {
    const address = await app.listen({
      port: env.PORT,
      host: '0.0.0.0', // Listen on all interfaces
    })
    logger.info(`🚀 Server listening at ${address}`)
  } catch (err) {
    logger.error(err)
    process.exit(1)
  }
}

bootstrap()
