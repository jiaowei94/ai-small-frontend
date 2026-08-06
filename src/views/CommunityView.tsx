import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Globe, Hash, Plus, Lock, ShieldCheck, MapPin, Sparkles, RefreshCw } from 'lucide-react';
import { CONFIG } from '../config';

interface CommunityMessage {
  id: string;
  nickname: string;
  avatar_url?: string;
  ip_location?: string;
  content: string;
  translation?: string;
  created_at: string;
}

interface ChannelItem {
  id: string;
  name: string;
  is_private: boolean;
  status?: string;
}

interface CommunityViewProps {
  user: any;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

export const CommunityView: React.FC<CommunityViewProps> = ({ user, showToast }) => {
  const [channels, setChannels] = useState<ChannelItem[]>([
    { id: 'ch-global', name: '大厅公共频道', is_private: false }
  ]);
  const [activeChannelId, setActiveChannelId] = useState<string>('ch-global');
  const [messages, setMessages] = useState<CommunityMessage[]>([]);
  const [inputContent, setInputContent] = useState('');
  const [newChannelName, setNewChannelName] = useState('');
  const [showChannelModal, setShowChannelModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${CONFIG.API_BASE_URL}/api/community/messages`);
      const data = await res.json();
      if (data.success) setMessages(data.messages);
    } catch (e) {}
  };

  const fetchChannels = async () => {
    try {
      const res = await fetch(`${CONFIG.API_BASE_URL}/api/channels`);
      const data = await res.json();
      if (data.success && data.channels) {
        setChannels([{ id: 'ch-global', name: '大厅公共频道', is_private: false }, ...data.channels]);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchMessages();
    fetchChannels();
    const timer = setInterval(fetchMessages, 8000);
    return () => clearInterval(timer);
  }, []);

  const handleSendMessage = async () => {
    if (!inputContent.trim() || loading) return;

    setLoading(true);
    try {
      const res = await fetch(`${CONFIG.API_BASE_URL}/api/community/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname: user ? user.nickname : '星际领航员',
          avatar_url: user ? user.avatar_url : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
          content: inputContent.trim()
        })
      });

      const data = await res.json();
      if (data.success) {
        setInputContent('');
        showToast('发言成功发布，Gemini 已自动同步双语翻译！', 'success');
        fetchMessages();
      }
    } catch (err: any) {
      showToast('发送失败: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChannel = async () => {
    if (!newChannelName.trim()) return;

    try {
      const res = await fetch(`${CONFIG.API_BASE_URL}/api/channels`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newChannelName.trim(),
          is_private: true,
          owner_id: user ? user.id : 'guest'
        })
      });

      const data = await res.json();
      if (data.success) {
        showToast(data.message || '申请成功！', 'success');
        setNewChannelName('');
        setShowChannelModal(false);
        fetchChannels();
      }
    } catch (e: any) {
      showToast('申请失败: ' + e.message, 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 头部 Top Banner */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold uppercase tracking-wider">
            <Globe className="w-4 h-4" />
            <span>/ddd 多人协同社区与 Gemini 2.0 自动多语言翻译</span>
          </div>
          <h2 className="text-xl font-bold text-white">类似 Discord 频道架构与实时中英双语对照</h2>
        </div>

        <button
          onClick={() => setShowChannelModal(true)}
          className="px-4 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>申请私人加密频道</span>
        </button>
      </div>

      {/* 主面板 Grid：左侧频道列表，右侧聊天面板 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[650px]">
        {/* 频道列表 */}
        <div className="p-4 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2">频道目录 (Supabase channels)</span>

          <div className="space-y-1.5">
            {channels.map((ch) => (
              <button
                key={ch.id}
                onClick={() => setActiveChannelId(ch.id)}
                className={`w-full p-3 rounded-2xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                  activeChannelId === ch.id
                    ? 'bg-teal-950 text-teal-300 border border-teal-500/30'
                    : 'bg-slate-950/60 text-slate-400 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {ch.is_private ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <Hash className="w-3.5 h-3.5 text-teal-400" />}
                  <span className="truncate">{ch.name}</span>
                </div>

                {ch.status === 'pending' && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    审批中
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 聊天发言展示区 */}
        <div className="lg:col-span-3 flex flex-col rounded-3xl bg-slate-900/60 border border-slate-800 overflow-hidden">
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <Hash className="w-4 h-4 text-teal-400" />
              <span>当前频道: {channels.find((c) => c.id === activeChannelId)?.name}</span>
            </span>

            <button
              onClick={fetchMessages}
              className="p-1.5 bg-slate-900 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 消息历史 */}
          <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={msg.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                      alt={msg.nickname}
                      className="w-7 h-7 rounded-full object-cover border border-slate-700"
                    />
                    <span className="text-xs font-bold text-slate-200">{msg.nickname}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-sky-400 border border-slate-800 flex items-center gap-1 font-mono">
                      <MapPin className="w-2.5 h-2.5" />
                      {msg.ip_location || 'CN 广东'}
                    </span>
                  </div>

                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* 原始内容 */}
                <p className="text-xs text-slate-200 leading-relaxed pl-9">{msg.content}</p>

                {/* Gemini 自动翻译 */}
                {msg.translation && (
                  <div className="ml-9 p-2.5 rounded-xl bg-slate-900/90 border border-teal-500/20 text-[11px] text-teal-300 flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                    <span>Gemini 自动实时翻译: {msg.translation}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 输入框 */}
          <div className="p-4 bg-slate-950 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              value={inputContent}
              onChange={(e) => setInputContent(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="在全服社区发言，Gemini 将为您自动翻译中英对照..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl py-3 px-4 text-xs text-slate-100 focus:outline-none focus:border-teal-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputContent.trim() || loading}
              className="px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>发言</span>
            </button>
          </div>
        </div>
      </div>

      {/* 申请频道 Modal */}
      {showChannelModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-md w-full space-y-4">
            <h3 className="text-base font-bold text-white">申请新建私人加密频道</h3>
            <p className="text-xs text-slate-400">私人频道创建后将进入管理端审批流程，审批通过后即可独享。</p>

            <input
              type="text"
              value={newChannelName}
              onChange={(e) => setNewChannelName(e.target.value)}
              placeholder="请输入频道名称（如：Geek 开发者讨论组）"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-teal-500"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowChannelModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleCreateChannel}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-xs font-bold text-white cursor-pointer"
              >
                提交申请
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
