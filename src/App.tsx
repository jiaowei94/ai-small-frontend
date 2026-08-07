import React, { useState, useEffect } from 'react';
import { ParticleBackground } from './components/ParticleBackground';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FeatureHub } from './components/FeatureHub';
import { PlatformIntro } from './components/PlatformIntro';
import { PartnerMarquee } from './components/PartnerMarquee';
import { Footer } from './components/Footer';
import { ToastContainer, ToastMessage } from './components/Toast';

import { AIChatView } from './components/views/AIChatView';
import { RecipeView } from './components/views/RecipeView';
import { ChannelView } from './components/views/ChannelView';
import { GameView } from './components/views/GameView';

import { ViewMode, User } from './types';
import { STORAGE_KEYS } from './config';
import { getCurrentUser } from './lib/api';

export default function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState<ViewMode>('home');

  // Theme State (Default Dark)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    return saved ? saved === 'dark' : true;
  });

  // Current User State
  const [currentUser, setCurrentUser] = useState<User | null>(() => getCurrentUser());

  // Toasts System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (type: 'success' | 'error' | 'info', text: string) => {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5);
    const newToast: ToastMessage = { id, type, text };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Toggle Theme
  const toggleTheme = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    localStorage.setItem(STORAGE_KEYS.THEME, next ? 'dark' : 'light');
    if (next) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handle Login
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_INFO);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setCurrentUser(null);
    showToast('info', '已成功退出登录');
  };

  return (
    <div
      className={`min-h-screen relative font-sans transition-colors duration-300 overflow-x-hidden ${
        isDarkMode ? 'bg-[#050505] text-white' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Immersive UI Background Atmosphere Glows */}
      {isDarkMode && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute top-[40%] right-[30%] w-[350px] h-[350px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />
        </div>
      )}

      {/* 1. Interactive Canvas Particle Background */}
      <ParticleBackground isDarkMode={isDarkMode} />

      {/* 2. Top Navigation Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        currentUser={currentUser}
        onOpenAuth={() => setCurrentView('home')}
        onLogout={handleLogout}
      />

      {/* 3. Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* 4. Main Body Views Routing */}
      <div className="relative z-10">
        {currentView === 'home' && (
          <main className="space-y-4">
            {/* Fold 1: Hero & Auth Box */}
            <HeroSection
              currentUser={currentUser}
              onLoginSuccess={handleLoginSuccess}
              onShowToast={showToast}
              onNavigate={setCurrentView}
            />

            {/* Fold 2: Feature Hub */}
            <FeatureHub onNavigate={setCurrentView} />

            {/* Fold 3: High-end Platform Intro */}
            <PlatformIntro />

            {/* Fold 4: Partner Marquee Banner */}
            <PartnerMarquee />

            {/* Fold 5: Footer & Compliance Links */}
            <Footer />
          </main>
        )}

        {currentView === 'chat' && (
          <AIChatView onBack={() => setCurrentView('home')} />
        )}

        {currentView === 'recipe' && (
          <RecipeView
            onBack={() => setCurrentView('home')}
            onShowToast={showToast}
          />
        )}

        {currentView === 'channel' && (
          <ChannelView
            currentUser={currentUser}
            onBack={() => setCurrentView('home')}
            onShowToast={showToast}
          />
        )}

        {currentView === 'game' && (
          <GameView
            onBack={() => setCurrentView('home')}
            onShowToast={showToast}
          />
        )}
      </div>
    </div>
  );
};
