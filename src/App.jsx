import React, { useState } from 'react';
import { 
  Bot, 
  Calendar, 
  Mail, 
  CloudRain, 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  Circle,
  MessageSquare,
  Send,
  Sparkles,
  Activity,
  Loader2
} from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './index.css';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "YOUR_API_KEY_HERE";
const genAI = new GoogleGenerativeAI(API_KEY);

const App = () => {
  const [activeAgent, setActiveAgent] = useState('orchestrator');
  const [tasks, setTasks] = useState([]);

  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'agent', text: 'Good morning! I am your Smart Planner Orchestrator. Click "Auto-Schedule" to generate a plan for today, or tell me what you need to do.' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const agents = [
    { id: 'orchestrator', name: 'Orchestrator', desc: 'Coordinates all other agents', icon: <Bot size={24} /> },
    { id: 'Scheduling', name: 'Scheduling', desc: 'Manages calendar & meetings', icon: <Calendar size={24} /> },
    { id: 'Communications', name: 'Communications', desc: 'Drafts emails & summaries', icon: <Mail size={24} /> },
    { id: 'Environment', name: 'Environment', desc: 'Monitors weather & alerts', icon: <CloudRain size={24} /> },
    { id: 'Deep Work', name: 'Deep Work', desc: 'Blocks distractions & focuses', icon: <Briefcase size={24} /> },
  ];

  const toggleTask = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const getGeminiResponse = async (promptText) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      const systemPrompt = `You are the Orchestrator Agent of a Smart Multi-Agent Daily Planner. You coordinate tasks with other agents: Scheduling (meetings), Communications (emails), Environment (weather), Deep Work (focus). 
      You receive input from the user. You must respond ONLY with a valid JSON object matching this structure:
      {
        "message": "your conversational response telling the user what was done",
        "tasks": [
          { "id": unique_number, "title": "task description", "time": "HH:MM AM/PM", "agent": "AgentName", "completed": false }
        ]
      }
      AgentName must be exactly one of: Orchestrator, Scheduling, Communications, Environment, Deep Work.
      Current tasks in the system: ${JSON.stringify(tasks)}.
      If the user is asking to add or modify tasks, update the list and return the FULL new list of tasks.
      If the user asks for a completely new schedule, generate a full day of 4-6 realistic tasks.
      Return ONLY raw JSON. Do not include markdown code blocks.`;

      const result = await model.generateContent(systemPrompt + "\n\nUser Input: " + promptText);
      let responseText = result.response.text().trim();
      if (responseText.startsWith('```json')) {
        responseText = responseText.substring(7, responseText.length - 3);
      } else if (responseText.startsWith('```')) {
        responseText = responseText.substring(3, responseText.length - 3);
      }
      
      const parsed = JSON.parse(responseText);
      return parsed;
    } catch (error) {
      console.error("Error calling Gemini:", error);
      return {
        message: "Error: " + (error.message || "Unknown error occurred while processing your request."),
        tasks: tasks
      };
    }
  };

  const autoSchedule = async () => {
    setIsLoading(true);
    setChatMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: "Please auto-schedule my day." }]);
    
    const response = await getGeminiResponse("Please generate a brand new, balanced daily schedule for me including work, breaks, and checking weather.");
    
    setTasks(response.tasks || []);
    setChatMessages(prev => [...prev, { id: Date.now(), sender: 'agent', text: response.message }]);
    setIsLoading(false);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    
    const userMessage = inputText;
    setChatMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: userMessage }]);
    setInputText('');
    setIsLoading(true);
    
    const response = await getGeminiResponse(userMessage);
    
    if (response.tasks) setTasks(response.tasks);
    if (response.message) {
      setChatMessages(prev => [...prev, { id: Date.now(), sender: 'agent', text: response.message }]);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="layout">
      <div className="header">
        <h1>Smart Multi-Agent Daily Planner <Sparkles size={32} style={{ color: 'var(--primary)', display: 'inline' }} /></h1>
      </div>

      <aside className="sidebar">
        <div className="glass-panel" style={{ marginBottom: '24px' }}>
          <h2 style={{ marginBottom: '16px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={20} color="var(--accent)" /> System Status
          </h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{tasks.filter(t => t.completed).length}/{tasks.length}</div>
              <div className="stat-label">Tasks</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">5</div>
              <div className="stat-label">Agents</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: '#10b981' }}>Live</div>
              <div className="stat-label">AI Link</div>
            </div>
          </div>
        </div>

        <div className="glass-panel">
          <h2 style={{ marginBottom: '16px', fontSize: '1.2rem' }}>Active Agents</h2>
          <div className="agent-list">
            {agents.map(agent => (
              <div 
                key={agent.id} 
                className={`agent-card ${activeAgent === agent.id ? 'active' : ''}`}
                onClick={() => setActiveAgent(agent.id)}
              >
                <div className="agent-icon">
                  {agent.icon}
                </div>
                <div className="agent-info">
                  <h3>{agent.name}</h3>
                  <p>{agent.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <main className="main-content">
        <div className="glass-panel">
          <div className="agenda-header">
            <h2>Today's Agenda</h2>
            <button className="btn" onClick={autoSchedule} disabled={isLoading}>
              {isLoading ? <Loader2 size={16} className="spin" /> : <Clock size={16} />} 
              {isLoading ? 'Planning...' : 'Auto-Schedule'}
            </button>
          </div>
          <div className="task-list">
            {tasks.length === 0 && !isLoading && (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                Your agenda is empty. Click Auto-Schedule to generate a plan using AI.
              </div>
            )}
            {tasks.map((task, idx) => (
              <div key={task.id || idx} className={`task-item ${task.completed ? 'completed' : ''}`}>
                <div style={{ cursor: 'pointer', color: task.completed ? '#10b981' : 'var(--text-muted)' }} onClick={() => toggleTask(task.id || idx)}>
                  {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                </div>
                <div className="task-time">{task.time}</div>
                <div className="task-details">
                  <div className="task-title">{task.title}</div>
                  <div className="task-agent">
                    Assigned to: {task.agent} Agent
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel">
          <h2 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={20} /> Orchestrator Chat
          </h2>
          <div className="chat-box">
            {chatMessages.map(msg => (
              <div key={msg.id} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="message agent" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Loader2 size={16} className="spin" /> Orchestrator is thinking...
              </div>
            )}
          </div>
          <form className="chat-input" onSubmit={handleSendMessage}>
            <input 
              type="text" 
              placeholder="Instruct the AI planner (e.g., 'Add a lunch meeting at 1 PM')..." 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
            />
            <button type="submit" className="btn" disabled={isLoading}>
              <Send size={18} />
            </button>
          </form>
        </div>
      </main>
      <style dangerouslySetInnerHTML={{__html: `
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </div>
  );
};

export default App;
