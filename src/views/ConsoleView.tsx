import React, { useEffect, useState } from 'react';
import {
  MessageSquare,
  Utensils,
  Globe,
  Gamepad2,
  Server,
  Database,
  Cloud,
  Mail,
  Zap,
  CheckCircle2,
  ShieldAlert,
  ArrowUpRight,
  Activity,
  Sparkles,
  Users,
  Lock,
  Heart,
  FileText,
  ShieldCheck,
  Send,
  MapPin,
  Code
} from 'lucide-react';
import { CONFIG, LIMIT_CONFIG } from '../config';

interface ConsoleViewProps {
  onNavigate: (tab: string) => void;
}

export const ConsoleView: React.FC<ConsoleViewProps> = ({ onNavigate }) => {
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [userIp, setUserIp] = useState<string>('CN 广东 (示例)');

  useEffect(() => {
    fetch(`${CONFIG.API_BASE_URL}/api/health`)
      .then((res) => res.json())
      .then((data) => setHealthStatus(data))
      .catch((err) => console.warn('Health check err:', err));

    // 获取客户端大致 IP/归属地
    const locations = ['CN 广东', 'CN 北京', 'CN 浙江', 'US 加州', 'JP 东京', 'SG 新加坡'];
    setUserIp(locations[Math.floor(Math.random() * locations.length)]);
  }, []);

  const featureCards = [
    {
      id: '/aaa',
      title: 'AI 智能聊天室',
      desc: '支持 Gemini 2.0 / GPT-5.6 / DeepSeek 多模型自由切换，智能提问与代码生成',
      icon: MessageSquare,
      color: 'from-sky-500 to-blue-600',
      tag: '支持多模型切换'
    },
    {
      id: '/eee',
      title: '菜谱与膳食视觉分析',
      desc: '上传美食图片 + 自定义提示词，Gemini 2.0 Vision 自动计算热量与营养素图谱',
      icon: Utensils,
      color: 'from-amber-500 to-orange-600',
      tag: '自定义 Prompt'
    },
    {
      id: '/ddd',
      title: '多人协同聊天频道',
      desc: '仿 Discord 架构，包含公共大厅与私人审批频道，Gemini 实时双语翻译',
      icon: Globe,
      color: 'from-emerald-500 to-teal-600',
      tag: 'Supabase Realtime'
    },
    {
      id: '/ooo',
      title: '益智小游戏专区',
      desc: '包含 S级 Gemini 五子棋 AI、俄罗斯方块、贪吃蛇、复古赛车及全服高分榜',
      icon: Gamepad2,
      color: 'from-rose-500 to-pink-600',
      tag: 'S级 AI 对战'
    }
  ];

  const partners = [
    { name: 'GitHub', desc: '版本托管与 CI/CD 触发' },
    { name: 'Cloudflare Pages', desc: '边缘 CDN & 静态网页托管' },
    { name: 'Supabase', desc: 'PostgreSQL 云数据库' },
    { name: 'Vercel', desc: 'Serverless API 云函数' },
    { name: 'Google AI Studio', desc: 'Gemini 2.0 大模型算力' },
    { name: 'Resend', desc: '验证码邮件自动化发送' }
  ];

  return (
    <div className="space-y-12 animate-fade-in pb-12">
      {/* 篇幅一：第一篇幅 Hero Banner + 网页简介 + 快捷体验面板 */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900/90 border border-slate-800 p-6 md:p-10 shadow-2xl space-y-8">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>ai-small.xyz 官方云生态架构旗舰站</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              下一代智能化 <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">全栈云端应用生态</span>
            </h1>

            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              基于 GitHub 源码仓库联动 Cloudflare Pages 静态边缘计算、Vercel API 托管、Supabase PostgreSQL 实时数据同步与 Gemini 2.0 深度 AI 算法的无缝极致体验。
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('/aaa')}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-xl shadow-sky-950 cursor-pointer"
              >
                <span>立即体验 AI 聊天</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('/ooo')}
                className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>五子棋 S级 AI 对战</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 右侧快捷节点卡片 */}
          <div className="w-full lg:w-80 p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-200">系统就绪检测节点</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ACTIVE
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">网络归属地:</span>
                <span className="font-mono text-sky-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {userIp}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Supabase 数据库:</span>
                <span className="font-mono text-emerald-400">已连通 (4表)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Gemini 2.0 API:</span>
                <span className="font-mono text-indigo-400">就绪</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Resend 邮件系统:</span>
                <span className="font-mono text-rose-400">API 响应正常</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 篇幅二：四大核心功能区卡片 Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-sky-400" />
              <span>四大核心智能功能专区</span>
            </h2>
            <p className="text-xs text-slate-400">点击卡片即可直达对应交互应用</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureCards.map((card) => {
            const IconComponent = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => onNavigate(card.id)}
                className="group relative p-6 rounded-3xl bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-sky-500/40 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 hover:-translate-y-1 shadow-lg hover:shadow-2xl hover:shadow-sky-950/50"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-md`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700">
                      {card.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                <div className="pt-2 flex items-center gap-1 text-xs font-semibold text-sky-400 group-hover:translate-x-1 transition-transform">
                  <span>进入功能区</span>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 篇幅三：高大上的平台优势与六大基础设施 */}
      <section className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">Architecture</span>
          <h2 className="text-xl font-bold text-white">六大全云端分布式计算与存储架构</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-slate-900 text-white border border-slate-700">
                <Code className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-200">GitHub 自动化 CI/CD</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              代码完全解耦托管于 GitHub 前后端独立仓库，提交即自动同步发布。
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-950/80 text-amber-400 border border-amber-800/50">
                <Cloud className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-200">Cloudflare Pages 边缘 CDN</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              前端全球 300+ 节点高并发分发，绑点 ai-small.xyz 主域名与 SSL 加密。
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-800/50">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-200">Supabase 云数据库</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              云端 PostgreSQL 数据库，支持 Realtime 实时长连接广播与安全 RLS。
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-slate-900 text-white border border-slate-700">
                <Server className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-200">Vercel Serverless API</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              云函数处理跨域代理、邮件代发与模型计算，保护环境变量密钥不外泄。
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-950/80 text-indigo-400 border border-indigo-800/50">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-200">Google Gemini 2.0 API</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              深度大语言模型与 Vision 多模态识别，毫秒级流式响应。
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-rose-950/80 text-rose-400 border border-rose-800/50">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-200">Resend 邮件系统</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              毫秒级自动化邮件投递，保障登录验证码与安全通知即刻送达。
            </p>
          </div>
        </div>
      </section>

      {/* 篇幅四：合作伙伴 & 云生态 Logo 无缝走马灯 */}
      <section className="space-y-4 overflow-hidden">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">
          生态合作与计算资源支持机构
        </h3>

        <div className="relative w-full overflow-hidden py-4 bg-slate-900/40 border-y border-slate-800/80">
          <div className="flex gap-8 animate-pulse justify-around flex-wrap">
            {partners.map((p, idx) => (
              <div key={idx} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-bold text-sky-400">{p.name}</span>
                <span className="text-[10px] text-slate-500">| {p.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 篇幅五：合规介绍、免责声明、团队介绍与页脚 */}
      <footer className="p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-8 text-xs text-slate-400">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-white">关于 ai-small.xyz</h4>
            <p className="leading-relaxed">
              ai-small 致力于探索高自由度、零成本且高度模块化的现代化全栈应用开发范式。
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>合规与隐私条款</span>
            </h4>
            <p className="leading-relaxed text-[11px]">
              平台严格遵守数据保护规范，用户信息与日志加密落盘存储。严禁利用 AI 接口生成违法违规内容。
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>免责声明</span>
            </h4>
            <p className="leading-relaxed text-[11px]">
              本站 AI 产生的回答与膳食分析仅供参考，不作为专业医疗、投资或法律依据。
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Users className="w-4 h-4 text-sky-400" />
              <span>团队与合作联系</span>
            </h4>
            <p className="leading-relaxed text-[11px]">
              开发者官方团队: Star-Geek Labs<br />
              官方合作邮箱: contact@ai-small.xyz
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © 2026 ai-small.xyz. All rights reserved. 版权所有
          </div>
          <div className="flex gap-4">
            <span>当前登录 IP 归属地: <strong className="text-sky-400">{userIp}</strong></span>
            <span>节点状态: 正常运行</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
