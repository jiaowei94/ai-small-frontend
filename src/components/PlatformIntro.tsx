import React from 'react';
import { Cpu, ShieldCheck, Zap, Globe, Database, Mail, Server, Lock } from 'lucide-react';

export const PlatformIntro: React.FC = () => {
  const highlights = [
    {
      title: '零成本边缘部署架构',
      desc: '采用 Cloudflare Pages 全球 CDN 静态网络与 Vercel Serverless 云函数，实现高并发无感响应。',
      icon: Globe,
      color: 'text-cyan-400',
    },
    {
      title: '数据库与实时通道',
      desc: '基于 Supabase Serverless PostgreSQL 数据库，支持 500MB 持久化存储与毫秒级 Realtime 消息广播。',
      icon: Database,
      color: 'text-emerald-400',
    },
    {
      title: 'Resend 验证发信系统',
      desc: '接轨 Resend API 专业发信通道，每分钟高并发精准推送 6 位数字安全登录与重置代码。',
      icon: Mail,
      color: 'text-blue-400',
    },
    {
      title: 'Gemini 2.0 / 3.6 API 引擎',
      desc: '集成 Google 最新大模型 API，安全代理隐藏密钥，提供长文本生成、多语言翻译与视觉识别。',
      icon: Cpu,
      color: 'text-amber-400',
    },
    {
      title: '密钥 100% 环境隔离',
      desc: '敏感 API Key 统一保存在后端 Vercel 云容器中，前端只传输加密 Token，杜绝网络抓包泄漏。',
      icon: Lock,
      color: 'text-rose-400',
    },
    {
      title: '防刷与 IP 流控机制',
      desc: '集成 express-rate-limit 智能中间件与前端 10 秒倒计时冷却限制，全方位保障配额安全。',
      icon: ShieldCheck,
      color: 'text-teal-400',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10 bg-black/20 relative z-10">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-white/10 text-[10px] font-mono tracking-[0.2em] uppercase text-white/60">
            <Server className="w-3.5 h-3.5 text-cyan-400" />
            <span>CLOUD_ARCHITECTURE_SYNC</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            高大上的极简云计算服务体系
          </h2>
          <p className="text-sm sm:text-base text-white/60">
            精简而不失功能强劲，结合全球顶尖 No-Credit-Card 堆栈，为极客与创作者打造的无缝体验。
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 bg-black/40 border border-white/10 rounded-2xl space-y-3 backdrop-blur-xl hover:border-white/20 transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.05)]"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="text-xs sm:text-sm text-white/60 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
