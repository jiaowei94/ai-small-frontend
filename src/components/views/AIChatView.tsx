import React, { useState, useEffect, useRef } from 'react';
import { Send, Plus, Trash2, Bot, User, ChevronDown, Sparkles, RefreshCw, MessageSquare, ArrowLeft } from 'lucide-react';
import { ChatMessage, ChatSession } from '../../types';
import { AI_MODELS, STORAGE_KEYS } from '../../config';
import { sendAIChatRequest } from '../../lib/api';

interface AIChatViewProps {
  onBack: () => void;
}

export const AIChatView: React.FC<AIChatViewProps> = ({ onBack }) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.6-flash');
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
    if (saved) {
      try {
        const parsed: ChatSession[] = JSON.parse(saved);
        if (parsed.length > 0) {
          setSessions(parsed);
          setActiveSessionId(parsed[0].id);
          return;
        }
      } catch (e) {
        console.warn('Failed to parse chat history:', e);
      }
    }

    // Default new session
    createNewSession();
  }, []);

  // Save sessions on change
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(sessions));
    }
  }, [sessions]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sessions, activeSessionId, isLoading]);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  function createNewSession() {
    const newSession: ChatSession = {
      id: 'session_' + Date.now(),
      title: '新对话 ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      messages: [
        {
          id: 'welcome_' + Date.now(),
          role: 'assistant',
          content: '👋 您好！我是 ai-small.xyz AI 智能助手。我已经就绪，请在下方选择模型并开始与我对话！',
          timestamp: Date.now(),
          model: selectedModel,
        },
      ],
      updatedAt: Date.now(),
      model: selectedModel,
    };

    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  }

  function deleteSession(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    const updated = sessions.filter((s) => s.id !== id);
    setSessions(updated);
    if (updated.length > 0) {
      setActiveSessionId(updated[0].id);
    } else {
      createNewSession();
    }
  }

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');

    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      role: 'user',
      content: userText,
      timestamp: Date.now(),
    };

    // Update session title if first user message
    let updatedTitle = activeSession.title;
    if (activeSession.messages.filter((m) => m.role === 'user').length === 0) {
      updatedTitle = userText.slice(0, 16) + (userText.length > 16 ? '...' : '');
    }

    const newMessages = [...activeSession.messages, userMsg];

    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSessionId
          ? { ...s, title: updatedTitle, messages: newMessages, updatedAt: Date.now() }
          : s
      )
    );

    setIsLoading(true);

    // Call API endpoint
    const reply = await sendAIChatRequest(newMessages, selectedModel);

    setIsLoading(false);

    const assistantMsg: ChatMessage = {
      id: 'msg_' + (Date.now() + 1),
      role: 'assistant',
      content: reply,
      timestamp: Date.now(),
      model: selectedModel,
    };

    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSessionId
          ? { ...s, messages: [...s.messages, assistantMsg], updatedAt: Date.now() }
          : s
      )
    );
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row relative z-10 max-w-7xl mx-auto p-2 sm:p-4 gap-4">
      {/* Left Sidebar: Session List & Workspace */}
      <aside className="w-full lg:w-64 border border-white/10 bg-black/40 backdrop-blur-xl rounded-2xl p-5 flex flex-col shrink-0 justify-between">
        <div className="space-y-6">
          {/* Workspace Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={onBack}
                className="p-1.5 text-white/60 hover:text-white bg-white/5 border border-white/10 rounded-lg transition-colors"
                title="返回"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold text-white uppercase tracking-wider">AI Workspace</span>
            </div>
            <button
              onClick={createNewSession}
              className="p-1.5 bg-white text-black hover:bg-zinc-200 rounded-lg transition-colors flex items-center justify-center"
              title="新建对话"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold mb-3">Workspace Nav</p>
            <nav className="space-y-1">
              <div className="flex items-center gap-3 px-3 py-2 bg-white/5 border border-white/10 rounded-md text-xs font-medium text-white">
                <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                <span>Cloud Deployment</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 text-xs text-white/60 hover:bg-white/5 rounded-md transition-colors cursor-pointer">
                <div className="w-2 h-2 rounded-full bg-white/20" />
                <span>API Registry</span>
              </div>
            </nav>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold mb-3">Recent Sessions</p>
            <div className="space-y-1.5 max-h-[45vh] overflow-y-auto pr-1">
              {sessions.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setActiveSessionId(s.id)}
                  className={`group flex items-center justify-between p-2.5 rounded-lg text-xs transition-all cursor-pointer ${
                    s.id === activeSessionId
                      ? 'border-l-2 border-cyan-400 bg-cyan-400/10 text-white font-medium'
                      : 'text-white/50 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="truncate max-w-[140px]">{s.title}</span>
                  <button
                    onClick={(e) => deleteSession(s.id, e)}
                    className="opacity-0 group-hover:opacity-100 text-white/40 hover:text-rose-400 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Instance footer */}
        <div className="pt-4 border-t border-white/10 mt-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-zinc-700 to-zinc-900 border border-white/20 flex items-center justify-center text-[10px] font-bold">
              AI
            </div>
            <div>
              <p className="text-xs font-medium text-white/80">User Instance</p>
              <p className="text-[10px] text-emerald-400 font-mono">Connected: Step 15+</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Right Area: Chat Conversation */}
      <main className="flex-1 bg-black/40 border border-white/10 rounded-2xl flex flex-col h-[calc(100vh-6rem)] backdrop-blur-xl overflow-hidden relative">
        {/* Atmosphere Glows in chat area */}
        <div className="absolute top-[-20%] left-[20%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[10%] w-[350px] h-[350px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Header Bar */}
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-black/20 backdrop-blur-md z-10 shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-xs text-white/40 font-mono">PROMPT_REF: ai-small核心变量配置.txt</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-white/60 tracking-widest uppercase font-mono">Vercel Live</span>
            </div>

            {/* Model Selector */}
            <div className="relative inline-block">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="appearance-none bg-black border border-white/20 text-cyan-300 text-xs font-mono py-1.5 pl-3 pr-7 rounded-full outline-none cursor-pointer"
              >
                {AI_MODELS.map((m) => (
                  <option key={m.id} value={m.id} className="bg-zinc-900 text-white">
                    {m.name} ({m.tag})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-cyan-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </header>

        {/* Messages Scroll Area */}
        <section className="flex-1 p-6 overflow-y-auto space-y-6 z-10">
          {activeSession?.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-4 max-w-3xl ${
                msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-cyan-400 to-blue-600 text-white'
                    : 'bg-zinc-800 text-cyan-400 border border-white/10'
                }`}
              >
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`p-4 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-50 rounded-tr-none shadow-[0_0_30px_rgba(34,211,238,0.05)]'
                    : 'bg-white/5 border border-white/10 text-white/80 rounded-tl-none'
                }`}
              >
                {msg.model && (
                  <p className="text-[10px] text-cyan-400/80 font-mono mb-2 italic">
                    // Executing requirement schema draft [{msg.model}]...
                  </p>
                )}
                <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                <div className="text-[10px] text-white/30 text-right mt-2 font-mono">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-4 max-w-2xl">
              <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-white/10 flex items-center justify-center">
                <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
              </div>
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none text-xs text-cyan-300 animate-pulse font-mono">
                AI 节点正在计算生成回答中...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </section>

        {/* Input Area */}
        <footer className="p-4 sm:p-6 z-10 shrink-0 border-t border-white/10">
          <form onSubmit={handleSend} className="relative max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full opacity-50 pointer-events-none" />
            <div className="relative bg-zinc-900/80 border border-white/10 rounded-2xl p-2 flex items-center gap-4 backdrop-blur-xl">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Describe additional prompt for ${selectedModel}...`}
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-4 py-2 text-white placeholder:text-white/20 outline-none"
              />
              <div className="flex items-center gap-2 pr-2">
                <div className="px-2 py-1 bg-white/5 rounded border border-white/10 text-[10px] text-white/40 font-mono hidden sm:block">
                  STEP 16-20
                </div>
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center hover:bg-zinc-200 transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>
        </footer>
      </main>
    </div>
  );
};
