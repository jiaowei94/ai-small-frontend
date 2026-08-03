// 认证逻辑控制器
const Auth = {
  // 获取已保存的用户 Token
  getToken() {
    return localStorage.getItem('auth_token');
  },

  // 获取当前登录用户信息
  getUser() {
    const userStr = localStorage.getItem('auth_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // 保存登录状态
  setSession(token, user) {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
  },

  // 清除登录状态 (退出登录)
  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    window.location.reload();
  },

  // 发送验证码 (支持 register 与 reset_password)
  async sendCode(email, type = 'register') {
    try {
      const res = await fetch(`${CONFIG.API_BASE_URL}/api/auth/send-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type })
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: '网络请求失败，请稍后再试' };
    }
  },

  // 账号注册
  async register(email, password, code, nickname) {
    try {
      const res = await fetch(`${CONFIG.API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, code, nickname })
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: '网络请求失败，请稍后再试' };
    }
  },

  // 账号密码登录
  async login(email, password) {
    try {
      const res = await fetch(`${CONFIG.API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        this.setSession(data.token, data.user);
      }
      return data;
    } catch (err) {
      return { success: false, message: '网络请求失败，请稍后再试' };
    }
  },

  // 重置密码
  async resetPassword(email, code, newPassword) {
    try {
      const res = await fetch(`${CONFIG.API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword })
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: '网络请求失败，请稍后再试' };
    }
  }
};
