// ai-small.xyz 全局系统配置文件
export const CONFIG = {
  // 后端 API 主接口地址
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "https://ai-small-backend-lyart.vercel.app",

  // Supabase 前端公开配置
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || "https://zcvgirshnyqenkjknrci.supabase.co",
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjdmdpcnNobnlxZW5ramtucmNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxMDExNDcsImV4cCI6MjEwMDY3NzE0N30.TjKa3v6tnr4xANh5Z9vuf5SFESUpI8ZHq_dSIizl7fQ",

  PRIMARY_DOMAIN: "https://ai-small.xyz",
  FRONTEND_PAGES_URL: "https://ai-small-frontend.pages.dev",
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_INFO: 'user_info',
  USER: 'user',
  THEME: 'theme_preference',
  CHAT_HISTORY: 'ai_small_chat_history',
  DIET_LOGS: 'ai_small_diet_logs',
};

export const LIMIT_CONFIG = {
  VERCEL_TIMEOUT_SEC: 10,
  EXPRESS_IP_RATE_LIMIT: 15,
  FRONTEND_COOL_DOWN_SEC: 10,
  GEMINI_MAX_RPM: "15 RPM",
  RESEND_DAILY_LIMIT: "100/day",
};

export const AI_MODELS = [
  { id: 'gemini-3.6-flash', name: 'Gemini 3.6 Flash', label: 'gemini-3.6-flash', tag: '官方推荐', description: '高效率强逻辑的大模型' },
  { id: 'gpt-5.6', name: 'GPT 5.6 (Flash)', label: 'gpt-5.6', tag: '极速响应', description: '媲美高端GPT超敏捷应答' },
  { id: 'deepseek-v4', name: 'DeepSeek V4 (Preview)', label: 'deepseek-v4', tag: '深度推理', description: '代码与数学推理强化引擎' },
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', label: 'gemini-2.0-flash', tag: '通用全能', description: '稳定平衡的多模态核心' },
];
