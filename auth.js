// Auth & Toast Notification Control Handler
let sendCodeCooldown = 0;
let cooldownTimer = null;

// 显示全局通用 Toast 提示
function showToast(message, type = 'warning') {
    const container = document.getElementById('toastContainer');
    if (!container) {
        alert(message);
        return;
    }
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span>${type === 'warning' ? '⚠️' : '✅'}</span>
        <span>${message}</span>
    `;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// 【需求 3】：受拦截的功能导航点击事件
function handleAuthProtectedNav(targetUrl, featureName) {
    const token = localStorage.getItem('auth_token');
    if (token) {
        window.location.href = targetUrl;
    } else {
        showToast(`需登录：请先完成登录或注册后再进入【${featureName}】`, 'warning');
    }
}

// 倒计时逻辑
function startCooldown(seconds) {
    sendCodeCooldown = seconds;
    const sendCodeBtn = document.getElementById('sendCodeBtn');
    if (!sendCodeBtn) return;
    
    sendCodeBtn.disabled = true;
    sendCodeBtn.textContent = `${sendCodeCooldown}s 后重新发送`;

    cooldownTimer = setInterval(() => {
        sendCodeCooldown--;
        if (sendCodeCooldown <= 0) {
            clearInterval(cooldownTimer);
            sendCodeBtn.disabled = false;
            sendCodeBtn.textContent = '发送验证码';
        } else {
            sendCodeBtn.textContent = `${sendCodeCooldown}s 后重新发送`;
        }
    }, 1000);
}

// 发送验证码
async function sendVerificationCode() {
    const emailInput = document.getElementById('usernameInput');
    const email = emailInput ? emailInput.value.trim() : '';

    if (!email) {
        showToast('请先输入有效的电子邮箱！', 'warning');
        return;
    }

    try {
        const sendCodeBtn = document.getElementById('sendCodeBtn');
        sendCodeBtn.disabled = true;
        sendCodeBtn.textContent = '发送中...';

        const res = await fetch(`${CONFIG.API_BASE_URL}/api/auth/send-code`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const data = await res.json();

        if (data.success) {
            showToast('验证码已发送至您的邮箱，请查收！', 'success');
            startCooldown(60);
        } else {
            showToast(data.message || '发送失败，请稍后重试', 'warning');
            sendCodeBtn.disabled = false;
            sendCodeBtn.textContent = '发送验证码';
        }
    } catch (err) {
        console.error('Send code error:', err);
        showToast('网络请求异常，请检查后端 API 服务状态', 'warning');
        const sendCodeBtn = document.getElementById('sendCodeBtn');
        if (sendCodeBtn) {
            sendCodeBtn.disabled = false;
            sendCodeBtn.textContent = '发送验证码';
        }
    }
}

// 表单提交登录/验证处理
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('usernameInput').value.trim();
    const code = document.getElementById('codeInput').value.trim();
    const submitBtn = document.getElementById('submitBtn');

    if (currentAuthMode === 'code' && !code) {
        showToast('请输入 6 位邮箱验证码！', 'warning');
        return;
    }

    try {
        submitBtn.disabled = true;
        submitBtn.textContent = '正在验证登录...';

        const res = await fetch(`${CONFIG.API_BASE_URL}/api/auth/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, code })
        });
        const data = await res.json();

        if (data.success) {
            showToast('登录验证成功！', 'success');
            localStorage.setItem('auth_token', data.token || 'authenticated');
            localStorage.setItem('user_info', JSON.stringify(data.user || { email }));
            updateLoggedInUI(data.user || { email });
        } else {
            showToast(data.message || '验证失败，请核对验证码', 'warning');
        }
    } catch (err) {
        console.error('Login error:', err);
        showToast('登录请求失败，请稍后再试', 'warning');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = '登录 / 快速注册';
    }
}

// 【需求 2】：更新已登录 UI & 隐藏登录卡片 (轻量化处理)
function updateLoggedInUI(user) {
    const consoleBtn = document.getElementById('consoleBtn');
    if (consoleBtn) {
        const name = user.email ? user.email.split('@')[0] : '用户';
        consoleBtn.textContent = `已登录 (${name})`;
        consoleBtn.href = "#";
    }

    // 隐藏首页登录卡片容器
    const loginCardContainer = document.getElementById('loginCardContainer');
    if (loginCardContainer) {
        loginCardContainer.style.display = 'none';
    }
}

// 页面加载自动检测
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('auth_token');
    const userInfoStr = localStorage.getItem('user_info');
    if (token && userInfoStr) {
        try {
            const user = JSON.parse(userInfoStr);
            updateLoggedInUI(user);
        } catch (e) {
            console.error(e);
        }
    }
});
