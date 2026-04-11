import { useState, useRef, useEffect } from 'react'
import { useCompanion } from '../context/CompanionContext'
import { sendChatMessage } from '../api/chat'
import './Chat.css'

function TypingIndicator() {
  return (
    <div className="msg companion typing">
      <div className="bubble">
        <span className="dot" />
        <span className="dot" />
        <span className="dot" />
      </div>
    </div>
  )
}

function Message({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`msg ${isUser ? 'user' : 'companion'}`}>
      <div className="bubble">{msg.content}</div>
    </div>
  )
}

export default function Chat() {
  const { state, actions } = useCompanion()
  const { companion, messages, loading, userName, serverUrl } = state
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || loading) return

    setInput('')
    actions.addMessage({ role: 'user', content: text, timestamp: Date.now() })
    actions.setLoading(true)

    try {
      const response = await sendChatMessage({
        message: text,
        companion,
        messages,
        userName,
        serverUrl,
      })
      actions.addMessage({ role: 'assistant', content: response, timestamp: Date.now() })
    } catch (err) {
      actions.addMessage({
        role: 'assistant',
        content: `Hmm, não consegui responder agora. (${err.message})`,
        timestamp: Date.now(),
      })
    } finally {
      actions.setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const isEmpty = messages.length === 0

  return (
    <div className="chat-panel">
      <div className="chat-messages">
        {isEmpty && !loading && (
          <div className="chat-empty">
            <p>Diga oi para {companion?.name}! 👋</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <Message key={i} msg={msg} />
        ))}
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input-row">
        <input
          ref={inputRef}
          className="chat-input"
          type="text"
          placeholder={`Fale com ${companion?.name ?? 'seu companheiro'}...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          disabled={loading}
          maxLength={500}
        />
        <button
          className="send-btn"
          onClick={handleSend}
          disabled={!input.trim() || loading}
        >
          ↑
        </button>
      </div>
    </div>
  )
}
