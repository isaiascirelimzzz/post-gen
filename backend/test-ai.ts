import { generateAIContent } from './src/modules/ai/ai.client.js'
import { prisma } from './src/shared/db/prisma.js'

async function run() {
  console.log('Starting AI generation test...')
  try {
    const aiContent = await generateAIContent('O que é marketing digital', 'educativo', [], [])
    console.log('Success:', JSON.stringify(aiContent, null, 2))
  } catch (err: any) {
    console.error('FAILED IN GENERATION:', err.message || err)
    if (err.stack) console.error(err.stack)
  }
}

run().catch(console.error)
