import React, { useState } from 'react';
import { UtensilsCrossed, Upload, Sparkles, RefreshCw, ArrowLeft, Camera, Check, HeartPulse, Flame } from 'lucide-react';
import { DietLog } from '../../types';
import { analyzeDietImage } from '../../lib/api';

interface RecipeViewProps {
  onBack: () => void;
  onShowToast: (type: 'success' | 'error' | 'info', text: string) => void;
}

export const RecipeView: React.FC<RecipeViewProps> = ({ onBack, onShowToast }) => {
  const [prompt, setPrompt] = useState('分析这张图片中的食物菜品，识别成分、计算估算卡路里并给出三大营养素占比与健康改善建议。');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resultLog, setResultLog] = useState<DietLog | null>(null);

  // Sample dishes for instant test
  const sampleImages = [
    {
      name: '健身鸡胸肉牛油果沙拉',
      url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80',
    },
    {
      name: '煎三文鱼配绿蔬黎麦饭',
      url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&auto=format&fit=crop&q=80',
    },
    {
      name: '和风鳗鱼便当',
      url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=80',
    },
  ];

  // Handle File Upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Run Analysis
  const handleAnalyze = async () => {
    if (!imagePreview) {
      onShowToast('error', '请先上传或选择一张美食图片！');
      return;
    }

    setIsLoading(true);
    try {
      const log = await analyzeDietImage(imagePreview, prompt);
      setResultLog(log);
      onShowToast('success', '食物菜谱识别完成！');
    } catch (e) {
      onShowToast('error', '识别分析失败，请稍后再试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 max-w-6xl mx-auto space-y-6 relative z-10">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 text-white/60 hover:text-white bg-white/5 border border-white/10 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-emerald-400" />
              <span>智能菜谱与健康膳食分析 (/eee)</span>
            </h1>
            <p className="text-xs text-white/40">调用 Gemini 1.5 Vision 多模态视觉引擎分析热量与营养</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image Upload & Controls */}
        <div className="lg:col-span-5 space-y-6">
          {/* Upload Dropzone */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-200">1. 上传或拍摄美食照片</h3>

            <div className="relative group border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-2xl p-6 text-center transition-colors bg-slate-950/50 flex flex-col items-center justify-center min-h-[200px] cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-20"
              />

              {imagePreview ? (
                <div className="relative w-full h-48 rounded-xl overflow-hidden">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-xs text-white font-bold">
                    点击更换图片
                  </div>
                </div>
              ) : (
                <div className="space-y-2 text-slate-400">
                  <Camera className="w-8 h-8 mx-auto text-emerald-400" />
                  <p className="text-xs font-semibold">点击选择图片 或 拖拽照片至此处</p>
                  <p className="text-[10px] text-slate-500">支持 JPG, PNG, WEBP 格式</p>
                </div>
              )}
            </div>

            {/* Quick Sample Selector */}
            <div className="space-y-2">
              <span className="text-xs font-medium text-slate-400">快捷示例图片 (一键体验):</span>
              <div className="grid grid-cols-3 gap-2">
                {sampleImages.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => setImagePreview(sample.url)}
                    className="relative rounded-xl overflow-hidden border border-slate-800 hover:border-emerald-500 h-16 transition-all group"
                  >
                    <img src={sample.url} alt={sample.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 text-[10px] text-white p-1 flex items-end font-medium leading-tight">
                      {sample.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Prompt Editor */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl space-y-3">
            <h3 className="text-sm font-bold text-slate-200">2. 自定义分析提示词 (Prompt)</h3>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-emerald-500 outline-none leading-relaxed"
            />

            <button
              onClick={handleAnalyze}
              disabled={isLoading || !imagePreview}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>启动 AI 智能识别</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Results Display */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl space-y-6">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
            <HeartPulse className="w-5 h-5 text-rose-400" />
            <span>AI 分析报告 (Diet Analysis Report)</span>
          </h3>

          {resultLog ? (
            <div className="space-y-6 animate-fade-in">
              {/* Dish Header & Calories */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                <div>
                  <h4 className="text-lg font-bold text-slate-100">{resultLog.food_name}</h4>
                  <span className="text-xs text-slate-400">估算卡路里 Total Calories</span>
                </div>
                <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-950/60 border border-amber-500/30 text-amber-400 font-black text-xl">
                  <Flame className="w-5 h-5" />
                  <span>{resultLog.calories} kcal</span>
                </div>
              </div>

              {/* Nutrition Macros Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
                  <span className="text-xs text-slate-400">蛋白质 Protein</span>
                  <div className="text-lg font-extrabold text-sky-400 mt-1">
                    {resultLog.nutrition_info.protein} g
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
                  <span className="text-xs text-slate-400">碳水化合物 Carbs</span>
                  <div className="text-lg font-extrabold text-emerald-400 mt-1">
                    {resultLog.nutrition_info.carbs} g
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
                  <span className="text-xs text-slate-400">脂肪 Fat</span>
                  <div className="text-lg font-extrabold text-amber-400 mt-1">
                    {resultLog.nutrition_info.fat} g
                  </div>
                </div>
              </div>

              {/* Health Advice & Tips */}
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <h5 className="text-xs font-bold text-slate-300">💡 饮食健康评价与建议:</h5>
                <p className="text-xs text-slate-300 leading-relaxed">{resultLog.advice}</p>
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-slate-500 space-y-3">
              <UtensilsCrossed className="w-12 h-12 text-slate-700" />
              <p className="text-xs">选择或上传图片并点击“启动 AI 智能识别”生成数据</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
