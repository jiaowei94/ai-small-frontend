import React, { useState, useEffect } from 'react';
import { Shield, FileText, Users, Globe, Lock, Mail, Heart } from 'lucide-react';
import { InfoModal } from './Modal';

export const Footer: React.FC = () => {
  const [modalType, setModalType] = useState<'compliance' | 'disclaimer' | 'team' | 'privacy' | 'contact' | null>(null);
  const [userIP, setUserIP] = useState<string>('正在检测 IP 位置...');

  useEffect(() => {
    // Detect IP Location via public API
    fetch('https://ipapi.co/json/')
      .then((res) => res.json())
      .then((data) => {
        if (data.ip) {
          setUserIP(`${data.ip} (${data.country_name || '网络节点'} · ${data.city || '未知城市'})`);
        } else {
          setUserIP('网络节点: Edge CDN Safe IP');
        }
      })
      .catch(() => {
        setUserIP('127.0.0.1 (Cloudflare Edge Node Protected)');
      });
  }, []);

  return (
    <footer className="border-t border-white/10 bg-black/60 text-white/40 text-xs py-12 px-4 sm:px-6 lg:px-8 relative z-10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Info Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-white/10">
          {/* Col 1: Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base text-white tracking-tight font-mono uppercase">AI-SMALL</span>
            </div>
            <p className="text-white/40 leading-relaxed text-[11px]">
              零成本、免信用卡、高并发 Serverless 全栈人工智能与协同云平台。
            </p>
          </div>

          {/* Col 2: Function links */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-[10px] uppercase tracking-[0.2em]">条款与合规</h4>
            <ul className="space-y-1.5 text-white/60">
              <li>
                <button onClick={() => setModalType('compliance')} className="hover:text-cyan-400 transition-colors">
                  合规介绍 (Compliance)
                </button>
              </li>
              <li>
                <button onClick={() => setModalType('disclaimer')} className="hover:text-cyan-400 transition-colors">
                  免责声明 (Disclaimer)
                </button>
              </li>
              <li>
                <button onClick={() => setModalType('privacy')} className="hover:text-cyan-400 transition-colors">
                  隐私条款 (Privacy Policy)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: About & Contact */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-[10px] uppercase tracking-[0.2em]">团队与合作</h4>
            <ul className="space-y-1.5 text-white/60">
              <li>
                <button onClick={() => setModalType('team')} className="hover:text-cyan-400 transition-colors">
                  团队介绍 (Team Info)
                </button>
              </li>
              <li>
                <button onClick={() => setModalType('contact')} className="hover:text-cyan-400 transition-colors">
                  合作联系 (Contact Us)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: IP & Node Info */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-[10px] uppercase tracking-[0.2em]">用户 IP 与连接网络</h4>
            <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
              <div className="flex items-center gap-1.5 text-white/80 font-mono text-[11px]">
                <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{userIP}</span>
              </div>
              <div className="text-[10px] text-white/40 font-mono">
                连接节点: Cloudflare Edge SSL Encrypted
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-white/30 text-[10px] font-mono tracking-widest uppercase">
          <div>
            © {new Date().getFullYear()} AI-SMALL. All rights reserved. Powered by Vercel & Supabase.
          </div>
          <div className="flex items-center gap-1.5 text-white/50">
            <span>AI-SMALL CORE ENGINE v0.1.4</span>
          </div>
        </div>
      </div>

      {/* Info Modals */}
      <InfoModal
        isOpen={modalType === 'compliance'}
        title="合规介绍 (Compliance Notice)"
        onClose={() => setModalType(null)}
      >
        <p>
          ai-small.xyz 严格遵循国际互联网安全标准与数据隐私管理规范。我们所有的后端逻辑运行于 Vercel Serverless 环境，数据全流程使用 HTTPS TLS 1.3 加密传输。
        </p>
        <p>
          平台不存储任何用户的明文密码。用户身份校验使用安全加密验证码与 Supabase 密码散列散列机制保存。所有 Gemini AI 调用均经由后端代理隔离，不会将用户数据公开或用于训练未经授权的模型。
        </p>
      </InfoModal>

      <InfoModal
        isOpen={modalType === 'disclaimer'}
        title="免责声明 (Disclaimer)"
        onClose={() => setModalType(null)}
      >
        <p>
          1. 本网站提供的 AI 聊天及膳食图片分析服务由 Google Gemini API 驱动，生成的结果仅供参考，不构成专业的医疗、健康、法律或投资建议。
        </p>
        <p>
          2. 用户在协同社区 (/ddd) 发言需遵守互联网法律法规，禁止发布违法、暴力、侵权或不当言论。
        </p>
        <p>
          3. 本站基于免费云平台构建（Vercel、Cloudflare、Supabase、Resend），配额用尽时可能会触发限流，请谅解。
        </p>
      </InfoModal>

      <InfoModal
        isOpen={modalType === 'team'}
        title="团队介绍 (Team Introduction)"
        onClose={() => setModalType(null)}
      >
        <p>
          ai-small.xyz 团队由热衷于 Cloud-Native 与 Serverless 人工智能架构的独立开发者发起。
        </p>
        <p>
          我们的宗旨是用零门槛、免绑定信用卡的全球免费顶尖云服务堆栈，为广大用户和开发者提供体验极致、界面精美的全栈 Web3.0 应用程序。
        </p>
      </InfoModal>

      <InfoModal
        isOpen={modalType === 'privacy'}
        title="隐私条款 (Privacy Policy)"
        onClose={() => setModalType(null)}
      >
        <p>
          1. 数据收集：我们仅收集用于登录校验的电子邮箱地址与基本用户昵称。
        </p>
        <p>
          2. 数据存储：数据安全存储于 Supabase PostgreSQL 加密数据库中。用户可随时请求注销并抹除数据。
        </p>
        <p>
          3. Cookie 与 LocalStorage：仅用于保持本地用户登录 Token 与主题偏好设置，绝不追踪第三方广告或跨站行为。
        </p>
      </InfoModal>

      <InfoModal
        isOpen={modalType === 'contact'}
        title="合作联系 (Contact Us)"
        onClose={() => setModalType(null)}
      >
        <p>有技术交流、项目合作或建议需求？欢迎通过以下方式联系我们：</p>
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-indigo-300 font-mono text-xs">
          <p>📧 官方邮箱: jiaoweixie94@gmail.com</p>
          <p>🌐 官方主页: https://ai-small.xyz</p>
          <p>💬 GitHub Repo: ai-small-frontend / ai-small-backend</p>
        </div>
      </InfoModal>
    </footer>
  );
};
