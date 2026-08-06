/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ParticleCanvas } from './components/ParticleCanvas';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { AuthModal } from './components/AuthModal';
import { ToastModal, ToastInfo, ModalInfo } from './components/ToastModal';

import { ConsoleView } from './views/ConsoleView';
import { ChatView } from './views/ChatView';
import { CommunityView } from './views/CommunityView';
import { DietView } from './views/DietView';
import { GameView } from './views/GameView';

import { STORAGE_KEYS } from './config';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('/');
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');
  const [particleEnabled, setParticleEnabled] = useState<boolean>(true);

  const [user, setUser] = useState<any>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const [toasts, setToasts] = useState<ToastInfo[]>([]);
  const [modal, setModal] = useState<ModalInfo | null>(null);

  // 初始化加载用户缓存
  useEffect(() => {
    try {
      const cachedUser = localStorage.getItem(STORAGE_KEYS.USER_INFO) || localStorage.getItem(STORAGE_KEYS.USER);
      if (cachedUser) {
        setUser(JSON.parse(cachedUser));
      }
    } catch (e) {}
  }, []);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    const newToast: ToastInfo = { id: 'toast-' + Date.now() + Math.random(), type, text };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 4000);
  };

  const handleCloseToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_INFO);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);
    showToast('已安全退出账户！', 'info');
  };

  return (
    <div className={`min-h-screen relative font-sans transition-colors ${themeMode === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'}`}>
      {/* 隐藏的 QR 代码上传 Input，对应 #qrFileInput */}
      <input id="qrFileInput" type="file" accept="image/*" className="hidden" />

      {/* 动态 Canvas 粒子背景，对应 #particleCanvas */}
      <ParticleCanvas enabled={particleEnabled} />

      {/* 顶部导航，包含 #themeToggleBtn, #themeSunIcon, #themeMoonIcon, #consoleBtn */}
      <Navbar
        themeMode={themeMode}
        particleEnabled={particleEnabled}
        user={user}
        activeTab={activeTab}
        onToggleTheme={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
        onToggleParticle={() => setParticleEnabled(!particleEnabled)}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
        onNavSelect={(tab) => setActiveTab(tab)}
      />

      {/* 主界面布局 */}
      <div className="max-w-[1700px] w-full mx-auto px-4 sm:px-8 py-8 flex flex-col lg:flex-row gap-8 relative z-10">
        <Sidebar activeTab={activeTab} onSelectTab={(tab) => setActiveTab(tab)} />

        <main className="flex-1 min-w-0">
          {activeTab === '/' && <ConsoleView onNavigate={(tab) => setActiveTab(tab)} />}
          {activeTab === '/aaa' && <ChatView />}
          {activeTab === '/ddd' && <CommunityView user={user} showToast={showToast} />}
          {activeTab === '/eee' && <DietView user={user} showToast={showToast} />}
          {activeTab === '/ooo' && <GameView user={user} showToast={showToast} />}
        </main>
      </div>

      {/* 认证弹窗，包含全部 11 个特定 ID */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={(loggedUser) => setUser(loggedUser)}
        showToast={showToast}
      />

      {/* Toast 和 Modal 挂载组件，包含 #toastContainer, #toastMessage, #toastText, #infoModal, #modalContent */}
      <ToastModal
        toasts={toasts}
        modal={modal}
        onCloseToast={handleCloseToast}
        onCloseModal={() => setModal(null)}
      />
    </div>
  );
}
