import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, Copy, Check, Code, Languages, Dumbbell, Plus, Trash2, ChevronDown, MessageSquare } from 'lucide-react';
import { CONFIG } from '../config';

interface MessageItem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: MessageItem[];
  updatedAt: string;
}

export const ChatView: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>(() => [
    {
      id: 'session-default',
      title: 'AI 探索新对话',
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      messages: [
        {
          id: 'welcome',
          role: 'assistant',
          content: '您好！我是由 **ai-small.xyz** 全栈平台驱动的高智能 AI 助手。您可以自由切换 Gemini 2.0、GPT-5.6 与 DeepSeek 模型引擎随时向我提问！',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    }
  ]);

  const [activeSessionId, setActiveSessionId] = useState<string>('session-default');
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.6-flash');
  const [role, setRole] = useState<'general' | 'code' | 'translator' | 'fitness'>('general');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages, loading]);

  const handleCreateNewSession = () => {
    const newId = 'session-' + Date.now();
    const newSession: ChatSession = {
      id: newId,
      title: '新对话 ' + (sessions.length + 1),
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      messages: [
        {
          id: 'welcome-' + newId,
          role: 'assistant',
          content: '新会话已开启！请选择您偏好的模型并输入任何问题。',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newId);
  };

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (sessions.length <= 1) return;
    const remaining = sessions.filter((s) => s.id !== sessionId);
    setSessions(remaining);
    if (activeSessionId === sessionId) {
      setActiveSessionId(remaining[0].id);
    }
  };

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: MessageItem = {
      id: 'usr-' + Date.now(),
      role: 'user',
      content: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // 更新当前 Session 消息与 Title
    setSessions((prev) =>
      prev.map((sess) => {
        if (sess.id === activeSessionId) {
          const updatedMsgs = [...sess.messages, userMsg];
          const newTitle = sess.messages.length <= 1 ? query.trim().slice(0, 15) : sess.title;
          return { ...sess, title: newTitle, messages: updatedMsgs };
        }
        return sess;
      })
    );

    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${CONFIG.API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query.trim(),
          systemRole: role,
          model: selectedModel,
          history: currentSession.messages.slice(-6).map((m) => ({ role: m.role, content: m.content }))
        })
      });

      const data = await res.json();

      const botReply: MessageItem = {
        id: 'bot-' + Date.now(),
        role: 'assistant',
        content: data.reply || data.error || '响应失败，请稍后重试',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setSessions((prev) =>
        prev.map((sess) => {
          if (sess.id === activeSessionId) {
            return { ...sess, messages: [...sess.messages, botReply] };
          }
          return sess;
        })
      );
    } catch (error: any) {
      const errReply: MessageItem = {
        id: 'err-' + Date.now(),
        role: 'assistant',
        content: '连接后端 API 发生波动: ' + error.message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setSessions((prev) =>
        prev.map((sess) => {
          if (sess.id === activeSessionId) {
            return { ...sess, messages: [...sess.messages, errReply] };
          }
          return sess;
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const models = [
    { id: 'gemini-3.6-flash', name: 'gemini-3.6-flash (当前可用最强·最新 Flash - 默认)' },
    { id: 'gemini-3.5-flash', name: 'gemini-3.5-flash (上一代旗舰 Flash·综合能力强)' },
    { id: 'gemini-3-flash-preview', name: 'gemini-3-flash-preview (Gemini 3 初代 Flash)' },
    { id: 'gemini-3.5-flash-lite', name: 'gemini-3.5-flash-lite (3.5 轻量版·快而省)' },
    { id: 'gemini-3.1-flash-lite', name: 'gemini-3.1-flash-lite (3.1 轻量版)' },
    { id: 'gemma-4-31b-it', name: 'gemma-4-31b-it (开源 Gemma 31B·带 Thinking)' },
    { id: 'gemma-4-26b-a4b-it', name: 'gemma-4-26b-a4b-it (开源 Gemma 26B MoE)' }
  ];

  const presets = [
    '解释什么是 Cloudflare Pages + Vercel + Supabase 架构',
    '写一段 React 19 + TypeScript 的防抖（Debounce）自定义 Hook',
    '帮我将这句中文翻译成地道的商务英文：项目将于下周二前上线部署',
    '制定一个一日 2000 卡路里的减脂增肌高蛋白食谱'
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fade-in min-h-[820px]">
      {/* 左侧：历史会话列表 (Session Sidebar) */}
      <div className="p-4 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <button
            onClick={handleCreateNewSession}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-sky-950"
          >
            <Plus className="w-4 h-4" />
            <span>新建 AI 探索对话</span>
          </button>

          <div className="pt-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2">历史对话纪录</span>
            <div className="mt-2 space-y-1.5 max-h-[520px] overflow-y-auto">
              {sessions.map((sess) => (
                <div
                  key={sess.id}
                  onClick={() => setActiveSessionId(sess.id)}
                  className={`group w-full p-3 rounded-2xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                    activeSessionId === sess.id
                      ? 'bg-slate-800 text-sky-300 border border-sky-500/30'
                      : 'bg-slate-950/60 text-slate-400 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate min-w-0">
                    <MessageSquare className="w-3.5 h-3.5 shrink-0 text-sky-400" />
                    <span className="truncate">{sess.title}</span>
                  </div>

                  {sessions.length > 1 && (
                    <button
                      onClick={(e) => handleDeleteSession(sess.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 底部系统角色/模式切换 */}
        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <span className="text-[10px] text-slate-400 font-medium block">提示词系统角色:</span>
          <select
            value={role}
            onChange={(e: any) => setRole(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-sky-300 font-semibold focus:outline-none"
          >
            <option value="general">🤖 通用高智能 AI 助手</option>
            <option value="code">💻 全栈架构与代码专家</option>
            <option value="translator">🌐 专业同声传译员</option>
            <option value="fitness">🥗 健身与营养师</option>
          </select>
        </div>
      </div>

      {/* 右侧：聊天主舞台 (Chat Stage) */}
      <div className="lg:col-span-3 flex flex-col bg-slate-900/70 border border-slate-800 rounded-3xl overflow-hidden relative shadow-2xl">
        {/* 顶部 Model Selector */}
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-400 animate-spin" />
            <span className="text-xs font-bold text-white">模型选择:</span>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-sky-400 font-bold focus:outline-none"
            >
              {models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div className="text-[10px] text-slate-500 hidden sm:block">
            已集成 Gemini 2.0 API 免费额度 · 无需 API Key 即可无限对话
          </div>
        </div>

        {/* 消息对话区域 */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4">
          {currentSession.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                  msg.role === 'user'
                    ? 'bg-sky-600 text-white'
                    : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                }`}
              >
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`group relative p-4 rounded-3xl text-xs md:text-sm leading-relaxed space-y-2 ${
                  msg.role === 'user'
                    ? 'bg-sky-600 text-white rounded-tr-xs'
                    : 'bg-slate-950/80 border border-slate-800 text-slate-100 rounded-tl-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-1.5 text-[10px] opacity-70 font-mono">
                  <span>{msg.role === 'user' ? '您' : selectedModel.toUpperCase()}</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div className="whitespace-pre-wrap">{msg.content}</div>

                {msg.role === 'assistant' && (
                  <button
                    onClick={() => handleCopy(msg.id, msg.content)}
                    className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-bounce" />
              </div>
              <div className="p-4 rounded-3xl bg-slate-950/80 border border-slate-800 text-xs text-sky-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>AI 大模型推理思考中，请稍候...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 预设提示词 Chips */}
        <div className="p-2 bg-slate-950/60 border-t border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none px-4">
          <span className="text-[10px] text-slate-500 whitespace-nowrap">快捷灵感:</span>
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="text-[10px] px-3 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 whitespace-nowrap cursor-pointer transition-all"
            >
              {p}
            </button>
          ))}
        </div>

        {/* 输入框 */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="输入您的问题或指令，按 Enter 键发送..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl py-3 px-4 text-xs md:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>发送</span>
          </button>
        </div>
      </div>
    </div>
  );
};
