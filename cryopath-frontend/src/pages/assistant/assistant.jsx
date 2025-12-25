// Simple assistant/help page
import React, { useState, useRef, useEffect } from 'react'
import './asisstan.css'

const Assistant = () => {
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', text: '¿Qué te gustaría saber?' }
  ])
  const [input, setInput] = useState('')
  const chatRef = useRef(null)

  const handleChatScroll = () => {
    // opcional: lógica adicional si se necesita
  }

  useEffect(() => {
    // Mantener el slider en sync tras nuevos mensajes
    const el = chatRef.current
    if (!el) return
    handleChatScroll()
  }, [messages])

  const sendMessage = (e) => {
    e.preventDefault()
    const text = input.trim()
    if (!text) return
    const userMsg = { id: Date.now(), role: 'user', text }
    // Mock assistant reply
    const reply = {
      id: Date.now() + 1,
      role: 'assistant',
      text: 'Estoy aquí para ayudarte. (Respuesta de ejemplo)'
    }
    // Limitar a los últimos 30 mensajes
    setMessages((prev) => {
      const next = [...prev, userMsg, reply]
      const MAX = 30
      return next.length > MAX ? next.slice(next.length - MAX) : next
    })
    setInput('')
  }

  return (
    <div className="assistant-page">
      <div className="assistant-left">
        <div className="assistant-header">Asistente Virtual julIA</div>
        <div className="chat-window" ref={chatRef} onScroll={handleChatScroll}>
          {messages.map((m) => (
            <div key={m.id} className={`msg msg-${m.role}`}>
              {m.text}
            </div>
          ))}
        </div>
        <form className="chat-input" onSubmit={sendMessage}>
          <input
            type="text"
            placeholder="¿Qué te gustaría saber?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit">Enviar</button>
        </form>
      </div>
      <div className="assistant-right">
        <button className="action-btn primary">Llamar a un asistente</button>
        <button className="action-btn warning">Reportar un problema</button>
      </div>
    </div>
  )
}

export default Assistant
