import { useState, useEffect } from 'react';
import { Bot, Send, User, MapPin, ArrowRightLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import indiaData from '../data/indiaStatesDistricts.json';
import './AIAssistant.css';

const AIAssistant = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hello! I am Heatlas AI. I can help you analyze heat drivers, pollution sources, or recommend interventions. How can I assist you with your region today?' }
  ]);
  const [loading, setLoading] = useState(false);

  // Primary Location State
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [districtsList, setDistrictsList] = useState([]);

  // Comparison Location State
  const [isComparing, setIsComparing] = useState(false);
  const [compareState, setCompareState] = useState('Madhya Pradesh');
  const [compareDistrict, setCompareDistrict] = useState('Indore');
  const [compareDistrictsList, setCompareDistrictsList] = useState([]);

  // Update primary district list when state changes
  useEffect(() => {
    if (selectedState) {
      const stateObj = indiaData.states.find(s => s.state === selectedState);
      if (stateObj) {
        setDistrictsList(stateObj.districts);
        setSelectedDistrict('');
      }
    }
  }, [selectedState]);

  // Update comparison district list when compare state changes
  useEffect(() => {
    if (compareState) {
      const stateObj = indiaData.states.find(s => s.state === compareState);
      if (stateObj) {
        setCompareDistrictsList(stateObj.districts);
      }
    }
  }, [compareState]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      let API_BASE = import.meta.env.VITE_API_URL_1 || 'http://localhost:8000';
      API_BASE = API_BASE.replace(/\/api\/?$/, '').replace(/\/+$/, '');
      
      // Inject location context invisibly to the AI
      let contextStr = '';
      if (selectedDistrict && selectedState) {
        contextStr = `[Context: User is analyzing ${selectedDistrict}, ${selectedState}. `;
        if (isComparing && compareDistrict && compareState) {
          contextStr += `User wants to compare this region with ${compareDistrict}, ${compareState}.`;
        }
        contextStr += `] `;
      }
      const finalPayload = `${contextStr}${userMsg}`;

      const response = await fetch(`${API_BASE}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: finalPayload })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || data.error?.message || `Server returned ${response.status}`);
      }
      
      setMessages(prev => [...prev, { role: 'ai', text: data.reply || "No reply provided by the server." }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', text: `Unable to connect to Heatlas AI Engine. (Reason: ${error.message})` }]);
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

      <div className="ai-location-panel">
        <div className="location-row">
          <div className="location-group">
            <MapPin size={18} className="loc-icon" />
            <select value={selectedState} onChange={e => setSelectedState(e.target.value)}>
              <option value="">Select State/UT...</option>
              {indiaData.states.map(s => (
                <option key={s.state} value={s.state}>{s.state}</option>
              ))}
            </select>
            <select value={selectedDistrict} onChange={e => setSelectedDistrict(e.target.value)} disabled={!selectedState}>
              <option value="">Select District...</option>
              {districtsList.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          
          <button 
            className={`compare-toggle-btn ${isComparing ? 'active' : ''}`}
            onClick={() => setIsComparing(!isComparing)}
          >
            <ArrowRightLeft size={16} /> Compare Region
          </button>
        </div>

        {isComparing && (
          <div className="location-row compare-row">
            <div className="location-group">
              <span className="compare-label">Comparing with:</span>
              <select value={compareState} onChange={e => {setCompareState(e.target.value); setCompareDistrict('');}}>
                <option value="">Select State/UT...</option>
                {indiaData.states.map(s => (
                  <option key={s.state} value={s.state}>{s.state}</option>
                ))}
              </select>
              <select value={compareDistrict} onChange={e => setCompareDistrict(e.target.value)} disabled={!compareState}>
                <option value="">Select District...</option>
                {compareDistrictsList.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="chat-interface">
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              {msg.role === 'ai' && <div className="avatar"><Bot size={18} /></div>}
              <div className="msg-content">
                {msg.role === 'ai' ? (
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                ) : (
                  msg.text
                )}
              </div>
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
