import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, KeyRound, ArrowRight, X, Sparkles } from 'lucide-react';
import { CONFIG, STORAGE_KEYS, LIMIT_CONFIG } from '../config';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any, token: string) => void;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  showToast
}) => {
  const [activeTab, setActiveTab] = useState<'password' | 'code'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // 10秒防刷倒计时
  const [cooldown, setCooldown] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let timer: any;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  if (!isOpen) return null;

  const handleSendCode = async () => {
    if (!email || !email.includes('@')) {
      showToast('请输入有效的电子邮箱地址！', 'error');
      return;
    }
    if (cooldown > 0) return;

    setLoading(true);
    try {
      const res = await fetch(`${CONFIG.API_BASE_URL}/api/auth/send-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();

      if (data.success) {
        showToast(
          data.debugCode
            ? `验证码已生成: ${data.debugCode} (可在后台或调试信息中使用)`
            : '验证码已发送至您的电子邮箱！',
          'success'
        );
        setCooldown(LIMIT_CONFIG.FRONTEND_COOL_DOWN_SEC); // 触发 10 秒防刷
      } else {
        showToast(data.error || '发送验证码失败', 'error');
      }
    } catch (err: any) {
      showToast('请求接口异常: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast('请输入邮箱', 'error');
      return;
    }

    if (activeTab === 'password' && !password) {
      showToast('请输入登录密码', 'error');
      return;
    }

    if (activeTab === 'code' && !code) {
      showToast('请输入验证码', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${CONFIG.API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          code,
          loginType: activeTab
        })
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.token);
        localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(data.user));
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));

        showToast(`欢迎回来，${data.user.nickname}！`, 'success');
        onLoginSuccess(data.user, data.token);
        onClose();
      } else {
        showToast(data.error || '登录鉴权失败', 'error');
      }
    } catch (err: any) {
      showToast('网络交互故障: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-8 text-slate-100 overflow-hidden">
        {/* 背景光晕装饰 */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* 头部标题与关闭按钮 */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>ai-small.xyz 认证中心</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">账户快速通道</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab 选项卡：对应 #tabPassword 和 #tabCode */}
        <div className="flex bg-slate-950/60 p-1.5 rounded-2xl mb-6 border border-slate-800">
          <button
            id="tabPassword"
            type="button"
            onClick={() => setActiveTab('password')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'password'
                ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            密码登录
          </button>
          <button
            id="tabCode"
            type="button"
            onClick={() => setActiveTab('code')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'code'
                ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            验证码登录/注册
          </button>
        </div>

        {/* 表单整体 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 通用电子邮箱输入框，对应 #usernameInput */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">电子邮箱</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              <input
                id="usernameInput"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@ai-small.xyz"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                required
              />
            </div>
          </div>

          {/* 密码登录容器，对应 #passwordContainer */}
          {activeTab === 'password' && (
            <div id="passwordContainer" className="animate-fade-in">
              <label className="block text-xs font-medium text-slate-400 mb-1.5">密码</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  id="passwordInput"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 pl-10 pr-10 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                />
                {/* 对应 #eyeIcon */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                >
                  <span id="eyeIcon">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* 验证码登录容器，对应 #codeContainer */}
          {activeTab === 'code' && (
            <div id="codeContainer" className="animate-fade-in">
              <label className="block text-xs font-medium text-slate-400 mb-1.5">邮件验证码</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <KeyRound className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    id="codeInput"
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="6 位验证码"
                    maxLength={6}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                  />
                </div>
                {/* 发送验证码按钮，对应 #sendCodeBtn (带倒计时) */}
                <button
                  id="sendCodeBtn"
                  type="button"
                  onClick={handleSendCode}
                  disabled={cooldown > 0 || loading}
                  className={`px-4 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                    cooldown > 0
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700/60'
                  }`}
                >
                  {cooldown > 0 ? `${cooldown}s 后重发` : '获取验证码'}
                </button>
              </div>
            </div>
          )}

          {/* 表单提交按钮，对应 #submitBtn 和 #submitBtnText */}
          <button
            id="submitBtn"
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-medium text-sm transition-all shadow-lg shadow-sky-900/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span id="submitBtnText" className="flex items-center gap-2">
              {loading ? (
                '处理中...'
              ) : (
                <>
                  <span>{activeTab === 'password' ? '立即登录' : '验证并进入平台'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </span>
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          受 Resend API 与 Supabase 物理安全隔离保护，注册即代表同意《AI-Small 平台使用协议》
        </p>
      </div>
    </div>
  );
};
