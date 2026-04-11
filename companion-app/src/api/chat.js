export async function sendChatMessage({ message, companion, messages, userName, serverUrl }) {
  const url = `${serverUrl || 'http://localhost:3001'}/api/chat`

  const history = messages.slice(-20).map((m) => ({
    role: m.role,
    content: m.content,
  }))

  const age = Math.floor((Date.now() - companion.birthDate) / (1000 * 60 * 60 * 24))

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      companion: {
        name: companion.name,
        personality: companion.personality,
        stats: companion.stats,
        age,
      },
      history,
      userName: userName || null,
    }),
  })

  if (!response.ok) {
    const err = await response.text().catch(() => response.statusText)
    throw new Error(`Erro no servidor: ${response.status} — ${err}`)
  }

  const data = await response.json()
  return data.response
}
