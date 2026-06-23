import { useState } from 'react';
import { Bot, Send, User } from 'lucide-react';
import './AIAssistant.css';

const AIAssistant = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hello! I am EcoShield AI. I can help you analyze heat drivers, pollution sources, or recommend interventions. How can I assist you with your region today?' }
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const API_BASE = import.meta.env.VITE_API_URL_1 || 'http://localhost:8000';
      const response = await fetch(`${API_BASE}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', text: "I'm having trouble connecting to my local python logic core right now. Make sure the uvicorn server is running on port 8000." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-container">
      <div className="ai-header">
        <h1>AI Environmental Assistant</h1>
        <p>Natural Language Queries & Location-Based Analysis</p>
      </div>

      <div className="chat-interface">
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              {msg.role === 'ai' && <div className="avatar"><Bot size={18} /></div>}
              <div className="msg-content">{msg.text}</div>
              {msg.role === 'user' && <div className="avatar"><User size={18} /></div>}
            </div>
          ))}
          {loading && (
            <div className="message ai">
              <div className="avatar"><Bot size={18} /></div>
              <div className="msg-content">Analyzing...</div>
            </div>
          )}
        </div>

        <div className="suggestions">
          <button className="suggestion-btn" onClick={() => setInput("What is causing pollution here?")}>What is causing pollution here?</button>
          <button className="suggestion-btn" onClick={() => setInput("Which intervention is best for my area?")}>Which intervention is best for my area?</button>
          <button className="suggestion-btn" onClick={() => setInput("Compare my area with another city.")}>Compare my area with another city.</button>
        </div>

        <div className="chat-input-area">
          <input 
            type="text" 
            placeholder="Ask anything about environmental intelligence..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button className="send-btn" onClick={sendMessage} disabled={loading}><Send size={18} /></button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
