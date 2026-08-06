import React from 'react';
import { Sun, Moon, Sparkles, User, ShieldCheck, Cpu, LogOut, LayoutDashboard } from 'lucide-react';

interface NavbarProps {
  themeMode: 'dark' | 'light';
  particleEnabled: boolean;
  user: any;
  activeTab: string;
  onToggleTheme: () => void;
  onToggleParticle: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onNavSelect: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  themeMode,
  particleEnabled,
  user,
  activeTab,
  onToggleTheme,
  onToggleParticle,
  onOpenAuth,
  onLogout,
  onNavSelect
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/70 border-b border-slate-800/80 transition-colors">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        {/* 左侧 Logo 与品牌名称 */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavSelect('/')}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-sky-300 bg-clip-text text-transparent">
                ai-small
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                .xyz v3.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">No-Credit-Card Fullstack Engine</p>
          </div>
        </div>

        {/* 右侧功能导航与控件 */}
        <div className="flex items-center gap-3">
          {/* 控制台导航按钮，对应 #consoleBtn */}
          <button
            id="consoleBtn"
            onClick={() => onNavSelect('/')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === '/'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden md:inline">控制台概览</span>
          </button>

          {/* Canvas 粒子特效切换按钮 */}
          <button
            onClick={onToggleParticle}
            title="切换动态背景粒子"
            className={`px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
              particleEnabled
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            <Cpu className="w-4 h-4" />
          </button>

          {/* 明/暗色主题切换按钮，对应 #themeToggleBtn, #themeSunIcon, #themeMoonIcon */}
          <button
            id="themeToggleBtn"
            onClick={onToggleTheme}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors cursor-pointer"
            title="切换主题"
          >
            {themeMode === 'dark' ? (
              <span id="themeSunIcon">
                <Sun className="w-4 h-4 text-amber-400" />
              </span>
            ) : (
              <span id="themeMoonIcon">
                <Moon className="w-4 h-4 text-sky-400" />
              </span>
            )}
          </button>

          {/* 登录状态与用户信息 */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <img
                src={user.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                alt={user.nickname}
                className="w-8 h-8 rounded-full border border-sky-500/40 object-cover"
              />
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-slate-200 truncate max-w-[100px]">{user.nickname}</p>
                <div className="flex items-center gap-1 text-[10px] text-emerald-400">
                  <ShieldCheck className="w-3 h-3" />
                  <span>已登录</span>
                </div>
              </div>
              <button
                onClick={onLogout}
                title="退出登录"
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-xl transition-colors cursor-pointer ml-1"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-medium text-xs tracking-wide shadow-lg shadow-sky-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>登录 / 注册</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
