import React from 'react';
import { MessageSquare, UtensilsCrossed, MessageCircle, Gamepad2, ArrowRight, Zap, Sparkles, Shield, Cpu } from 'lucide-react';
import { ViewMode } from '../types';

interface FeatureHubProps {
  onNavigate: (view: ViewMode) => void;
}

export const FeatureHub: React.FC<FeatureHubProps> = ({ onNavigate }) => {
  const features = [
    {
      id: 'chat' as ViewMode,
      route: '/aaa',
      title: 'AI 智能聊天室',
      subtitle: '支持 Gemini 3.6 Flash / DeepSeek V4',
      badge: '大模型调度',
      badgeColor: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
      description: '内置全能大模型加速引擎，可自由下拉选择 Gemini 3.6 Flash、GPT-5.6 (极速版) 与 DeepSeek V4，支持长文本撰写与代码调试。',
      icon: MessageSquare,
      iconColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      btnText: '进入 AI 聊天室 (/aaa)',
    },
    {
      id: 'recipe' as ViewMode,
      route: '/eee',
      title: '菜谱与健康膳食分析',
      subtitle: 'Gemini 1.5 Flash 视觉识别',
      badge: '图像多模态',
      badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
      description: '上传或拍照上传美食菜品照片，自定义提示词检测卡路里、三大营养素占比（蛋白质、碳水、脂肪），生成专业膳食健康指导。',
      icon: UtensilsCrossed,
      iconColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      btnText: '体验菜谱分析 (/eee)',
    },
    {
      id: 'channel' as ViewMode,
      route: '/ddd',
      title: 'Discord 式协同频道',
      subtitle: 'Supabase Realtime + IP归属解析',
      badge: '实时双语协同',
      badgeColor: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
      description: '类似 Discord 的多频道聊天大厅。集成 ip-api 自动解析发言者 IP 地理标志（CN/US/JP），内置 Gemini 实时双语对照翻译与私人频道申请。',
      icon: MessageCircle,
      iconColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      btnText: '加入协同社区 (/ddd)',
    },
    {
      id: 'game' as ViewMode,
      route: '/ooo',
      title: '益智小游戏专区',
      subtitle: '支持五子棋 AI、俄罗斯方块、贪吃蛇',
      badge: '模块化扩充',
      badgeColor: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
      description: '包含人机与双人五子棋（初级到S级AI）、经典俄罗斯方块、贪吃蛇、中国象棋等，具备积分排行榜与模块化轻松极速增加游戏能力。',
      icon: Gamepad2,
      iconColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      btnText: '打开小游戏专区 (/ooo)',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10 relative z-10">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Title Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-white/10 text-[10px] font-mono tracking-[0.2em] uppercase text-white/60">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Workspace Modules</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            全场景 Web3.0 智能应用矩阵
          </h2>
          <p className="text-sm sm:text-base text-white/60">
            全栈微服务架构，所有模块均搭载高并发边缘防护与极致交互体验。点击下方卡片直达业务功能区。
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="group relative bg-black/40 border border-white/10 hover:border-cyan-400/40 rounded-2xl p-7 backdrop-blur-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.1)] hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-5">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl border ${item.iconColor} transition-transform group-hover:scale-105`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className={`px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded-md border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {item.title}
                      </h3>
                      <span className="text-xs font-mono text-white/40 font-medium">({item.route})</span>
                    </div>
                    <p className="text-xs text-cyan-400/80 font-medium mt-1">{item.subtitle}</p>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-white/70 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Action Button */}
                <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-xs font-bold text-white/80 group-hover:text-cyan-300">
                  <span>{item.btnText}</span>
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 group-hover:bg-cyan-400 group-hover:text-black flex items-center justify-center transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
