import OpenAI from 'openai'
import { env } from '../../config/env.js'
import { logger } from '../../config/logger.js'
import { AppError } from '../../shared/http/errors.js'
import fs from 'fs'
import path from 'path'

export const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
})

/**
 * Generates a photorealistic background image for a slide using DALL-E 3.
 */
async function generateImage(prompt: string): Promise<string> {
  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: `Photorealistic, high-quality background for an Instagram carousel: ${prompt}. Clean, minimalist, modern design. Leaving space for text overlay. Premium aesthetic. No text in the image.`,
      n: 1,
      size: '1024x1792',
      quality: 'hd',
    })

    return response.data?.[0]?.url || ''
  } catch (error) {
    logger.error(error, 'Error generating image with DALL-E')
    return '' // Fallback to no image
  }
}

export async function generateAIContent(
  tema: string, 
  estilo: string, 
  contentExamples: any[] = [], 
  styleExamples: any[] = []
) {
  if (!env.OPENAI_API_KEY || env.OPENAI_API_KEY === 'sk-seu-token-aqui') {
    logger.warn('AI Generation called but OPENAI_API_KEY is missing or placeholder. Using fallback.')
    return fallbackGeneration(tema, estilo)
  }

  const contentPrompt = contentExamples.length > 0 
    ? `Use estes posts como referência de CONTEÚDO e TOM:\n${JSON.stringify(contentExamples, null, 2)}`
    : ''

  const stylePrompt = styleExamples.length > 0
    ? `USE OS SEGUINTES PADRÕES VISUAIS QUE EU GOSTO (TREINAMENTO):\n${JSON.stringify(styleExamples, null, 2)}`
    : ''

  const prompt = `
    Você é um designer de elite especializado em carrosséis para Instagram.
    Crie um post de alta performance sobre: "${tema}".
    Estilo sugerido: "${estilo}".
    ${contentPrompt}
    ${stylePrompt}

    Instruções de Conteúdo:
    1. Crie entre 5 a 7 slides.
    2. O primeiro slide é a CAPA (muito chamativa).
    3. O último slide é o CTA (Chamada para ação).

    Instruções de Design (Trate o slide como um grid 100x100):
    1. Para cada slide, defina as coordenadas (x, y) de 0 a 100 para o título e o texto.
       IMPORTANTE: Se houver padrões visuais nos exemplos de treinamento (typical_text_zones), tente segui-los para manter a consistência.
    2. Escolha cores (hex) com alto contraste do fundo. Se houver color_palette nos exemplos, dê preferência a essas cores.
    3. TIPOGRAFIA (CRÍTICO): Você DEVE ter liberdade criativa. NÃO use sempre "Inter" ou "Montserrat". Escolha um par de fontes (título e texto) que combine perfeitamente com a personalidade do "estilo" e do "tema".
       - Fontes de Título Sugeridas (Impacto): "Bebas Neue", "Anton", "Oswald", "Righteous", "Fjalla One", "Teko", "Cinzel", "Playfair Display", "Pacifico", "Caveat".
       - Fontes de Texto Sugeridas (Leitura): "Roboto", "Open Sans", "Lato", "Poppins", "Nunito", "Quicksand", "Work Sans", "Rubik", "Lora".
       Lista completa disponível: Inter, Roboto, Open Sans, Lato, Montserrat, Oswald, Source Sans 3, Raleway, PT Sans, Merriweather, Nunito, Playfair Display, Ubuntu, Lora, Rubik, Work Sans, PT Serif, Fira Sans, Quicksand, Barlow, Inconsolata, Titillium Web, Heebo, Poppins, Bitter, Dosis, Crimson Text, Libre Baskerville, Anton, Josefin Sans, Karla, Pacifico, Dancing Script, Varela Round, Space Grotesk, Space Mono, Archivo, Libre Franklin, Cabin, Cinzel, Righteous, Fjalla One, EB Garamond, Bebas Neue, Exo 2, Prompt, Mulish, Maven Pro, Teko, Caveat.
    4. Crie um prompt descritivo para o DALL-E gerar uma imagem de fundo (background) fotográfica e premium que combine com o slide. O prompt deve ser em INGLÊS.


    Responda EXCLUSIVAMENTE em formato JSON seguindo esta estrutura:
    {
      "slides": [
        { 
          "titulo": "...", 
          "texto": "...", 
          "image_prompt": "DALL-E prompt in English...",
          "layout": {
            "titulo": { "x": 50, "y": 40, "fontSize": 48, "color": "#ffffff", "textAlign": "center", "fontFamily": "Montserrat" },
            "texto": { "x": 50, "y": 65, "fontSize": 20, "color": "#e5e7eb", "textAlign": "center", "fontFamily": "Inter" }
          }
        }

      ],
      "legenda": "..."
    }
  `

  try {
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: 'Você é um Diretor de Arte Sênior especializado em Instagram Reels e Carrosséis.' },
      { role: 'user', content: prompt }
    ]

    // 1º PINTURA (Draft)
    const draftResponse = await openai.chat.completions.create({
      model: env.OPENAI_MODEL,
      messages,
      response_format: { type: 'json_object' },
    })

    const draftContent = draftResponse.choices[0].message.content
    if (!draftContent) throw new Error('AI returned empty draft content')

    // Anexamos a resposta para o histórico
    messages.push({ role: 'assistant', content: draftContent })

    // 2º PINTURA (Review / Agentic Self-Correction)
    const reviewPrompt = `
      Excelente. Agora, atue como um Revisor de Qualidade de UX/UI. Analise o JSON que você acabou de gerar e CRITIQUE-O buscando problemas na tela de um celular (aspect ratio 4:5):
      
      1. **Sobreposição**: O título e o texto estão muito próximos no eixo Y? (Certifique-se que haja uma distância de pelo menos 20 pontos entre eles. Ex: Título no y=25, Texto no y=65).
      2. **Zonas de Morte**: Algum texto está configurado para Y < 15 ou Y > 85? (Isso corta no celular. NUNCA coloque fora da zona 15-85).
      3. **Tamanhos e Quebras**: Textos de corpo (texto) muito longos com fonte muito grande (ex: fontSize > 25)? Reduza o fontSize do texto de corpo pra caber na tela.
      4. **Design Premium**: O contraste faz sentido? A escolha da 'fontFamily' está coesa?

      Corrija automaticamente QUALQUER um desses problemas matemáticos no grid.
      RETORNE O JSON FINAL OTIMIZADO seguindo exatamente a MESMA ESTRUTURA exigida anteriormente.
    `
    messages.push({ role: 'user', content: reviewPrompt })

    const finalResponse = await openai.chat.completions.create({
      model: env.OPENAI_MODEL,
      messages,
      response_format: { type: 'json_object' },
    })

    const finalContent = finalResponse.choices[0].message.content
    if (!finalContent) throw new Error('AI returned empty final content')

    const parsed = JSON.parse(finalContent)

    // Parallel image generation for the slides (limit to first 7 slides for safety)
    const slidesWithImages = await Promise.all(
      parsed.slides.slice(0, 7).map(async (slide: any) => {
        const imageUrl = await generateImage(slide.image_prompt)
        return {
          ...slide,
          image_url: imageUrl,
        }
      })
    )

    return {
      slides: slidesWithImages,
      legenda: parsed.legenda,
    }
  } catch (error) {
    logger.error(error, 'Error calling OpenAI')
    throw new AppError('Erro ao gerar conteúdo com IA', 502)
  }
}

/**
 * Uses GPT-4o (Vision) to analyze an image and return structured design patterns.
 */
export async function analyzeDesignStyle(imagePath: string) {
  try {
    const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' })
    const extension = path.extname(imagePath).replace('.', '')

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            { 
              type: 'text', 
              text: `Analyze this social media post design carefully. 
              Extract the following patterns in JSON format:
              - typical_text_zones: { titulo: { x, y }, texto: { x, y } } (coordinates 0-100)
              - color_palette: string[] (hex codes)
              - preferred_font_styles: string (e.g. "bold", "minimalist", "serif")
              - text_density: "low" | "medium" | "high"
              - visual_vibe: string (general description of the aesthetic)
              
              Respond ONLY with the JSON object.` 
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/${extension};base64,${imageBase64}`,
              },
            },
          ],
        },
      ],
      response_format: { type: 'json_object' },
    })

    const content = response.choices[0].message.content
    if (!content) throw new Error('Vision AI returned empty content')

    return JSON.parse(content)
  } catch (error) {
    logger.error(error, 'Error analyzing image with Vision API')
    return null
  }
}

function fallbackGeneration(tema: string, estilo: string) {
  return {
    slides: [
      { 
        titulo: tema, 
        texto: 'Este é um post gerado localmente (fallback).', 
        cor_fundo: 'linear-gradient(135deg, #1a0a1e 0%, #2d1040 40%, #1a1d24 100%)',
        layout: {
          titulo: { x: 50, y: 40, fontSize: 40, color: '#ffffff', textAlign: 'center', fontFamily: 'Montserrat' },
          texto: { x: 50, y: 60, fontSize: 18, color: '#f3f4f6', textAlign: 'center', fontFamily: 'Inter' }
        }
      },
      ...Array(3).fill(null).map((_, i) => ({
        titulo: `Slide ${i + 2}`,
        texto: `Conteúdo de exemplo do estilo ${estilo}.`,
        cor_fundo: 'linear-gradient(135deg, #0a0e1a 0%, #10152d 40%, #1a1d24 100%)',
        layout: {
          titulo: { x: 50, y: 45, fontSize: 32, color: '#ffffff', textAlign: 'center', fontFamily: 'Montserrat' },
          texto: { x: 50, y: 65, fontSize: 18, color: '#f3f4f6', textAlign: 'center', fontFamily: 'Inter' }
        }

      }))
    ],
    legenda: `🚀 ${tema}\n\nConteúdo gerado via fallback.\n\n#marketing #ia`,
  }
}
