import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Plus, Send, Globe2, Shield, Users, ArrowLeft, Lock, CheckCircle2 } from 'lucide-react';
import { Channel, ChannelMessage, User } from '../../types';
import { LIMIT_CONFIG } from '../../config';
import { supabase } from '../../lib/supabase';

interface ChannelViewProps {
  currentUser: User | null;
  onBack: () => void;
  onShowToast: (type: 'success' | 'error' | 'info', text: string) => void;
}

export const ChannelView: React.FC<ChannelViewProps> = ({ currentUser, onBack, onShowToast }) => {
  const [channels, setChannels] = useState<Channel[]>([
    {
      id: 'public_hall',
      name: '公共大厅 (#general)',
      is_private: false,
      owner_id: 'system',
      status: 'approved',
      created_at: new Date().toISOString(),
      description: '全站开放交流频道，集成 IP 地理节点与 Gemini 实时双语对照。',
    },
    {
      id: 'ai_tech',
      name: 'AI 极客技术讨论区',
      is_private: false,
      owner_id: 'system',
      status: 'approved',
      created_at: new Date().toISOString(),
      description: '探讨 Gemini API、Serverless 部署与代码优化。',
    },
  ]);

  const [activeChannelId, setActiveChannelId] = useState<string>('public_hall');
  const [messages, setMessages] = useState<ChannelMessage[]>([]);
  const [input, setInput] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [newChannelName, setNewChannelName] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial messages
  useEffect(() => {
    const initialMsgs: ChannelMessage[] = [
      {
        id: 'msg_1',
        channel_id: 'public_hall',
        user_id: 'sys_1',
        user_email: 'admin@ai-small.xyz',
        user_nickname: '全栈管理员',
        user_avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=admin',
        content: '欢迎来到 ai-small.xyz 实时协同大厅！可以在这里自由畅聊！',
        ip_location: 'CN·上海',
        translated_content: 'Welcome to ai-small.xyz real-time collaborative community!',
        created_at: new Date(Date.now() - 300000).toISOString(),
      },
      {
        id: 'msg_2',
        channel_id: 'public_hall',
        user_id: 'sys_2',
        user_email: 'guest@ai-small.xyz',
        user_nickname: 'Geek_2026',
        user_avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Geek2026',
        content: '部署在这个 Vercel + Supabase 架构上的前端秒开速度太惊艳了！',
        ip_location: 'US·加州',
        translated_content: 'The frontend response speed on Vercel + Supabase architecture is incredible!',
        created_at: new Date(Date.now() - 120000).toISOString(),
      },
    ];

    setMessages(initialMsgs);
  }, []);

  // Cooldown timer
  useEffect(() => {
    let timer: any;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeChannelId]);

  // Handle Send Message
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (cooldown > 0) {
      onShowToast('error', `发言太快，请 ${cooldown} 秒后再试`);
      return;
    }

    const senderEmail = currentUser?.email || 'guest@ai-small.xyz';
    const senderName = currentUser?.nickname || senderEmail.split('@')[0];

    const newMsg: ChannelMessage = {
      id: 'msg_' + Date.now(),
      channel_id: activeChannelId,
      user_id: currentUser?.id || 'guest_' + Date.now(),
      user_email: senderEmail,
      user_nickname: senderName,
      user_avatar: currentUser?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${senderEmail}`,
      content: input.trim(),
      ip_location: 'CN·节点',
      translated_content: 'Auto Dual-Language: ' + input.trim(),
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput('');
    setCooldown(LIMIT_CONFIG.FRONTEND_COOL_DOWN_SEC);
  };

  // Create Channel Request
  const handleCreateChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannelName.trim()) return;

    const newChan: Channel = {
      id: 'chan_' + Date.now(),
      name: newChannelName.trim(),
      is_private: true,
      owner_id: currentUser?.id || 'guest',
      status: 'approved', // Auto approve in frontend demo
      created_at: new Date().toISOString(),
      description: '用户申请创建的专属交流频道。',
    };

    setChannels((prev) => [...prev, newChan]);
    setActiveChannelId(newChan.id);
    setNewChannelName('');
    setShowCreateModal(false);
    onShowToast('success', '频道创建成功！');
  };

  const activeChannel = channels.find((c) => c.id === activeChannelId) || channels[0];
  const activeMessages = messages.filter((m) => m.channel_id === activeChannelId);

  return (
    <div className="min-h-[calc(100vh-4rem)] p-2 sm:p-4 max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 relative z-10">
      {/* Left Sidebar: Channels list & New Channel Button */}
      <aside className="w-full lg:w-72 bg-black/40 border border-white/10 rounded-2xl p-4 flex flex-col justify-between shrink-0 backdrop-blur-xl">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="p-2 text-white/60 hover:text-white bg-white/5 border border-white/10 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-cyan-400" />
              <span>协同社区频道 (/ddd)</span>
            </h2>
          </div>

          <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-1 pt-2">
            <span>已加入频道 ({channels.length})</span>
            <button
              onClick={() => setShowCreateModal(true)}
              className="p-1 text-indigo-400 hover:text-indigo-300 hover:bg-slate-800 rounded-lg flex items-center gap-1 text-[11px]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>新建频道</span>
            </button>
          </div>

          {/* Channels List */}
          <div className="space-y-1 max-h-[50vh] overflow-y-auto">
            {channels.map((chan) => (
              <button
                key={chan.id}
                onClick={() => setActiveChannelId(chan.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition-all ${
                  chan.id === activeChannelId
                    ? 'bg-indigo-950/80 border border-indigo-500/40 text-indigo-200 shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-slate-500 font-mono">#</span>
                  <span className="truncate">{chan.name}</span>
                </div>
                {chan.is_private && <Lock className="w-3 h-3 text-amber-400 shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* Online Status Box */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 space-y-1.5 mt-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              在线实时节点
            </span>
            <span className="font-mono text-slate-200">Supabase Realtime</span>
          </div>
          <div className="text-[10px] text-slate-500">自动拦截过滤违规发言与高频刷屏。</div>
        </div>
      </aside>

      {/* Main Chat Hall Panel */}
      <main className="flex-1 bg-slate-900/80 border border-slate-800/90 rounded-2xl flex flex-col h-[calc(100vh-6rem)] backdrop-blur-xl overflow-hidden">
        {/* Hall Header */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-950/40 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <span>{activeChannel.name}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">{activeChannel.description}</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
            <Users className="w-3.5 h-3.5 text-sky-400" />
            <span>在线 12 人 / 社区总人数 128 人</span>
          </div>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
          {activeMessages.map((msg) => (
            <div key={msg.id} className="flex gap-3 max-w-3xl">
              <img
                src={msg.user_avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${msg.user_email}`}
                alt="Avatar"
                className="w-8 h-8 rounded-xl object-cover shrink-0 border border-slate-800"
              />
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-slate-200">{msg.user_nickname}</span>
                  {msg.ip_location && (
                    <span className="px-1.5 py-0.5 text-[10px] rounded bg-slate-800 text-sky-300 border border-slate-700/60 font-mono">
                      [{msg.ip_location}]
                    </span>
                  )}
                  <span className="text-[10px] text-slate-500">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Message Box */}
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-200 leading-relaxed space-y-1">
                  <div>{msg.content}</div>
                  {msg.translated_content && (
                    <div className="text-[11px] text-slate-400 font-sans border-t border-slate-800/60 pt-1 mt-1 italic">
                      🌐 双语译文: {msg.translated_content}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Send Input Bar with 10s cooldown */}
        <form onSubmit={handleSend} className="p-3 sm:p-4 border-t border-slate-800/80 bg-slate-950/60 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={cooldown > 0 ? `冷却中，请 ${cooldown} 秒后再试...` : '在频道内公开发言...'}
            disabled={cooldown > 0}
            className="flex-1 bg-slate-900 border border-slate-800 focus:border-indigo-500 text-slate-100 text-xs sm:text-sm px-4 py-3 rounded-xl outline-none placeholder-slate-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || cooldown > 0}
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5 text-xs sm:text-sm"
          >
            <span>{cooldown > 0 ? `${cooldown}s` : '发送'}</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </main>

      {/* New Channel Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-base font-bold text-slate-100">申请新建私人频道</h3>
            <form onSubmit={handleCreateChannel} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">频道名称</label>
                <input
                  type="text"
                  required
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  placeholder="例如: 极客交流圈"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl"
                >
                  提交申请
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
