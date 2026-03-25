import { app } from './src/app.js'

async function testAPI() {
  console.log('Booting app...')
  await app.ready()
  
  const token = app.jwt.sign({ sub: '1' })

  console.log('Injecting /api/posts/generate...')
  const response = await app.inject({
    method: 'POST',
    url: '/api/posts/generate',
    headers: {
      Authorization: `Bearer ${token}`
    },
    payload: {
      tema: 'Como usar a IA no dia a dia',
      estilo: 'educativo'
    }
  })

  console.log('Status:', response.statusCode)
  console.log('Payload:', response.payload)
  
  await app.close()
}

testAPI().catch(console.error)
