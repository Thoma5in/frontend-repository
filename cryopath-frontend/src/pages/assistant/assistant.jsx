import React, { useState, useRef, useEffect } from 'react';
import { sendMessage as sendMessageToApi } from '../../services/assistantApi';
import { useAuth } from '../../context/AuthContext';
import './asisstan.css';

const Assistant = () => {
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', text: '¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const chatRef = useRef(null);
  const { currentUser } = useAuth();

  const handleChatScroll = () => {
    // opcional: lógica adicional si se necesita
  }

  useEffect(() => {
    // Mantener el slider en sync tras nuevos mensajes
    const el = chatRef.current
    if (!el) return
    handleChatScroll()
  }, [messages])

  const sendMessage = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;

    // Add user message to chat
    const userMsg = { id: Date.now(), role: 'user', text };
    setMessages(prev => {
      const updated = [...prev, userMsg];
      return updated.length > 30 ? updated.slice(updated.length - 30) : updated;
    });
    
    setInput('');
    setIsLoading(true);

    try {
      // Send message to API
      const response = await sendMessageToApi(
        text,
        currentUser?.uid || 'anonymous',
        conversationId
      );

      // Update conversation ID if this is a new conversation
      if (response.data?.conversationId && !conversationId) {
        setConversationId(response.data.conversationId);
      }

      // Add assistant's response to chat
      const assistantMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        text: response.data?.response || 'Lo siento, no pude procesar tu solicitud.'
      };
      
      setMessages(prev => {
        const updated = [...prev, assistantMsg];
        return updated.length > 30 ? updated.slice(updated.length - 30) : updated;
      });
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        text: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, inténtalo de nuevo.'
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

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
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Enviando...' : 'Enviar'}
          </button>
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
