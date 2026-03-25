import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import { hash } from '../src/shared/auth/hash.js'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const passwordHash = await hash.generate('123456')

  const admin = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Usuário Demo',
      password_hash: passwordHash,
    },
  })

  console.log('✅ Seed: Admin user created/verified:', admin.email)

  // Clear existing posts to avoid duplication on re-run
  await prisma.post.deleteMany({ where: { user_id: admin.id } })

  // Initial posts
  const postData = [
    { tema: 'Como escalar seu negócio digital', estilo: 'venda' },
    { tema: '5 erros que destroem seu engajamento', estilo: 'dor' },
    { tema: 'O segredo dos perfis que crescem rápido', estilo: 'educativo' },
    { tema: 'Por que seus stories não convertem', estilo: 'dor' },
    { tema: 'Estratégias de conteúdo para 2026', estilo: 'educativo' },
    { tema: 'Como criar carrosséis virais', estilo: 'educativo' },
    { tema: 'Funil de vendas pelo Instagram', estilo: 'venda' },
    { tema: 'Copywriting para redes sociais', estilo: 'venda' },
    { tema: 'Métricas que realmente importam', estilo: 'educativo' },
    { tema: 'Rotina de criação de conteúdo', estilo: 'educativo' },
    { tema: 'Como usar IA no marketing digital', estilo: 'venda' },
    { tema: 'Gatilhos mentais em posts', estilo: 'venda' },
  ]

  for (let i = 0; i < postData.length; i++) {
    const { tema, estilo } = postData[i]
    
    await prisma.post.create({
      data: {
        tema,
        estilo,
        conteudo: {
          slides: [
            { titulo: tema, texto: 'Descubra como transformar sua presença digital com estratégias comprovadas.', cor_fundo: '#1a1d24' },
            { titulo: 'O Problema', texto: 'Muitos profissionais falham por não entenderem a dinâmica atual das redes sociais.', cor_fundo: '#12141a' },
            { titulo: 'A Solução', texto: 'Aplique estas 3 técnicas simples mas poderosas para ver resultados imediatos.', cor_fundo: '#2a2f3a' },
            { titulo: 'CTA', texto: 'Gostou? Siga para mais dicas como esta! 🚀', cor_fundo: '#1a1d24' },
          ],
        },
        legenda: `🚀 ${tema}\n\nVocê sabia que a maioria dos perfis erra nisso?\n\nNeste carrossel você vai aprender o segredo.\n\n#marketing #instagram #conteudo #ia`,
        status: i < 4 ? 'gerado' : (i < 8 ? 'aprovado' : 'rejeitado'),
        favorito: i % 5 === 0,
        qualidade: Math.floor(Math.random() * 3) + 3,
        user_id: admin.id,
      },
    })
  }

  console.log('✅ Seed: All mock posts created successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
