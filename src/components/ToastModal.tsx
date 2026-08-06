import React from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export interface ToastInfo {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

export interface ModalInfo {
  title: string;
  content: string;
  type?: 'info' | 'warning';
}

interface ToastModalProps {
  toasts: ToastInfo[];
  modal: ModalInfo | null;
  onCloseToast: (id: string) => void;
  onCloseModal: () => void;
}

export const ToastModal: React.FC<ToastModalProps> = ({
  toasts,
  modal,
  onCloseToast,
  onCloseModal
}) => {
  return (
    <>
      {/* Toast 容器，对应 #toastContainer */}
      <div
        id="toastContainer"
        className="fixed top-5 right-5 z-50 flex flex-col gap-3 pointer-events-none max-w-sm w-full px-4"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            id="toastMessage"
            className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-xl shadow-2xl border backdrop-blur-md transition-all duration-300 animate-slide-in ${
              toast.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
                : toast.type === 'error'
                ? 'bg-rose-950/80 border-rose-500/50 text-rose-200'
                : 'bg-slate-900/90 border-sky-500/50 text-sky-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-sky-400 shrink-0" />}
              <span id="toastText" className="text-sm font-medium tracking-wide leading-relaxed">
                {toast.text}
              </span>
            </div>
            <button
              onClick={() => onCloseToast(toast.id)}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4 opacity-70 hover:opacity-100" />
            </button>
          </div>
        ))}
      </div>

      {/* 全局 Modal 弹窗，对应 #infoModal 和 #modalContent */}
      {modal && (
        <div
          id="infoModal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
        >
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-2xl text-slate-100 overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="text-lg font-semibold tracking-wide text-sky-400 flex items-center gap-2">
                <Info className="w-5 h-5" />
                {modal.title}
              </h3>
              <button
                onClick={onCloseModal}
                className="p-1.5 hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div id="modalContent" className="text-slate-300 text-sm leading-relaxed space-y-2">
              {modal.content}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={onCloseModal}
                className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-medium text-sm transition-all shadow-lg cursor-pointer"
              >
                好的，了解
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
