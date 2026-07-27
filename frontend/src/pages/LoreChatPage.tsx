import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { FormEvent } from 'react';

import '../assets/CSS/LoreChatPage.css'; // Import pure CSS
import ProjectNavBar from '../components/ProjectNavBar';
import api from '../api/axiosConfig'; // Import the configured axios instance

interface ChatMessage {
  id: number;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

interface ChatRequest {
  projectId: number;
  question: string;
}

interface ChatResponse {
  answer: string;
}

export default function LoreChatPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: 'ai',
      text: "Welcome to your Worldbuilding Hub! I have loaded all your wiki data. Ask me anything about your lore, characters, or factions.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     const canUseAI = await fetch(`http://localhost:8080/api/ai/`, {

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userQuery = input.trim();
    const userMessage: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      text: userQuery,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const requestPayload: ChatRequest = {
        projectId: projectId ? parseInt(projectId, 10) : 1,
        question: userQuery
      };

      const response = await api.post('/ai/chat', requestPayload);
    

      const data: ChatResponse = response.data;

      const aiMessage: ChatMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: data.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: "⚠️ Couldn't reach the lore engine. Ensure your Spring Boot backend is running.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <ProjectNavBar />
    <div className="lore-chat-container">
      
      {/* Left Sidebar */}
      <aside className="lore-chat-sidebar">
        <div>
          <button onClick={() => navigate(-1)} className="btn-back">
            ← Back to Project Workspace
          </button>

          <h2 className="sidebar-title">Suggested Prompts</h2>

          <div className="prompt-list">
            {[
              "Summarize the main conflict",
              "Who is the main antagonist?",
              "Find gaps in my magic system",
              "Suggest 3 character motives"
            ].map((prompt, i) => (
              <button
                key={i}
                onClick={() => setInput(prompt)}
                className="btn-prompt"
              >
                💡 {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* <div className="sidebar-footer">
          <span className="status-indicator">
            <span className="status-dot" />
            Lore Index Active
          </span>
          <span>Gemini 2.0</span>
        </div> */}
      </aside>

      {/* Main Chat Area */}
      <main className="lore-chat-main">
        
        {/* Header */}
        <header className="chat-header">
          <div>
            <h1 className="header-title">Story Smith AI Historian</h1>
            {/* <p className="header-subtitle">Querying project lore in real-time</p> */}
          </div>
          <button onClick={() => setMessages([messages[0]])} className="btn-clear">
            Clear Chat
          </button>
        </header>

        {/* Message Stream */}
        <div className="message-stream">
          {messages.map((msg) => (
            <div key={msg.id} className={`message-wrapper ${msg.sender}`}>
              <div className="message-bubble">
                <p className="message-text">{msg.text}</p>
              </div>
              <span className="message-timestamp">{msg.timestamp}</span>
            </div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="message-wrapper ai">
              <div className="typing-indicator">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="chat-input-area">
          <form onSubmit={handleSendMessage} className="chat-form">
            <input
              type="text"
              value={input}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
              placeholder="Ask anything about your world, characters, factions..."
              disabled={isLoading}
              className="chat-input"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="btn-send"
            >
              Send
            </button>
          </form>
        </div>

      </main>
    </div>
    </>
  );
}