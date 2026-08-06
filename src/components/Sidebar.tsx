import React from 'react';
import { LayoutDashboard, Bot, Users, Utensils, Gamepad2, Sparkles, ChevronRight } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab }) => {
  const navItems = [
    {
      id: '/',
      label: '控制台概览',
      subLabel: '工作台与云资源状态',
      icon: LayoutDashboard,
      badge: 'PRO',
      color: 'from-sky-500 to-blue-600'
    },
    {
      id: '/aaa',
      label: 'AI 智能助手',
      subLabel: '免登录 Gemini 2.0 对话',
      icon: Bot,
      badge: 'Gemini',
      color: 'from-purple-500 to-indigo-600'
    },
    {
      id: '/ddd',
      label: '实时协同社区',
      subLabel: '多语言翻译与私人频道',
      icon: Users,
      badge: 'Live',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      id: '/eee',
      label: '膳食智能日志',
      subLabel: '图片识别与卡路里计算',
      icon: Utensils,
      badge: 'Vision',
      color: 'from-amber-500 to-orange-600'
    },
    {
      id: '/ooo',
      label: '互动游戏中心',
      subLabel: '俄罗斯方块与五子棋 AI',
      icon: Gamepad2,
      badge: 'S级 AI',
      color: 'from-rose-500 to-pink-600'
    }
  ];

  return (
    <aside className="w-full lg:w-72 shrink-0 bg-slate-950/40 border-b lg:border-b-0 lg:border-r border-slate-800/80 p-4">
      <div className="mb-4 hidden lg:flex items-center gap-2 px-3 py-2 bg-slate-900/80 rounded-2xl border border-slate-800">
        <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
        <span className="text-xs text-slate-300 font-medium truncate">全局功能模块中心</span>
      </div>

      <nav className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex items-center justify-between p-3 rounded-2xl transition-all cursor-pointer text-left whitespace-nowrap min-w-[160px] lg:min-w-0 ${
                isActive
                  ? 'bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-800/80 border border-slate-700/80 shadow-xl'
                  : 'hover:bg-slate-900/50 border border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform ${
                    isActive ? `bg-gradient-to-tr ${item.color} text-white shadow-lg` : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-slate-300'}`}>
                      {item.label}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 hidden sm:block lg:block truncate">{item.subLabel}</p>
                </div>
              </div>

              <div className="hidden lg:flex items-center gap-1">
                {item.badge && (
                  <span
                    className={`text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                <ChevronRight className={`w-3.5 h-3.5 text-slate-600 transition-transform ${isActive ? 'translate-x-0.5 text-sky-400' : ''}`} />
              </div>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
