import React, { useState, useEffect } from 'react';
import { Utensils, Sparkles, Shield, Heart, Activity, Calendar, CheckCircle2, AlertTriangle, XCircle, FileText, Plus, ChevronRight, RefreshCw, Upload, Image as ImageIcon } from 'lucide-react';
import { CONFIG } from '../config';

interface DietLogItem {
  id: string;
  log_date: string;
  food_name: string;
  calories: number;
  macros?: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
    fiber: number;
    sugar: number;
  };
  micronutrients?: Array<{
    name: string;
    status: string;
    badge: string;
    detail: string;
  }>;
  traffic_lights?: {
    green?: string[];
    yellow?: string[];
    red?: string[];
  };
  dinner_suggestion?: string;
  full_report_markdown?: string;
  image_url?: string;
  visibility?: string;
  created_at: string;
}

interface DietViewProps {
  user: any;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

export const DietView: React.FC<DietViewProps> = ({ user, showToast }) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [foodText, setFoodText] = useState<string>(
    '早餐：2个鸡蛋，1杯黑咖啡；午餐：200g煎鸡胸肉，一碗糙米饭，大量西兰花'
  );
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState('image/jpeg');
  const [customPrompt, setCustomPrompt] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [logs, setLogs] = useState<DietLogItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'report' | 'markdown'>('report');

  const presetSamples = [
    {
      title: '30岁白领标准日餐',
      text: '早餐：2个鸡蛋，1杯黑咖啡；午餐：200g煎鸡胸肉，一碗糙米饭，大量西兰花'
    },
    {
      title: '外卖照烧定食套餐',
      text: '早餐：1杯全脂牛奶，1块全麦吐司；午餐：日式照烧三文鱼定食，含一碗白米饭与味增汤'
    },
    {
      title: '高蛋白健身减脂餐',
      text: '早餐：无糖豆浆300ml，水煮蛋2个；午餐：水煮牛肉片150g，紫薯150g，清炒空心菜1盘'
    }
  ];

  const fetchDietLogs = async (dateToFetch?: string) => {
    try {
      const url = new URL(`${CONFIG.API_BASE_URL}/api/diet/logs`);
      if (dateToFetch) url.searchParams.append('date', dateToFetch);
      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchDietLogs(selectedDate);
  }, [selectedDate]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMimeType(file.type || 'image/jpeg');
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!foodText.trim() && !selectedImage) {
      showToast('请输入餐食描述或上传餐食照片！', 'error');
      return;
    }

    setAnalyzing(true);
    try {
      const res = await fetch(`${CONFIG.API_BASE_URL}/api/diet/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          foodInput: foodText.trim(),
          imageBase64: selectedImage,
          mimeType,
          customPrompt: customPrompt.trim()
        })
      });

      const data = await res.json();
      if (data.success) {
        setAnalysisResult(data.result);
        showToast('私人营养师数据报告生成成功！', 'success');
      } else {
        showToast(data.error || '膳食分析失败', 'error');
      }
    } catch (err: any) {
      showToast('网络交互异常: ' + err.message, 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSaveLog = async () => {
    if (!analysisResult) return;

    setSaving(true);
    try {
      const res = await fetch(`${CONFIG.API_BASE_URL}/api/diet/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user ? user.id : 'guest',
          log_date: selectedDate,
          food_name: analysisResult.food_name || foodText,
          calories: analysisResult.calories || analysisResult.macros?.calories || 0,
          macros: analysisResult.macros,
          micronutrients: analysisResult.micronutrients,
          traffic_lights: analysisResult.traffic_lights,
          dinner_suggestion: analysisResult.dinner_suggestion,
          full_report_markdown: analysisResult.full_report_markdown,
          image_url: selectedImage || '',
          visibility: 'private'
        })
      });

      const data = await res.json();
      if (data.success) {
        showToast(`已成功保存至 ${selectedDate} 日历历史记录！`, 'success');
        fetchDietLogs(selectedDate);
      }
    } catch (e: any) {
      showToast('保存日志失败: ' + e.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // 获得唯一的有纪录日期列表
  const recordedDates = Array.from(new Set([todayStr, ...logs.map((l) => l.log_date)])).sort().reverse();

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* 顶部 Banner 与 角色声明 */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Utensils className="w-4 h-4" />
            <span>私人营养师 & 膳食数据分析引擎 (/eee)</span>
          </div>
          <h2 className="text-2xl font-black text-white">AI 膳食指南日志与微量元素分析</h2>
          <p className="text-xs text-slate-400">
            Role: 你是一位精通营养学和数据分析的私人营养师 · 提供宏量营养素、微量元素红黄绿灯与中年人晚餐改善建议
          </p>
        </div>

        {/* 日历日期选择下拉框与输入 */}
        <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
          <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs text-slate-400 shrink-0">按日期查看/记录:</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1 text-xs text-emerald-400 font-bold focus:outline-none"
          />
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-2 py-1 text-xs text-slate-300 focus:outline-none"
          >
            {recordedDates.map((d) => (
              <option key={d} value={d}>
                {d === todayStr ? `今天 (${d})` : d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 主布局 Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 左侧：数据输入与配置区 (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-5 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>1. 输入今日餐食数据 (Input Data)</span>
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">日期: {selectedDate}</span>
            </div>

            {/* 快速填入样本按钮 */}
            <div className="space-y-2">
              <span className="text-[11px] text-slate-400 font-medium">快速填入示范数据:</span>
              <div className="flex flex-wrap gap-2">
                {presetSamples.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => setFoodText(sample.text)}
                    className="text-[11px] px-2.5 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
                  >
                    {sample.title}
                  </button>
                ))}
              </div>
            </div>

            {/* 多行文本输入区 */}
            <div className="space-y-2">
              <textarea
                rows={5}
                value={foodText}
                onChange={(e) => setFoodText(e.target.value)}
                placeholder="在此处输入你吃的食物，例如：早餐：2个鸡蛋，1杯黑咖啡；午餐：200g煎鸡胸肉，一碗糙米饭，大量西兰花..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs md:text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors leading-relaxed"
              />
            </div>

            {/* 照片上传 (可选) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-sky-400" /> 附加菜品照片 (可选):
                </span>
                {selectedImage && (
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="text-rose-400 hover:underline text-[10px]"
                  >
                    清除图片
                  </button>
                )}
              </div>

              {selectedImage ? (
                <div className="relative rounded-2xl overflow-hidden border border-slate-800 aspect-video max-h-48">
                  <img src={selectedImage} alt="Food Upload" className="w-full h-full object-cover" />
                </div>
              ) : (
                <label className="border border-dashed border-slate-800 hover:border-emerald-500/50 rounded-2xl p-4 flex items-center justify-center gap-2 text-xs text-slate-400 cursor-pointer bg-slate-950/60 hover:bg-slate-950 transition-all">
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <span>点击上传本地菜品照片辅助评估</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </div>

            {/* 特别需求或提示词修改 */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-slate-400">偏好与补充说明:</span>
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="如：晚餐偏好极简，不含乳制品，30岁中年人防血压偏高..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* 提交按钮 */}
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-emerald-950 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{analyzing ? '私人营养师数据分析中...' : '生成精准营养摄入报告'}</span>
            </button>
          </div>

          {/* 选定日期的历史纪录组件 */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-sky-400" />
                <span>{selectedDate} 保存的日志记录</span>
              </h3>
              <span className="text-xs text-slate-400">{logs.length} 条数据</span>
            </div>

            {logs.length > 0 ? (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    onClick={() => setAnalysisResult(log)}
                    className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-emerald-500/40 cursor-pointer transition-all space-y-2 group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-bold text-slate-200 line-clamp-2 group-hover:text-emerald-400 transition-colors">
                        {log.food_name}
                      </p>
                      <span className="text-xs font-mono font-bold text-amber-400 shrink-0">
                        {log.calories} kcal
                      </span>
                    </div>

                    {log.macros && (
                      <div className="flex gap-2 text-[10px] text-slate-400 font-mono">
                        <span>蛋白: {log.macros.protein}g</span>
                        <span>脂肪: {log.macros.fat}g</span>
                        <span>碳水: {log.macros.carbs}g</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-950/60 border border-dashed border-slate-800 text-center text-xs text-slate-500">
                该日期暂无持久化记录，分析后点击【保存日志】即可归档
              </div>
            )}
          </div>
        </div>

        {/* 右侧：营养摄入分析报告 (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {analysisResult ? (
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-emerald-500/40 space-y-6 shadow-2xl animate-fade-in">
              {/* 标题 & 保存按钮 Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      报告日期: {selectedDate}
                    </span>
                    <span className="text-xs text-slate-400">私人营养师分析完成</span>
                  </div>
                  <h3 className="text-xl font-black text-white mt-1">
                    {analysisResult.food_name || '今日餐食营养分析'}
                  </h3>
                </div>

                <button
                  onClick={handleSaveLog}
                  disabled={saving}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg cursor-pointer shrink-0"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{saving ? '保存中...' : `保存至 ${selectedDate} 日志`}</span>
                </button>
              </div>

              {/* 1. 宏量营养素表格 (Macro-Nutrients Table) */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>一、宏量营养素表格 (Macro-Nutrients)</span>
                </h4>

                <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800">
                      <tr>
                        <th className="p-3">总热量 (kcal)</th>
                        <th className="p-3">蛋白质 (g)</th>
                        <th className="p-3">脂肪 (g)</th>
                        <th className="p-3">碳水化合物 (g)</th>
                        <th className="p-3">膳食纤维 (g)</th>
                        <th className="p-3">糖分 (g)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono font-bold text-slate-100">
                      <tr>
                        <td className="p-3 text-amber-400">{analysisResult.calories || analysisResult.macros?.calories || 0}</td>
                        <td className="p-3 text-emerald-400">{analysisResult.macros?.protein || 0}</td>
                        <td className="p-3 text-rose-400">{analysisResult.macros?.fat || 0}</td>
                        <td className="p-3 text-sky-400">{analysisResult.macros?.carbs || 0}</td>
                        <td className="p-3 text-emerald-300">{analysisResult.macros?.fiber || 0}</td>
                        <td className="p-3 text-amber-300">{analysisResult.macros?.sugar || 0}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 2. 微量元素深度分析 (Sodium, Potassium, Calcium, Iron, Magnesium, Vitamin D) */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-400" />
                  <span>二、微量元素深度分析 (Micronutrients Evaluation)</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(analysisResult.micronutrients || []).map((item: any, idx: number) => (
                    <div key={idx} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200">{item.name}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
                          {item.badge || item.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. 红黄绿灯评价 (Traffic Light Evaluation) */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span>三、红黄绿灯综合评价 (Traffic Lights)</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* 🟢 绿色：优秀 */}
                  <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> 🟢 表现优秀指标
                    </span>
                    <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                      {(analysisResult.traffic_lights?.green || []).map((g: string, i: number) => (
                        <li key={i}>{g}</li>
                      ))}
                    </ul>
                  </div>

                  {/* 🟡 黄色：注意 */}
                  <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-2">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" /> 🟡 需要注意 / 临界点
                    </span>
                    <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                      {(analysisResult.traffic_lights?.yellow || []).map((y: string, i: number) => (
                        <li key={i}>{y}</li>
                      ))}
                    </ul>
                  </div>

                  {/* 🔴 红色：严重超标/不足 */}
                  <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-500/30 space-y-2">
                    <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                      <XCircle className="w-4 h-4" /> 🔴 严重超标 / 不足
                    </span>
                    <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                      {(analysisResult.traffic_lights?.red || ['暂无严重超标指标']).map((r: string, i: number) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* 4. 针对30岁中年人的简单晚餐改进建议 */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-950/60 to-slate-950 border border-sky-500/30 space-y-2">
                <h4 className="text-xs font-extrabold text-sky-300 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-sky-400" />
                  <span>四、针对30岁中年人的晚餐定制改进建议 (Dinner Solution)</span>
                </h4>
                <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-medium">
                  {analysisResult.dinner_suggestion || '暂无专属晚餐建议'}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-slate-900/40 border border-dashed border-slate-800 text-center space-y-4">
              <Utensils className="w-12 h-12 mx-auto text-emerald-500/40 animate-pulse" />
              <div>
                <h3 className="text-base font-bold text-slate-300">私人营养师时刻待命</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  在左侧输入今日餐食（早餐/午餐摄入内容），AI 将自动根据 30 岁中年人健康标准生成包含宏量营养素、微量元素、红黄绿灯与晚餐配置方案。
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
