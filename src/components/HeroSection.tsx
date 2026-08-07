import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, ShieldCheck, Mail, Lock, KeyRound, Sparkles, ArrowRight, CheckCircle, RefreshCw } from 'lucide-react';
import { sendEmailCode, loginUser } from '../lib/api';
import { User } from '../types';
import { LIMIT_CONFIG } from '../config';

interface HeroSectionProps {
  currentUser: User | null;
  onLoginSuccess: (user: User) => void;
  onShowToast: (type: 'success' | 'error' | 'info', text: string) => void;
  onNavigate: (view: any) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentUser,
  onLoginSuccess,
  onShowToast,
  onNavigate,
}) => {
  // Auth Form State
  const [activeTab, setActiveTab] = useState<'password' | 'code' | 'register' | 'forgot'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Cool down timer
  const [cooldown, setCooldown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let timer: any;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  // Handle Send Code
  const handleSendCode = async () => {
    if (!email || !email.includes('@')) {
      onShowToast('error', '请输入有效的电子邮箱地址');
      return;
    }

    if (cooldown > 0) return;

    setIsLoading(true);
    const result = await sendEmailCode(email);
    setIsLoading(false);

    if (result.success) {
      onShowToast('success', result.message);
      setCooldown(LIMIT_CONFIG.FRONTEND_COOL_DOWN_SEC);
    } else {
      onShowToast('error', result.message);
    }
  };

  // Handle Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      onShowToast('error', '请输入有效的电子邮箱地址');
      return;
    }

    if (activeTab === 'password' && !password) {
      onShowToast('error', '请输入登录密码');
      return;
    }

    if ((activeTab === 'code' || activeTab === 'register' || activeTab === 'forgot') && !code) {
      onShowToast('error', '请输入6位邮箱验证码');
      return;
    }

    setIsLoading(true);
    const result = await loginUser({
      email,
      password,
      code,
      type: activeTab,
    });
    setIsLoading(false);

    if (result.success && result.user) {
      onShowToast('success', result.message || '操作成功！');
      onLoginSuccess(result.user);
    } else {
      onShowToast('error', result.message || '验证失败，请核对信息');
    }
  };

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 z-10">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Col: High-End Introduction */}
        <div className="lg:col-span-7 flex flex-col items-start space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-400/5 border border-cyan-400/20 text-cyan-300 text-xs font-mono tracking-widest uppercase backdrop-blur-md shadow-[0_0_15px_rgba(34,211,238,0.1)]">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>AI-SMALL CORE ENGINE v0.1.4</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
            极简 · 沉浸 · 无界
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
              ai-small.xyz 智能全栈平台
            </span>
          </h1>

          <p className="text-base sm:text-lg text-white/70 max-w-2xl font-normal leading-relaxed">
            基于 Cloudflare Edge CDN、Vercel Serverless 与 Supabase 云数据库打造的高并发免卡全栈智能系统。集成 Gemini 大模型 AI 智能对话、多语言实时协同社区、智能膳食图片辨识与经典游戏专区。
          </p>

          {/* Core Feature Tags */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full pt-2">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-black/40 border border-white/10 text-white/80 text-xs">
              <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] shrink-0" />
              <span>100% 免卡轻量级托管</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-black/40 border border-white/10 text-white/80 text-xs">
              <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] shrink-0" />
              <span>Gemini 3.6 / DeepSeek V4</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-black/40 border border-white/10 text-white/80 text-xs">
              <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)] shrink-0" />
              <span>Resend API 邮箱秒级验证</span>
            </div>
          </div>

          {/* Quick Jump Buttons if logged in */}
          {currentUser && (
            <div className="pt-4 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('chat')}
                className="flex items-center gap-2 px-5 py-3 text-sm font-bold text-black bg-white hover:bg-zinc-200 rounded-full transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                <span>进入 AI 聊天 (/aaa)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('channel')}
                className="flex items-center gap-2 px-5 py-3 text-sm font-bold text-white/90 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all"
              >
                <span>加入协同社区 (/ddd)</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Col: Interactive Auth / Login Card */}
        <div className="lg:col-span-5 w-full max-w-md mx-auto">
          <div className="relative bg-zinc-900/80 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-[0_0_30px_rgba(34,211,238,0.05)] backdrop-blur-xl">
            {/* Ambient Glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            {currentUser ? (
              /* Already Logged In Console Box */
              <div className="text-center py-6 space-y-5">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 p-1 shadow-[0_0_20px_rgba(34,211,238,0.4)]">
                  <img
                    src={currentUser.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.email}`}
                    alt="User"
                    className="w-full h-full rounded-full object-cover bg-black"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">欢迎归来，{currentUser.nickname || currentUser.email.split('@')[0]}</h3>
                  <p className="text-xs text-white/40 mt-1 font-mono">{currentUser.email}</p>
                </div>
                <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-xs text-white/80 text-left space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white/40 uppercase tracking-widest text-[10px]">MODULE_STATUS</span>
                    <span className="text-emerald-400 font-mono text-xs">AUTH_READY: TRUE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40 uppercase tracking-widest text-[10px]">ENDPOINT_SYNC</span>
                    <span className="text-cyan-400 font-mono text-xs">CROSS_CLOUD: ACTIVE</span>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('chat')}
                  className="w-full py-3 bg-white hover:bg-zinc-200 text-black font-bold text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                >
                  前往 AI 聊天工作台
                </button>
              </div>
            ) : (
              /* Auth Form Tabs & Inputs */
              <div>
                {/* Header & Tabs */}
                <div className="mb-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-cyan-400" />
                      <span>控制台通行登录</span>
                    </h2>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Supabase Auth</span>
                  </div>

                  {/* Tabs */}
                  <div className="grid grid-cols-2 p-1 bg-black/40 rounded-xl border border-white/10">
                    <button
                      id="tabPassword"
                      onClick={() => setActiveTab('password')}
                      className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        activeTab === 'password'
                          ? 'bg-white/10 border border-white/20 text-white shadow-[0_0_10px_rgba(255,255,255,0.05)]'
                          : 'text-white/40 hover:text-white'
                      }`}
                    >
                      密码登录
                    </button>
                    <button
                      id="tabCode"
                      onClick={() => setActiveTab('code')}
                      className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        activeTab === 'code' || activeTab === 'register' || activeTab === 'forgot'
                          ? 'bg-white/10 border border-white/20 text-white shadow-[0_0_10px_rgba(255,255,255,0.05)]'
                          : 'text-white/40 hover:text-white'
                      }`}
                    >
                      验证码登录/注册
                    </button>
                  </div>
                </div>

                {/* Form Elements */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email Input */}
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1.5">电子邮箱账号</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="usernameInput"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 focus:border-cyan-400/80 rounded-xl text-sm text-white placeholder-white/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Password Input Container (when password tab is active) */}
                  {activeTab === 'password' && (
                    <div id="passwordContainer" className="space-y-1.5">
                      <label className="block text-xs font-medium text-white/70">账号密码</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          id="passwordInput"
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-10 py-2.5 bg-black/40 border border-white/10 focus:border-cyan-400/80 rounded-xl text-sm text-white placeholder-white/20 outline-none transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                        >
                          {showPassword ? <EyeOff id="eyeIcon" className="w-4 h-4" /> : <Eye id="eyeIcon" className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Verification Code Input Container (when code / register / forgot tab is active) */}
                  {(activeTab === 'code' || activeTab === 'register' || activeTab === 'forgot') && (
                    <div id="codeContainer" className="space-y-1.5">
                      <label className="block text-xs font-medium text-white/70">6位邮箱验证码</label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <KeyRound className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            id="codeInput"
                            type="text"
                            maxLength={6}
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="123456"
                            className="w-full pl-10 pr-3 py-2.5 bg-black/40 border border-white/10 focus:border-cyan-400/80 rounded-xl text-sm text-white placeholder-white/20 outline-none transition-all tracking-widest font-mono"
                          />
                        </div>
                        <button
                          id="sendCodeBtn"
                          type="button"
                          disabled={cooldown > 0 || isLoading}
                          onClick={handleSendCode}
                          className="px-4 py-2.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 disabled:opacity-50 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0"
                        >
                          {cooldown > 0 ? `${cooldown}s 后重发` : '获取验证码'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Password / Register Secondary Action Links */}
                  <div className="flex items-center justify-between text-xs pt-1 text-white/40">
                    <button
                      type="button"
                      onClick={() => setActiveTab('register')}
                      className="hover:text-cyan-400 underline decoration-white/20 underline-offset-4"
                    >
                      用户注册
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('forgot')}
                      className="hover:text-cyan-400 underline decoration-white/20 underline-offset-4"
                    >
                      忘记密码
                    </button>
                  </div>

                  {/* Submit Button */}
                  <button
                    id="submitBtn"
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 mt-2 bg-gradient-to-br from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-white font-bold text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <span id="submitBtnText">
                        {activeTab === 'password'
                          ? '安全登录通行'
                          : activeTab === 'register'
                          ? '立即注册账号'
                          : activeTab === 'forgot'
                          ? '重置与取回密码'
                          : '验证码快捷登录'}
                      </span>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
