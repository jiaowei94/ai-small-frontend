// Auth & Backend API Interaction Handler
let sendCodeCooldown = 0;
let cooldownTimer = null;

async function sendVerificationCode() {
    const emailInput = document.getElementById('usernameInput');
    const email = emailInput ? emailInput.value.trim() : '';

    if (!email) {
        showToast('请先输入正确的电子邮箱账号！');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showToast('请输入有效的邮箱格式 (例如: user@example.com)');
        return;
    }

    if (sendCodeCooldown > 0) return;

    const sendCodeBtn = document.getElementById('sendCodeBtn');
    if (sendCodeBtn) sendCodeBtn.disabled = true;

    showToast(`正在向 ${email} 发送验证码...`);

    try {
        const res = await fetch(`${CONFIG.API_BASE_URL}/api/auth/send-code`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        const data = await res.json();

        if (res.ok && data.success) {
            showToast('验证码已成功发送至您的邮箱，请查收！');
            startCooldown(60);
        } else {
            showToast(data.message || '验证码发送失败，请稍后重试');
            if (sendCodeBtn) sendCodeBtn.disabled = false;
        }
    } catch (err) {
        console.error('Send Code Error:', err);
        showToast('网络连接异常，无法连接后端服务器');
        if (sendCodeBtn) sendCodeBtn.disabled = false;
    }
}

function startCooldown(seconds) {
    sendCodeCooldown = seconds;
    const sendCodeBtn = document.getElementById('sendCodeBtn');
    
    if (cooldownTimer) clearInterval(cooldownTimer);
    cooldownTimer = setInterval(() => {
        sendCodeCooldown--;
        if (sendCodeBtn) {
            sendCodeBtn.textContent = `${sendCodeCooldown}s 后重试`;
        }
        if (sendCodeCooldown <= 0) {
            clearInterval(cooldownTimer);
            if (sendCodeBtn) {
                sendCodeBtn.disabled = false;
                sendCodeBtn.textContent = '获取验证码';
            }
        }
    }, 1000);
}

async function handleLogin(e) {
    e.preventDefault();

    const usernameInput = document.getElementById('usernameInput');
    const passwordInput = document.getElementById('passwordInput');
    const codeInput = document.getElementById('codeInput');

    const email = usernameInput ? usernameInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value : '';
    const code = codeInput ? codeInput.value.trim() : '';

    if (!email) {
        showToast('请输入账号/邮箱');
        return;
    }

    if (currentAuthMode === 'password' && !password) {
        showToast('请输入密码');
        return;
    }

    if (currentAuthMode === 'code' && !code) {
        showToast('请输入6位数字验证码');
        return;
    }

    showToast('正在验证登录数据...');

    try {
        const res = await fetch(`${CONFIG.API_BASE_URL}/api/auth/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                password: currentAuthMode === 'password' ? password : null,
                code: currentAuthMode === 'code' ? code : null,
                mode: currentAuthMode
            })
        });

        const data = await res.json();

        if (res.ok && data.success) {
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('user_info', JSON.stringify(data.user));

            openModal(`🎉 验证成功！欢迎回来，${data.user.email}。数据已就绪。`);
            updateLoggedInUI(data.user);
        } else {
            showToast(data.message || '登录验证失败，请校验输入信息');
        }
    } catch (err) {
        console.error('Auth Verify Error:', err);
        showToast('网络交互失败，请确认后端 API 正常运行');
    }
}

function updateLoggedInUI(user) {
    const consoleBtn = document.getElementById('consoleBtn');
    if (consoleBtn) {
        consoleBtn.textContent = `控制台 (${user.email.split('@')[0]})`;
        consoleBtn.href = "#hero";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('auth_token');
    const userInfoStr = localStorage.getItem('user_info');
    if (token && userInfoStr) {
        try {
            const user = JSON.parse(userInfoStr);
            updateLoggedInUI(user);
        } catch (e) {}
    }
});
