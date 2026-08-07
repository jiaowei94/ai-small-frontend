import React from 'react';
import { Sun, Moon, Sparkles, MessageSquare, UtensilsCrossed, MessageCircle, Gamepad2, UserCheck, LogOut, Terminal } from 'lucide-react';
import { ViewMode, User } from '../types';

interface NavbarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  isDarkMode,
  onToggleTheme,
  currentUser,
  onOpenAuth,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-black/40 border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.4)] group-hover:scale-105 transition-transform">
            <span className="text-xs font-bold text-white">AI</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight uppercase text-white font-mono">
                AI-SMALL
              </span>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] text-cyan-400 font-mono">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Vercel Live</span>
              </div>
            </div>
            <span className="text-[10px] text-white/40 font-mono tracking-wider uppercase">Cloud Backend Engine v0.1.4</span>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1.5 bg-black/40 p-1.5 border border-white/10 rounded-xl">
          <button
            onClick={() => onNavigate('home')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
              currentView === 'home'
                ? 'bg-white/10 border border-white/20 text-white shadow-[0_0_10px_rgba(255,255,255,0.05)]'
                : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${currentView === 'home' ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'bg-white/20'}`} />
            工作台
          </button>

          <button
            onClick={() => onNavigate('chat')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
              currentView === 'chat'
                ? 'bg-white/10 border border-white/20 text-white shadow-[0_0_10px_rgba(255,255,255,0.05)]'
                : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${currentView === 'chat' ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'bg-white/20'}`} />
            <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
            AI 聊天 (/aaa)
          </button>

          <button
            onClick={() => onNavigate('recipe')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
              currentView === 'recipe'
                ? 'bg-white/10 border border-white/20 text-white shadow-[0_0_10px_rgba(255,255,255,0.05)]'
                : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${currentView === 'recipe' ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'bg-white/20'}`} />
            <UtensilsCrossed className="w-3.5 h-3.5 text-emerald-400" />
            菜谱分析 (/eee)
          </button>

          <button
            onClick={() => onNavigate('channel')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
              currentView === 'channel'
                ? 'bg-white/10 border border-white/20 text-white shadow-[0_0_10px_rgba(255,255,255,0.05)]'
                : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${currentView === 'channel' ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'bg-white/20'}`} />
            <MessageCircle className="w-3.5 h-3.5 text-indigo-400" />
            协同社区 (/ddd)
          </button>

          <button
            onClick={() => onNavigate('game')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
              currentView === 'game'
                ? 'bg-white/10 border border-white/20 text-white shadow-[0_0_10px_rgba(255,255,255,0.05)]'
                : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${currentView === 'game' ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'bg-white/20'}`} />
            <Gamepad2 className="w-3.5 h-3.5 text-amber-400" />
            游戏专区 (/ooo)
          </button>
        </nav>

        {/* Right Controls: Theme Toggle & User Auth */}
        <div className="flex items-center gap-2.5">
          {/* Theme Toggle Button */}
          <button
            id="themeToggleBtn"
            onClick={onToggleTheme}
            title={isDarkMode ? '切换至日间模式' : '切换至夜间模式'}
            className="p-2 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all shadow-sm"
          >
            {isDarkMode ? (
              <Sun id="themeSunIcon" className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon id="themeMoonIcon" className="w-4 h-4 text-cyan-400" />
            )}
          </button>

          {/* User Auth or Console Button */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                id="consoleBtn"
                onClick={() => onNavigate('home')}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all text-xs text-white/90"
              >
                {currentUser.avatar_url ? (
                  <img src={currentUser.avatar_url} alt="Avatar" className="w-5 h-5 rounded-full border border-white/20" />
                ) : (
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                )}
                <span className="max-w-[90px] truncate font-medium">
                  {currentUser.nickname || currentUser.email.split('@')[0]}
                </span>
              </button>
              <button
                onClick={onLogout}
                title="退出登录"
                className="p-2 text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-1.5 bg-white text-black text-xs font-bold rounded-full hover:bg-zinc-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.2)]"
            >
              登录 / 注册
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
