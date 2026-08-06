// ai-small 前端全局配置文件
export const CONFIG = {
  // 后端 API 主接口地址 (如果为空字符串，则默认使用当前域名的相对路径 /api)
  API_BASE_URL: (import.meta as any).env?.VITE_API_BASE_URL || "",

  // WebSocket 实时接口地址
  WS_BASE_URL: (import.meta as any).env?.VITE_WS_BASE_URL || "wss://ai-small-backend-xie7.vercel.app",

  // Supabase 前端配置（通过云端环境变量 VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY 注入）
  SUPABASE_URL: (import.meta as any).env?.VITE_SUPABASE_URL || "https://zcvgirshnyqenkjknrci.supabase.co",
  SUPABASE_ANON_KEY: (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || ""
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',  // 存储用户身份 Token
  USER_INFO: 'user_info',    // 存储用户基本信息缓存
  USER: 'user'               // 用户数据备用键名
};

export const LIMIT_CONFIG = {
  VERCEL_TIMEOUT_SEC: 10,       // Vercel 云函数单次请求超时上限 (10秒)
  SUPABASE_DB_SIZE: "500MB",    // Supabase 免费容量上限
  EXPRESS_IP_RATE_LIMIT: 15,    // express-rate-limit 限制单 IP 每分钟最多 15 次请求
  FRONTEND_COOL_DOWN_SEC: 10,   // 前端发言/发送验证码防刷倒计时 (10秒)
  GEMINI_MAX_RPM: "15 RPM",     // Google Gemini 免费额度每分钟请求次数上限
  RESEND_DAILY_LIMIT: "100/day" // Resend 免费邮件发送每日上限 (100封/天，月额度3000)
};
