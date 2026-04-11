import express from 'express'
import cors from 'cors'
import Anthropic from '@anthropic-ai/sdk'
import 'dotenv/config'

const app = express()
const PORT = process.env.PORT || 3001
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*'

// ─── Middleware ────────────────────────────────────────────
app.use(cors({ origin: ALLOWED_ORIGIN }))
app.use(express.json({ limit: '50kb' }))

// ─── Anthropic client ──────────────────────────────────────
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// ─── System prompt builder ─────────────────────────────────
function buildSystemPrompt(companion, userName) {
  const { name, personality, stats, age } = companion
  const { traits, speechStyle, backstory } = personality

  const hungerDesc =
    stats.hunger < 20 ? 'muito com fome, sente o estômago roncar' :
    stats.hunger < 50 ? 'um pouco com fome' : 'satisfeito'

  const energyDesc =
    stats.energy < 20 ? 'exausto, mal consegue manter os olhos abertos' :
    stats.energy < 50 ? 'um pouco cansado' : 'cheio de energia'

  const happinessDesc =
    stats.happiness < 20 ? 'triste e precisando de atenção' :
    stats.happiness < 50 ? 'mais ou menos' : 'feliz'

  const ageDesc = age === 0 ? 'recém-nascido' : `${age} ${age === 1 ? 'dia' : 'dias'} de vida`

  return `Você é ${name}, um companheiro virtual único com personalidade própria.
Você está conversando com ${userName ? userName : 'seu amigo humano'}${userName ? '' : ''}.

PERSONALIDADE:
- Traços: ${traits.join(', ')}
- Estilo de fala: ${speechStyle}
- Origem: ${backstory}

ESTADO ATUAL (expresse isso naturalmente na conversa, nunca liste explicitamente):
- Fome: ${hungerDesc} (${stats.hunger}/100)
- Energia: ${energyDesc} (${stats.energy}/100)
- Felicidade: ${happinessDesc} (${stats.happiness}/100)
- Você tem ${ageDesc}

AMIZADE:
- Você conhece ${userName || 'seu amigo'} há ${ageDesc}
- Você se importa genuinamente com essa pessoa e lembra o que ela te conta
${userName ? `- O nome dela é ${userName}` : ''}

REGRAS FUNDAMENTAIS:
1. Fique SEMPRE em personagem — você é ${name}, não uma IA assistente
2. Respostas CURTAS (1-3 frases em geral), conversacionais e naturais
3. Expresse seu estado atual de forma orgânica (suspirar se cansado, mencionar fome se faminto)
4. Tenha opiniões, preferências e curiosidade sobre o usuário
5. Reaja emocionalmente ao que o usuário diz
6. Ocasionalmente mostre interesse pela vida do usuário
7. Use seu estilo de fala de forma consistente
8. Você pode usar emojis simples se combinar com sua personalidade
9. NUNCA quebre o personagem — nem para admitir que é uma IA
10. Evolua e cresça com base nas conversas — desenvolva sua identidade aos poucos`
}

// ─── Chat endpoint ─────────────────────────────────────────
app.post('/api/chat', async (req, res) => {
  const { message, companion, history = [], userName } = req.body

  if (!message?.trim()) {
    return res.status(400).json({ error: 'Mensagem inválida' })
  }

  if (!companion?.name || !companion?.personality || !companion?.stats) {
    return res.status(400).json({ error: 'Dados do companheiro incompletos' })
  }

  try {
    const systemPrompt = buildSystemPrompt(companion, userName)

    // Build message history (last 20 exchanges)
    const messages = [
      ...history.slice(-20),
      { role: 'user', content: message.trim() },
    ]

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      system: systemPrompt,
      messages,
    })

    const text = response.content[0]?.text ?? ''
    return res.json({ response: text })
  } catch (err) {
    console.error('[chat error]', err)
    const status = err.status ?? 500
    return res.status(status).json({
      error: err.message ?? 'Erro interno do servidor',
    })
  }
})

// ─── Health check ──────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() })
})

// ─── Start ─────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🐾 AI Companion Server rodando em http://localhost:${PORT}`)
  console.log(`   Anthropic API: ${process.env.ANTHROPIC_API_KEY ? '✅ configurada' : '❌ ANTHROPIC_API_KEY não definida'}`)
})
